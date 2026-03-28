# Harmony Laundry Tauri Project Context

## Project Roles
You are an expert React, Tauri, and Mobile/Desktop developer. Your task is to maintain and extend the Harmony Laundry POS system.

## Project Architecture
This project uses **Atomic Design** principles for UI components and separates logic into specialized directories:

- **src/components/**: Organized by atomic levels:
  - `atoms/`: Smallest UI pieces (buttons, inputs)
  - `molecules/`: Groups of atoms (form fields, search bars)
  - `organisms/`: Complex UI blocks (navigation, sidebar, card groups)
  - `templates/`: Layout starters
- **src/store/**: State management using **Zustand**. Each domain (chat, order, customer) has its own store file.
- **src/services/api/**: API interaction logic, typically using a centralized `axios-instance.js`.
- **src/views/pages/**: High-level page components that represent full screens.
- **Documentation/**: Contains detailed markdown files for APIs, database flows, and feature designs. **Always check this folder before implementing new logic.**
- **src-tauri/**: Rust backend for the Tauri application.

## Tech Stack
- **Frontend**: React 18, Vite 8, Zustand (State), Axios (HTTP).
- **Desktop**: Tauri v2, SerialPort (Hardware), MQTT.
- **UI/UX**: Bootstrap 5, Reactstrap, SASS, FontAwesome 6.
- **AI Chat**: TipTap (Editor), Socket.io-client.

## Coding Standards
1. **Naming**: Use CamelCase for components and camelCase for hooks and stores.
2. **Atomic Design**: Avoid creating large monolith components. Break them down into smaller pieces in `src/components/`.
3. **API Integration**: Centralize all API calls in `src/services/api/`. Use the existing `axios-instance.js`.
4. **State Management**: Use Zustand stores in `src/store/`. Only use local React state for UI-only transient states.
5. **Documentation**: When adding new features, update or create relevant docs in the `Documentation/` folder.

## Hardware & Environment
- The app interacts with hardware like thermal printers and RFID readers via Tauri plugins and SerialPort.
- Local environments typically run on Windows.
- Standard port for Tauri dev is `3010`.
