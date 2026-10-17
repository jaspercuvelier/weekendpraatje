'use strict';
(function () {
  const D = window.INHOUD;
  // Instellingen per versie (bv. sclera/index.html): window.WEEKEND = { basis: '../', beelden: 'picto/', ext: '.png', vorm: 'sclera' }
  const CFG = Object.assign({ basis: '', beelden: 'beelden/', ext: '.jpg', vorm: 'scene' }, window.WEEKEND || {});
  const Z = D.zinnen;
  const BEELDEN = new Set(window.BEELDEN || []);
  const AUDIO = window.AUDIO || {};               // { vrouw: [...ids], man: [...ids] }
  const LAGEN = D.lagen.map(l => l.id);           // wie, waar, wanneer, hoe
  const $ = s => document.querySelector(s);

  // ---------- kleine hulpjes ----------
  const opslag = {
    get(k, d) { try { const v = localStorage.getItem('weekend_' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('weekend_' + k, JSON.stringify(v)); } catch (e) { /* geen opslag: geen probleem */ } }
  };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function meng(hex, wit) {
    const n = parseInt(hex.slice(1), 16), rgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    return 'rgb(' + rgb.map(c => Math.round(c + (255 - c) * wit)).join(',') + ')';
  }

  // Lijn-iconen (24x24) in dezelfde dunne lijn als de tekeningen.
  const DUIM = '<path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/>';
  const VINK = '<path d="M20 6 9 17l-5-5"/>', KRUIS = '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>';
  const ICOON = {
    terug: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    opnieuw: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    luid: '<path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/>',
    pijl: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    potlood: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    sparkel: '<path d="M9.94 14.5A2 2 0 0 0 8.5 13.06l-6.13-1.58a.5.5 0 0 1 0-.96L8.5 8.94A2 2 0 0 0 9.94 7.5l1.58-6.13a.5.5 0 0 1 .96 0L14.06 7.5A2 2 0 0 0 15.5 8.94l6.13 1.58a.5.5 0 0 1 0 .96L15.5 13.06a2 2 0 0 0-1.44 1.44l-1.58 6.13a.5.5 0 0 1-.96 0z"/>',
    'blok-ja': VINK, 'blok-nee': KRUIS, 'waarweet-ja': VINK, 'waarweet-nee': KRUIS,
    'blok-weet': '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
    'blok-nogeens': '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    'hoe-super': `<g transform="translate(0 5) scale(.52)">${DUIM}</g><g transform="translate(11.5 5) scale(.52)">${DUIM}</g>`,
    'hoe-leuk': DUIM,
    'hoe-gewoon': `<g transform="rotate(-90 12 12)">${DUIM}</g>`,
    'hoe-niet': `<g transform="matrix(1 0 0 -1 0 24)">${DUIM}</g>`
  };
  const svgIcoon = (inner, cls = '') =>
    `<svg viewBox="0 0 24 24" class="${cls}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
  const beeldId = it => it.beeld || (it.groepen ? 'cat-' + it.id : it.id);
  const beeldSrc = it => BEELDEN.has(beeldId(it)) ? CFG.beelden + beeldId(it) + CFG.ext : null;

  // ---------- toestand ----------
  let modus = null;              // 'zelf' of 'voorlezen'
  let stem = null;               // 'vrouw' of 'man'
  let keuze = leeg();
  let corrigeren = false, bevestigd = false;
  const verhalen = [];
  function leeg() {
    return { cat: null, groep: null, act: null, typ: null, wie: null, waar: null, waarweet: null, waartyp: null, wanneer: null, hoe: null };
  }
  // wat er moet wissen als je iets anders kiest
  const AFHANKELIJK = { cat: ['groep', 'act', 'typ'], groep: ['act', 'typ'], act: ['typ'], waar: ['waarweet', 'waartyp'], waarweet: ['waartyp'] };

  function typNodig() { return (keuze.groep && keuze.groep.typ) || (keuze.act && keuze.act.typ); }
  function metLagen() {
    const g = keuze.groep, a = keuze.act;
    return !(g && g.lagen === false) && !(a && a.lagen === false);
  }
  function velden() {
    const v = ['cat', 'groep'];
    if (keuze.groep && keuze.groep.activiteiten) v.push('act');
    if (typNodig()) v.push('typ');
    if (metLagen()) {
      v.push('wie');
      if (!(keuze.act && keuze.act.waar === false)) {
        v.push('waar');
        if (keuze.waar && keuze.waar.anders) {
          v.push('waarweet');
          if (keuze.waarweet && keuze.waarweet.id === 'waarweet-ja') v.push('waartyp');
        }
      }
      v.push('wanneer', 'hoe');
    }
    return v;
  }
  function huidigeStap() {
    if (!modus) return 'start';
    if (modus === 'voorlezen' && !stem) return 'stem';
    return velden().find(v => !keuze[v]) || 'klaar';
  }
  function opties(stap) {
    switch (stap) {
      case 'start': return D.start;
      case 'stem': return D.stemmen;
      case 'cat': return D.categorieen;
      case 'groep': return keuze.cat.groepen;
      case 'act': return keuze.groep.activiteiten.concat(keuze.groep.ietsAnders ? [D.ietsAnders] : []);
      case 'waarweet': return D.waarweet;
      default: return D.lagen.find(l => l.id === stap).opties;
    }
  }
  // id van de (voor te lezen) vraag bij een stap
  function vraagId(stap) {
    if (stap === 'groep') return keuze.cat.vraag || 'vraag-groep';
    if (stap === 'act') return Z['vraag-act-' + keuze.groep.id] ? 'vraag-act-' + keuze.groep.id : 'vraag-act';
    if (stap === 'typ') return 'vraag-typ';
    return 'vraag-' + stap;
  }
  function vraagTekst(stap) {
    if (stap === 'start') return 'Hoe wil je vertellen?';
    if (stap === 'stem') return 'Welke stem?';
    if (stap === 'cat') return D.titel;
    if (LAGEN.includes(stap)) return D.lagen.find(l => l.id === stap).vraag;
    return Z[vraagId(stap)] || '';
  }
  // waar je zelf typte: "bij oma" blijft "bij oma", "Brugge" wordt "in Brugge"
  function waarFrase(t) {
    t = t.trim();
    return /^(in|bij|op|aan|naar|thuis|buiten|onder|achter|naast|over|langs|rond|tegen)\b/i.test(t) ? t : 'in ' + t;
  }

  // ---------- voorlezen ----------
  // Elke zin heeft een id. Staat audio/<stem>/<id>.mp3 er (maak_audio.py, Vlaamse Piper-stem), dan wordt die
  // gespeeld; anders (en voor wat de leerling zelf typte) leest de stem van het toestel voor.
  let rij = [], speler = null, bezig = false, rijNr = 0;
  const spreken = () => modus === 'voorlezen' && !!stem;
  const heeftAudio = id => !!id && Array.isArray(AUDIO[stem]) && AUDIO[stem].includes(id);

  function stil() {
    rij = []; rijNr++; bezig = false;
    if (speler) { speler.pause(); speler = null; }
    try { speechSynthesis.cancel(); } catch (e) { }
  }
  function lees(stukken, achteraan) {
    if (!spreken()) return;
    if (!achteraan) stil();
    rij.push(...stukken.filter(st => st && (heeftAudio(st[0]) || st[1])));
    if (!bezig) volgende();
  }
  function volgende() {
    const nr = rijNr;
    const st = rij.shift();
    if (!st) { bezig = false; return; }
    bezig = true;
    const verder = () => { if (nr === rijNr) { speler = null; setTimeout(volgende, 120); } };
    const speel = (src, reserve) => {
      speler = new Audio(src);
      speler.onended = verder;
      speler.onerror = reserve;
      speler.play().catch(reserve);
    };
    if (heeftAudio(st[0])) {
      speel(CFG.basis + `audio/${stem}/${st[0]}.mp3`, () => tts(st[1], verder));
    } else if (!st[0] && window.Spraak && !window.Spraak.kapot) {
      // zelf getypte tekst: met dezelfde Vlaamse stem, ter plaatse gemaakt (spraak/spraak.js)
      window.Spraak.maak(st[1], stem)
        .then(url => { if (nr === rijNr) speel(url, () => tts(st[1], verder)); })
        .catch(() => { if (nr === rijNr) tts(st[1], verder); });
    } else {
      tts(st[1], verder);
    }
  }
  function toestelStem() {
    const alle = speechSynthesis.getVoices().filter(v => /^nl/i.test(v.lang));
    const be = alle.filter(v => /^nl[-_]BE/i.test(v.lang));
    const pool = be.length ? be : alle;
    const man = /arnaud|bart|maarten|frank|xander|willem|guy|male|man\b/i;
    if (stem === 'man') return { v: pool.find(v => man.test(v.name)), pool };
    return { v: pool.find(v => !man.test(v.name)), pool };
  }
  function tts(tekst, klaar) {
    if (!tekst || !('speechSynthesis' in window)) { klaar(); return; }
    try {
      const u = new SpeechSynthesisUtterance(tekst.replace(/\//g, ' of ').replace(/…/g, ''));
      const { v, pool } = toestelStem();
      const keus = v || pool[0];
      if (keus) { u.voice = keus; u.lang = keus.lang; } else u.lang = 'nl-BE';
      if (stem === 'man' && !v) u.pitch = 0.7;           // geen mannenstem op dit toestel: wat lager
      u.rate = 0.9;
      u.onend = klaar; u.onerror = klaar;
      speechSynthesis.speak(u);
    } catch (e) { klaar(); }
  }
  const stukVast = id => [id, Z[id]];
  const stukItem = (stap, it) => [stap === 'cat' ? 'cat-' + it.id : it.id, it.spreek || it.woord];
  function stukkenControle() {
    const g = keuze.groep, a = keuze.act;
    const blad = a || g;
    if (!blad) return [];
    if (blad.zin) return [['c-' + blad.id, blad.zin]];
    const v = velden();
    const deel = k => (v.includes(k) && keuze[k] && keuze[k] !== '?' && keuze[k].zin) ? ['c-' + keuze[k].id, keuze[k].zin] : null;
    const iets = (g && g.typ) || (a && a.typ);
    const L = iets ? D.ietsAnders : a;
    let waar = deel('waar');
    if (v.includes('waartyp') && keuze.waartyp) waar = ['', waarFrase(keuze.waartyp)];
    const uit = [stukVast('c-' + L.hww), deel('wanneer'), deel('wie'), waar];
    if (iets) uit.push(stukVast('c-iets-anders'), ['', keuze.typ]);
    else uit.push(['c-' + L.id, L.rest]);
    uit.push(deel('hoe'));
    return uit.filter(Boolean);
  }
  function controleZin() {
    const st = stukkenControle();
    if (!st.length) return '';
    const hoe = keuze.hoe && keuze.hoe !== '?' && velden().includes('hoe') ? keuze.hoe.zin : null;
    const tekst = st.map(s => s[1]).filter(t => t && t !== hoe).join(' ');
    if (st.length === 1) return tekst;
    return hoe ? tekst + ', ' + hoe : tekst + '?';
  }
  function eindeId() {
    if (keuze.groep && keuze.groep.einde) return keuze.groep.einde;
    return 'einde';
  }

  function stemKlaarzetten() {
    if (!spreken() || !window.Spraak || window.Spraak.kapot || window.Spraak.isKlaar(stem)) return;
    const status = $('#typStatus');
    if (status) status.textContent = 'De stem wordt klaargezet. De eerste keer kan dat even duren.';
    window.Spraak.voorbereiden(stem).then(() => {
      const s = $('#typStatus');
      if (s) s.textContent = window.Spraak.isKlaar(stem) ? '' : 'Lukt niet: de stem van dit toestel leest voor.';
    });
  }

  // ---------- installeren als app (niet verplicht) ----------
  let installVraag = null, tipGesloten = false;
  const geinstalleerd = () => (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installVraag = e; });
  window.addEventListener('appinstalled', () => { installVraag = null; $('#installeer').hidden = true; });
  function toonInstalleerTip() {
    if (tipGesloten || geinstalleerd() || !window.isSecureContext || !('serviceWorker' in navigator)) return;   // installeren kan enkel via https of localhost
    $('#installeer').hidden = false;
  }
  async function installeer() {
    if (installVraag) {
      installVraag.prompt();
      const keuze = await installVraag.userChoice.catch(() => null);
      installVraag = null;
      if (keuze && keuze.outcome === 'accepted') { $('#installeer').hidden = true; return; }
      return;
    }
    // geen installatieknop van de browser (bv. Safari op iPad): uitleg tonen
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const o = $('#overlay');
    o.innerHTML = `<div class="groot-kaart uitleg">
      <span class="uitleg-titel">Deze site als app installeren</span>
      <span class="uitleg-tekst">${ios
        ? 'Tik op het deel-icoon (vierkantje met pijl omhoog) en kies <b>Zet op beginscherm</b>.'
        : 'Open het menu van je browser (⋮ of …) en kies <b>App installeren</b> of <b>Installeren</b>.'}</span>
      <span class="uitleg-klein">Tik ergens om te sluiten.</span></div>`;
    o.hidden = false;
    clearTimeout(overlayTimer);
  }

  // ---------- confetti ----------
  let confettiAan = opslag.get('confetti', true);
  const rustig = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function confetti(x, y, emoji, veel, richting) {
    if (!confettiAan || rustig || !emoji || !document.body.animate) return;
    const lijst = emoji.split(' ').filter(Boolean);
    if (!lijst.length) return;
    const n = veel ? 40 : 26;
    const basis = richting === undefined ? -Math.PI / 2 : richting;
    const spreiding = richting === undefined ? Math.PI * 1.25 : Math.PI * 0.45;
    const ring = document.createElement('span');
    ring.className = 'confetti-ring';
    ring.style.left = x + 'px'; ring.style.top = y + 'px';
    document.body.appendChild(ring);
    ring.animate([{ transform: 'translate(-50%,-50%) scale(.2)', opacity: .9 },
                  { transform: 'translate(-50%,-50%) scale(2.6)', opacity: 0 }],
                 { duration: 600, easing: 'ease-out' }).onfinish = () => ring.remove();
    for (let k = 0; k < n; k++) {
      const el = document.createElement('span');
      el.className = 'confetti';
      el.textContent = lijst[k % lijst.length];
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.style.fontSize = (veel ? 34 : 28) + Math.random() * 26 + 'px';
      document.body.appendChild(el);
      const hoek = basis + (Math.random() - 0.5) * spreiding;
      const v = (veel ? 520 : 380) + Math.random() * (veel ? 420 : 300);
      const vx = Math.cos(hoek) * v, vy = Math.sin(hoek) * v;
      const g = 1400, duur = 1.6 + Math.random() * 0.9;
      const draai = (Math.random() - 0.5) * 720, wiebel = 20 + Math.random() * 30;
      const frames = [];
      for (let f = 0; f <= 12; f++) {
        const t = duur * f / 12;
        const px = vx * t * 0.85 + Math.sin(t * 7) * wiebel * (f / 12);
        const py = vy * t + 0.5 * g * t * t;
        frames.push({
          transform: `translate(calc(-50% + ${px.toFixed(1)}px), calc(-50% + ${py.toFixed(1)}px)) rotate(${(draai * f / 12).toFixed(0)}deg) scale(${f === 0 ? 0.3 : f === 1 ? 1.25 : 1})`,
          opacity: f < 9 ? 1 : 1 - (f - 8) / 4
        });
      }
      el.animate(frames, { duration: duur * 1000, delay: Math.random() * 90, easing: 'linear', fill: 'backwards' })
        .onfinish = () => el.remove();
    }
  }
  function feest(emoji) {
    if (!confettiAan || rustig) return;
    const h = innerHeight, w = innerWidth;
    confetti(w * 0.5, h * 0.45, emoji, true);
    setTimeout(() => confetti(30, h - 90, emoji, true, -Math.PI / 3), 150);
    setTimeout(() => confetti(w - 30, h - 90, emoji, true, -Math.PI * 2 / 3), 300);
    setTimeout(() => confetti(w * 0.5, h * 0.35, emoji, true), 650);
  }
  function confettiOp(el, emoji) {
    const r = el.getBoundingClientRect();
    confetti(r.left + r.width / 2, r.top + r.height / 2, emoji);
  }

  // ---------- kiezen ----------
  function kies(stap, it) {
    corrigeren = false;
    if (stap === 'start') {
      modus = it.modus;
      if (modus === 'zelf') stil();
      render(false);
      return;
    }
    if (stap === 'stem') {
      stem = it.stem;
      lees([[it.id, it.spreek]]);        // enkel "Hallo!", daarna geen vraag
      render(false);
      return;
    }
    keuze[stap] = it;
    (AFHANKELIJK[stap] || []).forEach(k => { keuze[k] = null; });
    lees([stukItem(stap, it)]);
    render(true);
  }
  function bewaarTyp(veld, tekst) {
    keuze[veld] = tekst;
    toonInstalleerTip();
    try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) { }
    if (veld === 'typ') lees([stukVast('typ-act'), ['', tekst]]);
    else lees([stukVast('typ-waar'), ['', waarFrase(tekst)]]);
    render(true);
  }
  function terug() {
    stil();
    if (bevestigd) { nieuwVerhaal(); return; }
    const stap = huidigeStap();
    if (stap === 'start') return;
    if (stap === 'stem') { modus = null; render(false); return; }
    if (stap === 'cat') {
      if (modus === 'voorlezen') stem = null; else modus = null;
      render(false); return;
    }
    const v = velden();
    const idx = stap === 'klaar' ? v.length : v.indexOf(stap);
    const vorige = v[idx - 1];
    keuze[vorige] = null;
    (AFHANKELIJK[vorige] || []).forEach(k => { keuze[k] = null; });
    corrigeren = false;
    render(true);
  }
  function corrigeer(veld) {
    stil();
    if (bevestigd) return;
    if (veld === 'start') keuze = leeg();
    else {
      keuze[veld] = null;
      (AFHANKELIJK[veld] || []).forEach(k => { keuze[k] = null; });
    }
    corrigeren = false;
    render(true);
  }
  function nieuwVerhaal() { stil(); keuze = leeg(); bevestigd = false; corrigeren = false; render(true); }
  function helemaalOpnieuw() { stil(); keuze = leeg(); bevestigd = false; corrigeren = false; modus = null; stem = null; render(false); }

  // ---------- tekenen ----------
  function beeldHTML(it, klein) {
    const src = beeldSrc(it);
    if (src) return `<img src="${src}" alt="" loading="lazy" draggable="false">`;
    if (ICOON[it.id]) return svgIcoon(ICOON[it.id], 'ico');
    return klein ? '' : '<span class="plaats">beeld volgt</span>';
  }
  function tinten(stap) {
    if (stap === 'cat') return i => D.categorieen[i].kleur;
    if (stap === 'start' || stap === 'stem') return i => ['#ff8a45', '#8fb6d3'][i % 2];      // oranje en blauw van het thema
    const c = keuze.cat;
    let paar;
    if (c.id === 'anders') paar = ['#f4f2ed', '#e7e3da'];
    else if (stap === 'groep') paar = [meng(c.kleur, 0.0), meng(c.kleur, 0.2)];
    else if (stap === 'act' || stap === 'waarweet') paar = [meng(c.kleur, 0.25), meng(c.kleur, 0.42)];
    else paar = [meng(c.kleur, 0.55), meng(c.kleur, 0.70)];
    return i => paar[i % 2];
  }
  function kaartjesHTML(stap, items) {
    const tint = tinten(stap);
    const licht = keuze.cat && keuze.cat.id === 'anders' && stap !== 'cat' && stap !== 'start' && stap !== 'stem';
    const klas = { start: 'kaarten-twee', stem: 'kaarten-twee', cat: 'kaarten-cat' }[stap] || '';
    return `<div class="kaarten ${klas}" data-n="${items.length}">` +
      items.map((it, i) => {
        const kleur = tint(i);
        const ditLicht = licht || (stap === 'cat' && it.id === 'anders');
        const vorm = beeldSrc(it) || !ICOON[it.id] ? CFG.vorm : 'picto';
        return `<button class="kaart ${stap === 'cat' ? 'kaart-cat' : ''} ${ditLicht ? 'licht' : ''}"
            data-i="${i}" style="--k:${kleur}" aria-label="${esc(it.woord)}">
          <span class="kaart-beeld vorm-${vorm}">${beeldHTML(it)}</span>
          <span class="kaart-woord">${esc(it.woord)}</span>
        </button>`;
      }).join('') + '</div>';
  }
  function typHTML(veld) {
    const isWaar = veld === 'waartyp';
    const waarde = keuze[veld] || '';
    return `<form class="typ" id="typform" autocomplete="off">
      <span class="typ-icoon">${svgIcoon(ICOON.potlood)}</span>
      <input id="typveld" type="text" maxlength="80" enterkeyhint="done" value="${esc(waarde)}"
        aria-label="${isWaar ? 'waar was het' : 'wat deed je'}"
        placeholder="${isWaar ? 'bv. bij oma, aan zee, in Brugge' : 'bv. paardrijden'}">
      <p class="typ-status" id="typStatus" aria-live="polite"></p>
      <div class="typ-knoppen">
        <button type="button" class="knop-tweede" id="typLees">${svgIcoon(ICOON.luid)}<span>lees voor</span></button>
        <button type="submit" class="groot-knop">${svgIcoon(VINK)}<span>klaar</span></button>
      </div>
    </form>`;
  }
  // chips (bovenaan) en ketting (samenvatting): alles wat gekozen is
  function gekozen() {
    return velden().filter(v => keuze[v] && keuze[v] !== '?' && v !== 'waarweet').map(v => {
      const w = keuze[v];
      if (typeof w === 'string') return { veld: v, woord: v === 'waartyp' ? waarFrase(w) : w, typ: true };
      return { veld: v, woord: w.woord, it: w };
    });
  }
  function kettingHTML() {
    const kleur = keuze.cat.kleur;
    return `<div class="ketting ${corrigeren ? 'corrigeren' : ''}">` + gekozen().map((g, j) => {
      const isCat = g.veld === 'cat';
      const beeld = g.typ ? svgIcoon(ICOON.potlood, 'ico') : (isCat && !beeldSrc(g.it) ? '' : beeldHTML(g.it));
      return (j ? `<span class="schakel">${svgIcoon(ICOON.pijl)}</span>` : '') +
        `<button class="mini ${isCat ? 'mini-cat' : ''} ${keuze.cat.id === 'anders' ? 'licht' : ''}" data-veld="${g.veld}" style="--k:${kleur}">
          <span class="mini-beeld">${beeld}</span>
          <span class="mini-woord">${esc(g.woord)}</span>
        </button>`;
    }).join('') + '</div>';
  }
  function samenvattingHTML() {
    if (bevestigd) {
      return `<div class="samenvatting klaar">
        <p class="einde">${esc(Z[eindeId()])}</p>
        <ul class="verhalen">${verhalen.map(v => `<li><span class="stip" style="--k:${v.kleur}"></span>${esc(v.zin)}</li>`).join('')}</ul>
        <button class="groot-knop" id="nogVerhaal">nog iets vertellen</button>
      </div>`;
    }
    return `<div class="samenvatting">
      ${kettingHTML()}
      <div class="vraagzin">${spreken() ? `<button class="knop-rond" id="leesZin" aria-label="lees de zin voor">${svgIcoon(ICOON.luid)}</button>` : ''}<p>${esc(controleZin())}</p></div>
      <p class="hint">${corrigeren ? 'Wat klopt er niet? Tik op dat prentje.' : 'Klopt dit? Tik op <b>ja</b> of <b>nee</b>.'}</p>
    </div>`;
  }
  function spoorHTML() {
    let h = `<li><button class="chip" data-veld="start">${esc(D.titel.replace(' …', ''))}</button></li>`;
    gekozen().forEach(g => {
      const mini = g.typ ? svgIcoon(ICOON.potlood) : (g.veld === 'cat' && !beeldSrc(g.it) ? '' : beeldHTML(g.it, true));
      h += `<li><button class="chip" data-veld="${g.veld}" style="--k:${keuze.cat.kleur}"><span class="chip-stip"></span>${mini ? `<span class="chip-beeld">${mini}</span>` : ''}${esc(g.woord)}</button></li>`;
    });
    return h;
  }
  function blokHTML() {
    return D.blok.map(it => `<button class="blok-knop" data-id="${it.id}">
      <span class="blok-beeld">${beeldHTML(it)}</span><span>${esc(it.woord)}</span></button>`).join('');
  }

  let overlayTimer;
  function toonGroot(it) {
    const o = $('#overlay');
    o.innerHTML = `<div class="groot-kaart"><span class="blok-beeld">${beeldHTML(it)}</span><span>${esc(it.woord)}</span></div>`;
    o.hidden = false;
    clearTimeout(overlayTimer);
    overlayTimer = setTimeout(() => { o.hidden = true; }, 2200);
  }
  function blokKlik(id) {
    const it = D.blok.find(b => b.id === id);
    const stap = huidigeStap();
    // bij "Weet je waar het was?" tellen ja en nee als antwoord
    if (stap === 'waarweet' && (id === 'blok-ja' || id === 'blok-nee')) {
      kies('waarweet', D.waarweet.find(w => w.id === (id === 'blok-ja' ? 'waarweet-ja' : 'waarweet-nee')));
      return;
    }
    toonGroot(it);
    lees([[it.id, it.spreek]]);
    if (stap === 'klaar' && !bevestigd) {
      if (id === 'blok-ja') {
        bevestigd = true;
        verhalen.push({ zin: controleZin(), kleur: keuze.cat.kleur });
        setTimeout(() => {
          render(false);
          lees([stukVast(eindeId())], true);
          const stil = (keuze.groep && keuze.groep.einde) || (keuze.hoe && keuze.hoe.id === 'hoe-niet');
          if (!stil) feest(D['confetti-einde']);
        }, 700);
      } else if (id === 'blok-nee') {
        corrigeren = true;
        setTimeout(() => { render(false); lees([stukVast('corrigeer')], true); }, 700);
      } else if (id === 'blok-nogeens') {
        lees(stukkenControle(), true);
      }
    } else if (id === 'blok-nogeens' && Z[vraagId(stap)]) {
      lees([stukVast(vraagId(stap))], true);
    }
  }

  // Kaartjes zo groot mogelijk maken binnen het scherm, zonder scrollen (digitaal bord).
  // Probeert elk aantal kolommen en kiest de schikking met de breedste kaartjes die nog passen.
  function pasKaartjesAan() {
    const grid = document.querySelector('#inhoud .kaarten');
    if (!grid) return;
    grid.classList.remove('passend'); grid.style.cssText = '';
    const box = $('#inhoud');
    const W = box.clientWidth, H = box.clientHeight;
    const kaarten = [...grid.children], n = kaarten.length;
    if (!n || W < 50 || H < 50) return;
    const gap = Math.round(Math.max(12, Math.min(30, W * 0.014)));
    const pad = 12, binnen = 10;
    const ratio = grid.querySelector('.vorm-sclera') ? 1 : grid.querySelector('.vorm-picto') ? 3 / 4 : 9 / 16;
    const woorden = kaarten.map(k => (k.querySelector('.kaart-woord') || {}).textContent || '');
    const letter = w => Math.max(18, Math.min(48, w * 0.085));
    const lijnen = (w, fs) => Math.min(3, Math.max(1, ...woorden.map(t => Math.ceil(t.trim().length * fs * 0.56 / (w - 2 * pad - 20)))));
    let best = null;
    for (let cols = 1; cols <= n; cols++) {
      const rows = Math.ceil(n / cols);
      const wBreed = (W - gap * (cols - 1)) / cols;
      let w = wBreed;
      for (let i = 0; i < 4; i++) {                       // label-hoogte hangt af van de breedte: even bijsturen
        const fs = letter(w);
        const labelH = lijnen(w, fs) * fs * 1.18 + 16;
        const wHoog = ((H - gap * (rows - 1)) / rows - 2 * pad - binnen - labelH) / ratio + 2 * pad;
        w = Math.min(wBreed, wHoog);
      }
      if (!best || w > best.w + 0.5) best = { cols, w };
    }
    if (best.w < 140) return;                              // te klein (bv. gsm met veel kaartjes): gewoon scrollen
    const w = Math.floor(best.w);
    grid.classList.add('passend');
    grid.style.gridTemplateColumns = `repeat(${best.cols}, ${w}px)`;
    grid.style.gap = gap + 'px';
    grid.style.setProperty('--fs', letter(w).toFixed(1) + 'px');
  }
  let pasTimer;
  window.addEventListener('resize', () => { clearTimeout(pasTimer); pasTimer = setTimeout(pasKaartjesAan, 80); });

  function render(spreekVraag) {
    const stap = huidigeStap();
    document.body.dataset.stap = stap;
    document.body.style.setProperty('--cat', keuze.cat ? keuze.cat.kleur : '#d6d0c4');
    const voorStart = stap === 'start' || stap === 'stem';
    $('#spoor').innerHTML = voorStart ? '' : spoorHTML();
    $('#spoor').scrollLeft = $('#spoor').scrollWidth;
    $('#terug').style.visibility = (stap === 'start' && !bevestigd) ? 'hidden' : 'visible';
    $('#vraag').textContent = stap === 'klaar' ? (bevestigd ? '' : 'Klopt het?') : vraagTekst(stap);
    $('#overslaan').hidden = !LAGEN.includes(stap);
    $('#blok').hidden = voorStart;

    const inhoud = $('#inhoud');
    if (stap === 'klaar') {
      inhoud.innerHTML = samenvattingHTML();
      if (spreekVraag) lees(stukkenControle(), true);
    } else if (stap === 'typ' || stap === 'waartyp') {
      inhoud.innerHTML = typHTML(stap);
      if (spreekVraag) lees([stukVast(vraagId(stap))], true);
      setTimeout(() => { const f = $('#typveld'); if (f) f.focus(); }, 50);
      stemKlaarzetten();
    } else {
      inhoud.innerHTML = kaartjesHTML(stap, opties(stap));
      requestAnimationFrame(pasKaartjesAan);
      if (spreekVraag && !voorStart) lees([stukVast(vraagId(stap))], true);
    }
    inhoud.className = 'inhoud-' + stap;
  }

  // ---------- events ----------
  $('#inhoud').addEventListener('click', e => {
    const kaart = e.target.closest('[data-i]');
    if (kaart) {
      const stap = huidigeStap();
      const it = opties(stap)[+kaart.dataset.i];
      kaart.classList.add('gekozen');
      confettiOp(kaart, it.emoji);
      setTimeout(() => kies(stap, it), 220);
      return;
    }
    const mini = e.target.closest('.mini');
    if (mini) return corrigeer(mini.dataset.veld);
    if (e.target.closest('#leesZin')) return lees(stukkenControle());
    if (e.target.closest('#nogVerhaal')) return nieuwVerhaal();
    if (e.target.closest('#typLees')) {
      const t = $('#typveld').value.trim();
      if (t) lees([['', huidigeStap() === 'waartyp' ? waarFrase(t) : t]]);
    }
  });
  $('#inhoud').addEventListener('submit', e => {
    e.preventDefault();
    const veld = $('#typveld');
    const t = veld.value.trim();
    if (!t) { veld.classList.remove('schud'); void veld.offsetWidth; veld.classList.add('schud'); veld.focus(); return; }
    bewaarTyp(huidigeStap(), t);
  });
  $('#spoor').addEventListener('click', e => {
    const c = e.target.closest('.chip');
    if (c) corrigeer(c.dataset.veld);
  });
  $('#blok').innerHTML = blokHTML();
  $('#blok').addEventListener('click', e => {
    const b = e.target.closest('.blok-knop');
    if (b) blokKlik(b.dataset.id);
  });
  $('#overlay').addEventListener('click', () => { $('#overlay').hidden = true; });
  $('#terug').innerHTML = svgIcoon(ICOON.terug);
  $('#terug').addEventListener('click', terug);
  $('#opnieuw').innerHTML = svgIcoon(ICOON.opnieuw);
  $('#opnieuw').addEventListener('click', helemaalOpnieuw);
  $('#overslaan').addEventListener('click', () => { stil(); keuze[huidigeStap()] = '?'; render(true); });
  const confKnop = $('#confetti');
  confKnop.innerHTML = svgIcoon(ICOON.sparkel);
  confKnop.setAttribute('aria-pressed', confettiAan);
  confKnop.addEventListener('click', () => {
    confettiAan = !confettiAan; opslag.set('confetti', confettiAan);
    confKnop.setAttribute('aria-pressed', confettiAan);
    if (confettiAan) confettiOp(confKnop, '✨ ⭐');
  });
  if ('speechSynthesis' in window) { try { speechSynthesis.getVoices(); } catch (e) { } }

  $('#installeerKnop').addEventListener('click', installeer);
  $('#installeerSluit').addEventListener('click', () => { tipGesloten = true; $('#installeer').hidden = true; });
  // service worker: bewaart de app op het toestel (werkt ook zonder te installeren)
  if ('serviceWorker' in navigator && /^https?:/.test(location.protocol)) {
    window.addEventListener('load', () => navigator.serviceWorker.register(CFG.basis + 'sw.js').catch(e => console.warn('[sw]', e)));
  }

  // voor testen: window.__weekend
  window.__weekend = { controleZin, stukkenControle, get keuze() { return keuze; } };
  render(false);
})();
