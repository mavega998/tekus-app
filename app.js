const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')

const { coinBase } = require('./modules/price')

let mainWindow
app.on('ready', async () => {
  mainWindow = new BrowserWindow({})
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'views/index.html'),
      protocol: 'file',
      slashes: true
    })
  )
  mainWindow.menuBarVisible = false
  mainWindow.webContents.openDevTools()
  coinBase.validCurrentDate()
})