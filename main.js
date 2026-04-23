const { app, BrowserWindow, Menu } = require('electron')

app.whenReady().then(() => {
  Menu.setApplicationMenu(null)  // removes menu bar
  const win = new BrowserWindow({ width: 500, height: 710 })
  win.loadFile('index.html')
})