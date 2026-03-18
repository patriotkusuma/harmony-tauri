#!/usr/bin/env bash
set -euo pipefail

HOST="${SSH_HOST:-harmonylaundry.my.id}"
PORT="${SSH_PORT:-36786}"
USER="${SSH_USER:-patriot}"
PASS="${SSH_PASS:-}"
REMOTE_DIR="${REMOTE_DIR:-/home/patriot/kasir/kasir.harmonylaundry.my.id}"
PUBLIC_URL="${PUBLIC_URL_CHECK:-https://kasir.harmonylaundry.my.id}"

if [[ -n "$PASS" ]]; then
  SSH_BASE=(sshpass -p "$PASS" ssh -o StrictHostKeyChecking=no -p "$PORT" "$USER@$HOST")
else
  SSH_BASE=(ssh -o StrictHostKeyChecking=no -p "$PORT" "$USER@$HOST")
fi

echo "[check] host=$HOST port=$PORT user=$USER remote_dir=$REMOTE_DIR"

"${SSH_BASE[@]}" "
set -e
echo '=== runtime user ==='
whoami
hostname

echo '=== kasir directory ==='
ls -la '$REMOTE_DIR'

echo '=== nginx route for kasir ==='
if command -v sudo >/dev/null 2>&1; then
  sudo -n nginx -T 2>/dev/null | sed -n '/server_name kasir.harmonylaundry.my.id/,/server {/p' | sed -n '1,220p' || true
fi

echo '=== listening 8083 ==='
ss -ltnp | grep ':8083' || true

echo '=== docker ps ==='
docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}'

echo '=== kasir compose ==='
if [ -f '$REMOTE_DIR/docker-compose.yml' ]; then
  sed -n '1,220p' '$REMOTE_DIR/docker-compose.yml'
fi

echo '=== HTTP checks ==='
curl -k -I -sS '$PUBLIC_URL' | sed -n '1,12p'
curl -k -sS '$PUBLIC_URL' | head -n 20
"

