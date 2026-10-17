# Mijn weekend

Een webapp waarmee leerlingen met een matige tot zware mentale beperking zonder te spreken kunnen vertellen wat ze in het weekend deden.

## Zo werkt het

1. **Startscherm**: *zelf vertellen* (niets wordt voorgelezen) of *voorlezen*. Bij voorlezen kies je een **vrouwen- of mannenstem**.
2. **Kleur**: actief (oranje) · gezellig bezig (geel) · chill (lichtblauw) · nog iets anders (wit).
3. **Groep**, bv. actief → sporten / spelen / uitstap.
4. **Activiteit**, bv. sporten → basket, zwemmen, judo … Elke lijst eindigt met **iets anders**: dan verschijnt een typvak.
5. **Met wie? → Waar? → Wanneer? → Hoe vond je het?**
   Bij *waar → ergens anders* vraagt de app *Weet je waar het was?* Bij *ja* kan je typen waar.
   Zit de plaats al in de activiteit (bv. *naar de zoo*), dan wordt *waar?* overgeslagen.
6. **Controlezin**: *"Jij bent zondag met papa in de sportclub gaan zwemmen, en dat vond je super leuk?"* De leerling tikt ja of nee.
   Bij nee tikt de leerling op het prentje dat niet klopt.
7. Bij *ja*: *"Fijn! Dankjewel om dit te vertellen."* (met confetti).

Onderaan staan altijd **ja · nee · weet ik niet · nog eens**. Rechtsboven: helemaal opnieuw beginnen en confetti aan/uit.

Er is geen database, geen login en er wordt niets bewaard of doorgestuurd.

## Bestanden

| bestand | wat |
|---|---|
| `index.html`, `stijl.css`, `app.js` | de app |
| `inhoud.js` | **alle inhoud**: kleuren, groepen, activiteiten, lagen, zinnen, beeldbeschrijvingen, confetti. Uitleg bovenaan het bestand. |
| `beelden/` | lichte webversies van de prenten + `lijst.js` |
| `audio/vrouw/`, `audio/man/` | voorleesbestanden + `audio/lijst.js` |
| `assets/` | Styrka-logo en "Jouw koers, onze stroom" |
| `IMG/` | de originele prenten (niet mee naar GitHub) |

## Prenten maken

```bash
python3 genereer_afbeeldingen.py --droog      # wat ontbreekt er + geschatte kost (kost niets)
python3 genereer_afbeeldingen.py --test       # proefrit met 3 prenten
python3 genereer_afbeeldingen.py              # alles wat ontbreekt
python3 genereer_afbeeldingen.py hockey --opnieuw
```

Alle prenten hebben dezelfde opbouw als de bestaande in `IMG/`: titel + kleine icoontjes + rustige scène (16:9).
De sleutel komt uit `GEMINI_API_KEY`, uit `gemini_key.txt` in deze map, of uit `gemini_key.txt` in de map van de doelkaartjes.

## Voorlezen

Alles wordt in volzinnen voorgelezen met een Vlaamse Piper-stem (nathalie = vrouw, rdh = man).
Wat een leerling zelf typt, kan niet vooraf opgenomen worden: dat leest de stem van het toestel voor (bij voorkeur nl-BE).

```bash
python3 maak_audio.py                 # alles wat nog ontbreekt, beide stemmen
python3 maak_audio.py --opnieuw       # alles opnieuw, bv. na het aanpassen van zinnen
python3 maak_audio.py --lijst         # alle zinnen tonen
python3 maak_audio.py zwemmen c-zwemmen   # enkel deze
```

## Zelf getypte tekst voorlezen (Piper in de browser)

Wat een leerling typt bij *iets anders* of *ergens anders* wordt ter plaatse voorgelezen met dezelfde Vlaamse stem.
Dat gebeurt in de browser zelf (map `spraak/`): de uitspraakmodule (espeak-ng als WebAssembly), de stemmodellen
`vrouw.onnx` (nathalie) en `man.onnx` (rdh), en onnxruntime-web, dat de browser de eerste keer van cdnjs haalt.
Lukt dat niet, dan leest de stem van het toestel voor.

## Op het toestel bewaren (service worker)

`sw.js` bewaart de app op het toestel: de eerste keer wordt alles opgehaald (± 12 MB, de stemmodellen pas wanneer er
getypt wordt, ± 63 MB per stem), daarna laadt alles van het toestel en werkt de app ook zonder internet.
Installeren is niet nodig. Na het typen verschijnt bovenaan wel een tip om de site als app te installeren.
Wijzig je iets aan de app, dan komt dat door bij de volgende start met internet.
Werkt enkel via http(s) (GitHub Pages, Netlify of `dev_server.py`), niet bij dubbelklikken op `index.html`.

## Sclera-versie (map `sclera/`)

Dezelfde app, maar met de pictogrammen van [Sclera](https://www.sclera.be) in plaats van de prenten:
open `sclera/` (lokaal http://localhost:8000/sclera/, online …/sclera/).
Inhoud, zinnen, stemmen en code komen uit de hoofdmap; enkel de picto's verschillen.

```bash
python3 maak_sclera.py              # sclera/picto/ opnieuw opbouwen uit Sclera_picto_nl/
python3 maak_sclera.py --controle   # + contactblad sclera/_overzicht.jpg om de keuzes na te kijken
```

Een ander picto voor een kaartje? Pas de naam aan in `KEUZE` bovenaan `maak_sclera.py`.
Sclera heeft geen picto voor zaterdag en zondag: die worden gemaakt van een scheurkalender met *ZA* en *ZO*.
De picto's vallen onder de licentie CC BY-NC 2.0 BE (naamsvermelding, niet-commercieel); de vermelding staat op het startscherm.

## Testen en uploaden

```bash
python3 dev_server.py         # lokaal testen op http://localhost:8000 (zonder cache)
python3 maak_uploadmap.py     # map netlify/ opnieuw opbouwen; sleep die naar https://app.netlify.com/drop
```
