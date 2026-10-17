/* Kleine brug tussen de app en de spraakmotor (spraak-worker.js).
 *   Spraak.voorbereiden('vrouw')            -> laadt alvast het stemmodel (eerste keer ~63 MB)
 *   Spraak.maak('paardrijden', 'vrouw')     -> Promise<blob-url van een wav-bestand>
 * Lukt het niet (oud toestel, geen internet bij de eerste keer ...), dan geeft maak() een fout
 * en gebruikt de app de stem van het toestel. */
(function () {
  'use strict';
  let worker = null, nr = 0;
  const wacht = {}, klaar = {}, cache = new Map();
  let kapot = false;

  function start() {
    if (worker || kapot) return worker;
    try {
      worker = new Worker(((window.WEEKEND && window.WEEKEND.basis) || '') + 'spraak/spraak-worker.js');
      worker.onmessage = e => { const w = wacht[e.data.nr]; if (w) { delete wacht[e.data.nr]; w(e.data); } };
      worker.onerror = e => { console.warn('[spraak]', e.message); kapot = true; Object.values(wacht).forEach(w => w({ ok: false, fout: 'worker' })); };
    } catch (e) { kapot = true; }
    return worker;
  }
  function vraag(bericht, ms) {
    return new Promise((ok, fout) => {
      if (!start()) return fout(new Error('geen spraakmotor'));
      const n = ++nr;
      const t = setTimeout(() => { delete wacht[n]; fout(new Error('te traag')); }, ms);
      wacht[n] = d => { clearTimeout(t); d.ok ? ok(d) : fout(new Error(d.fout)); };
      worker.postMessage(Object.assign({ nr: n }, bericht));
    });
  }
  function wav(pcm, rate) {
    const buf = new ArrayBuffer(44 + pcm.length * 2), v = new DataView(buf);
    const s = (o, t) => { for (let i = 0; i < t.length; i++) v.setUint8(o + i, t.charCodeAt(i)); };
    s(0, 'RIFF'); v.setUint32(4, 36 + pcm.length * 2, true); s(8, 'WAVE'); s(12, 'fmt ');
    v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
    s(36, 'data'); v.setUint32(40, pcm.length * 2, true);
    for (let i = 0; i < pcm.length; i++) v.setInt16(44 + i * 2, Math.max(-1, Math.min(1, pcm[i])) * 32767, true);
    return URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
  }

  window.Spraak = {
    get kapot() { return kapot; },
    isKlaar: stem => !!klaar[stem],
    voorbereiden(stem) {
      if (klaar[stem] || kapot) return Promise.resolve();
      if (!klaar['_' + stem]) klaar['_' + stem] = vraag({ soort: 'voorbereiden', stem }, 180000)
        .then(() => { klaar[stem] = true; })
        .catch(e => { console.warn('[spraak] voorbereiden mislukt:', e.message); delete klaar['_' + stem]; });
      return klaar['_' + stem];
    },
    maak(tekst, stem) {
      const sleutel = stem + '|' + tekst;
      if (cache.has(sleutel)) return Promise.resolve(cache.get(sleutel));
      // nog niet geladen: niet te lang wachten, anders valt de app terug op de stem van het toestel
      const ms = klaar[stem] ? 15000 : 4000;
      return vraag({ soort: 'spreek', tekst, stem, tempo: 1.1 }, ms).then(d => {
        const url = wav(d.pcm, d.rate);
        cache.set(sleutel, url);
        return url;
      });
    }
  };
})();
