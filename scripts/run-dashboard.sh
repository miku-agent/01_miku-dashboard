#!/usr/bin/env bash
set -euo pipefail

PORT=${PORT:-23000}

echo "[miku-dashboard] cleaning orphan listeners on :${PORT} ..."
if command -v lsof >/dev/null 2>&1; then
  lsof -ti:${PORT} | xargs -r kill -9 || true
fi

echo "[miku-dashboard] starting Next.js on :${PORT} ..."
exec pnpm start --port ${PORT}
