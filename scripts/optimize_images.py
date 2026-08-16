#!/usr/bin/env python3
"""
Optimize bundled image assets.

Two problems this fixes:

1. Several ".svg" files are not vector art at all -- they are a thin <svg>
   wrapper around a base64-encoded photo. One of them carries a 4096x2731
   photo inside a box that renders at 300x400. Those are rewritten in place:
   same filename, same extension, same markup, but the embedded raster is
   resized to what the box actually needs and re-encoded.

2. Photos are stored as huge RGBA PNGs (one hero is 5680x2988). PNG is the
   wrong codec for photographic content. Those are re-encoded to WebP at a
   sane resolution; the caller is responsible for updating the imports.

Run with --apply to write changes. Without it, the script only reports.

    python scripts/optimize_images.py            # dry run
    python scripts/optimize_images.py --apply
"""

import argparse
import base64
import io
import os
import re
import sys

from PIL import Image

# Allow the oversized source files through Pillow's decompression-bomb guard.
# Everything here is a first-party asset we already control.
Image.MAX_IMAGE_PIXELS = None

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DASHBOARDS = os.path.abspath(os.path.join(REPO, "..", "ken_dashboards-main"))

# Longest side we are ever willing to ship. Retina on a 1440px-wide layout.
MAX_RASTER_EDGE = 1920
WEBP_QUALITY = 82
JPEG_QUALITY = 80

# Raster assets to convert to WebP, relative to each project's src/assets/images.
# Only files big enough for the codec change to matter are listed; tiny icons
# stay as PNG because WebP would not beat them and the churn is not worth it.
TO_WEBP = [
    "home/hero.png",
    "about/aboutHero1.png",
    "about/aboutHero2.png",
    "about/story/story1.png",
    "about/story/story2.png",
    "about/story/story3.png",
    "layout/footer_img.png",
    "mock/offer_bg.png",
    "mock/offer.png",
    "auth/auth_image.png",
    "huts/hero/huts_hero_1.png",
    "huts/hero/huts_hero_2.png",
    "huts/hero/huts_hero_3.png",
    "home/offer/ticket.png",
]

B64_RE = re.compile(
    rb'(href="data:image/)(png|jpe?g|webp)(;base64,)([A-Za-z0-9+/=\s]+)(")'
)
SVG_DIM_RE = re.compile(r'<svg[^>]*?\bwidth="([\d.]+)"[^>]*?\bheight="([\d.]+)"')


def human(n):
    return f"{n / 1048576:.2f} MB" if n >= 1048576 else f"{n / 1024:.0f} KB"


def has_real_alpha(im):
    """True only if the alpha channel actually varies -- many of these PNGs
    are RGBA with a fully opaque alpha channel, which is pure waste."""
    if im.mode not in ("RGBA", "LA", "P"):
        return False
    im = im.convert("RGBA")
    alpha = im.getchannel("A")
    return alpha.getextrema()[0] < 255


def fit(w, h, max_w, max_h):
    """Scale (w,h) down to fit inside (max_w,max_h), preserving aspect."""
    scale = min(max_w / w, max_h / h, 1.0)
    return max(1, round(w * scale)), max(1, round(h * scale))


def optimize_svg_embeds(path, apply):
    """Rewrite the base64 rasters embedded in an SVG, keeping the file's
    name, extension and surrounding markup byte-for-byte identical."""
    raw = open(path, "rb").read()
    if not B64_RE.search(raw):
        return None

    text = raw.decode("utf8", "ignore")
    m = SVG_DIM_RE.search(text)
    if m:
        # Target 2x the rendered box so it still looks sharp on retina.
        box_w, box_h = float(m.group(1)) * 2, float(m.group(2)) * 2
    else:
        box_w = box_h = MAX_RASTER_EDGE

    before = len(raw)
    notes = []

    def replace(match):
        payload = re.sub(rb"\s", b"", match.group(4))
        try:
            src = Image.open(io.BytesIO(base64.b64decode(payload)))
        except Exception as exc:  # keep the original bytes on any failure
            notes.append(f"skipped an embed ({exc})")
            return match.group(0)

        new_w, new_h = fit(src.width, src.height, box_w, box_h)
        alpha = has_real_alpha(src)
        out = io.BytesIO()

        if new_w != src.width or new_h != src.height:
            src = src.resize((new_w, new_h), Image.LANCZOS)

        if alpha:
            src.convert("RGBA").save(out, "PNG", optimize=True)
            mime = b"png"
        else:
            src.convert("RGB").save(
                out, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True
            )
            mime = b"jpeg"

        notes.append(f"{src.width}x{new_h} {'png' if alpha else 'jpeg'}")
        encoded = base64.b64encode(out.getvalue())
        return match.group(1) + mime + match.group(3) + encoded + match.group(5)

    new_raw = B64_RE.sub(replace, raw)
    if apply and len(new_raw) < before:
        with open(path, "wb") as fh:
            fh.write(new_raw)
    return before, len(new_raw), notes


def optimize_raster(path, apply):
    """Re-encode a photographic PNG as WebP next to the original."""
    with Image.open(path) as src:
        src.load()
        alpha = has_real_alpha(src)
        new_w, new_h = fit(src.width, src.height, MAX_RASTER_EDGE, MAX_RASTER_EDGE)
        resized = (
            src.resize((new_w, new_h), Image.LANCZOS)
            if (new_w, new_h) != (src.width, src.height)
            else src.copy()
        )
        orig_dims = (src.width, src.height)

    resized = resized.convert("RGBA" if alpha else "RGB")
    dest = os.path.splitext(path)[0] + ".webp"
    buf = io.BytesIO()
    resized.save(buf, "WEBP", quality=WEBP_QUALITY, method=6)

    before = os.path.getsize(path)
    after = buf.tell()
    if apply:
        with open(dest, "wb") as fh:
            fh.write(buf.getvalue())
    return before, after, orig_dims, (new_w, new_h), alpha, dest


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true", help="write changes to disk")
    args = ap.parse_args()

    total_before = total_after = 0
    mode = "APPLY" if args.apply else "DRY RUN"
    print(f"=== optimize_images.py [{mode}] ===\n")

    print("-- SVG files wrapping base64 rasters (rewritten in place) --")
    for project in (REPO, DASHBOARDS):
        images_dir = os.path.join(project, "src", "assets", "images")
        if not os.path.isdir(images_dir):
            continue
        for dirpath, _, names in os.walk(images_dir):
            for name in sorted(names):
                if not name.lower().endswith(".svg"):
                    continue
                path = os.path.join(dirpath, name)
                if os.path.getsize(path) < 50 * 1024:
                    continue
                result = optimize_svg_embeds(path, args.apply)
                if not result:
                    continue
                before, after, notes = result
                if after >= before:
                    continue
                total_before += before
                total_after += after
                rel = os.path.relpath(path, os.path.dirname(project))
                pct = (1 - after / before) * 100
                print(f"  {human(before):>9} -> {human(after):>9}  -{pct:4.1f}%  {rel}")
                for n in notes:
                    print(f"{'':>32}{n}")

    print("\n-- Photographic PNGs re-encoded as WebP --")
    for rel in TO_WEBP:
        path = os.path.join(REPO, "src", "assets", "images", *rel.split("/"))
        if not os.path.exists(path):
            print(f"  {'(missing)':>9}  {rel}")
            continue
        before, after, od, nd, alpha, dest = optimize_raster(path, args.apply)
        total_before += before
        total_after += after
        pct = (1 - after / before) * 100
        tag = " alpha" if alpha else ""
        print(f"  {human(before):>9} -> {human(after):>9}  -{pct:4.1f}%  {rel}")
        print(f"{'':>32}{od[0]}x{od[1]} -> {nd[0]}x{nd[1]}{tag}")

    print(
        f"\nTOTAL {human(total_before)} -> {human(total_after)}  "
        f"({(1 - total_after / total_before) * 100:.1f}% smaller)"
    )
    if not args.apply:
        print("\nDry run only. Re-run with --apply to write these changes.")


if __name__ == "__main__":
    sys.exit(main())
