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

## Nieuwe indeling (aan/uit)

Via het **tandwiel** rechtsboven schakel je de **nieuwe indeling** aan of uit (feedback van de collega's).
De keuze wordt onthouden op het toestel (localStorage); uit = de huidige versie hierboven.

1. Startscherm en stemkeuze blijven hetzelfde.
2. **Waar was je in het weekend?** thuis (oranje) · in de leefgroep (lichtblauw) · niet thuis (geel) · ik wil niks vertellen (wit).
3. Thuis en leefgroep: **binnen / buiten**, daarna groepen en subgroepen (bv. binnen → chill → schermtijd → tablet).
   Niet thuis: sporten · spelen · uitstap · gezellig bezig · chill. Niks vertellen: weet het niet meer · vergeten · echt nog iets anders · wil het niet vertellen.
4. Met wie (+ opvoeders, vrienden van de leefgroep) → Waar (thuis binnen, thuis buiten, … de leefgroep, de jeugdbeweging) → Wanneer (+ in de vakantie) → Hoe.

De inhoud staat in `inhoud-nieuw.js` (uitleg bovenaan dat bestand). Die vervangt de kleuren en lagen van `inhoud.js`;
de rest (start, stemmen, zinnen, ja/nee-balk) wordt gedeeld. `maak_audio.py` en `maak_sclera.py` lezen beide bestanden.
In `beta/` (prenten) hebben enkele nieuwe kaartjes nog geen prent ("beeld volgt").

## Bestanden

| bestand | wat |
|---|---|
| `index.html`, `stijl.css`, `app.js` | de app |
| `inhoud-nieuw.js` | de nieuwe indeling (aan/uit via het tandwiel) |
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

## Twee versies

- **Standaard (hoofdpagina): Sclera-picto's.** Lokaal http://localhost:8000/, online https://weekendpraatje.cuveldier.com/
- **Beta (`beta/`): de prenten** uit `beelden/`. Lokaal http://localhost:8000/beta/, online …/beta/

Inhoud, zinnen, stemmen en code zijn gedeeld; enkel de beelden verschillen (instelling `window.WEEKEND` in elke `index.html`).
Het oude adres `/sclera/` stuurt door naar de hoofdpagina.

### Sclera-picto's kiezen

```bash
python3 maak_sclera.py              # sclera/picto/ opnieuw opbouwen uit Sclera_picto_nl/
python3 maak_sclera.py --controle   # + contactblad sclera/_overzicht.jpg om de keuzes na te kijken
```

Een ander picto voor een kaartje? Pas de naam aan in `KEUZE` bovenaan `maak_sclera.py`.
Sclera heeft geen picto voor zaterdag en zondag: die worden gemaakt van een scheurkalender met *ZA* en *ZO*.
De picto's vallen onder de licentie CC BY-NC 2.0 BE (naamsvermelding, niet-commercieel); de vermelding staat op het startscherm.

## Testen en uploaden

```bash
python3 dev_server.py         # lokaal testen: http://localhost:8000 (Sclera) en /beta/ (prenten), zonder cache
python3 maak_uploadmap.py     # map netlify/ opnieuw opbouwen; sleep die naar https://app.netlify.com/drop
```
