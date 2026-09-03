/* ---------------------------------------------------------------------------
   Meta Purchase rules, exercised against the real /meta page in a browser.

   These are money rules — a Purchase fired at the wrong moment, or twice,
   misreports revenue — so they are tested by driving the actual page and
   dispatching Calendly's real message shapes, not by reading the source.

   Skipped automatically when Chrome is not installed.
--------------------------------------------------------------------------- */

const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ROOT = path.join(__dirname, '..');
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

if (!fs.existsSync(CHROME)) {
  test('meta Purchase rules (skipped: Chrome not installed)', { skip: true }, () => {});
  return;
}

/* -------------------------- tiny static server -------------------------- */

const confirmRequests = [];

function serve() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://x');

    // stand in for /api/cooking/confirm so the handover can be observed
    if (url.pathname === '/api/cooking/confirm') {
      confirmRequests.push({
        pathname: url.pathname,
        query: Object.fromEntries(url.searchParams),
      });
      res.writeHead(200, { 'Content-Type': 'text/html' });
      return res.end('<!doctype html><title>confirm stub</title>');
    }

    const rel = decodeURIComponent(url.pathname).replace(/^\/+/, '');
    for (const c of [rel, path.join(rel, 'index.html')]) {
      const abs = path.join(ROOT, c);
      if (abs.startsWith(ROOT) && fs.existsSync(abs) && fs.statSync(abs).isFile()) {
        res.writeHead(200, { 'Content-Type': TYPES[path.extname(abs)] || 'application/octet-stream' });
        return fs.createReadStream(abs).pipe(res);
      }
    }
    res.writeHead(404).end();
  });
  return new Promise((r) => server.listen(0, '127.0.0.1', () => r(server)));
}

/* ------------------------------ CDP driver ------------------------------ */

async function browser(port) {
  const chrome = spawn(
    CHROME,
    ['--headless=new', `--remote-debugging-port=${port}`, '--user-data-dir=' + fs.mkdtempSync('/tmp/cdp-'),
     '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', 'about:blank'],
    { stdio: 'ignore' }
  );
  let wsUrl;
  for (let i = 0; i < 80; i++) {
    try {
      wsUrl = (await (await fetch(`http://127.0.0.1:${port}/json/version`)).json()).webSocketDebuggerUrl;
      break;
    } catch { await sleep(250); }
  }
  const ws = new WebSocket(wsUrl);
  await new Promise((r) => ws.addEventListener('open', r));

  let id = 0;
  const rpc = (method, params = {}, sessionId) =>
    new Promise((res, rej) => {
      const i = ++id;
      const h = (e) => {
        const d = JSON.parse(e.data);
        if (d.id === i) { ws.removeEventListener('message', h); d.error ? rej(new Error(d.error.message)) : res(d.result); }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id: i, method, params, sessionId }));
    });

  const { targetId } = await rpc('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await rpc('Target.attachToTarget', { targetId, flatten: true });
  const S = (m, p) => rpc(m, p, sessionId);
  return { chrome, ws, S, close: () => { ws.close(); chrome.kill(); } };
}

/* -------------------------------- suite -------------------------------- */

test('Meta Purchase rules on the paid booking page', async (t) => {
  const server = await serve();
  const base = `http://127.0.0.1:${server.address().port}`;
  const b = await browser(9361);
  t.after(() => { b.close(); server.close(); });

  await b.S('Page.enable');
  await b.S('Runtime.enable');

  // A recording stand-in for a Pixel that is already on the page. Its presence
  // is also the assertion that our code adopts it instead of installing another.
  await b.S('Page.addScriptToEvaluateOnNewDocument', {
    source: `window.__fbq = [];
             window.fbq = function () { window.__fbq.push(Array.from(arguments)); };`,
  });

  await b.S('Page.navigate', { url: `${base}/cooking/book` });
  await sleep(1800);

  const ev = async (expr) => {
    const r = await b.S('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.text);
    return r.result.value;
  };

  const INVITEE = 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee';
  const EVENT = 'ffffffff-1111-4222-8333-444444444444';

  // MessageEvent's constructor lets us reproduce Calendly's origin exactly.
  const post = (data, origin = 'https://calendly.com') =>
    ev(`window.dispatchEvent(new MessageEvent('message', {
      data: ${JSON.stringify(data)}, origin: ${JSON.stringify(origin)} })); 0`);

  const purchases = () =>
    ev(`JSON.stringify(window.__fbq.filter(a => a[0] === 'track' && a[1] === 'Purchase'))`).then(JSON.parse);
  const calls = () => ev(`JSON.stringify(window.__fbq)`).then(JSON.parse);

  const scheduled = {
    event: 'calendly.event_scheduled',
    payload: {
      event: { uri: `https://api.calendly.com/scheduled_events/${EVENT}` },
      invitee: { uri: `https://api.calendly.com/scheduled_events/${EVENT}/invitees/${INVITEE}` },
    },
  };

  const nav = () => confirmRequests.slice();
  const reload = async () => {
    confirmRequests.length = 0;
    await b.S('Page.navigate', { url: `${base}/cooking/book` });
    await sleep(1500);
  };

  await t.test('CTA copy is commitment-free and survives syncPrice', async () => {
    await b.S('Page.navigate', { url: `${base}/meta` });
    await sleep(1600);
    // syncPrice() rewrites [data-price] elements; it must never turn a CTA back
    // into "Book for <price>", which would misdescribe what the click does.
    const hero = await ev(`document.querySelector('.hero .btn').textContent.trim()`);
    assert.equal(hero, 'Book a free 10-minute call', 'the cold CTA books the free call');

    const sticky = await ev(`document.querySelector('#sticky .btn').textContent.trim()`);
    assert.equal(sticky, 'Book a free 10-minute call');

    const free = await ev(`document.querySelector('.hero__free').textContent.trim()`);
    assert.match(free, /No payment/);

    // the eventual price stays visible so the lead knows what they are considering
    assert.match(await ev(`document.body.innerText`), /\$109\.99/);

    assert.equal(await ev(`document.body.innerText.includes('Book for')`), false);
    assert.equal(await ev(`/trained chef|professional chef|\\bchef\\b/i.test(document.body.innerText)`), false,
      'Malik is the founder, not a chef — no credential claim');
  });

  await t.test('the V1 glasses-ad continuity line is gated on utm_content', async () => {
    // hidden for ordinary traffic
    assert.equal(await ev(`document.getElementById('matchline').hidden`), true);

    await b.S('Page.navigate', { url: `${base}/meta?utm_content=V1%20%7C%20Founder%20AI%20Glasses` });
    await sleep(1500);
    assert.equal(await ev(`document.getElementById('matchline').hidden`), false,
      'shown for the glasses ad');
    assert.match(await ev(`document.getElementById('matchline').textContent.trim()`),
      /Meta glasses cooking session from the ad/);
    // and it must not have eaten the attribution
    assert.match(await ev(`decodeURIComponent(document.cookie)`), /utm_content/);

    // back to the page this suite is about
    await b.S('Page.navigate', { url: `${base}/cooking/book` });
    await sleep(1500);
  });

  await t.test('adopts the existing Pixel instead of initialising another', async () => {
    assert.equal((await calls()).filter((c) => c[0] === 'init').length, 0, 'must never call fbq init');
  });

  await t.test('no Purchase and no handover from the other Calendly events', async () => {
    await post({ event: 'calendly.profile_page_viewed' });
    await post({ event: 'calendly.event_type_viewed' });
    await post({ event: 'calendly.date_and_time_selected' });
    await sleep(1200); // longer than the handover delay
    assert.equal((await purchases()).length, 0);
    assert.deepEqual(nav(), [], 'nothing navigates on load, date or time selection');
    assert.equal((await calls()).filter((c) => c[1] === 'InitiateCheckout').length, 1,
      'picking a time is InitiateCheckout, not Purchase');
  });

  await t.test('a message that is not really from Calendly does nothing', async () => {
    await post(scheduled, 'https://evil.example');
    await sleep(1200);
    assert.equal((await purchases()).length, 0);
    assert.deepEqual(nav(), [], 'a spoofed origin must not redirect');
  });

  await t.test('event_scheduled fires exactly one Purchase, with value, currency and eventID', async () => {
    await post(scheduled);
    await post(scheduled); // repeats inside the handover window
    await post(scheduled);
    await sleep(300); // read before the navigation happens

    const p = await purchases();
    assert.equal(p.length, 1, 'once per booking however many messages arrive');
    assert.deepEqual(p[0][2], { value: 109.99, currency: 'USD' });
    assert.deepEqual(p[0][3], { eventID: INVITEE }, 'eventID is the Calendly invitee uuid');

    const blob = JSON.stringify(p[0]).toLowerCase();
    for (const leak of ['email', '@', 'phone', 'name', 'address', 'recipe'])
      assert.ok(!blob.includes(leak), `Purchase parameters must not contain "${leak}"`);
    assert.deepEqual(Object.keys(p[0][2]).sort(), ['currency', 'value']);
  });

  await t.test('then hands over to the verified confirmation, once', async () => {
    await sleep(1200); // past HANDOVER_DELAY_MS
    const seen = nav();
    assert.equal(seen.length, 1, 'exactly one handover despite three messages');
    assert.equal(seen[0].pathname, '/api/cooking/confirm',
      'the entry point that issues the signed cookie, not /cooking/confirmed directly');
    assert.equal(seen[0].query.invitee_uuid, INVITEE, 'identified by the Calendly invitee uuid');
    assert.equal(seen[0].query.event_uuid, EVENT, 'event uuid passed so verification reads directly');
    assert.equal(Object.keys(seen[0].query).length, 2, 'no personal data in the handover URL');
  });

  await t.test('a reload does not re-count the same booking', async () => {
    await reload();
    await post(scheduled);
    await sleep(300);
    assert.equal((await purchases()).length, 0, 'already counted before the reload');
  });

  await t.test('a different booking is counted separately', async () => {
    await reload();
    const other = JSON.parse(JSON.stringify(scheduled));
    other.payload.invitee.uri =
      'https://api.calendly.com/scheduled_events/Z/invitees/99999999-8888-4777-8666-555555555555';
    other.payload.event.uri = 'https://api.calendly.com/scheduled_events/Z';
    await post(other);
    await sleep(300);
    const p = await purchases();
    assert.equal(p.length, 1);
    assert.equal(p[0][3].eventID, '99999999-8888-4777-8666-555555555555');
  });

  await t.test('a broken Pixel (ad blocker) breaks neither booking nor handover', async () => {
    await reload();
    await ev(`window.__errs = [];
      window.addEventListener('error', e => window.__errs.push(String(e.message)));
      window.onunhandledrejection = e => window.__errs.push(String(e.reason));
      window.fbq = function () { throw new Error('pixel blocked'); }; 0`);

    const fresh = JSON.parse(JSON.stringify(scheduled));
    fresh.payload.invitee.uri =
      'https://api.calendly.com/scheduled_events/Y/invitees/11111111-2222-4333-8444-555555555555';
    fresh.payload.event.uri = 'https://api.calendly.com/scheduled_events/Y';
    await post(fresh);
    await sleep(300); // read the page's own error log before it navigates away
    assert.deepEqual(await ev('JSON.stringify(window.__errs || [])').then(JSON.parse), [],
      'a throwing fbq must be swallowed, not surfaced');

    await sleep(1100); // now let the handover happen
    assert.equal(nav().length, 1, 'the customer still reaches their confirmation');
  });

  await t.test('a scheduled message with no invitee uri does not strand the customer', async () => {
    await reload();
    await post({ event: 'calendly.event_scheduled', payload: { event: { uri: 'x' } } });
    await sleep(1300);
    assert.deepEqual(nav(), [],
      'nothing to verify, so stay on Calendly’s own confirmation rather than bounce to /meta');
  });
});

test('the free intro call fires Schedule and never Purchase', async (t) => {
  const server = await serve();
  const base = `http://127.0.0.1:${server.address().port}`;
  const b = await browser(9363);
  t.after(() => { b.close(); server.close(); });

  await b.S('Page.enable');
  await b.S('Runtime.enable');
  await b.S('Page.addScriptToEvaluateOnNewDocument', {
    source: `window.__fbq = [];
             window.fbq = function () { window.__fbq.push(Array.from(arguments)); };`,
  });

  const ev = async (expr) => {
    const r = await b.S('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.text);
    return r.result.value;
  };
  const calls = () => ev(`JSON.stringify(window.__fbq)`).then(JSON.parse);
  const post = (data, origin = 'https://calendly.com') =>
    ev(`window.dispatchEvent(new MessageEvent('message', {
      data: ${JSON.stringify(data)}, origin: ${JSON.stringify(origin)} })); 0`);

  const INV = 'aaaa1111-2222-4333-8444-555566667777';
  const scheduled = {
    event: 'calendly.event_scheduled',
    payload: {
      event: { uri: 'https://api.calendly.com/scheduled_events/INTRO1' },
      invitee: { uri: `https://api.calendly.com/scheduled_events/INTRO1/invitees/${INV}` },
    },
  };

  confirmRequests.length = 0;
  await b.S('Page.navigate', { url: `${base}/meta` });
  await sleep(1800);

  await t.test('the page declares itself an intro booking', async () => {
    assert.equal(await ev(`document.getElementById('cal').dataset.booking`), 'intro');
  });

  await t.test('picking a time does not fire InitiateCheckout on a free call', async () => {
    await post({ event: 'calendly.date_and_time_selected' });
    await sleep(200);
    assert.equal((await calls()).filter((c) => c[1] === 'InitiateCheckout').length, 0);
  });

  await t.test('a completed intro booking fires Schedule once, with the invitee uuid', async () => {
    await post(scheduled);
    await post(scheduled);
    await post(scheduled);
    await sleep(300);
    const sch = (await calls()).filter((c) => c[1] === 'Schedule');
    assert.equal(sch.length, 1, 'once per booking');
    assert.deepEqual(sch[0][2], {}, 'no value or currency on a free call');
    assert.deepEqual(sch[0][3], { eventID: INV });
  });

  await t.test('MOST IMPORTANT: no Purchase is ever fired by the intro call', async () => {
    const all = await calls();
    assert.equal(all.filter((c) => c[1] === 'Purchase').length, 0);
    assert.equal(JSON.stringify(all).includes('109.99'), false, 'no paid value anywhere');
  });

  await t.test('it hands over to the free confirmation, not the paid one', async () => {
    await sleep(1200);
    assert.deepEqual(confirmRequests, [], 'never touches /api/cooking/confirm');
    assert.match(await ev('location.pathname'), /\/intro\/confirmed/);
  });

  await t.test('a spoofed origin fires nothing', async () => {
    await b.S('Page.navigate', { url: `${base}/meta` });
    await sleep(1500);
    await post({ ...scheduled, payload: { invitee: { uri: 'x/invitees/bbbb1111-2222-4333-8444-555566667777' } } }, 'https://evil.example');
    await sleep(1200);
    assert.equal((await calls()).filter((c) => c[1] === 'Schedule' || c[1] === 'Purchase').length, 0);
  });

  await t.test('a reload does not re-count the same intro booking', async () => {
    await b.S('Page.navigate', { url: `${base}/meta` });
    await sleep(1500);
    await post(scheduled);
    await sleep(300);
    assert.equal((await calls()).filter((c) => c[1] === 'Schedule').length, 0, 'already counted');
  });

  await t.test('UTMs survive the intro funnel', async () => {
    await b.S('Page.navigate', { url: `${base}/meta?utm_source=ig&utm_medium=paid_social&utm_campaign=c&utm_content=a&utm_term=s&placement=feed&campaign_id=1&ad_id=2` });
    await sleep(1600);
    const attr = await ev(`decodeURIComponent(document.cookie.split('; ').find(c=>c.startsWith('glutt_attr='))?.slice(11)||'{}')`);
    for (const k of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'])
      assert.match(attr, new RegExp(k), `${k} preserved`);
  });
});

test('the Pixel is initialised exactly once', async (t) => {
  const server = await serve();
  const base = `http://127.0.0.1:${server.address().port}`;
  const b = await browser(9362);
  t.after(() => { b.close(); server.close(); });

  await b.S('Page.enable');
  await b.S('Runtime.enable');
  await b.S('Network.enable');
  // hold the real Pixel script so every call stays queued and countable
  await b.S('Network.setBlockedURLs', { urls: ['*connect.facebook.net*'] });

  await b.S('Page.navigate', { url: `${base}/cooking/book` });
  await sleep(1800);

  const queue = await b.S('Runtime.evaluate', {
    expression: 'JSON.stringify((window.fbq && window.fbq.queue) || [])',
    returnByValue: true,
  }).then((r) => JSON.parse(r.result.value));

  const inits = queue.filter((c) => c[0] === 'init');
  assert.equal(inits.length, 1, 'exactly one fbq init, never a second Pixel');
  assert.equal(inits[0][1], '2198241070747099', 'the current website Pixel');
  assert.equal(queue.filter((c) => c[0] === 'track' && c[1] === 'PageView').length, 1);
  assert.equal(queue.filter((c) => c[1] === 'Purchase').length, 0, 'no Purchase merely from landing');
});
