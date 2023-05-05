// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const common = require('./common')
const {download} = require('electron-dl');

//Chỉ bật khi dev
//Only dev
require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});

// if (require('electron-squirrel-startup')) app.quit();

ipcMain.on('download-item', async (event, {url}) => {
  event.sender.send('download-success', url)
  const win = BrowserWindow.getFocusedWindow();
  await download(win, url, {
    saveAs: true
  });
});

function createWindow() {

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    icon: path.join(__dirname, 'resources/icons/tool-icon.png'),
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
      // "web-security": false
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// function testclick(){
//   console.log("abc");
// }


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  //Setup API path
  // common.initDomainAPI();
  // await common.initAPIKey();
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.