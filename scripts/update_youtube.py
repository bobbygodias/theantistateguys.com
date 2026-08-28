#!/usr/bin/env python3
"""Resolve the band's YouTube handle and cache the three newest uploads.

No API key is required. If YouTube changes its public page markup or temporarily
blocks the request, the script exits cleanly and keeps the last known JSON.
"""
from __future__ import annotations

import json
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

HANDLE_URL = "https://www.youtube.com/@TheAntiStateGuys"
OUT = Path(__file__).resolve().parents[1] / "data" / "videos.json"
UA = "Mozilla/5.0 (compatible; AntiStateGuysSite/1.0; +https://theantistateguys.com)"


def get(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en-US,en;q=0.8"})
    with urllib.request.urlopen(req, timeout=25) as response:
        return response.read()


def resolve_channel_id(html: str) -> str | None:
    patterns = [
        r'"channelId"\s*:\s*"(UC[^"]+)"',
        r'<meta\s+itemprop="channelId"\s+content="(UC[^"]+)"',
        r'youtube\.com/channel/(UC[\w-]+)',
    ]
    for pattern in patterns:
        m = re.search(pattern, html)
        if m:
            return m.group(1)
    return None


def main() -> int:
    try:
        html = get(HANDLE_URL).decode("utf-8", "ignore")
        channel_id = resolve_channel_id(html)
        if not channel_id:
            raise RuntimeError("Could not resolve YouTube channel ID from handle")

        feed = get(f"https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}")
        root = ET.fromstring(feed)
        ns = {
            "atom": "http://www.w3.org/2005/Atom",
            "yt": "http://www.youtube.com/xml/schemas/2015",
        }
        videos = []
        for entry in root.findall("atom:entry", ns)[:3]:
            vid = entry.findtext("yt:videoId", default="", namespaces=ns)
            title = entry.findtext("atom:title", default="", namespaces=ns)
            published = entry.findtext("atom:published", default="", namespaces=ns)
            if vid:
                videos.append({"id": vid, "title": title, "published": published})

        if not videos:
            raise RuntimeError("YouTube feed returned no videos")

        OUT.parent.mkdir(parents=True, exist_ok=True)
        OUT.write_text(json.dumps(videos, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"Updated {OUT} with {len(videos)} video(s) from {channel_id}")
        return 0
    except Exception as exc:
        print(f"YouTube update skipped: {exc}", file=sys.stderr)
        return 0


if __name__ == "__main__":
    raise SystemExit(main())
