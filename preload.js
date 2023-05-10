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

      if (content == "" || content == null) {
        alert("Nội dung đang rỗng!");
        resolve(false);
      }

      fs.writeFileSync(filepath, content);
      resolve(true);
    });
  },

  AddRow: (keyword, value, keywordArray) => {
    return new Promise((resolve, reject) => {
      const fs = require("fs");
      // var pathFolder = path.join(__dirname, './FileTF/');
      // var pathFile = path.join(pathFolder, filename);

      // if (!fs.existsSync(pathFolder)) {
      //   fs.mkdirSync(pathFolder, { recursive: true });
      // }

      if (keyword == "" || keyword == null) {
        alert("Vui lòng nhập từ khóa!");
        resolve(false);
      }

      if (value == "" || value == null) {
        alert("Vui lòng nhập giá trị!");
        resolve(false);
      }

      var iKhoa = keywordArray.indexOf(keyword);
      if (iKhoa >= 0) {
        alert("Từ khóa đã tồn tại: Dòng " + iKhoa);
        resolve(false);
      }
      resolve(true);
    });
  },
})