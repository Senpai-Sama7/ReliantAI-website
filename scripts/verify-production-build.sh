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

if [ ! -f "$DIST_DIR/index.html" ]; then
  echo "Production build verification failed: $DIST_DIR/index.html is missing."
  exit 1
fi

if ! grep -q "localStorage.getItem('theme')" "$DIST_DIR/index.html"; then
  echo "Production build verification failed: theme boot script is missing from dist/index.html."
  exit 1
fi

if ! grep -q '#f7f7f7' "$DIST_DIR/index.html"; then
  echo "Production build verification failed: light-mode critical CSS is missing from dist/index.html."
  exit 1
fi

if ! grep -q 'html.dark body' "$DIST_DIR/index.html"; then
  echo "Production build verification failed: dark-mode critical CSS is missing from dist/index.html."
  exit 1
fi

# Absolute asset base — relative base ('./') breaks trailing-slash SPA deep links.
if grep -qE 'src="\./assets/|href="\./assets/' "$DIST_DIR/index.html"; then
  echo "Production build verification failed: dist/index.html still uses relative ./assets paths (set vite base to '/')."
  exit 1
fi

# --- SEO / GEO / AEO guards ---

if ! grep -q 'rel="canonical" href="https://www.reliantai.org/"' "$DIST_DIR/index.html"; then
  echo "Production build verification failed: www canonical is missing from dist/index.html."
  exit 1
fi

if grep -qE 'https://reliantai\.org' "$DIST_DIR/index.html"; then
  echo "Production build verification failed: bare-apex URL found in dist/index.html (must use https://www.reliantai.org)."
  grep -nE 'https://reliantai\.org' "$DIST_DIR/index.html" | head -n 5
  exit 1
fi

for asset in og-image.png logo.png favicon.svg manifest.webmanifest llms.txt llms-full.txt sitemap.xml robots.txt \
  project-metalforge.webp project-oilfield.webp project-homeservices.webp project-medical.webp; do
  if [ ! -f "$DIST_DIR/$asset" ]; then
    echo "Production build verification failed: $DIST_DIR/$asset is missing."
    exit 1
  fi
done

if ! grep -q 'og:image" content="https://www.reliantai.org/og-image.png"' "$DIST_DIR/index.html"; then
  echo "Production build verification failed: og:image does not reference the generated og-image.png."
  exit 1
fi

# Validate every JSON-LD block parses as valid JSON.
if ! node "$ROOT_DIR/scripts/validate-jsonld.mjs" "$DIST_DIR/index.html"; then
  echo "Production build verification failed: invalid JSON-LD structured data."
  exit 1
fi

echo "Production build verification passed."
