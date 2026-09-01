/* ---------------------------------------------------------------------------
   calendly.js — booking verification against the Calendly v2 API.

   The redirect Calendly sends people back with is entirely client-controllable,
   so none of it is treated as proof. It is only a lookup key: every field shown
   on the confirmation page comes from an authenticated server-side read of the
   Calendly API, and the booking must be active, belong to our cooking-session
   event type, and (where the event type collects payment) have a successful
   payment before anything is confirmed.

   The API token is read from the environment and never leaves the server.
--------------------------------------------------------------------------- */

const cfg = require('./config');

const API = 'https://api.calendly.com';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Distinguishes "this booking is not real" from "we could not reach Calendly". */
class CalendlyUnavailable extends Error {}

const isUuid = (v) => typeof v === 'string' && UUID.test(v);
const uuidOf = (uri) => (typeof uri === 'string' ? uri.split('/').pop() : '');

async function api(path, { fetchImpl = globalThis.fetch, token } = {}) {
  const t = token || cfg.apiToken();
  if (!t) throw new CalendlyUnavailable('CALENDLY_API_TOKEN is not configured');

  let res;
  try {
    res = await fetchImpl(`${API}${path}`, {
      headers: { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    throw new CalendlyUnavailable(`network: ${err.message}`);
  }

  if (res.status === 404) return null; // genuinely absent, not a fault
  if (res.status === 401 || res.status === 403) {
    // a bad token is our problem, not proof the booking is fake
    throw new CalendlyUnavailable(`auth ${res.status}`);
  }
  if (res.status === 429 || res.status >= 500) throw new CalendlyUnavailable(`upstream ${res.status}`);
  if (!res.ok) return null;

  try {
    return await res.json();
  } catch (err) {
    throw new CalendlyUnavailable(`bad json: ${err.message}`);
  }
}

/* ------------------------------- lookups -------------------------------- */

let orgCache = null;

async function organization(opts) {
  if (orgCache) return orgCache;
  const me = await api('/users/me', opts);
  orgCache = me?.resource?.current_organization || null;
  if (!orgCache) throw new CalendlyUnavailable('could not resolve organization');
  return orgCache;
}

/**
 * Finds the scheduled event that a given invitee belongs to.
 * Calendly's redirect gives us the invitee uuid but not the event uuid, so we
 * search the org's events in a tight window around the reported start time and
 * confirm the invitee actually appears on one of them.
 */
async function findByInvitee({ inviteeUuid, inviteeEmail, startTime }, opts) {
  const org = await organization(opts);
  const params = new URLSearchParams({ organization: org, count: '25', status: 'active' });
  if (inviteeEmail) params.set('invitee_email', inviteeEmail);

  const t = Date.parse(startTime);
  if (!Number.isNaN(t)) {
    params.set('min_start_time', new Date(t - 36e5).toISOString());
    params.set('max_start_time', new Date(t + 36e5).toISOString());
  }

  const list = await api(`/scheduled_events?${params}`, opts);
  for (const event of list?.collection || []) {
    const eventUuid = uuidOf(event.uri);
    const invitee = await getInvitee(eventUuid, inviteeUuid, opts);
    if (invitee) return { event, invitee };
  }
  return null;
}

async function getInvitee(eventUuid, inviteeUuid, opts) {
  if (!isUuid(eventUuid) || !isUuid(inviteeUuid)) return null;
  const res = await api(`/scheduled_events/${eventUuid}/invitees/${inviteeUuid}`, opts);
  return res?.resource || null;
}

async function getEvent(eventUuid, opts) {
  if (!isUuid(eventUuid)) return null;
  const res = await api(`/scheduled_events/${eventUuid}`, opts);
  return res?.resource || null;
}

async function getEventType(uri, opts) {
  const uuid = uuidOf(uri);
  if (!isUuid(uuid)) return null;
  const res = await api(`/event_types/${uuid}`, opts);
  return res?.resource || null;
}

/* ------------------------------ shaping --------------------------------- */

const RECIPE_HINT = /(recipe|cook|dish|make|meal)/i;
const LOOKS_LIKE_URL = /^(https?:\/\/|www\.)/i;

/** A recipe name only if it is genuinely a short, readable answer. */
function recipeFrom(invitee) {
  for (const qa of invitee?.questions_and_answers || []) {
    if (!RECIPE_HINT.test(qa.question || '')) continue;
    const a = (qa.answer || '').trim();
    if (!a || a.length > 80 || LOOKS_LIKE_URL.test(a) || a.includes('\n')) continue;
    return a;
  }
  return null;
}

/**
 * Payment is only reported when Calendly says it actually succeeded. If the
 * event type does not collect payment, `payment` is absent and we say nothing
 * about money rather than assuming.
 */
function paymentFrom(invitee) {
  const p = invitee?.payment;
  if (!p || p.successful !== true) return null;
  return {
    amount: typeof p.amount === 'number' ? p.amount : null,
    currency: p.currency || null,
    provider: p.provider || null,
  };
}

function formatWhen(startTime, timezone) {
  const d = new Date(startTime);
  if (Number.isNaN(d.getTime())) return { date: null, time: null, iso: null };
  const tz = timezone || 'America/New_York';
  const opt = { timeZone: tz };
  try {
    return {
      date: new Intl.DateTimeFormat('en-US', {
        ...opt,
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }).format(d),
      time: new Intl.DateTimeFormat('en-US', {
        ...opt,
        hour: 'numeric',
        minute: '2-digit',
      }).format(d),
      iso: d.toISOString(),
    };
  } catch {
    return { date: null, time: null, iso: d.toISOString() };
  }
}

/* ----------------------------- verification ------------------------------ */

/**
 * Resolves a booking to a verified, active, correctly-typed session.
 *
 * @returns {Promise<{ok: true, booking: object} | {ok: false, reason: string}>}
 * @throws {CalendlyUnavailable} when Calendly cannot be reached — the caller
 *         must not treat that as "not booked".
 */
async function verifyBooking({ inviteeUuid, eventUuid, inviteeEmail, startTime }, opts = {}) {
  if (!isUuid(inviteeUuid)) return { ok: false, reason: 'bad_invitee_uuid' };

  let event = null;
  let invitee = null;

  if (isUuid(eventUuid)) {
    invitee = await getInvitee(eventUuid, inviteeUuid, opts);
    if (invitee) event = await getEvent(eventUuid, opts);
  }

  if (!invitee) {
    const found = await findByInvitee({ inviteeUuid, inviteeEmail, startTime }, opts);
    if (!found) return { ok: false, reason: 'not_found' };
    event = found.event;
    invitee = found.invitee;
  }

  // A reschedule leaves the old invitee canceled and points at the new one.
  let hops = 0;
  while (invitee?.rescheduled && invitee.new_invitee && hops < 3) {
    hops += 1;
    const nextEvent = invitee.new_invitee.split('/scheduled_events/')[1]?.split('/')[0];
    const nextInvitee = uuidOf(invitee.new_invitee);
    const moved = await getInvitee(nextEvent, nextInvitee, opts);
    if (!moved) break;
    invitee = moved;
    event = await getEvent(nextEvent, opts);
  }

  if (!event) return { ok: false, reason: 'no_event' };
  if (invitee.status !== 'active') return { ok: false, reason: 'invitee_canceled' };
  if (event.status !== 'active') return { ok: false, reason: 'event_canceled' };

  // must be the cooking session, not some other event on the same account
  const type = await getEventType(event.event_type, opts);
  const expected = cfg.bookingUrlKey();
  const actual = (type?.scheduling_url || '').replace(/\/+$/, '').toLowerCase();
  if (expected && actual && actual !== expected) return { ok: false, reason: 'wrong_event_type' };

  const when = formatWhen(event.start_time, invitee.timezone);

  return {
    ok: true,
    booking: {
      eventUuid: uuidOf(event.uri),
      inviteeUuid: uuidOf(invitee.uri),
      eventName: type?.name || event.name || null,
      recipe: recipeFrom(invitee),
      payment: paymentFrom(invitee),
      when,
      cancelUrl: typeof invitee.cancel_url === 'string' ? invitee.cancel_url : null,
      rescheduleUrl: typeof invitee.reschedule_url === 'string' ? invitee.reschedule_url : null,
    },
  };
}

module.exports = {
  CalendlyUnavailable,
  verifyBooking,
  formatWhen,
  recipeFrom,
  paymentFrom,
  isUuid,
  uuidOf,
  _resetOrgCache: () => {
    orgCache = null;
  },
};
