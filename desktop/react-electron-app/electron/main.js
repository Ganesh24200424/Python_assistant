const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const isDev = process.env.ELECTRON_IS_DEV || !app.isPackaged

let mainWindow = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 1000,
    minWidth: 1000,
    minHeight: 700,
    show: false,
    frame: false,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#050510',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      devTools: isDev
    }
  })

  const loadURL = isDev 
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../dist/index.html')}`

  mainWindow.loadURL(loadURL)

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

