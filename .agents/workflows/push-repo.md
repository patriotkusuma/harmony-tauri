---
description: Standard workflow for committing and pushing changes to the Harmony Tauri repository.
---

# Push Repository Workflow
Use this workflow to safely commit and push your changes to the remote repository.

## Steps:

### 1. Check Status
Before committing, check what has changed:
// turbo
```powershell
git status
```

### 2. Add Changes
Stage all changes in the project:
// turbo
```powershell
git add .
```

### 3. Commit
Commit with a meaningful message.
// turbo
```powershell
git commit -m "feat: updated project with Antigravity skills and cross-platform deploy script"
```

### 4. Push
Push to the remote repository (usually `main`):
// turbo
```powershell
git push origin main
```

### 5. Verify
Check the remote status:
// turbo
```powershell
git log -n 1
```
