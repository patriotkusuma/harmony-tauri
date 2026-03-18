# Kasir Web Deploy (Docker + Nginx Proxy 8083)

Domain `kasir.harmonylaundry.my.id` tidak melayani file statis langsung dari Nginx host. Trafik diproxy ke container `kasir-harmonylaundry` di `127.0.0.1:8083`.

## Alur yang dipakai
1. Build React web: `npm run build:server`
2. Sync isi `build/` ke `/home/patriot/kasir/kasir.harmonylaundry.my.id/`
3. Reload container web: `docker compose up -d web`
4. Smoke test asset utama dan route SPA

## Script yang disediakan
- Cek server runtime:
```bash
SSH_PASS='05Juli!!' npm run kasir:check:server
```

- Deploy web:
```bash
SSH_PASS='05Juli!!' npm run kasir:deploy
```

## Environment variables opsional
- `SSH_HOST` default: `harmonylaundry.my.id`
- `SSH_PORT` default: `36786`
- `SSH_USER` default: `patriot`
- `SSH_PASS` default: kosong (kalau kosong, pakai key auth)
- `REMOTE_DIR` default: `/home/patriot/kasir/kasir.harmonylaundry.my.id`
- `PUBLIC_URL_CHECK` default: `https://kasir.harmonylaundry.my.id`

## Kenapa ini penting
- Upload SFTP manual sering menyisakan file hash lama.
- Script deploy menggunakan `rsync --delete` untuk menjaga folder server persis sama dengan `build/` terbaru.
- Ini mencegah mismatch asset yang bisa berujung blank putih.

