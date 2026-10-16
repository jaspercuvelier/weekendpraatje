/* Spraakmotor voor "Mijn weekend": Piper in de browser (in een aparte thread, zodat de app vlot blijft).
 * 1. piper_phonemize (espeak-ng als WebAssembly) zet tekst om in klanken
 * 2. onnxruntime-web laat het Vlaamse stemmodel (vrouw.onnx / man.onnx) daar geluid van maken
 * Alles wordt door de service worker bewaard, dus na de eerste keer werkt het ook zonder internet. */
'use strict';
const ORT_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/onnxruntime-web/1.18.0/';
let ortKlaar = null;
const sessies = {};      // stem -> Promise<{ sessie, cfg }>

function laadOrt() {
  if (!ortKlaar) ortKlaar = (async () => {
    let basis = 'ort/';                                   // eerst een lokale kopie (spraak/ort/), anders de CDN
    try { importScripts(basis + 'ort.min.js'); }
    catch (e) { basis = ORT_CDN; importScripts(basis + 'ort.min.js'); }
    self.ort.env.wasm.numThreads = 1;
    self.ort.env.wasm.proxy = false;
    self.ort.env.wasm.wasmPaths = new URL(basis, self.location.href).href;
  })();
  return ortKlaar;
}

function laadStem(stem) {
  if (!sessies[stem]) sessies[stem] = (async () => {
    await laadOrt();
    const cfg = await (await fetch(`${stem}.onnx.json`)).json();
    const r = await fetch(`${stem}.onnx`);
    if (!r.ok) throw new Error(`stemmodel ${stem}.onnx niet gevonden (${r.status})`);
    const sessie = await self.ort.InferenceSession.create(await r.arrayBuffer(), { executionProviders: ['wasm'] });
    return { sessie, cfg };
  })().catch(e => { delete sessies[stem]; throw e; });
  return sessies[stem];
}

importScripts('piper_phonemize.js');                       // definieert createPiperPhonemize
function klanken(tekst, taal) {
  return new Promise((ok, fout) => {
    let klaar = false;
    createPiperPhonemize({
      print: data => { if (!klaar) { klaar = true; ok(JSON.parse(data).phoneme_ids); } },
      printErr: m => { if (!klaar && /error/i.test(m)) { klaar = true; fout(new Error(m)); } },
      locateFile: url => url,                              // .wasm en .data staan naast dit bestand
    }).then(mod => {
      mod.callMain(['-l', taal, '--input', JSON.stringify([{ text: tekst }]), '--espeak_data', '/espeak-ng-data']);
    }).catch(fout);
  });
}

async function spreek(tekst, stem, tempo) {
  const { sessie, cfg } = await laadStem(stem);
  const ids = await klanken(tekst, cfg.espeak.voice);
  const inf = cfg.inference;
  const feeds = {
    input: new self.ort.Tensor('int64', BigInt64Array.from(ids.map(BigInt)), [1, ids.length]),
    input_lengths: new self.ort.Tensor('int64', BigInt64Array.from([BigInt(ids.length)]), [1]),
    scales: new self.ort.Tensor('float32', Float32Array.from([inf.noise_scale, tempo || inf.length_scale, inf.noise_w]), [3]),
  };
  if (cfg.num_speakers > 1) feeds.sid = new self.ort.Tensor('int64', BigInt64Array.from([0n]), [1]);
  const uit = await sessie.run(feeds);
  const pcm = uit.output ? uit.output.data : uit[Object.keys(uit)[0]].data;
  return { pcm: Float32Array.from(pcm), rate: cfg.audio.sample_rate };
}

self.onmessage = async e => {
  const { nr, soort, tekst, stem, tempo } = e.data;
  try {
    if (soort === 'voorbereiden') { await laadStem(stem); self.postMessage({ nr, ok: true }); return; }
    const { pcm, rate } = await spreek(tekst, stem, tempo);
    self.postMessage({ nr, ok: true, pcm, rate }, [pcm.buffer]);
  } catch (fout) {
    self.postMessage({ nr, ok: false, fout: String(fout && fout.message || fout) });
  }
};
