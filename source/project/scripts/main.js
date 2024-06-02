// import { app, BrowserWindow } from 'electron';
// import path from 'node:path';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// import * as dbMgr from './database/dbMgr.js';

const {app, BrowserWindow} = require('electron');
const path = require('node:path');
const dbMgr = require('./database/dbMgr.js');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 2560,
    height: 1440,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  });

  win.loadFile('./source/project/components/mainview/mainview.html');
  win.webContents.openDevTools();
};

app.whenReady().then(() => {
  dbMgr.init(createWindow);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
