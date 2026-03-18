#!/usr/bin/env bash
set -euo pipefail

HOST="${SSH_HOST:-harmonylaundry.my.id}"
PORT="${SSH_PORT:-36786}"
USER="${SSH_USER:-patriot}"
PASS="${SSH_PASS:-}"
REMOTE_DIR="${REMOTE_DIR:-/home/patriot/kasir/kasir.harmonylaundry.my.id}"
PUBLIC_URL="${PUBLIC_URL_CHECK:-https://kasir.harmonylaundry.my.id}"

if ! command -v rsync >/dev/null 2>&1; then
  echo "rsync tidak ditemukan. Install dulu: sudo apt install rsync"
  exit 1
fi

if [[ -n "$PASS" ]]; then
  SSH_CMD="sshpass -p '$PASS' ssh -o StrictHostKeyChecking=no -p $PORT"
  RSYNC_RSH="sshpass -p '$PASS' ssh -o StrictHostKeyChecking=no -p $PORT"
else
  SSH_CMD="ssh -o StrictHostKeyChecking=no -p $PORT"
  RSYNC_RSH="ssh -o StrictHostKeyChecking=no -p $PORT"
fi

echo "[deploy] Building web bundle (PUBLIC_URL=/)"
npm run build:server

if [[ ! -f build/asset-manifest.json ]]; then
  echo "build/asset-manifest.json tidak ditemukan. Build gagal."
  exit 1
fi

read -r MAIN_JS MAIN_CSS < <(
  node -e '
    const m = require("./build/asset-manifest.json");
    const files = m.files || {};
    const js = files["main.js"] || "";
    const css = files["main.css"] || "";
    console.log(js, css);
  '
)

if [[ -z "$MAIN_JS" || -z "$MAIN_CSS" ]]; then
  echo "Gagal baca main.js/main.css dari asset-manifest.json"
  exit 1
fi

echo "[deploy] Sync build/ ke $USER@$HOST:$REMOTE_DIR (delete file lama)"
eval "rsync -az --delete --omit-dir-times --no-perms --no-owner --no-group -e \"$RSYNC_RSH\" build/ \"$USER@$HOST:$REMOTE_DIR/\""

echo "[deploy] Reload container web (docker compose)"
eval "$SSH_CMD $USER@$HOST \"cd '$REMOTE_DIR' && docker compose up -d web\""

echo "[deploy] Smoke tests"
eval "$SSH_CMD $USER@$HOST \"curl -k -s -o /dev/null -w '%{http_code}\\n' '$PUBLIC_URL$MAIN_JS'\" | grep -q '^200$'"
eval "$SSH_CMD $USER@$HOST \"curl -k -s -o /dev/null -w '%{http_code}\\n' '$PUBLIC_URL$MAIN_CSS'\" | grep -q '^200$'"
eval "$SSH_CMD $USER@$HOST \"curl -k -s -o /dev/null -w '%{http_code}\\n' '$PUBLIC_URL/dashboard'\" | grep -q '^200$'"

echo "[deploy] OK"
echo "  JS  : $PUBLIC_URL$MAIN_JS"
echo "  CSS : $PUBLIC_URL$MAIN_CSS"

