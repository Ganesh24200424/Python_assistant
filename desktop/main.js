console.log('Global keys:', Object.keys(global).filter(k => k.length < 5));
console.log('app in global?:', 'app' in global);
console.log('BrowserWindow in global?:', 'BrowserWindow' in global);

const path = require('path');
const { app, BrowserWindow, shell } = global;

let mainWindow;

const isDev = process.env.NODE_ENV === 'development';

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
}

app.whenReady().then(() => {
  console.log('Starting Jarvis Desktop...');
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});