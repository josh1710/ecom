const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadFile('dashboard.html');
}

app.whenReady().then(createWindow);
