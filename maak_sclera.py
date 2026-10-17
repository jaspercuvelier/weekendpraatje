#!/usr/bin/env python3
"""Sclera-versie van "Mijn weekend": kiest per kaartje een Sclera-picto en zet die klaar in sclera/picto/.

Gebruik (in de map STYRKA_WEEKENDPRAATJE):
    python3 maak_sclera.py            # sclera/picto/<id>.png + sclera/picto/lijst.js opnieuw maken
    python3 maak_sclera.py --controle # contactblad sclera/_overzicht.jpg met alle keuzes (niet mee naar GitHub)

Een ander picto kiezen? Pas de bestandsnaam (zonder .png) aan in KEUZE hieronder en draai het script opnieuw.
Kaartjes zonder picto krijgen het lijn-icoon van de app (bv. "nog eens").
De picto's komen uit Sclera_picto_nl/ (www.sclera.be, licentie CC BY-NC 2.0 BE).
"""
import argparse, json, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

BASIS = Path(__file__).resolve().parent
BRON = BASIS / "Sclera_picto_nl"
DOEL = BASIS / "sclera" / "picto"

# kaartje (beeld-id uit inhoud.js) -> Sclera-bestand (zonder .png)
KEUZE = {
    # start en stemmen
    "start-zelf": "vertellen", "start-voorlezen": "voorlezen", "stem-vrouw": "vrouw", "stem-man": "man",
    # kleuren
    "cat-actief": "sport en spel", "cat-gezellig": "groep gezellig", "cat-chill": "relax", "cat-anders": "vraagteken",
    # groepen
    "sporten": "sport", "g-spelen-actief": "spelen buiten", "uitstap": "uitstap",
    "g-creatief": "creatief met materiaal", "g-spelen-samen": "spelletje bezig meedoen", "feestje": "fuif",
    "g-apero-eten": "aperitief", "g-bezoek": "op bezoek",
    "g-schermtijd": "tv kijken", "rusten": "hangmat", "g-verzorging": "bad douche",
    "g-weet-niet-meer": "nadenken", "vergeten": "nadenken 2", "anders": "anders", "g-wil-niet-vertellen": "zwijgen",
    # actief
    "basketbal": "basketball", "muurklimmen": "bergbeklimmen", "zwemmen": "zwemmen 4", "fietsen": "fietsen bos",
    "voetballen": "voetbal 3", "dansen": "dansen", "hockey": "hockey 2", "judo": "Oosterse sporten", "vissen": "vissen 2",
    "trampoline": "trampoline springen midden", "speeltuin": "speeltuin", "jeugdbeweging": "jeugdbeweging",
    "in-de-tuin": "tuin", "pretpark": "pretpark", "naar-de-speeltuin": "speeltuin", "winkelen": "winkelen 2",
    "markt": "markt", "dierentuin": "zoo", "bos": "wandeling park bos", "stad": "stad", "bibliotheek": "bibliotheek",
    "cinema": "cinema", "optreden": "theater", "rijden": "uitstap auto 2",
    # gezellig
    "knutselen": "knutselen", "tekenen": "tekenen", "schilderen": "schilderen", "puzzelen": "puzzelen 2",
    "gezelschapsspel": "gezelschapsspel", "samen-spelen": "spelen binnen", "verjaardag": "Verjaardag",
    "bakken-koken": "koken ik", "aperitieven": "zoute snacks", "gaan-eten": "uit eten gaan", "thuis-eten": "maaltijd thuis",
    "bezoek-krijgen": "bezoek van", "familie-bezoeken": "huis school grootouders",
    "vrienden-bezoeken": "spelen ik bij vriendje 2",
    # chill
    "tv-film": "tv kijken 2", "tablet": "tablet computer", "gamen": "playstation", "muziek": "muziek luisteren",
    "boek": "lezen 2", "zetel": "zitten zetel", "uitslapen": "slapen 2", "douchen-bad": "douche",
    "kapper": "kapper 2", "helpen-thuis": "afwassen",
    # nog iets anders
    "niet-goed": "verdrietig", "geen-zin": "nee zeggen", "hoeft-niet": "zwijgen",
    # met wie
    "wie-alleen": "spelen binnen alleen", "wie-mama": "moeder 2", "wie-papa": "vader 2", "wie-broer-zus": "liefde zus broer",
    "wie-familie": "familie", "wie-vriend": "vrienden 2", "wie-groep": "groep 3",
    # waar
    "waar-thuis": "thuis 2", "waar-buiten": "buiten 2", "waar-familie": "huis school grootouders",
    "waar-winkel": "supermarkt", "waar-restaurant": "restaurant", "waar-frituur": "frietjes", "waar-sportclub": "sporthal",
    "waar-cafe": "café", "waar-anders": "waar",
    # wanneer (zaterdag en zondag: geen Sclera-picto, zie DAGEN)
    "wann-vrijdagavond": "avond", "wann-weekend": "weekend", "wann-weet": "vraagteken",
    # hoe vond je het
    "hoe-super": "goed 2", "hoe-leuk": "duim omhoog", "hoe-gewoon": "emotie neutraal", "hoe-niet": "duim omlaag",
    # ja / nee / weet ik niet
    "waarweet-ja": "ja knikken", "waarweet-nee": "nee schudden",
    "blok-ja": "ja knikken", "blok-nee": "nee schudden", "blok-weet": "vraagteken",
}
# Sclera heeft geen picto per weekdag: scheurkalender met de dag erop.
DAGEN = {"wann-zaterdag": ("scheurkalender dag", "ZA"), "wann-zondag": ("scheurkalender dag", "ZO")}


def pad(naam):
    for ext in (".png", ".PNG"):
        p = BRON / (naam + ext)
        if p.exists():
            return p
    sys.exit(f"Niet gevonden in Sclera_picto_nl: {naam}.png")


def open_wit(p):
    """Sclera-png (soms met transparantie) op zwart, 300x300."""
    im = Image.open(p).convert("RGBA")
    bg = Image.new("RGBA", im.size, (0, 0, 0, 255))
    bg.alpha_composite(im)
    return bg.convert("RGB").resize((300, 300), Image.LANCZOS)


def lettertype(grootte):
    for f in ("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "/Library/Fonts/Arial Bold.ttf",
              "C:/Windows/Fonts/arialbd.ttf", "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf"):
        try:
            return ImageFont.truetype(f, grootte)
        except OSError:
            pass
    return ImageFont.load_default()


def dag(naam, tekst):
    im = open_wit(pad(naam))
    d = ImageDraw.Draw(im)
    # zon op het kalenderblad wit maken en de dag erop zetten
    d.ellipse((92, 98, 212, 214), fill="white")
    f = lettertype(78)
    b = d.textbbox((0, 0), tekst, font=f)
    d.text((152 - (b[2] - b[0]) / 2 - b[0], 158 - (b[3] - b[1]) / 2 - b[1]), tekst, font=f, fill="black")
    return im


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--controle", action="store_true", help="contactblad maken met alle keuzes")
    args = ap.parse_args()
    if not BRON.exists():
        sys.exit("Map Sclera_picto_nl/ niet gevonden.")
    DOEL.mkdir(parents=True, exist_ok=True)
    beelden = {}
    for i, naam in KEUZE.items():
        beelden[i] = open_wit(pad(naam))
    for i, (naam, tekst) in DAGEN.items():
        beelden[i] = dag(naam, tekst)
    for i, im in beelden.items():
        im.save(DOEL / f"{i}.png", optimize=True)
    (DOEL / "lijst.js").write_text(
        "// Automatisch gemaakt door maak_sclera.py: welke Sclera-picto's er in sclera/picto/ staan.\n"
        "window.BEELDEN = " + json.dumps(sorted(beelden)) + ";\n", encoding="utf-8")
    print(f"{len(beelden)} picto's in {DOEL.relative_to(BASIS)}/")
    if args.controle:
        S, kol = 150, 8
        rijen = -(-len(beelden) // kol)
        blad = Image.new("RGB", (kol * (S + 8), rijen * (S + 24)), "white")
        d = ImageDraw.Draw(blad)
        f = lettertype(12)
        for n, (i, im) in enumerate(beelden.items()):
            x, y = (n % kol) * (S + 8), (n // kol) * (S + 24)
            blad.paste(im.resize((S, S)), (x, y))
            d.text((x, y + S + 4), i, fill="black", font=f)
        blad.save(BASIS / "sclera" / "_overzicht.jpg", quality=80)
        print("Contactblad: sclera/_overzicht.jpg")


if __name__ == "__main__":
    main()
