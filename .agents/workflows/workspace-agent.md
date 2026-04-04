---
description: Standard workflow for Harmony Tauri Frontend development (Atomic Design, Zustand, & Desktop Bridge)
---

# Harmony Tauri Frontend Workflow
This workflow defines how Antigravity should build, test, and deploy features in the Harmony Tauri repository.

## 1. Requirement & State Planning
Before coding, ensure state management is centralized in Zustand.
// turbo
1. Review the Domain models from the Backend:
   ```bash
   # Check the corresponding backend models (if available in the workspace)
   # Or review local stores in src/store/
   ls src/store/
   ```
2. Identify which **Atomic Components** are needed.
3. Check `openapi.yaml` to ensure API alignment.

## 2. Component Development (Atomic Design)
NEVER place logic in Views. Follow the Atomic structure: `atoms` -> `molecules` -> `organisms` -> `views`.
// turbo
1. Update Atoms and Molecules in `src/components/`.
2. Build complex Organisms in `src/components/organisms/`.
3. Compose Organisms into Page Views in `src/views/pages/`.
4. Register the new route in `src/routes.jsx` and `src/components/Sidebar/SidebarNew.jsx`.

## 3. Data Integration (Axios & Zustand)
Standardize data fetching and state.
// turbo
1. Create/Update Axios service in `src/services/api/`.
2. Integrate Axios service into the corresponding Zustand store (`src/store/`).
3. Connect the store to UI components using `useStore` hook.

## 4. Local Development & Testing
Keep the dev environment running to see UI changes instantly.
// turbo
1. Start the dev server:
   ```bash
   npm run tauri:dev
   ```
2. Verify visual results and console logs for errors.

## 5. Pushing & Versioning
When work is complete:
// turbo
1. Use `/push-repo` (tauri/.agents/workflows/push-repo.md) to commit and push changes.
2. If version bumping is required, use `/bump-version`.

## 6. Build & Deployment
For distribution:
// turbo
1. Use `/build-linux` to generate locally or `/deploy` to trigger automated pipelines.
