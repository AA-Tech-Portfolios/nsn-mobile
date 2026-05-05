#!/usr/bin/env python3
"""Resize and compress the NSN app icon into Expo asset targets.

Usage:
  python scripts/optimize_nsn_icons.py path/to/source-icon.png
  python scripts/optimize_nsn_icons.py path/to/source-icon.png --root path/to/project
"""

from argparse import ArgumentParser
from pathlib import Path

from PIL import Image

ICON_SIZE = (768, 768)
TARGET_PATHS = [
    "assets/images/icon.png",
    "assets/images/splash-icon.png",
    "assets/images/favicon.png",
    "assets/images/android-icon-foreground.png",
]


def parse_args():
    parser = ArgumentParser(description="Optimize the NSN source icon for Expo assets.")
    parser.add_argument("source", type=Path, help="Source PNG/JPG icon to resize.")
    parser.add_argument("--root", type=Path, default=Path.cwd(), help="Project root. Defaults to the current directory.")
    return parser.parse_args()


def optimize_icon(source: Path, project_root: Path) -> None:
    if not source.exists():
        raise FileNotFoundError(f"Source icon not found: {source}")

    with Image.open(source) as image:
        resized = image.convert("RGB").resize(ICON_SIZE, Image.Resampling.LANCZOS)
        optimized = resized.quantize(colors=192, method=Image.Quantize.MEDIANCUT)

        for relative_target in TARGET_PATHS:
            target = project_root / relative_target
            target.parent.mkdir(parents=True, exist_ok=True)
            optimized.save(target, format="PNG", optimize=True)
            print(f"{target}: {target.stat().st_size / 1024:.1f}KB")


def main() -> None:
    args = parse_args()
    optimize_icon(args.source, args.root)


if __name__ == "__main__":
    main()
