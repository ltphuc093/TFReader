/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 * 
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */


const common = require('./common')
const { contextBridge, BrowserWindow } = require('electron')
const path = require('path')
const { ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }

})

ipcRenderer.on('download-success', (event, arg) => {
})

//FileRes
contextBridge.exposeInMainWorld('FileRes', {
  ExportFileJSON: (content, filepath) => {
    return new Promise((resolve, reject) => {
      const fs = require("fs");
      // var pathFolder = path.join(__dirname, './FileTF/');
      // var pathFile = path.join(pathFolder, filename);

      // if (!fs.existsSync(pathFolder)) {
      //   fs.mkdirSync(pathFolder, { recursive: true });
      // }

      if (filepath == "" || filepath == null) {
        alert("Đường dẫn không hợp lệ!");
        resolve(false);
      }

      fs.writeFileSync(filepath, content);
      resolve(true);
    });
  },
})