/**
 * mqtt.js – Electron main-process MQTT client
 *
 * Broker : mqtt://harmonylaundry.my.id:37879
 *
 * Topics subscribed:
 *   harmony/rfid/+/events   → scan events per device  (wildcard)
 *   harmony/rfid/events     → shared scan stream
 *   harmony/rfid/+/status   → device online/offline (retained + LWT)
 *
 * IPC channels pushed to renderer:
 *   rfid-uid        → uid string
 *   rfid-scan-data  → { uid, device_id, uid_len, ts_ms }
 *   mqtt-status     → { status: 'connected'|'connecting'|'disconnected'|'error', message? }
 *   rfid-device-status → { device_id, status: 'online'|'offline' }
 */

const mqtt = require('mqtt');

const BROKER_URL = 'mqtt://harmonylaundry.my.id:37879';
const CLIENT_ID  = `harmony_kasir_${Math.random().toString(16).slice(2, 10)}`;

const TOPICS = [
  'harmony/rfid/+/events',  // per-device scan events  (wildcard)
  'harmony/rfid/events',    // shared scan stream
  'harmony/rfid/+/status',  // device online/offline
];

const OPTIONS = {
  clientId        : CLIENT_ID,
  username        : 'harmony',
  password        : 'Manisku212',
  keepalive       : 60,
  reconnectPeriod : 3000,
  connectTimeout  : 10_000,
  clean           : true,
};

let client        = null;
let mainWindowRef = null;
let currentStatus = { status: 'connecting' };
let currentDevices = {}; // Keep track of latest device statuses

/* ─── helpers ──────────────────────────────────────────────────── */

function sendStatus(status, extra = {}) {
  currentStatus = { status, ...extra };
  if (!mainWindowRef || mainWindowRef.isDestroyed()) return;
  mainWindowRef.webContents.send('mqtt-status', currentStatus);
}

function sendUID(uid, scanData) {
  if (!mainWindowRef || mainWindowRef.isDestroyed()) return;
  mainWindowRef.webContents.send('rfid-uid', uid);
  mainWindowRef.webContents.send('rfid-scan-data', scanData);
}

function sendDeviceStatus(device_id, status) {
  currentDevices[device_id] = status; // Keep in memory for reloads
  if (!mainWindowRef || mainWindowRef.isDestroyed()) return;
  mainWindowRef.webContents.send('rfid-device-status', { device_id, status });
}

/* ─── message router ────────────────────────────────────────────── */

function handleMessage(topic, payload) {
  const raw = payload.toString().trim();
  console.log(`[MQTT] ← topic: ${topic}  payload: ${raw}`);

  // ── Device status topic: harmony/rfid/<device_id>/status ─────
  //    Payload is a plain string: "online" | "offline"
  if (topic.match(/^harmony\/rfid\/.+\/status$/)) {
    const parts = topic.split('/');
    const device_id = parts[2];
    const status = raw; // "online" | "offline"
    console.log(`[MQTT] Device ${device_id} is ${status}`);
    sendDeviceStatus(device_id, status);
    return;
  }

  // ── Scan event topics ─────────────────────────────────────────
  //    harmony/rfid/+/events  or  harmony/rfid/events
  try {
    const data = JSON.parse(raw);

    // Validate schema
    if (data.schema !== 'rfid.v1') {
      console.warn(`[MQTT] Unknown schema: ${data.schema}`);
      return;
    }
    if (data.event !== 'scan') {
      console.info(`[MQTT] Non-scan event ignored: ${data.event}`);
      return;
    }
    if (!data.uid) {
      console.warn('[MQTT] Scan event missing uid field');
      return;
    }

    const uid = data.uid.toUpperCase().trim();
    console.log(`[MQTT] ✅ RFID scan → uid=${uid}  device=${data.device_id}  uid_len=${data.uid_len}`);

    sendUID(uid, {
      uid,
      device_id : data.device_id || 'unknown',
      uid_len   : data.uid_len,
      ts_ms     : data.ts_ms,
    });

  } catch (e) {
    console.warn(`[MQTT] Failed to parse JSON on topic ${topic}:`, e.message, '| raw:', raw);
  }
}

/* ─── setup / teardown ──────────────────────────────────────────── */

function setupMQTT(mainWindow) {
  mainWindowRef = mainWindow;

  console.log(`[MQTT] Connecting to ${BROKER_URL}  client=${CLIENT_ID}`);
  client = mqtt.connect(BROKER_URL, OPTIONS);

  client.on('connect', () => {
    console.log('[MQTT] Connected ✓');
    sendStatus('connected');

    // Subscribe to all topics
    client.subscribe(TOPICS, { qos: 0 }, (err, granted) => {
      if (err) {
        console.error('[MQTT] Subscribe error:', err.message);
        sendStatus('error', { message: err.message });
      } else {
        granted.forEach(({ topic, qos }) =>
          console.log(`[MQTT] Subscribed → ${topic} (qos=${qos})`)
        );
      }
    });
  });

  client.on('message', handleMessage);

  client.on('reconnect', () => {
    console.log('[MQTT] Reconnecting…');
    sendStatus('connecting');
  });

  client.on('offline', () => {
    console.warn('[MQTT] Offline');
    sendStatus('disconnected');
  });

  client.on('error', (err) => {
    console.error('[MQTT] Error:', err.message);
    sendStatus('error', { message: err.message });
  });

  client.on('close', () => {
    sendStatus('disconnected');
  });
}

function teardownMQTT() {
  if (client) {
    client.end(true);
    client = null;
    console.log('[MQTT] Disconnected (teardown)');
  }
}

module.exports = { 
  setupMQTT, 
  teardownMQTT, 
  getCurrentStatus: () => ({ ...currentStatus, devices: currentDevices }) 
};
