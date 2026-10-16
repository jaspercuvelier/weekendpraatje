#!/usr/bin/env python3
"""Bouwt de map netlify/ opnieuw op met enkel wat de site nodig heeft.

Gebruik:  python3 maak_uploadmap.py
Sleep daarna de map netlify/ naar https://app.netlify.com/drop (of upload ze bij je bestaande site).
"""
import shutil
from pathlib import Path

BASIS = Path(__file__).resolve().parent
DOEL = BASIS / "netlify"
BESTANDEN = ["index.html", "app.js", "stijl.css", "inhoud.js", "sw.js", "manifest.webmanifest"]
MAPPEN = ["beelden", "audio", "assets", "spraak"]

if DOEL.exists():
    shutil.rmtree(DOEL)
DOEL.mkdir()
for b in BESTANDEN:
    shutil.copy2(BASIS / b, DOEL / b)
for m in MAPPEN:
    if (BASIS / m).exists():
        # oude losse mp3's bovenaan in audio/ (van voor de stemkeuze) niet meenemen
        if m == "audio":
            (DOEL / m).mkdir()
            for f in (BASIS / m).iterdir():
                if f.is_dir():
                    shutil.copytree(f, DOEL / m / f.name)
                elif not f.name.endswith(".mp3"):
                    shutil.copy2(f, DOEL / m / f.name)
        else:
            shutil.copytree(BASIS / m, DOEL / m)
n = sum(1 for p in DOEL.rglob("*") if p.is_file())
mb = sum(p.stat().st_size for p in DOEL.rglob("*") if p.is_file()) / 1e6
print(f"netlify/ klaar: {n} bestanden, {mb:.1f} MB")
