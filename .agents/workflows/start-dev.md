---
description: Standard workflow for starting the local Tauri development environment efficiently.
---

# Start Tauri Development Workflow
This workflow sets up everything you need to start coding without worrying about outdated dependencies or missing configurations.

## Steps to Execute:

### 1. Ensure Dependencies Are Up-To-Date
Before starting the development server, it's good practice to ensure all `node_modules` are synchronized with `package.json`.
// turbo
```bash
npm install
```

### 2. Start the Tauri Dev Server
Launch the Vite React frontend and the Tauri Rust backend simultaneously. This will open the desktop application window.
// turbo
```bash
npm run tauri:dev
```

### 3. Verification
- The local server will start on port `3010`.
- The Tauri desktop window should pop up momentarily.
- **Tip**: Keep the terminal panel open to watch for both React and Rust compilation errors.
