---
description: Standard workflow for safely bumping the application version across the Node and Tauri project.
---

# Bump Version Workflow
This workflow is used to increment the version number of the application. Tauri applications require the version string to be identical in two places: `package.json` and `src-tauri/tauri.conf.json`. This workflow ensures synchronization.

## Steps:

### 1. Identify Target Version
- Ask the user what the new version number should be (e.g., from `1.2.4` to `1.2.5` or `1.3.0`).
- Wait for the user's input before modifying files.

### 2. Update `package.json`
- Use the content-replacement tool to replace the existing `"version": "x.x.x"` string inside `package.json` with the new version provided by the user.

### 3. Update `tauri.conf.json`
- Use the content-replacement tool to replace the existing `"version": "x.x.x"` string inside `src-tauri/tauri.conf.json` with the exact same new version.

### 4. Git Commit (Optional)
- Prompt the user if they'd like you to automatically commit the changes with the message: `chore: bump version to x.x.x`.
