const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // ── Print ──────────────────────────────────────────────────────
  printOrder     : (data) => ipcRenderer.invoke('print:order', data),
  printRaw       : (data) => ipcRenderer.invoke('print:raw', data),
  printLastOrder : (data) => ipcRenderer.invoke('print:last-order', data),
  printName      : (data) => ipcRenderer.invoke('print:name', data),

  // ── RFID via MQTT (main process → renderer) ───────────────────
  // Query current MQTT status immediately on mount (avoids race-condition)
  getMQTTStatus : () => ipcRenderer.invoke('mqtt-get-status'),

  // Raw UID string
  onRFIDUID           : (cb) => ipcRenderer.on('rfid-uid',           (_e, uid)  => cb(uid)),
  removeRFIDListener  : ()   => ipcRenderer.removeAllListeners('rfid-uid'),

  // Enriched scan data: { uid, device_id, uid_len, ts_ms }
  onRFIDScanData                : (cb) => ipcRenderer.on('rfid-scan-data', (_e, data) => cb(data)),
  removeRFIDScanDataListener    : ()   => ipcRenderer.removeAllListeners('rfid-scan-data'),

  // Device status: { device_id, status: 'online'|'offline' }
  onRFIDDeviceStatus            : (cb) => ipcRenderer.on('rfid-device-status', (_e, d) => cb(d)),
  removeRFIDDeviceStatusListener: ()   => ipcRenderer.removeAllListeners('rfid-device-status'),

  // MQTT broker connection status: { status, message? }
  onMQTTStatus            : (cb) => ipcRenderer.on('mqtt-status', (_e, s) => cb(s)),
  removeMQTTStatusListener: ()   => ipcRenderer.removeAllListeners('mqtt-status'),
});

