#!/bin/bash
set -euo pipefail

# Pastikan berada di direktori proyek
echo "🚀 Memulai proses build HarmoyLaundry untuk Linux..."

# 1. Bersihkan folder dist/build lama
echo "🧹 Membersihkan folder lama..."
rm -rf dist
rm -rf build

# 2. Build React Apps
echo "📦 Membangun bundle React..."
npm run build

# 2.5 Generate Linux icon sizes (agar icon muncul konsisten di launcher)
echo "🖼️ Menyiapkan ikon Linux..."
ICON_SRC="electron/assets/icon.png"
ICON_DIR="electron/assets/icons"
mkdir -p "$ICON_DIR"

for SIZE in 16 24 32 48 64 128 256 512; do
  ffmpeg -y -loglevel error -i "$ICON_SRC" -vf "scale=${SIZE}:${SIZE}" "$ICON_DIR/${SIZE}x${SIZE}.png"
done

# 3. Build Electron App (.deb)
echo "🏗️ Mengemas aplikasi Electron ke format .deb..."
npx electron-builder --linux deb

echo "✅ Build selesai! Cek folder 'dist' untuk file .deb Anda."
