/**
 * useMQTTRFID – React hook & Provider untuk menerima event RFID dari MQTT broker.
 *
 * Strategi dual-mode:
 *   ① ELECTRON  → main process buka koneksi native TCP mqtt://
 *                  dan kirim ke renderer via IPC.
 *   ② BROWSER   → WebSocket fallback via mqtt.js CDN (window.mqtt)
 *
 * Refactor ke Global Provider:
 *   Koneksi MQTT dipindah ke context agar global dan persisten (hanya ada 1 koneksi).
 *   Ini mencegah multiple WebSocket/IPC listener.
 */

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import desktopBridge from 'services/desktop-bridge';

/* ─── Konfigurasi broker ─────────────────────────────────────── */
const BROKER = {
  host    : 'harmonylaundry.my.id',
  wsPort  : 37879,
  username: 'harmony',
  password: 'Manisku212',
  topics  : [
    'harmony/rfid/+/events',
    'harmony/rfid/events',
    'harmony/rfid/+/status',
  ],
  clientId: `kasir_web_${Math.random().toString(16).slice(2, 10)}`,
};

const hasDesktopMQTTBridge = () => desktopBridge.hasMQTTBridge();

const MQTTRFIDContext = createContext();

/* ════════════════════════════════════════════════════════════════ */

export function MQTTRFIDProvider({ children }) {
  const [uid, setUID]               = useState('');
  const [lastScan, setLastScan]     = useState(null);
  const [connected, setConnected]   = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError]           = useState(null);
  const [mode, setMode]             = useState('');
  
  // Map of device_id → 'online'|'offline'
  const [devices, setDevices]       = useState({});

  const wsClientRef = useRef(null);
  const subscribersRef = useRef([]);
  const lastProcessedUidRef = useRef({ uid: '', at: 0 });

  const clearUID = useCallback(() => setUID(''), []);

  const subscribe = useCallback((cb) => {
    subscribersRef.current.push(cb);
    return () => {
      subscribersRef.current = subscribersRef.current.filter(fn => fn !== cb);
    };
  }, []);

  const handleUID = useCallback((scannedUID, extra = {}) => {
    const now = Date.now();
    const upper = (scannedUID || '').toUpperCase().trim();
    if (!upper) return;

    // Deduplikasi burst (abaikan jika UID sama dalam < 1000ms)
    if (lastProcessedUidRef.current.uid === upper && (now - lastProcessedUidRef.current.at) < 1000) {
      console.warn(`[MQTT] Duplicate burst ignored for: ${upper}`);
      return;
    }

    lastProcessedUidRef.current = { uid: upper, at: now };
    
    setUID(upper);
    setLastScan({ uid: upper, receivedAt: new Date(), ...extra });
    
    // Broadcast to all active subscribers via useMQTTRFID hook
    subscribersRef.current.forEach(cb => {
      try {
        cb(upper, extra);
      } catch (e) {
        console.error('[MQTT] Callback error:', e);
      }
    });
  }, []);

  const handleDeviceStatus = useCallback(({ device_id, status }) => {
    setDevices(prev => ({ ...prev, [device_id]: status }));
  }, []);

  /* ── ① ELECTRON path ──────────────────────────────────────────── */
  useEffect(() => {
    if (!hasDesktopMQTTBridge()) return;

    setMode('desktop');
    setConnecting(true);

    // Query current status immediately on mount
    desktopBridge.getMQTTStatus().then(({ status, message, devices: cachedDevices }) => {
      // Hydrate known devices from Electron main-process cache on reload
      if (cachedDevices && Object.keys(cachedDevices).length > 0) {
        setDevices(prev => ({ ...prev, ...cachedDevices }));
      }

      if (status === 'connected') {
        setConnected(true); setConnecting(false); setError(null);
      } else if (status === 'error') {
        setConnected(false); setConnecting(false); setError(message || 'MQTT error');
      } else {
        setConnected(false); setConnecting(status === 'connecting');
      }
    }).catch(() => {});

    // UID scan (legacy/fallback)
    const stopUID = desktopBridge.onRFIDUID((uid) => {
      // Hanya proses jika ScanData tidak terpanggil (redundancy check minimal)
      handleUID(uid, { source: 'bridge-uid' });
    });

    // Enriched scan data (modern path)
    const stopScanData = desktopBridge.onRFIDScanData((data) => {
      handleUID(data.uid, {
        device_id: data.device_id,
        uid_len  : data.uid_len,
        ts_ms    : data.ts_ms,
        source   : 'bridge-scan-data'
      });
    });

    // Device online/offline status
    const stopDeviceStatus = desktopBridge.onRFIDDeviceStatus(handleDeviceStatus);

    // Live broker status push
    const stopMQTTStatus = desktopBridge.onMQTTStatus(({ status, message }) => {
      if (status === 'connected') {
        setConnected(true); setConnecting(false); setError(null);
      } else if (status === 'connecting') {
        setConnected(false); setConnecting(true);
      } else if (status === 'error') {
        setConnected(false); setConnecting(false); setError(message || 'MQTT error');
      } else {
        setConnected(false); setConnecting(false);
      }
    });

    return () => {
      stopUID?.();
      stopScanData?.();
      stopDeviceStatus?.();
      stopMQTTStatus?.();
      setConnected(false);
      setConnecting(false);
    };
  }, [handleUID, handleDeviceStatus]);

  /* ── ② BROWSER / WebSocket fallback ──────────────────────────── */
  useEffect(() => {
    if (hasDesktopMQTTBridge()) return;

    const mqttLib = typeof window !== 'undefined' ? window.mqtt : null;
    if (!mqttLib) {
      setError('mqtt.js CDN tidak tersedia. Tambahkan <script> di public/index.html');
      return;
    }

    setMode('websocket');
    setConnecting(true);
    setError(null);

    const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const brokerUrl = `${wsProtocol}://${BROKER.host}:${BROKER.wsPort}/mqtt`;
    console.info('[MQTT-WS] Connecting to', brokerUrl);

    let client;
    try {
      client = mqttLib.connect(brokerUrl, {
        clientId       : BROKER.clientId,
        username       : BROKER.username,
        password       : BROKER.password,
        keepalive      : 60,
        reconnectPeriod: 3000,
        connectTimeout : 10_000,
      });
    } catch (e) {
      const message = e?.message || String(e);
      setError(`MQTT connect gagal: ${message}`);
      setConnected(false);
      setConnecting(false);
      console.error('[MQTT-WS] Connect init failed:', message);
      return;
    }

    wsClientRef.current = client;

    client.on('connect', () => {
      setConnected(true); setConnecting(false); setError(null);
      console.info('[MQTT-WS] Connected');
      client.subscribe(BROKER.topics, { qos: 0 }, (err) => {
        if (err) {
          console.error('[MQTT-WS] Subscribe error:', err.message);
          setError(`Subscribe gagal: ${err.message}`);
        } else {
          console.info('[MQTT-WS] Subscribed to:', BROKER.topics);
        }
      });
    });

    client.on('message', (topic, payload) => {
      const raw = payload.toString().trim();
      console.log(`[MQTT-WS] ← ${topic}: ${raw}`);

      // status
      if (/^harmony\/rfid\/.+\/status$/.test(topic)) {
        const device_id = topic.split('/')[2];
        handleDeviceStatus({ device_id, status: raw });
        return;
      }

      // events
      try {
        const data = JSON.parse(raw);
        if (data.schema === 'rfid.v1' && data.event === 'scan' && data.uid) {
          handleUID(data.uid, {
            device_id: data.device_id,
            uid_len  : data.uid_len,
            ts_ms    : data.ts_ms,
          });
        }
      } catch (e) {
        // ignore parse error logs to prevent spam
      }
    });

    client.on('reconnect', () => { setConnecting(true); setConnected(false); });
    client.on('offline',   () => { setConnected(false); setConnecting(false); });
    client.on('error',     (err) => { setError(err.message); setConnected(false); setConnecting(false); });
    client.on('btn-close',     () => { setConnected(false); });

    return () => {
      client.end(true);
      wsClientRef.current = null;
      setConnected(false);
      setConnecting(false);
    };
  }, [handleUID, handleDeviceStatus]);

  const value = React.useMemo(() => ({
    uid,
    lastScan,
    connected,
    connecting,
    error,
    mode,      // 'electron' | 'websocket'
    devices,   // { [device_id]: 'online'|'offline' }
    clearUID,
    subscribe,
  }), [uid, lastScan, connected, connecting, error, mode, devices, clearUID, subscribe]);

  return (
    <MQTTRFIDContext.Provider value={value}>
      {children}
    </MQTTRFIDContext.Provider>
  );
}

// Global hook
export function useMQTTRFID({ enabled = true, onUID } = {}) {
  const context = useContext(MQTTRFIDContext);
  if (!context) {
    throw new Error('useMQTTRFID must be used within MQTTRFIDProvider');
  }

  useEffect(() => {
    if (!enabled || !onUID) return;
    return context.subscribe(onUID);
  }, [enabled, onUID, context]);

  return context;
}
