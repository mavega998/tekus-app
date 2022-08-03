const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('ipcRenderer', {
  on: (channel, listener) => ipcRenderer.on(channel, listener),
  send: (channel, ...args) => ipcRenderer.send(channel, ...args),
  removeEventListener: (channel) => ipcRenderer.removeEventListener(channel)
})