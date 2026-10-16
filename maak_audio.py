#!/usr/bin/env python3
"""Voorleesbestanden voor "Mijn weekend" maken met Piper: een Vlaamse vrouwen- en mannenstem.

Gebruik (in de map STYRKA_WEEKENDPRAATJE):
    python3 maak_audio.py                 # alles wat nog ontbreekt, voor beide stemmen
    python3 maak_audio.py --stem vrouw    # enkel de vrouwenstem (nathalie)  /  --stem man (rdh)
    python3 maak_audio.py --opnieuw       # alles opnieuw (bv. na het aanpassen van zinnen in inhoud.js)
    python3 maak_audio.py zwemmen c-zwemmen   # enkel deze opnieuw
    python3 maak_audio.py --lijst         # toon alle zinnen (maakt niets)
    python3 maak_audio.py --tempo 1.2     # trager praten (1.0 = normaal, hoger = trager)

Resultaat: audio/vrouw/<id>.mp3, audio/man/<id>.mp3 en audio/lijst.js.
Nodig: piper (https://github.com/rhasspy/piper) en ffmpeg.
De stemmodellen worden gezocht in ../TONEEL GPS STEMMETJES/ (of geef --map PAD op).
Wat een leerling zelf typt, kan niet vooraf opgenomen worden: dat leest de stem van het toestel voor.
"""
import argparse, json, shutil, subprocess, sys, tempfile
from pathlib import Path

BASIS = Path(__file__).resolve().parent
AUDIO = BASIS / "audio"
STEMMEN_MAP = BASIS.parent / "TONEEL GPS STEMMETJES"
MODELLEN = {"vrouw": "nl_BE-nathalie-medium.onnx", "man": "nl_BE-rdh-medium.onnx"}
# Het stemmodel kent enkel Nederlands: woorden die anders verkeerd klinken, schrijven we hier fonetisch.
# (Alleen voor de uitspraak; op het scherm blijft de gewone spelling staan.)
UITSPRAAK = {"tv": "teevee", "hockey": "hokkie"}


def lees_inhoud():
    t = (BASIS / "inhoud.js").read_text(encoding="utf-8")
    return json.loads(t[t.index("{"): t.rindex("}") + 1])


def zinnen(d, stem):
    """(bestandsnaam zonder .mp3, zin) voor alles wat voorgelezen wordt.

    cat-<kleur>   tik op een kleur            ("Mijn weekend was actief.")
    <id>          tik op een kaartje of knop  ("Ik ben gaan zwemmen.", "Ik was met papa.", "Ja, dat klopt.")
    c-<id>        stukje van de controlezin   ("gaan zwemmen", "met papa", "en dat vond je leuk?")
    vraag-..., einde, ...                     vaste zinnen uit "zinnen" in inhoud.js
    """
    uit = []
    def item(o, sleutel=None):
        if o.get("spreek"):
            uit.append((sleutel or o["id"], o["spreek"]))
    for s in d["stemmen"]:
        if s["stem"] == stem:
            item(s)
    for c in d["categorieen"]:
        item(c, "cat-" + c["id"])
        for g in c["groepen"]:
            item(g)
            if g.get("zin"):
                uit.append(("c-" + g["id"], g["zin"]))
            for a in g.get("activiteiten", []):
                item(a)
                controle = a.get("zin") or a.get("rest")
                if controle:
                    uit.append(("c-" + a["id"], controle))
    item(d["ietsAnders"])
    for laag in d["lagen"]:
        for o in laag["opties"]:
            item(o)
            if o.get("zin"):
                uit.append(("c-" + o["id"], o["zin"]))
    for o in d["waarweet"] + d["blok"]:
        item(o)
    uit += list(d["zinnen"].items())
    gezien, uniek = set(), []
    for i, z in uit:
        if i not in gezien:
            gezien.add(i); uniek.append((i, z))
    return uniek


def schrijf_lijst():
    lijst = {s: sorted(p.stem for p in (AUDIO / s).glob("*.mp3")) for s in MODELLEN if (AUDIO / s).exists()}
    (AUDIO / "lijst.js").write_text(
        "// Automatisch gemaakt door maak_audio.py: welke voorleesbestanden er per stem in audio/ staan.\n"
        "window.AUDIO = " + json.dumps(lijst) + ";\n", encoding="utf-8")
    return {s: len(v) for s, v in lijst.items()}


def uitspraak(zin):
    import re
    for woord, klank in UITSPRAAK.items():
        zin = re.sub(r"\b" + re.escape(woord) + r"\b", klank, zin, flags=re.IGNORECASE)
    return zin


def spreek(piper, model, zin, tempo, doel, td):
    zin = uitspraak(zin)
    wav = Path(td) / "zin.wav"
    if wav.exists():
        wav.unlink()
    # zelfde aanroep als piper_batch.py in de toneelmap
    r = subprocess.run([piper, zin, "--model", str(model), "--output-file", str(wav), "--length_scale", str(tempo)],
                       stdin=subprocess.DEVNULL, capture_output=True, text=True)
    if r.returncode != 0 or not wav.exists() or wav.stat().st_size < 2000:
        # oudere piper-versies lezen de tekst van stdin
        r = subprocess.run([piper, "--model", str(model), "--output_file", str(wav), "--length_scale", str(tempo)],
                           input=zin, capture_output=True, text=True)
    if r.returncode != 0 or not wav.exists() or wav.stat().st_size < 2000:
        sys.exit(f"piper faalde voor {doel.name}:\n{r.stderr[-800:]}")
    # stilte vooraan en achteraan wegknippen, normaliseren, klein mp3'tje
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav),
                    "-af", "silenceremove=start_periods=1:start_threshold=-50dB,"
                           "areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,"
                           "loudnorm=I=-16:TP=-1.5",
                    "-ar", "22050", "-ac", "1", "-b:a", "64k", str(doel)], check=True)


def main():
    ap = argparse.ArgumentParser(description="Voorleesbestanden maken met Piper (Vlaamse stemmen)")
    ap.add_argument("--stem", choices=["vrouw", "man", "beide"], default="beide")
    ap.add_argument("--map", type=Path, default=STEMMEN_MAP, help="map met de Piper-stemmodellen")
    ap.add_argument("--piper", default="piper", help="pad naar het piper-programma")
    ap.add_argument("--tempo", type=float, default=1.1, help="length_scale: 1.0 normaal, hoger = trager")
    ap.add_argument("--opnieuw", action="store_true", help="bestaande bestanden vervangen")
    ap.add_argument("--lijst", action="store_true", help="toon enkel alle zinnen")
    ap.add_argument("ids", nargs="*", help="enkel deze bestanden (zonder .mp3) opnieuw maken")
    args = ap.parse_args()

    d = lees_inhoud()
    stemmen = ["vrouw", "man"] if args.stem == "beide" else [args.stem]
    if args.lijst:
        for i, z in zinnen(d, stemmen[0]):
            print(f"{i:28} {z}")
        return
    if not shutil.which(args.piper) and not Path(args.piper).exists():
        sys.exit("piper niet gevonden. Installeer het of geef het pad op met --piper.")
    if not shutil.which("ffmpeg"):
        sys.exit("ffmpeg niet gevonden.")

    for stem in stemmen:
        model = args.map / MODELLEN[stem]
        if not model.exists():
            sys.exit(f"Stemmodel niet gevonden: {model}")
        doelmap = AUDIO / stem
        doelmap.mkdir(parents=True, exist_ok=True)
        alles = zinnen(d, stem)
        if args.ids:
            gekend = {i for st in MODELLEN for i, _ in zinnen(d, st)}
            onbekend = set(args.ids) - gekend
            if onbekend:
                sys.exit("Onbekend: " + ", ".join(sorted(onbekend)))
            todo = [(i, z) for i, z in alles if i in args.ids]
        else:
            todo = [(i, z) for i, z in alles if args.opnieuw or not (doelmap / f"{i}.mp3").exists()]
        print(f"{stem}: {len(todo)} zin(nen) voorlezen met {model.name}.")
        with tempfile.TemporaryDirectory() as td:
            for n, (i, zin) in enumerate(todo, 1):
                spreek(args.piper, model, zin, args.tempo, doelmap / f"{i}.mp3", td)
                print(f"  [{n}/{len(todo)}] {stem}/{i}.mp3  \"{zin}\"")
    aantallen = schrijf_lijst()
    print("Klaar: " + ", ".join(f"{s} {n} bestanden" for s, n in aantallen.items()) + " in audio/lijst.js.")


if __name__ == "__main__":
    main()
