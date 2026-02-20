const { app, BrowserWindow, dialog } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');

const BACKEND_PORT = 8000;
const BACKEND_URL = `http://127.0.0.1:${BACKEND_PORT}`;
const isDev = !app.isPackaged;

let backendProcess = null;
let mainWindow = null;

function getBackendCommand() {
  if (isDev) {
    // Dev mode: run from venv
    const base = path.join(__dirname, '..');
    const python = process.platform === 'win32'
      ? path.join(base, 'venv', 'Scripts', 'python.exe')
      : path.join(base, 'venv', 'bin', 'python');
    const backendDir = path.join(base, 'backend');
    return { cmd: python, args: ['-m', 'uvicorn', 'app:app', '--host', '127.0.0.1', '--port', String(BACKEND_PORT)], cwd: backendDir };
  }

  // Production: run PyInstaller binary bundled in resources
  const binaryName = process.platform === 'win32' ? 'wordhunt-backend.exe' : 'wordhunt-backend';
  const binaryPath = path.join(process.resourcesPath, 'backend', binaryName);
  return { cmd: binaryPath, args: [String(BACKEND_PORT)], cwd: path.dirname(binaryPath) };
}

function startBackend() {
  const { cmd, args, cwd } = getBackendCommand();
  console.log(`Starting backend: ${cmd} ${args.join(' ')} (cwd: ${cwd})`);

  backendProcess = spawn(cmd, args, {
    cwd,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  backendProcess.stdout.on('data', (data) => {
    console.log(`[backend] ${data.toString().trimEnd()}`);
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`[backend] ${data.toString().trimEnd()}`);
  });

  backendProcess.on('error', (err) => {
    console.error('Failed to start backend:', err.message);
  });

  backendProcess.on('exit', (code) => {
    console.log(`Backend exited with code ${code}`);
    backendProcess = null;
  });
}

function waitForBackend(maxAttempts = 60) {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    function check() {
      attempts++;
      const req = http.get(`${BACKEND_URL}/health`, (res) => {
        if (res.statusCode === 200) {
          resolve();
        } else if (attempts < maxAttempts) {
          setTimeout(check, 500);
        } else {
          reject(new Error('Backend did not become healthy'));
        }
      });

      req.on('error', () => {
        if (attempts < maxAttempts) {
          setTimeout(check, 500);
        } else {
          reject(new Error('Backend did not start'));
        }
      });

      req.end();
    }

    check();
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, '..', 'frontend', 'index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function killBackend() {
  if (backendProcess) {
    backendProcess.kill();
    backendProcess = null;
  }
}

app.whenReady().then(async () => {
  startBackend();
  createWindow();

  try {
    await waitForBackend();
  } catch (err) {
    console.error(err.message);
    dialog.showErrorBox('Backend Error', 'The backend server failed to start. Please check the console for details.');
    app.quit();
  }
});

app.on('window-all-closed', () => {
  killBackend();
  app.quit();
});

app.on('before-quit', () => {
  killBackend();
});
