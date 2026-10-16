#!/usr/bin/env python3
"""Lokale dev-server voor "Mijn weekend".

Gebruik (in de map STYRKA_WEEKENDPRAATJE):
    python3 dev_server.py            # http://localhost:8000 en opent de browser
    python3 dev_server.py 8080       # andere poort
    python3 dev_server.py --lan      # ook bereikbaar vanaf een tablet op hetzelfde netwerk

Stuurt alles zonder cache, dus gewoon herladen toont altijd de nieuwste versie
(ook nieuwe prenten en geluidjes). Stoppen met Ctrl+C.
"""
import http.server, socket, socketserver, sys, threading, webbrowser
from functools import partial
from pathlib import Path

MAP = Path(__file__).resolve().parent


class GeenCache(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map,
                      ".js": "text/javascript", ".mp3": "audio/mpeg", ".svg": "image/svg+xml",
                      ".wasm": "application/wasm", ".webmanifest": "application/manifest+json",
                      ".onnx": "application/octet-stream", ".data": "application/octet-stream"}

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, fmt, *args):
        # enkel fouten tonen, geen lijn per bestand
        if len(args) > 1 and str(args[1]).startswith(("4", "5")):
            sys.stderr.write(f"  {args[1]}  {args[0]}\n")


def lan_ip():
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.connect(("10.255.255.255", 1))
            return s.getsockname()[0]
    except OSError:
        return None


def main():
    lan = "--lan" in sys.argv
    poorten = [a for a in sys.argv[1:] if a.isdigit()]
    poort = int(poorten[0]) if poorten else 8000
    host = "0.0.0.0" if lan else "127.0.0.1"

    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.ThreadingTCPServer((host, poort), partial(GeenCache, directory=str(MAP))) as srv:
        url = f"http://localhost:{poort}/"
        print(f"Mijn weekend draait op {url}")
        if lan and lan_ip():
            print(f"Op de tablet (zelfde wifi): http://{lan_ip()}:{poort}/")
        print("Stoppen met Ctrl+C.")
        threading.Timer(0.6, lambda: webbrowser.open(url)).start()
        try:
            srv.serve_forever()
        except KeyboardInterrupt:
            print("\nGestopt.")


if __name__ == "__main__":
    main()
