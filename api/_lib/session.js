/* ---------------------------------------------------------------------------
   session.js — the short-lived confirmation session.

   The confirmation page is gated by an HMAC-signed, HttpOnly cookie that the
   server issues only after it has verified the booking against Calendly. The
   cookie carries no personal data: just the two Calendly identifiers needed to
   re-resolve the booking, and an expiry. Every render re-fetches from Calendly,
   so a cancellation or reschedule is caught even with a valid cookie.

   Files under api/_lib are not routed by Vercel (leading underscore), so this
   is server-only and never reaches the browser.
--------------------------------------------------------------------------- */

const crypto = require('crypto');

const VERIFIED_COOKIE = 'glutt_conf';
const PENDING_COOKIE = 'glutt_conf_pending';
const ATTR_COOKIE = 'glutt_attr';

const TTL_VERIFIED = 60 * 45; // 45 min — long enough to refresh and re-read
const TTL_PENDING = 60 * 10;

const b64u = (buf) => Buffer.from(buf).toString('base64url');

function hmac(secret, data) {
  return crypto.createHmac('sha256', secret).update(data).digest();
}

/** @returns {string} `<payload>.<signature>` */
function sign(payload, secret, ttlSeconds) {
  const body = { ...payload, exp: Math.floor(Date.now() / 1000) + ttlSeconds };
  const data = b64u(JSON.stringify(body));
  return `${data}.${b64u(hmac(secret, data))}`;
}

/** @returns {object|null} the payload, or null if forged, malformed or expired */
function verify(token, secret) {
  if (typeof token !== 'string' || !secret) return null;
  const dot = token.indexOf('.');
  if (dot < 1) return null;

  const data = token.slice(0, dot);
  const given = Buffer.from(token.slice(dot + 1), 'base64url');
  const want = hmac(secret, data);

  // length check first: timingSafeEqual throws on a mismatch
  if (given.length !== want.length || !crypto.timingSafeEqual(given, want)) return null;

  let payload;
  try {
    payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
  } catch {
    return null;
  }

  if (!payload || typeof payload.exp !== 'number') return null;
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

function parseCookies(req) {
  const out = {};
  const raw = req.headers?.cookie;
  if (!raw) return out;
  for (const part of raw.split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    out[part.slice(0, i).trim()] = part.slice(i + 1).trim();
  }
  return out;
}

function cookie(name, value, maxAge, { secure = true } = {}) {
  const bits = [
    `${name}=${value}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax', // Calendly returns via a top-level navigation, so Lax is sent
    `Max-Age=${maxAge}`,
  ];
  if (secure) bits.push('Secure');
  return bits.join('; ');
}

const clear = (name) => `${name}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;

module.exports = {
  VERIFIED_COOKIE,
  PENDING_COOKIE,
  ATTR_COOKIE,
  TTL_VERIFIED,
  TTL_PENDING,
  sign,
  verify,
  parseCookies,
  cookie,
  clear,
};
