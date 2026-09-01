/* ---------------------------------------------------------------------------
   Gate + verification tests for the /cooking/confirmed funnel.

   The acceptance test that matters: a stranger, a forged cookie, or a tampered
   payload must never see the confirmation page. These run against the real
   handlers with Calendly stubbed at the network boundary.

   node --test tests/
--------------------------------------------------------------------------- */

process.env.CONFIRMATION_SECRET = 'test-secret-please-be-long-and-random';
process.env.CALENDLY_API_TOKEN = 'test-token';
process.env.CALENDLY_BOOKING_URL = 'https://calendly.com/hi-cielpm/30min';
process.env.META_PIXEL_ID = '';

const test = require('node:test');
const assert = require('node:assert/strict');

const S = require('../api/_lib/session');
const calendly = require('../api/_lib/calendly');
const confirmed = require('../api/cooking-confirmed');
const confirm = require('../api/cooking/confirm');

const SECRET = process.env.CONFIRMATION_SECRET;
const EV = '11111111-1111-4111-8111-111111111111';
const INV = '22222222-2222-4222-8222-222222222222';
const ET = '33333333-3333-4333-8333-333333333333';

/* ------------------------------- fixtures -------------------------------- */

function fixtures(over = {}) {
  const invitee = {
    uri: `https://api.calendly.com/scheduled_events/${EV}/invitees/${INV}`,
    email: 'buyer@example.com',
    name: 'Buyer',
    status: 'active',
    timezone: 'America/New_York',
    rescheduled: false,
    new_invitee: null,
    cancel_url: 'https://calendly.com/cancellations/abc',
    reschedule_url: 'https://calendly.com/reschedulings/abc',
    questions_and_answers: [
      { question: 'What recipe do you want to cook?', answer: 'Butter Chicken', position: 0 },
    ],
    payment: { successful: true, amount: 100, currency: 'USD', provider: 'stripe' },
    ...over.invitee,
  };
  const event = {
    uri: `https://api.calendly.com/scheduled_events/${EV}`,
    name: '30 Minute Meeting',
    status: 'active',
    start_time: '2026-09-12T22:00:00.000000Z',
    end_time: '2026-09-12T23:00:00.000000Z',
    event_type: `https://api.calendly.com/event_types/${ET}`,
    ...over.event,
  };
  const eventType = {
    uri: `https://api.calendly.com/event_types/${ET}`,
    name: 'Private cooking session',
    scheduling_url: 'https://calendly.com/hi-cielpm/30min',
    ...over.eventType,
  };
  return { invitee, event, eventType };
}

/** Routes Calendly API paths to fixtures. `fail` forces an upstream outage. */
function stubFetch(fx, { fail = false, status = 200 } = {}) {
  return async (url) => {
    if (fail) throw new Error('ECONNRESET');
    const path = url.replace('https://api.calendly.com', '');
    const json = (body, s = status) => ({
      ok: s >= 200 && s < 300,
      status: s,
      json: async () => body,
    });

    if (status >= 500) return json({}, status);
    if (path.startsWith('/users/me'))
      return json({ resource: { current_organization: 'https://api.calendly.com/organizations/ORG' } });
    if (path.startsWith('/scheduled_events?'))
      return json({ collection: [fx.event] });
    if (path === `/scheduled_events/${EV}/invitees/${INV}`) return json({ resource: fx.invitee });
    if (path.startsWith(`/scheduled_events/${EV}/invitees/`)) return json(null, 404);
    if (path === `/scheduled_events/${EV}`) return json({ resource: fx.event });
    if (path === `/event_types/${ET}`) return json({ resource: fx.eventType });
    return json(null, 404);
  };
}

function useCalendly(fx, opts) {
  calendly._resetOrgCache();
  globalThis.fetch = stubFetch(fx, opts);
}

/* ------------------------------ fake res --------------------------------- */

function mockRes() {
  return {
    statusCode: 0,
    headers: {},
    body: '',
    setHeader(k, v) {
      this.headers[k.toLowerCase()] = v;
    },
    end(b) {
      this.body = b || '';
      this.ended = true;
    },
    get location() {
      return this.headers.location;
    },
    get cookies() {
      const c = this.headers['set-cookie'];
      return Array.isArray(c) ? c : c ? [c] : [];
    },
  };
}

const reqWith = (cookieStr, query = {}) => ({
  headers: { cookie: cookieStr, 'x-forwarded-proto': 'https' },
  query,
});

const validCookie = () =>
  `${S.VERIFIED_COOKIE}=${S.sign({ e: EV, i: INV }, SECRET, S.TTL_VERIFIED)}`;

/* =========================== session integrity =========================== */

test('signed session round-trips', () => {
  const t = S.sign({ e: EV, i: INV }, SECRET, 60);
  assert.deepEqual(S.verify(t, SECRET).i, INV);
});

test('a tampered payload is rejected', () => {
  const t = S.sign({ e: EV, i: INV }, SECRET, 60);
  const [data, sig] = t.split('.');
  const evil = Buffer.from(
    JSON.stringify({ e: EV, i: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', exp: 9e9 })
  ).toString('base64url');
  assert.equal(S.verify(`${evil}.${sig}`, SECRET), null);
  assert.equal(S.verify(`${data}.${Buffer.from('nope').toString('base64url')}`, SECRET), null);
});

test('a session signed with another secret is rejected', () => {
  assert.equal(S.verify(S.sign({ i: INV }, 'other-secret', 60), SECRET), null);
});

test('an expired session is rejected', () => {
  assert.equal(S.verify(S.sign({ i: INV }, SECRET, -1), SECRET), null);
});

test('garbage is rejected without throwing', () => {
  for (const junk of ['', 'x', 'a.b', '....', null, undefined, 'a.'])
    assert.equal(S.verify(junk, SECRET), null);
});

/* ============================== the gate ================================= */

test('GATE: no cookie → redirected to /meta, no confirmation content', async () => {
  useCalendly(fixtures());
  const res = mockRes();
  await confirmed(reqWith(undefined), res);
  assert.equal(res.statusCode, 302);
  assert.equal(res.location, '/meta');
  assert.equal(res.body, '');
});

test('GATE: forged cookie value → redirected to /meta', async () => {
  useCalendly(fixtures());
  const res = mockRes();
  await confirmed(reqWith(`${S.VERIFIED_COOKIE}=totally.madeup`), res);
  assert.equal(res.statusCode, 302);
  assert.equal(res.location, '/meta');
});

test('GATE: cookie signed with a different secret → redirected to /meta', async () => {
  useCalendly(fixtures());
  const forged = S.sign({ e: EV, i: INV }, 'attacker-secret', 600);
  const res = mockRes();
  await confirmed(reqWith(`${S.VERIFIED_COOKIE}=${forged}`), res);
  assert.equal(res.statusCode, 302);
  assert.equal(res.location, '/meta');
});

test('GATE: query parameters alone prove nothing', async () => {
  useCalendly(fixtures());
  const res = mockRes();
  await confirmed(
    reqWith(undefined, { confirmed: 'true', paid: 'true', invitee_uuid: INV, name: 'Mallory' }),
    res
  );
  assert.equal(res.statusCode, 302);
  assert.equal(res.location, '/meta');
});

test('GATE: a cancelled booking with a valid cookie is still refused', async () => {
  useCalendly(fixtures({ invitee: { status: 'canceled' } }));
  const res = mockRes();
  await confirmed(reqWith(validCookie()), res);
  assert.equal(res.statusCode, 302);
  assert.equal(res.location, '/meta');
  assert.ok(res.cookies.some((c) => c.startsWith(`${S.VERIFIED_COOKIE}=;`)), 'clears the session');
});

test('GATE: a booking for a different event type is refused', async () => {
  useCalendly(fixtures({ eventType: { scheduling_url: 'https://calendly.com/hi-cielpm/intro-call' } }));
  const res = mockRes();
  await confirmed(reqWith(validCookie()), res);
  assert.equal(res.statusCode, 302);
  assert.equal(res.location, '/meta');
});

/* ============================ the happy path ============================= */

test('a verified booking renders the confirmation with real details', async () => {
  useCalendly(fixtures());
  const res = mockRes();
  await confirmed(reqWith(validCookie()), res);

  assert.equal(res.statusCode, 200);
  assert.match(res.body, /You're booked\./);
  assert.match(res.body, /Butter Chicken/);
  assert.match(res.body, /Saturday, September 12/);
  assert.match(res.body, /6:00 PM|6:00 PM/);
  assert.match(res.body, /Paid · \$100 · ingredients included/);
  assert.equal(res.headers['x-robots-tag'], 'noindex, nofollow');
  assert.match(res.headers['cache-control'], /no-store/);
  assert.ok(res.cookies.some((c) => c.includes('HttpOnly') && c.includes('SameSite=Lax')));
});

test('no payment on the event type → no money is claimed', async () => {
  useCalendly(fixtures({ invitee: { payment: null } }));
  const res = mockRes();
  await confirmed(reqWith(validCookie()), res);
  assert.equal(res.statusCode, 200);
  assert.doesNotMatch(res.body, /Paid ·/);
  assert.match(res.body, /Ingredients included/);
});

test('an unsuccessful payment is not treated as paid', async () => {
  useCalendly(fixtures({ invitee: { payment: { successful: false, amount: 100, currency: 'USD' } } }));
  const res = mockRes();
  await confirmed(reqWith(validCookie()), res);
  assert.doesNotMatch(res.body, /Paid ·/);
});

test('a recipe answer that is a URL is never dumped into the headline', async () => {
  useCalendly(
    fixtures({
      invitee: {
        questions_and_answers: [
          { question: 'What recipe do you want to cook?', answer: 'https://example.com/a/very/long/recipe' },
        ],
      },
    })
  );
  const res = mockRes();
  await confirmed(reqWith(validCookie()), res);
  assert.equal(res.statusCode, 200);
  assert.doesNotMatch(res.body, /example\.com/);
  assert.match(res.body, /Your cooking session is booked for/);
});

test('a recipe name is HTML-escaped', async () => {
  useCalendly(
    fixtures({
      invitee: {
        questions_and_answers: [
          { question: 'Recipe?', answer: '<img src=x onerror=alert(1)>' },
        ],
      },
    })
  );
  const res = mockRes();
  await confirmed(reqWith(validCookie()), res);
  assert.doesNotMatch(res.body, /<img src=x/);
  assert.match(res.body, /&lt;img src=x/);
});

test('a rescheduled booking resolves to the active session, not the stale one', async () => {
  const NEW_EV = '44444444-4444-4444-8444-444444444444';
  const NEW_INV = '55555555-5555-4555-8555-555555555555';
  const fx = fixtures({
    invitee: {
      status: 'canceled',
      rescheduled: true,
      new_invitee: `https://api.calendly.com/scheduled_events/${NEW_EV}/invitees/${NEW_INV}`,
    },
  });
  calendly._resetOrgCache();
  globalThis.fetch = async (url) => {
    const path = url.replace('https://api.calendly.com', '');
    const json = (b, s = 200) => ({ ok: s < 300, status: s, json: async () => b });
    if (path.startsWith('/users/me'))
      return json({ resource: { current_organization: 'https://api.calendly.com/organizations/ORG' } });
    if (path === `/scheduled_events/${EV}/invitees/${INV}`) return json({ resource: fx.invitee });
    if (path === `/scheduled_events/${NEW_EV}/invitees/${NEW_INV}`)
      return json({
        resource: {
          ...fx.invitee,
          uri: `https://api.calendly.com/scheduled_events/${NEW_EV}/invitees/${NEW_INV}`,
          status: 'active',
          rescheduled: false,
          new_invitee: null,
          questions_and_answers: [{ question: 'Recipe?', answer: 'Butter Chicken' }],
        },
      });
    if (path === `/scheduled_events/${EV}`) return json({ resource: fx.event });
    if (path === `/scheduled_events/${NEW_EV}`)
      return json({
        resource: { ...fx.event, uri: `https://api.calendly.com/scheduled_events/${NEW_EV}`, start_time: '2026-09-19T22:00:00.000000Z' },
      });
    if (path === `/event_types/${ET}`) return json({ resource: fx.eventType });
    return json(null, 404);
  };

  const res = mockRes();
  await confirmed(reqWith(validCookie()), res);
  assert.equal(res.statusCode, 200);
  assert.match(res.body, /Saturday, September 19/, 'shows the new date');
  assert.doesNotMatch(res.body, /September 12/, 'never shows the stale date');
});

/* ========================= upstream unavailable ========================== */

test('Calendly being down does not tell a paying customer they are not booked', async () => {
  useCalendly(fixtures(), { fail: true });
  const res = mockRes();
  await confirmed(reqWith(validCookie()), res);
  assert.equal(res.statusCode, 200);
  assert.match(res.body, /confirming your session/i);
  assert.doesNotMatch(res.body, /You're booked/);
});

test('a 500 from Calendly is treated as an outage, not a rejection', async () => {
  useCalendly(fixtures(), { status: 503 });
  const res = mockRes();
  await confirmed(reqWith(validCookie()), res);
  assert.equal(res.statusCode, 200);
  assert.match(res.body, /confirming your session/i);
});

/* ======================== the Calendly redirect ========================== */

test('redirect endpoint: a real booking issues a session and lands on the clean URL', async () => {
  useCalendly(fixtures());
  const res = mockRes();
  await confirm(
    { headers: { 'x-forwarded-proto': 'https' }, query: { invitee_uuid: INV, event_start_time: '2026-09-12T22:00:00Z', invitee_email: 'buyer@example.com' } },
    res
  );
  assert.equal(res.statusCode, 302);
  assert.equal(res.location, '/cooking/confirmed', 'no personal data in the URL');
  assert.ok(res.cookies.some((c) => c.startsWith(`${S.VERIFIED_COOKIE}=`) && c.includes('HttpOnly')));
});

test('redirect endpoint: a made-up invitee uuid gets nothing', async () => {
  useCalendly(fixtures());
  const res = mockRes();
  await confirm({ headers: {}, query: { invitee_uuid: 'not-a-uuid' } }, res);
  assert.equal(res.statusCode, 302);
  assert.equal(res.location, '/meta');
  assert.equal(res.cookies.length, 0, 'issues no session');
});

test('redirect endpoint: a well-formed but unknown uuid gets nothing', async () => {
  useCalendly(fixtures());
  globalThis.fetch = async (url) => {
    const path = url.replace('https://api.calendly.com', '');
    if (path.startsWith('/users/me'))
      return { ok: true, status: 200, json: async () => ({ resource: { current_organization: 'x' } }) };
    return { ok: false, status: 404, json: async () => null };
  };
  const res = mockRes();
  await confirm(
    { headers: {}, query: { invitee_uuid: '99999999-9999-4999-8999-999999999999' } },
    res
  );
  assert.equal(res.statusCode, 302);
  assert.equal(res.location, '/meta');
  assert.ok(!res.cookies.some((c) => c.startsWith(`${S.VERIFIED_COOKIE}=` + 'e')));
});

/* ========================== misconfiguration ============================= */

test('without a signing secret the page fails closed', async () => {
  const keep = process.env.CONFIRMATION_SECRET;
  process.env.CONFIRMATION_SECRET = '';
  const res = mockRes();
  await confirmed(reqWith(validCookie()), res);
  process.env.CONFIRMATION_SECRET = keep;
  assert.equal(res.statusCode, 302);
  assert.equal(res.location, '/meta');
});
