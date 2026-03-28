---
description: Standard workflow for building and deploying the Harmony Tauri application.
---

# Deployment & Build Workflow
Follow these steps to build the Tauri desktop app or deploy the web portion.

## Prerequisites:
- Ensure **Node.js** v18+ is installed.
- Ensure **Rust & Cargo** are installed for Tauri builds.

## Steps:

### 1. Tauri Desktop Build (Development)
To run the project locally in Tauri development mode:
// turbo
```powershell
npm run tauri:dev
```
- Port `3010` will be used as configured in `package.json`.

### 2. Tauri Desktop Build (Production)
To create the final installer (.msi/.exe for Windows):
// turbo
```powershell
npm run tauri:build
```
- Resulting files will be in `src-tauri/target/release/bundle/`.

### 3. Web-only Deployment (Kasir Server)
- **Linux/Mac**: `npm run kasir:deploy` (runs `bash scripts/kasir-deploy.sh`).
- **Windows**: `npm run kasir:deploy:win` (runs `node scripts/kasir-deploy-win.js`).

Ini akan melakukan:
1. Build React web bundle.
2. Mendeteksi main JS/CSS (Vite).
3. Sync ke server Harmony via SSH/SCP.
4. Reload Docker container di server.

### 4. Code Cleanup
Before a major build, it may be helpful to use:
// turbo
```powershell
npm run install:clean
```
- This removes `node_modules` and re-installs.
