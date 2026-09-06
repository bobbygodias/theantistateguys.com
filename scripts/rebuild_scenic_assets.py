from __future__ import annotations

import base64
import hashlib
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]

SPECS = {
    "home": ("home-*.b64", ROOT / "assets/home-scene.webp"),
    "pose": ("pose-*.b64", ROOT / "assets/photos-pose-6.webp"),
    "studio": ("studio-*.b64", ROOT / "assets/studio.webp"),
    "thomaz": ("thomaz-*.b64", ROOT / "assets/members/thomaz.webp"),
}

staging = ROOT / ".asset-fix"
if not staging.is_dir():
    raise SystemExit("Missing .asset-fix staging directory")

for label, (pattern, output) in SPECS.items():
    chunks = sorted(staging.glob(pattern))
    if not chunks:
        raise SystemExit(f"No chunks found for {label}: {pattern}")

    encoded = "".join(chunk.read_text(encoding="ascii").strip() for chunk in chunks)
    try:
        data = base64.b64decode(encoded, validate=True)
    except Exception as exc:
        raise SystemExit(f"Invalid Base64 for {label}: {exc}") from exc

    if len(data) < 12 or data[:4] != b"RIFF" or data[8:12] != b"WEBP":
        raise SystemExit(f"{label} is not a RIFF/WEBP payload")

    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_bytes(data)

    try:
        with Image.open(output) as image:
            image.load()
            if image.format != "WEBP":
                raise SystemExit(f"{label} decoded as {image.format}, expected WEBP")
            width, height = image.size
            if width < 300 or height < 200:
                raise SystemExit(f"{label} dimensions look wrong: {width}x{height}")
    except Exception as exc:
        raise SystemExit(f"Pillow could not decode {label}: {exc}") from exc

    digest = hashlib.sha256(data).hexdigest()
    print(f"{label}: {len(data)} bytes | {width}x{height} | sha256={digest}")

print("All scenic assets rebuilt and decoded successfully.")
