const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

let currentPort = null;
let reconnectTimer = null;

function setupRFID(mainWindow) {
  function connectToRFID() {
    SerialPort.list().then((ports) => {
      // Find a device that matches Arduino, CH340, CP210, etc.
      let selectedPortInfo = ports.find((p) => {
        const needle = ((p.manufacturer || '') + ' ' + (p.pnpId || '')).toLowerCase();
        return needle.includes('arduino') || needle.includes('ch340') || needle.includes('cp210') || needle.includes('usb');
      });

      // Prefer the selected port, or just try the first available one if none explicitly match
      if (!selectedPortInfo && ports.length > 0) {
        selectedPortInfo = ports[0];
      }

      if (!selectedPortInfo) {
        console.log('[RFID] No serial ports found. Retrying in 2s...');
        scheduleReconnect();
        return;
      }

      console.log(`[RFID] Attempting to connect to ${selectedPortInfo.path}...`);
      
      const portPath = selectedPortInfo.path;
      currentPort = new SerialPort({ path: portPath, baudRate: 115200 }, (err) => {
        if (err) {
          console.error(`[RFID] Error opening port: ${err.message}`);
          scheduleReconnect();
        }
      });

      const parser = currentPort.pipe(new ReadlineParser({ delimiter: String.fromCharCode(10) }));

      parser.on('data', (data) => {
        const line = data.trim();
        if (line.startsWith('UID:')) {
          const uid = line.substring(4).trim().toUpperCase();
          const uidRegex = /^[0-9A-FA-F]{8,20}$/;
          if (uidRegex.test(uid)) {
            console.log(`[RFID] UID Detected: ${uid}`);
            if (mainWindow && !mainWindow.isDestroyed()) {
              mainWindow.webContents.send('rfid-uid', uid);
            }
          }
        }
      });

      currentPort.on('error', (err) => {
        console.error(`[RFID] SerialPort error: ${err.message}`);
      });

      currentPort.on('close', () => {
        console.log('[RFID] Port closed. Reconnecting...');
        currentPort = null;
        scheduleReconnect();
      });

      console.log('[RFID] Connected successfully.');
    }).catch((err) => {
      console.error(`[RFID] Error listing ports: ${err.message}`);
      scheduleReconnect();
    });
  }

  function scheduleReconnect() {
    clearTimeout(reconnectTimer);
    reconnectTimer = setTimeout(connectToRFID, 2000);
  }

  // Start connection
  connectToRFID();
}

module.exports = { setupRFID };
