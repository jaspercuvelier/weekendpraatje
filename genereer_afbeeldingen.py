#!/usr/bin/env python3
"""Afbeeldingen voor "Mijn weekend" maken met de Gemini API (Nano Banana), in de stijl van de prenten in IMG/.

Gebruik (in de map STYRKA_WEEKENDPRAATJE):
    python3 genereer_afbeeldingen.py --droog        # toon wat er nog ontbreekt + geschatte kost (kost niets)
    python3 genereer_afbeeldingen.py --test         # proefrit: 1 scène + 2 pictogrammen
    python3 genereer_afbeeldingen.py                # alles wat nog ontbreekt
    python3 genereer_afbeeldingen.py tv-film kapper # enkel deze (id's uit inhoud.js)
    python3 genereer_afbeeldingen.py --soort picto  # enkel pictogrammen (kleuren, lagen, vast blok)
    python3 genereer_afbeeldingen.py kapper --opnieuw   # opnieuw maken (oude gaat naar IMG/oude versies)
    python3 genereer_afbeeldingen.py --web          # enkel de webversies in beelden/ opnieuw maken

Wat het doet:
  * leest alle onderdelen uit inhoud.js (één plek voor tekst én beeldbeschrijving)
  * alle prenten (kleuren, activiteiten, met wie/waar/wanneer/hoe) krijgen dezelfde opbouw als IMG/:
    16:9, titel in hoofdletters + klein icoontje + rustige scène
  * stuurt telkens twee prenten uit IMG/ mee als stijlvoorbeeld (STIJL_BEELDEN)
  * bewaart het origineel als IMG/<id>.png en maakt meteen een lichte webversie beelden/<id>.jpg
  * werkt beelden/lijst.js bij, zodat de app weet welke prenten er al zijn
  * slaat over wat al bestaat, dus je kan het script gerust opnieuw starten
  * houdt een logboek bij in generatie_log.csv

API-sleutel: GEMINI_API_KEY, of een bestand gemini_key.txt in deze map,
of (als die er niet is) gemini_key.txt uit de map STYRKA_DOELKAARTJES OV1-2 ernaast.
Pillow (pip install pillow) is nodig voor de webversies; het genereren zelf vraagt enkel standaard-Python.
"""
import argparse, base64, csv, datetime, json, os, shutil, sys, time
import urllib.request, urllib.error
from pathlib import Path

BASIS = Path(__file__).resolve().parent
IMG = BASIS / "IMG"
WEB = BASIS / "beelden"
MODEL = "gemini-nano-banana-2.1"
ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/interactions"
SLEUTEL_PADEN = [BASIS / "gemini_key.txt", BASIS.parent / "STYRKA_DOELKAARTJES OV1-2" / "gemini_key.txt"]
TEST = ["cat-actief", "hockey", "stem-vrouw"]

# Gemini API, standaardtarief Nano Banana 2.1 (okt. 2026), in dollar per gegenereerde prent.
# Nakijken op https://ai.google.dev/gemini-api/docs/pricing als het lang geleden is.
PRIJS_PER_PRENT = {"1K": 0.0336, "2K": 0.0504, "4K": 0.113}
PRIJS_PER_REFERENTIE = 0.0017   # elk meegestuurd stijlvoorbeeld (~1.120 tokens aan $1,50 per miljoen)

# Stijlvoorbeelden uit IMG/ (eenvoudige, rustige prenten werken het best)
STIJL_BEELDEN = ["zwemmen .jpg", "trampoline.jpg"]

SOORTEN = {
    "scene": {"formaat": "16:9", "grootte": "2K", "web": (960, 540)},
    "picto": {"formaat": "1:1", "grootte": "1K", "web": (480, 480)},
}

SCENE_PROMPT = (
    "The attached images are style references. Draw a NEW picture in exactly the same style: "
    "minimalist black line-art on a pure white background, 16:9 landscape, thin uniform fine-liner lines, "
    "crisp pure black lines, no color, no grey fills, no shading, no gradients. "
    "At the top centre the title \"{titel}\" in the same bold uppercase hand-lettered marker font as the references, "
    "followed by one or two small simple line icons that match the title, exactly like in the references. "
    "Below the title one wide, calm scene of the place and the objects that belong to this activity, seen from a little distance. "
    "{mensen}"
    "Keep it simple, uncluttered and calm: very clear for children with an intellectual disability. "
    "Everything stays inside the picture with a clear white margin, nothing is cut off. "
    "No other text than the title. Do NOT copy the scenes of the reference images.\n\n"
    "The scene: {scene}"
)
ZONDER_MENSEN = "Like the references, the scene shows NO people. "
MET_MENSEN = ("People (or hands) are drawn in exactly the same clean, thin fine-liner style as the objects and buildings "
              "in the references: normal proportions, NOT stick figures, NOT cartoon or clip-art, no thick outlines, "
              "with calm friendly smiling faces. Only the people described below, nobody else. ")

PICTO_PROMPT = (
    "The attached images are style references. Look only at the SMALL ICONS next to the title at the top of each reference image. "
    "Draw ONE new icon in exactly that icon style, but large: a single simple pictogram, centred, "
    "filling about 70 percent of a square 1:1 picture, on a pure white background. "
    "Thin uniform black fine-liner lines, crisp pure black, no color, no grey, no shading, no filled areas, no frame, no border, no circle around it. "
    "Very simple, few details, immediately recognisable for children with an intellectual disability. "
    "{tekst}\n\n"
    "The icon: {picto}"
)
GEEN_TEKST = "No text, no letters and no numbers anywhere."
MET_TEKST = "Below the icon the Dutch word \"{woord}\" in the same bold uppercase hand-lettered marker font as the reference titles. No other text."


# ---------------------------------------------------------------- inhoud
def lees_inhoud():
    t = (BASIS / "inhoud.js").read_text(encoding="utf-8")
    return json.loads(t[t.index("{"): t.rindex("}") + 1])


def onderdelen(d):
    """Alle onderdelen met een eigen prent. Alles in dezelfde opbouw als IMG/: titel + icoontjes + scène (16:9).
    Onderdelen zonder "scene" in inhoud.js hergebruiken een bestaande prent ("beeld") en worden overgeslagen.
    De vaste knoppen (ja/nee/...) en "Weet je waar?" gebruiken eenvoudige lijn-iconen."""
    uit, gezien = [], set()
    def neem(o, beeld_id):
        if o.get("scene") and beeld_id not in gezien:
            gezien.add(beeld_id)
            uit.append(dict(o, id=beeld_id, soort="scene"))
    for o in d["start"] + d["stemmen"]:
        neem(o, o["id"])
    for c in d["categorieen"]:
        neem(c, "cat-" + c["id"])
        for g in c["groepen"]:
            neem(g, g.get("beeld") or g["id"])
            for a in g.get("activiteiten", []):
                neem(a, a.get("beeld") or a["id"])
    for laag in d["lagen"]:
        for o in laag["opties"]:
            neem(o, o.get("beeld") or o["id"])
    return uit


def prompt_voor(o):
    if o["soort"] == "scene":
        return SCENE_PROMPT.format(titel=o.get("titel") or o["woord"].upper(), scene=o["scene"],
                                   mensen=MET_MENSEN if o.get("mensen") else ZONDER_MENSEN)
    tekst = MET_TEKST.format(woord=o["tekst"]) if o.get("tekst") else GEEN_TEKST
    return PICTO_PROMPT.format(tekst=tekst, picto=o["picto"])


def origineel(o):
    """Het bronbeeld in IMG/ voor dit onderdeel (bestaande prent of eerder gegenereerd)."""
    if o.get("bron") and (IMG / o["bron"]).exists():
        return IMG / o["bron"]
    for ext in (".png", ".jpg", ".jpeg", ".webp"):
        p = IMG / (o["id"] + ext)
        if p.exists():
            return p
    return None


# ---------------------------------------------------------------- webversies
def maak_web(o, bron):
    try:
        from PIL import Image
    except ImportError:
        print("    (Pillow ontbreekt: pip install pillow  -> webversie niet gemaakt)")
        return False
    WEB.mkdir(exist_ok=True)
    w, h = SOORTEN[o["soort"]]["web"]
    im = Image.open(bron).convert("RGB")
    im.thumbnail((w, h), Image.LANCZOS)
    if o["soort"] == "picto" and im.size != (w, h):       # vierkant maken met witte rand
        doek = Image.new("RGB", (w, h), "white")
        doek.paste(im, ((w - im.width) // 2, (h - im.height) // 2))
        im = doek
    im.save(WEB / f"{o['id']}.jpg", quality=82, optimize=True, progressive=True)
    return True


def schrijf_lijst():
    WEB.mkdir(exist_ok=True)
    ids = sorted(p.stem for p in WEB.glob("*.jpg"))
    (WEB / "lijst.js").write_text(
        "// Automatisch gemaakt door genereer_afbeeldingen.py: welke prenten er in beelden/ staan.\n"
        "window.BEELDEN = " + json.dumps(ids, ensure_ascii=False, indent=0) + ";\n", encoding="utf-8")
    return len(ids)


# ---------------------------------------------------------------- API
def lees_sleutel():
    k = os.environ.get("GEMINI_API_KEY", "").strip()
    for p in SLEUTEL_PADEN:
        if not k and p.exists():
            k = p.read_text().strip()
    if not k:
        sys.exit("Geen API-sleutel gevonden. Zet GEMINI_API_KEY of maak een bestand gemini_key.txt in deze map.")
    return k


def beeldblok(p):
    suf = p.suffix.lower()
    mime = "image/png" if suf == ".png" else "image/webp" if suf == ".webp" else "image/jpeg"
    return {"type": "image", "mime_type": mime, "data": base64.b64encode(p.read_bytes()).decode()}


def zoek_beeld(obj):
    """Zoek het (laatste) beeld in het antwoord, ongeacht de exacte structuur."""
    gevonden = []
    def loop(o):
        if isinstance(o, dict):
            data = o.get("data")
            mime = o.get("mime_type") or o.get("mimeType") or ""
            if isinstance(data, str) and len(data) > 1000 and (o.get("type") == "image" or mime.startswith("image/")):
                gevonden.append((data, mime or "image/png"))
            inl = o.get("inlineData") or o.get("inline_data")
            if isinstance(inl, dict) and inl.get("data"):
                gevonden.append((inl["data"], inl.get("mimeType") or inl.get("mime_type") or "image/png"))
            for v in o.values():
                loop(v)
        elif isinstance(o, list):
            for v in o:
                loop(v)
    if isinstance(obj, dict) and isinstance(obj.get("output_image"), dict):
        oi = obj["output_image"]
        return oi.get("data"), oi.get("mime_type", "image/png")
    loop(obj)
    return gevonden[-1] if gevonden else (None, None)


def genereer(sleutel, prompt, refs, soort, pogingen=4):
    s = SOORTEN[soort]
    body = {
        "model": MODEL,
        "input": [{"type": "text", "text": prompt}] + refs,
        "response_format": {"type": "image", "aspect_ratio": s["formaat"], "image_size": s["grootte"]},
    }
    data = json.dumps(body).encode()
    fout = ""
    for poging in range(1, pogingen + 1):
        req = urllib.request.Request(ENDPOINT, data=data, method="POST", headers={
            "Content-Type": "application/json", "x-goog-api-key": sleutel})
        try:
            with urllib.request.urlopen(req, timeout=300) as resp:
                antwoord = json.loads(resp.read())
            b64, mime = zoek_beeld(antwoord)
            if b64:
                return base64.b64decode(b64), mime
            fout = "geen afbeelding in het antwoord: " + json.dumps(antwoord)[:300]
        except urllib.error.HTTPError as e:
            fout = f"HTTP {e.code}: {e.read().decode(errors='replace')[:300]}"
            if e.code in (400, 401, 403, 404):
                raise RuntimeError(fout)
        except Exception as e:
            fout = str(e)
        wacht = 10 * poging
        print(f"    poging {poging} mislukt ({fout}); opnieuw over {wacht}s")
        time.sleep(wacht)
    raise RuntimeError(fout)


# ---------------------------------------------------------------- hoofdprogramma
def main():
    ap = argparse.ArgumentParser(description="Afbeeldingen voor 'Mijn weekend' maken met Gemini")
    ap.add_argument("ids", nargs="*", help="id's uit inhoud.js, bv. tv-film wie-mama cat-rood")
    ap.add_argument("--test", action="store_true", help=f"proefrit met {TEST}")
    ap.add_argument("--soort", choices=["scene", "picto"], help="enkel scènes of enkel pictogrammen")
    ap.add_argument("--opnieuw", action="store_true", help="bestaande prent vervangen")
    ap.add_argument("--droog", action="store_true", help="toon enkel wat er zou gebeuren")
    ap.add_argument("--web", action="store_true", help="enkel webversies (beelden/) opnieuw maken")
    args = ap.parse_args()

    alles = onderdelen(lees_inhoud())
    ids = {o["id"] for o in alles}
    gevraagd = TEST if args.test else args.ids
    for i in gevraagd:
        if i not in ids:
            sys.exit(f"Onbekende id: {i}. Kijk in inhoud.js welke id's er zijn.")
    keuze = [o for o in alles if (not gevraagd or o["id"] in gevraagd) and (not args.soort or o["soort"] == args.soort)]

    if args.web:
        n = 0
        for o in keuze:
            b = origineel(o)
            if b and maak_web(o, b):
                n += 1
        print(f"{n} webversie(s) gemaakt; {schrijf_lijst()} prenten in beelden/lijst.js.")
        return

    todo = [o for o in keuze if args.opnieuw or not origineel(o)]
    print(f"{len(todo)} prent(en) te maken met {MODEL}.")
    if todo:
        kost = 0.0
        for soort in SOORTEN:
            n = sum(1 for o in todo if o["soort"] == soort)
            if n:
                stuk = PRIJS_PER_PRENT[SOORTEN[soort]["grootte"]] + PRIJS_PER_REFERENTIE * len(STIJL_BEELDEN)
                kost += n * stuk
                print(f"  {n:>3} x {soort:5} ({SOORTEN[soort]['grootte']}, {SOORTEN[soort]['formaat']})  ~ ${n * stuk:.2f}")
        print(f"  geschatte kost: ~ ${kost:.2f} (+ wat je opnieuw laat maken)")
    if args.droog or not todo:
        for o in todo:
            print(f"  {o['soort']:5}  {o['id']:22} {o['woord']}")
        # webversies van bestaande prenten bijwerken kost niets
        if not args.droog:
            for o in keuze:
                b = origineel(o)
                if b and not (WEB / f"{o['id']}.jpg").exists():
                    maak_web(o, b)
            schrijf_lijst()
        return

    sleutel = lees_sleutel()
    refs = [beeldblok(IMG / n) for n in STIJL_BEELDEN if (IMG / n).exists()]
    if not refs:
        print("  (geen stijlvoorbeelden gevonden in IMG/, het resultaat kan afwijken)")
    log = BASIS / "generatie_log.csv"
    nieuw_log = not log.exists()
    with open(log, "a", newline="", encoding="utf-8") as lf:
        w = csv.writer(lf, delimiter=";")
        if nieuw_log:
            w.writerow(["tijd", "id", "status", "bestand_of_fout"])
        for i, o in enumerate(todo, 1):
            print(f"[{i}/{len(todo)}] {o['id']} ({o['soort']}): {o['woord']}")
            try:
                beeld, mime = genereer(sleutel, prompt_voor(o), refs, o["soort"])
            except RuntimeError as e:
                print(f"    MISLUKT: {e}")
                w.writerow([datetime.datetime.now().isoformat(timespec="seconds"), o["id"], "mislukt", str(e)[:300]])
                lf.flush()
                if "HTTP 40" in str(e) and "429" not in str(e):
                    sys.exit("Gestopt: de API weigert de vraag (sleutel, model of facturatie nakijken).")
                continue
            ext = ".jpg" if "jpeg" in mime else ".webp" if "webp" in mime else ".png"
            oud = origineel(o)
            if oud and oud.stem == o["id"]:            # enkel eigen gegenereerde prenten archiveren
                archief = IMG / "oude versies"
                archief.mkdir(exist_ok=True)
                shutil.move(str(oud), str(archief / f"{oud.stem} ({datetime.date.today()}){oud.suffix}"))
            IMG.mkdir(exist_ok=True)
            doel = IMG / (o["id"] + ext)
            doel.write_bytes(beeld)
            if o.get("bron"):
                print(f"    let op: '{o['id']}' heeft in inhoud.js nog 'bron': {o['bron']} -> haal dat weg om de nieuwe prent te gebruiken")
            else:
                maak_web(o, doel)
            print(f"    OK -> {doel.relative_to(BASIS)}")
            w.writerow([datetime.datetime.now().isoformat(timespec="seconds"), o["id"], "ok", str(doel.relative_to(BASIS))])
            lf.flush()
    print(f"Klaar. {schrijf_lijst()} prenten in beelden/lijst.js. "
          "Lelijke prent? Opnieuw met: python3 genereer_afbeeldingen.py ID --opnieuw")


if __name__ == "__main__":
    main()
