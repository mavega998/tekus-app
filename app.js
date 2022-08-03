const { app, ipcMain, BrowserWindow } = require('electron')
const { coinBase } = require('./modules/price')

let mainWindow

//This function creates the window and its properties.
createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 380,
    height: 800,
    x: 1080,
    y: 0,
    title: 'Tekus - App',
    webPreferences: {
      nodeIntegration: true,
      preload: `${app.getAppPath()}/preload.js`
    }
  })

  mainWindow.loadURL(`file://${__dirname}/views/index.html`)

  mainWindow.setMenu(null)

  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  coinBase.validCurrentDate()
}

app.on('ready', createWindow)

app.on('window-all-closed', () => app.quit())

/* ipcMain is listening the "message" channel, and when the message arrives,
  it replies with "pong" */
ipcMain.on('message', async (event, message) => {
  console.log(message)
  const eur = await coinBase.updateCurrencyEUR(message)
  const cop = await coinBase.updateCurrencyCOP(message)
  event.reply('reply', { eur, cop })
})
