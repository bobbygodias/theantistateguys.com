from __future__ import annotations

import base64
import hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CHUNKS = ROOT / ".asset-chunks"

ASSETS = {
    "home": ("assets/home-scene.webp", "b191f9f7ce84d56deedfb5c41518e0b72f4679b3dbe8abb73522198af9828cc3"),
    "wordmark": ("assets/wordmark-custom.webp", "cb9790a8f2adc97f63fb2a1336af63c7141cdc795dfe649466b669913d800c1b"),
    "photos": ("assets/photos-pose-6.webp", "5df43beb2945f530802ae52404d38f7bf7c30f8bced06cc39fcf6b69c41170a6"),
    "studio": ("assets/studio.webp", "44894175700399ad6d16912637c2b4cc4017c4a2287a0bc08ae59a8da50e1d75"),
    "thomaz": ("assets/members/thomaz.webp", "b04f59665cf90b8db5e41d85f4629fab26b6da298ab1da3f18aeb5a5771e790a"),
}

for name, (destination, expected_sha256) in ASSETS.items():
    parts = sorted((CHUNKS / name).glob("part*"))
    if not parts:
        raise SystemExit(f"Missing chunks for {name}")

    encoded = "".join(part.read_text(encoding="ascii") for part in parts)
    payload = base64.b64decode(encoded, validate=True)

    if payload[:4] != b"RIFF" or payload[8:12] != b"WEBP":
        raise SystemExit(f"Decoded asset {name} is not a valid WebP container")

    digest = hashlib.sha256(payload).hexdigest()
    if digest != expected_sha256:
        raise SystemExit(f"SHA-256 mismatch for {name}: {digest}")

    target = ROOT / destination
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(payload)
    print(f"assembled {destination} ({len(payload)} bytes)")
