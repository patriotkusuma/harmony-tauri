export const isElectronRuntime = () =>
  typeof window !== "undefined" && Boolean(window.electron);

export const isTauriRuntime = () =>
  typeof window !== "undefined" &&
  (Boolean(window.__TAURI_INTERNALS__) ||
    Boolean(window.__TAURI__) ||
    Boolean(window.__TAURI_IPC__));

export const isDesktopRuntime = () => isElectronRuntime() || isTauriRuntime();

export const loginRedirectPath = () =>
  isElectronRuntime() ? "/#/auth/login" : "/auth/login";
