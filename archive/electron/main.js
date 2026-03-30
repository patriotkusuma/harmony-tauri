const { app, BrowserWindow, ipcMain, powerSaveBlocker } = require('electron');
const path = require('path');
const fs = require('fs');
const { registerPrintIPC } = require('./printer');
const { setupRFID } = require('./rfid');
const { setupMQTT, teardownMQTT, getCurrentStatus } = require('./mqtt');

let win;

// Optimization and stability switches
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-backgrounding-occluded-windows');
app.commandLine.appendSwitch('ignore-certificate-errors');
app.commandLine.appendSwitch('allow-insecure-localhost', 'true');
app.commandLine.appendSwitch('disable-gpu'); 

function createWindow() {
  const isDev = !app.isPackaged;

  win = new BrowserWindow({
    width: 1280,
    height: 800,
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'assets/icon.png'), // Logo untuk taskbar/dock
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const localIndexPath = path.join(__dirname, '../build/index.html');
  const localIndexUrl = `file://${localIndexPath}`;
  const devServerUrl = process.env.ELECTRON_DEV_SERVER_URL || 'http://localhost:3010';
  const forceDevServer = process.env.ELECTRON_USE_DEV_SERVER === '1';

  // In source mode, prefer local build output when available to avoid
  // accidentally depending on a running dev server after build.
  const shouldUseDevServer = isDev && (forceDevServer || !fs.existsSync(localIndexPath));
  const startUrl = shouldUseDevServer ? devServerUrl : localIndexUrl;

  console.log(
    `[main] isPackaged=${app.isPackaged} forceDevServer=${forceDevServer} localIndexExists=${fs.existsSync(localIndexPath)} startUrl=${startUrl}`,
  );
  win.loadURL(startUrl);

  win.webContents.on('did-finish-load', () => {
    console.log(`[did-finish-load] url=${win.webContents.getURL()}`);
  });

  win.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL) => {
    console.error(`[did-fail-load] code=${errorCode} desc=${errorDescription} url=${validatedURL}`);
  });

  win.webContents.on('console-message', (_event, level, message, line, sourceId) => {
    console.log(`[renderer:${level}] ${message} (${sourceId}:${line})`);
  });

  win.webContents.on('render-process-gone', (_event, details) => {
    console.error(`[render-process-gone] reason=${details.reason} exitCode=${details.exitCode}`);
  });

  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }

  win.on('close', (e) => {
    if (!app.isQuitting) {
      e.preventDefault();
      win.hide();
    }
  });
}

// Global certificate error handler
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  event.preventDefault();
  callback(true);
});

app.whenReady().then(() => {
  // Set App ID agar logo muncul konsisten di Linux/ZorinOS
  app.setAppUserModelId('com.harmony.kasir');

  powerSaveBlocker.start('prevent-app-suspension');
  registerPrintIPC(ipcMain);

  // Allow renderer to query current MQTT status on mount (avoids race condition)
  ipcMain.handle('mqtt-get-status', () => getCurrentStatus());

  createWindow();
  
  // RFID via Serial (disabled)
  /*
  if (win) {
    setupRFID(win);
  }
  */

  // RFID via MQTT (native TCP — Node.js main process)
  setupMQTT(win);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
    else win.show();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // Tetap berjalan di background
  }
});

app.on('before-quit', () => {
  app.isQuitting = true;
  teardownMQTT();
});
