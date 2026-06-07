#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

DIST_DIR="${1:-dist}"
ISSUES_FILE="$(mktemp)"
trap 'rm -f "$ISSUES_FILE"' EXIT

if [ ! -d "$DIST_DIR/assets" ]; then
  echo "Production build verification failed: $DIST_DIR/assets does not exist."
  exit 1
fi

if grep -R -n -E 'jsxDEV|fileName:|react/jsx-dev-runtime' "$DIST_DIR/assets" >"$ISSUES_FILE"; then
  echo "Production build verification failed: React development JSX metadata was found in built assets."
  head -n 20 "$ISSUES_FILE"
  exit 1
fi

if grep -R -n -F "$ROOT_DIR" "$DIST_DIR/assets" >"$ISSUES_FILE"; then
  echo "Production build verification failed: absolute local source paths were found in built assets."
  head -n 20 "$ISSUES_FILE"
  exit 1
fi

if [ -f "$DIST_DIR/index.html" ] &&
  grep -n -E '<link[^>]+rel="modulepreload"[^>]+vendor-three' "$DIST_DIR/index.html" >"$ISSUES_FILE"; then
  echo "Production build verification failed: Three.js is preloaded in the initial HTML."
  cat "$ISSUES_FILE"
  exit 1
fi

if find "$DIST_DIR" -type f -name '*.map' -print -quit | grep -q .; then
  echo "Production build verification failed: public source map files were generated in $DIST_DIR."
  exit 1
fi

echo "Production build verification passed."
