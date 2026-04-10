const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods to renderer
contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  minimize: () => ipcRenderer.invoke('window-minimize'),
  maximize: () => ipcRenderer.invoke('window-maximize'),
  close: () => ipcRenderer.invoke('window-close'),
  isMaximized: () => ipcRenderer.invoke('window-is-maximized'),

  // App info
  isDev: process.env.ELECTRON_IS_DEV,
  version: process.versions.electron
})

// Handle IPC from main (if needed later)
ipcRenderer.on('message-from-main', (event, message) => {
  window.postMessage({ type: 'main-message', payload: message }, '*')
})

