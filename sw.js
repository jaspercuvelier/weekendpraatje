/* Service worker van "Mijn weekend": bewaart de app op het toestel.
 * - de app zelf (html, js, css, inhoud): eerst internet proberen, anders de bewaarde versie
 *   -> updates komen meteen door, en zonder internet werkt alles toch
 * - prenten en geluidjes: bewaarde versie meteen tonen, op de achtergrond bijwerken
 * - stemmodellen en spraakmotor (groot): één keer downloaden, daarna altijd van het toestel
 * Werkt in een gewone browser; installeren als app is niet nodig (wel handig). */
'use strict';
const VERSIE = 'weekend-4';          // ophogen als je zeker wil dat alles opnieuw opgehaald wordt
const GROOT_CACHE = 'weekend-groot';  // stemmodellen en spraakmotor: blijven bewaard over versies heen
const KERN = [
  './', 'index.html', 'stijl.css', 'app.js', 'inhoud.js', 'sclera/sclera.css', 'sclera/picto/lijst.js', 'audio/lijst.js',
  'spraak/spraak.js', 'manifest.webmanifest', 'assets/logo-styrka.png', 'assets/jouw-koers.png',
  'assets/icoon-192.png', 'assets/icoon-512.png', 'assets/achtergrond.svg'
];
const GROOT = /\.(onnx|wasm|data)$|onnx\.json$|\/ort[^/]*\.js$|piper_phonemize\.js$/;
const MEDIA = /\.(jpg|jpeg|png|mp3|woff2?)$/;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSIE).then(c => c.addAll(KERN)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== VERSIE && k !== GROOT_CACHE) await caches.delete(k);
    await self.clients.claim();
    // alle prenten en geluidjes alvast bewaren (± 12 MB), zodat de app ook offline volledig werkt
    try {
      const c = await caches.open(VERSIE);
      const lijst = async (url, pad) => {
        const t = await (await fetch(url, { cache: 'no-store' })).text();
        const json = JSON.parse(t.slice(t.indexOf('=') + 1).trim().replace(/;$/, ''));
        return pad(json);
      };
      // standaard = Sclera-picto's; de prenten van beta/ worden pas bewaard wanneer ze gebruikt worden
      const beelden = await lijst('sclera/picto/lijst.js', a => a.map(id => `sclera/picto/${id}.png`));
      const audio = await lijst('audio/lijst.js', o => Object.entries(o).flatMap(([s, ids]) => ids.map(id => `audio/${s}/${id}.mp3`)));
      const ontbreekt = [];
      for (const u of beelden.concat(audio)) if (!(await c.match(u))) ontbreekt.push(u);
      for (let i = 0; i < ontbreekt.length; i += 20) {
        await Promise.allSettled(ontbreekt.slice(i, i + 20).map(u => c.add(u)));
      }
    } catch (fout) { /* niet erg: wat ontbreekt wordt bewaard zodra het gebruikt wordt */ }
  })());
});

async function eerstNet(req) {
  const url = new URL(req.url);
  const c = await caches.open(VERSIE);
  try {
    const r = await fetch(req, { cache: 'no-store' });
    if (r.ok) c.put(req, r.clone());
    return r;
  } catch (e) {
    return (await c.match(req, { ignoreSearch: true }))
      || (req.mode === 'navigate' ? await c.match(url.pathname.includes('/beta/') ? 'beta/index.html' : 'index.html') : null)
      || Response.error();
  }
}
async function eerstBewaard(req, bijwerken, naam) {
  const c = await caches.open(naam || VERSIE);
  const bewaard = await c.match(req);
  const haal = fetch(req).then(r => { if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; });
  if (bewaard) { if (bijwerken) haal.catch(() => {}); return bewaard; }
  return haal;
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const eigen = url.origin === self.location.origin;
  if (!eigen) {
    // spraakmotor van de CDN en lettertype: bewaren voor offline gebruik
    if (/cdnjs\.cloudflare\.com|fonts\.(googleapis|gstatic)\.com/.test(url.host)) e.respondWith(eerstBewaard(req, false, GROOT_CACHE));
    return;
  }
  if (GROOT.test(url.pathname)) e.respondWith(eerstBewaard(req, false, GROOT_CACHE));
  else if (MEDIA.test(url.pathname)) e.respondWith(eerstBewaard(req, true));
  else e.respondWith(eerstNet(req));
});
