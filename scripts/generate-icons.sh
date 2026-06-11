#!/usr/bin/env bash
# Regenerates platform icons from build/icon.png.
#   macOS  -> build/icon.icns   (always, via sips + iconutil)
#   Windows -> build/icon.ico   (if ImageMagick `magick` or `convert` is installed)
# Run with: npm run icons

set -euo pipefail

SRC="build/icon.png"
OUT_ICNS="build/icon.icns"
OUT_ICO="build/icon.ico"

if [ ! -f "${SRC}" ]; then
  echo "Source ${SRC} not found. Place a 1024x1024 PNG there first." >&2
  exit 1
fi

if ! command -v sips >/dev/null || ! command -v iconutil >/dev/null; then
  echo "sips and iconutil are required (macOS only)." >&2
  exit 1
fi

ICONSET=$(mktemp -d -t skyveer-iconset.XXXXXX)/icon.iconset
mkdir -p "${ICONSET}"

echo "-> Generating icon.iconset..."
sips -z 16   16   "${SRC}" --out "${ICONSET}/icon_16x16.png"      >/dev/null
sips -z 32   32   "${SRC}" --out "${ICONSET}/icon_16x16@2x.png"   >/dev/null
sips -z 32   32   "${SRC}" --out "${ICONSET}/icon_32x32.png"      >/dev/null
sips -z 64   64   "${SRC}" --out "${ICONSET}/icon_32x32@2x.png"   >/dev/null
sips -z 128  128  "${SRC}" --out "${ICONSET}/icon_128x128.png"    >/dev/null
sips -z 256  256  "${SRC}" --out "${ICONSET}/icon_128x128@2x.png" >/dev/null
sips -z 256  256  "${SRC}" --out "${ICONSET}/icon_256x256.png"    >/dev/null
sips -z 512  512  "${SRC}" --out "${ICONSET}/icon_256x256@2x.png" >/dev/null
sips -z 512  512  "${SRC}" --out "${ICONSET}/icon_512x512.png"    >/dev/null
sips -z 1024 1024 "${SRC}" --out "${ICONSET}/icon_512x512@2x.png" >/dev/null

iconutil -c icns "${ICONSET}" -o "${OUT_ICNS}"
rm -rf "$(dirname "${ICONSET}")"
echo "Wrote ${OUT_ICNS}"

# Windows .ico -- optional, only if ImageMagick is available
if command -v magick >/dev/null; then
  IM_BIN="magick"
elif command -v convert >/dev/null; then
  IM_BIN="convert"
else
  IM_BIN=""
fi

if [ -n "${IM_BIN}" ]; then
  echo "-> Generating ${OUT_ICO} with ${IM_BIN}..."
  "${IM_BIN}" "${SRC}" -define icon:auto-resize=16,24,32,48,64,128,256 "${OUT_ICO}"
  echo "Wrote ${OUT_ICO}"
else
  echo "Skipping ${OUT_ICO} -- install ImageMagick (brew install imagemagick) to generate it."
fi
