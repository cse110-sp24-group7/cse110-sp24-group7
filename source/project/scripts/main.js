// import { app, BrowserWindow } from 'electron';
// import path from 'node:path';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// import * as dbMgr from './database/dbMgr.js';

const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const dbMgr = require("./database/dbMgr.js");
const fs = require("fs");

ipcMain.handle('getUserData', () => app.getPath("userData"));

const createWindow = () => {
	const win = new BrowserWindow({
		width: 2560,
		height: 1440,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true
		}
	});

	win.loadFile("./source/project/components/mainview/mainview.html");
	win.webContents.openDevTools();
};

app.whenReady().then(() => {
  let userDataDB = path.resolve(app.getPath("userData"), "data.db");
  console.log("Path to userdata DB: " + userDataDB);
  if(!fs.existsSync(userDataDB)){
    // TODO: touch .db in userData here
    console.log("Did not find " + userDataDB);
    let file = fs.openSync(userDataDB, 'a');
    fs.closeSync(file);
  }
  createWindow();
  // dbMgr.connect("", () => {
  //   dbMgr.init(createWindow);
  // });
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});
