import { isDesktopRuntime, isElectronRuntime, isTauriRuntime } from "./runtime";

let tauriCoreModulePromise = null;
let tauriEventModulePromise = null;

const defaultMQTTStatus = {
  status: "disconnected",
  message: "MQTT bridge tidak tersedia",
  devices: {},
};

const noop = () => {};

const getTauriCoreModule = async () => {
  if (!tauriCoreModulePromise) {
    tauriCoreModulePromise = import("@tauri-apps/api/core");
  }
  return tauriCoreModulePromise;
};

const getTauriEventModule = async () => {
  if (!tauriEventModulePromise) {
    tauriEventModulePromise = import("@tauri-apps/api/event");
  }
  return tauriEventModulePromise;
};

const invokeTauri = async (command, payload = {}) => {
  const { invoke } = await getTauriCoreModule();
  return invoke(command, payload);
};

const listenTauri = (eventName, cb) => {
  let disposed = false;
  let unlistenFn = null;

  (async () => {
    try {
      const { listen } = await getTauriEventModule();
      const off = await listen(eventName, (event) => cb(event.payload));
      if (disposed) {
        off();
      } else {
        unlistenFn = off;
      }
    } catch (err) {
      console.error(`Gagal listen event Tauri ${eventName}:`, err);
    }
  })();

  return () => {
    disposed = true;
    if (typeof unlistenFn === "function") {
      unlistenFn();
    }
  };
};

const desktopBridge = {
  isDesktop: isDesktopRuntime,
  isElectron: isElectronRuntime,
  isTauri: isTauriRuntime,
  hasNativePrint: () => isElectronRuntime() || isTauriRuntime(),
  hasMQTTBridge: () => isElectronRuntime() || isTauriRuntime(),

  async printOrder(data) {
    if (isElectronRuntime()) return window.electron.printOrder(data);
    if (isTauriRuntime()) return invokeTauri("print_order", { order: data });
    throw new Error("Desktop print tidak tersedia");
  },

  async printRaw(data) {
    if (isElectronRuntime()) return window.electron.printRaw(data);
    if (isTauriRuntime()) return invokeTauri("print_raw", { order: data });
    throw new Error("Desktop print tidak tersedia");
  },

  async printLastOrder(data) {
    if (isElectronRuntime()) return window.electron.printLastOrder(data);
    if (isTauriRuntime()) return invokeTauri("print_last_order", { order: data });
    throw new Error("Desktop print tidak tersedia");
  },

  async printName(data) {
    if (isElectronRuntime()) return window.electron.printName(data);
    if (isTauriRuntime()) return invokeTauri("print_name", { order: data });
    throw new Error("Desktop print tidak tersedia");
  },

  async getMQTTStatus() {
    if (isElectronRuntime() && window.electron?.getMQTTStatus) {
      return window.electron.getMQTTStatus();
    }
    if (isTauriRuntime()) {
      try {
        return await invokeTauri("mqtt_get_status");
      } catch (_e) {
        return defaultMQTTStatus;
      }
    }
    return defaultMQTTStatus;
  },

  onRFIDUID(cb) {
    if (isElectronRuntime() && window.electron?.onRFIDUID) {
      window.electron.onRFIDUID(cb);
      return () => window.electron?.removeRFIDListener?.();
    }
    if (isTauriRuntime()) {
      return listenTauri("rfid-uid", (payload) => cb(String(payload || "").trim()));
    }
    return noop;
  },

  onRFIDScanData(cb) {
    if (isElectronRuntime() && window.electron?.onRFIDScanData) {
      window.electron.onRFIDScanData(cb);
      return () => window.electron?.removeRFIDScanDataListener?.();
    }
    if (isTauriRuntime()) {
      return listenTauri("rfid-scan-data", (payload) => {
        if (payload && typeof payload === "object") cb(payload);
      });
    }
    return noop;
  },

  onRFIDDeviceStatus(cb) {
    if (isElectronRuntime() && window.electron?.onRFIDDeviceStatus) {
      window.electron.onRFIDDeviceStatus(cb);
      return () => window.electron?.removeRFIDDeviceStatusListener?.();
    }
    if (isTauriRuntime()) {
      return listenTauri("rfid-device-status", (payload) => {
        if (payload && typeof payload === "object") cb(payload);
      });
    }
    return noop;
  },

  onMQTTStatus(cb) {
    if (isElectronRuntime() && window.electron?.onMQTTStatus) {
      window.electron.onMQTTStatus(cb);
      return () => window.electron?.removeMQTTStatusListener?.();
    }
    if (isTauriRuntime()) {
      return listenTauri("mqtt-status", (payload) => {
        if (payload && typeof payload === "object") cb(payload);
      });
    }
    return noop;
  },
};

export default desktopBridge;
