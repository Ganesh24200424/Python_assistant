const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const http = require('http');

let mainWindow;
let pythonServer;

const isDev = process.env.NODE_ENV === 'development';

function startPythonServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Python server check');
    });
    server.listen(8000, '127.0.0.1', () => {
      console.log('Checking backend...');
      resolve(server);
    });
    server.on('error', () => {
      console.log('Backend may already be running');
      resolve(server);
    });
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    show: false,
    backgroundColor: '#050510',
    title: 'Jarvis',
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  const startUrl = isDev 
    ? 'http://localhost:8000' 
    : `file://${path.join(__dirname, 'Frontend', 'index.html')}`;

  mainWindow.loadURL(startUrl);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (!isDev) {
    mainWindow.setMenuBarVisibility(false);
  }
}

app.whenReady().then(async () => {
  console.log('Starting Jarvis Desktop...');
  
  if (!isDev) {
    pythonServer = await startPythonServer();
  }
  
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (pythonServer) {
    pythonServer.close();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (pythonServer) {
    pythonServer.close();
  }
});