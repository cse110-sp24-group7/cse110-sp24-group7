// import { app, BrowserWindow } from 'electron';
// import path from 'node:path';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// import * as dbMgr from './database/dbMgr.js';

const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");

ipcMain.handle('getPath', () => app.getPath("userData"));
const fs = require("fs");
const path2 = require("path")

const createWindow = () => {
  const win = new BrowserWindow({
    width: 2560,
    height: 1440,
    webPreferences: {
      preload: path.resolve(__dirname, "preload.js"),
      nodeIntegration: true,
    },
  });

	win.loadFile("./source/project/components/mainview/mainview.html");
	win.webContents.openDevTools();
};

const {DatabaseManager} = require("./database/dbMgr.js");
const dbManager = DatabaseManager(app.getPath("userData"));
app.whenReady().then(() => {
  dbManager.init(createWindow);
  console.log("MAIN PROCESS: " + app.getPath("userData"));
  if (fs.existsSync(path2.resolve(app.getPath("userData"), 'data.db'))) {
    console.log("file exists!");

    fs.readFile(path2.resolve(app.getPath("userData"), 'data.db'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(data);
    });
  } else {
    console.log("file does not exist!");
  }
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});
