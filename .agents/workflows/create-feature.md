---
description: Standard workflow for creating a new feature in Harmony Tauri
---

# Feature Creation Workflow
This workflow ensures consistency across the codebase when adding a new business domain or feature.

## Steps:

### 1. Requirements & Design
- Review existing documentation in `Documentation/`.
- If it's a new API, check the `openapi.yaml`.
- Plan the component structure using Atomic Design.

### 2. State & Data Layer
- **Zustand Store**: Create a new file in `src/store/` (e.g., `featureStore.js`).
- **API Service**: Create or update a file in `src/services/api/` (e.g., `feature.js`) using `axios-instance.js`.

### 3. UI Components
- **Atoms/Molecules**: Create small UI pieces in `src/components/atoms/` or `molecules/`.
- **Organisms**: Build complex blocks in `src/components/organisms/`.
- Use **Reactstrap** and **Bootstrap 5** for layout and styling.

### 4. Integration
- **Page Component**: Create the main page in `src/views/pages/` (e.g., `NewFeatureManagement.jsx`).
- **Routes**: Add the new page to `src/routes.jsx` and `src/components/Sidebar/SidebarNew.jsx`.

### 5. Hardware/Native (If Applicable)
- Update `src-tauri/src/main.rs` if custom Tauri commands are needed.
- Use `src/services/desktop-bridge.js` for Tauri-specific calls.
