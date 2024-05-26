const { app, BrowserWindow } = require("electron");
const path = require("path");

const createWindow = () => {
  let __dirname = path.resolve();
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "source/project/scripts/preload.js"),
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  win.loadFile("./source/project/pages/index.html");
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
