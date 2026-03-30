---
description: Standard workflow for building the Tauri application natively on a Linux OS (.AppImage, .deb).
---

# Build Tauri Application for Linux
This workflow guides you through preparing the environment and building the application for a Linux distribution.

## Prerequisites:
- Ensure **Node.js** v18+ is installed.
- Ensure **Rust & Cargo** are installed for Tauri builds.

## Steps:

### 1. Install Required Linux Dependencies
Tauri applications on Linux require several development libraries to successfully compile (especially WebKit2GTK). 

If you are using **Ubuntu/Debian-based** distributions, run the following command to install the required libraries:
// turbo
```bash
sudo apt update && sudo apt install -y libwebkit2gtk-4.1-dev build-essential curl wget file libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev
```
*(For Fedora/Arch/other distributions, please refer to the official Tauri prerequisites documentation for the corresponding package names).*

### 2. Install Project Node Modules
Ensure all npm dependencies are fresh before creating the build.
// turbo
```bash
npm install
```

### 3. Build the Applicaton (Linux Targets)
Run the build script. This step will invoke Cargo and compile the application.
// turbo
```bash
npm run tauri:build
```
- Compilation will take a few minutes the first time as it downloads and compiles Rust crates.
- The compiled `.AppImage` and `.deb` files will be output to:
  - `src-tauri/target/release/bundle/appimage/`
  - `src-tauri/target/release/bundle/deb/`
