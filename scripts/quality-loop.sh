#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

REPORT_DIR="reports/quality"
REPORT_FILE="$REPORT_DIR/latest.md"
mkdir -p "$REPORT_DIR"

TS="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
FAILURES=0
WARNINGS=0

run_check() {
  local name="$1"
  local cmd="$2"
  local blocking="${3:-true}"
  local output_file
  output_file="$(mktemp)"

  echo "## $name" >> "$REPORT_FILE"
  echo '```bash' >> "$REPORT_FILE"
  echo "$cmd" >> "$REPORT_FILE"
  echo '```' >> "$REPORT_FILE"

  set +e
  bash -lc "$cmd" >"$output_file" 2>&1
  local code=$?
  set -e

  if [ $code -eq 0 ]; then
    echo "- Status: PASS" >> "$REPORT_FILE"
  elif [ "$blocking" = "false" ]; then
    echo "- Status: WARN (exit $code)" >> "$REPORT_FILE"
    WARNINGS=$((WARNINGS + 1))
  else
    echo "- Status: FAIL (exit $code)" >> "$REPORT_FILE"
    FAILURES=$((FAILURES + 1))
  fi

  echo '```text' >> "$REPORT_FILE"
  cat "$output_file" >> "$REPORT_FILE"
  echo '```' >> "$REPORT_FILE"
  echo >> "$REPORT_FILE"

  rm -f "$output_file"
}

cat > "$REPORT_FILE" <<HEADER
# Quality Loop Report

- Timestamp (UTC): $TS
- Commit: $(git rev-parse --short HEAD 2>/dev/null || echo "N/A")
- Branch: $(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "N/A")

HEADER

if [ -f package-lock.json ]; then
  INSTALL_CMD="npm ci"
else
  INSTALL_CMD="npm install"
fi

run_check "Install" "$INSTALL_CMD" true
run_check "Lint" "npm run lint" true
run_check "Build" "npm run build" true
run_check "Security Audit (high+)" "npm audit --audit-level=high" true
run_check "Dependency Drift (non-blocking)" "npm outdated" false

if npm run | grep -qE '(^|[[:space:]])test([[:space:]]|$)'; then
  run_check "Tests" "npm test -- --runInBand" true
fi

{
  echo "## Summary"
  if [ "$FAILURES" -eq 0 ]; then
    echo "- Result: PASS"
  else
    echo "- Result: FAIL"
  fi
  echo "- Failed checks: $FAILURES"
  echo "- Warning checks: $WARNINGS"
} >> "$REPORT_FILE"

cat "$REPORT_FILE"

if [ "$FAILURES" -gt 0 ]; then
  exit 1
fi
