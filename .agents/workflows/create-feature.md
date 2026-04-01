description: Standard workflow for creating a new feature in Harmony Tauri
---

# Feature Creation Workflow
This workflow ensures consistency across the codebase when adding a new business domain or feature.

## Architecture & State (Mandatory)
- **Atomic Design**: MUST strictly follow the Atomic structure (`components/atoms`, `components/molecules`, `components/organisms`). Do NOT write complex UI logic inside view pages.
- **Zustand State Management**: ALWAYS use Zustand stores in `src/store/` for the state layer. DO NOT use only local component state for shared business logic.

## Steps:

### 1. Requirements & Design
- Review existing documentation in `docs/` or `Documentation/`.
- If it's a new API, check the `openapi.yaml`.
- Plan the component structure based on **Atomic Design categories**.

### 2. State & Data Layer
- **Zustand Store**: Create a new file in `src/store/` (e.g., `featureStore.js`).
- **API Service**: Create or update a file in `src/services/api/` (e.g., `feature.js`) using `axios-instance.js`.

### 3. UI Components (Atomic)
- **Atoms**: Basic building blocks (Buttons, StatusDots, Inputs).
- **Molecules**: Groups of atoms (FormGroup, TableRow).
- **Organisms**: Complex blocks (DataTable, FormModal, HeaderSection).
- Use **Reactstrap** and **Bootstrap 5** for standardized layout.

### 4. Integration & Routing
- **Page Component**: Compose organisms inside a view in `src/views/pages/`.
- **Routes**: Add the new page to `src/routes.jsx`.
- **Sidebar**: ALWAYS update `src/components/Sidebar/SidebarNew.jsx` to include the new route under the correct section.

### 5. Hardware/Native (If Applicable)
- Update `src-tauri/src/main.rs` if custom Tauri commands are needed.
- Use `src/services/desktop-bridge.js` for Tauri-specific calls.
