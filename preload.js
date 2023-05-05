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

//Student
contextBridge.exposeInMainWorld('Student', {
  Student_OpenFolder: (studentID, batchName) => {
    const fs = require("fs");
    var folderPath = path.join(__dirname, '../StudentPhoto/', batchName + " - " + studentID);
    if (!fs.existsSync(folderPath)) {
      alert("Không tìm thấy thư mục theo đường dẫn: " + folderPath + ", vui lòng kiểm tra lại");
      return;
    }
    require('child_process').exec('start "" "' + folderPath + '"');
  },
  
  StudentDownloadFile: async () => {
     const url = common.apiPath +'/api/ExportExcelStudentPhoto'
     ipcRenderer.send('download-item', {url: url}) 
  },


  Student_GetApiKey: () => {
    return new Promise((resolve, reject) => {
      var request = require('request');
      var options = {
        'method': 'POST',
        'url': common.apiPath + '/Api/AppChupHinh_GetApiKey',
        'headers': {
        },
        formData: {
        }
      };

      request(options, function (error, response) {
        if (error) reject(error);
        resolve(response.body)
      });
    });
  },

  Student_GetByStudentID: (studentID, key) => {
    return new Promise((resolve, reject) => {
      var request = require('request');
      var options = {
        'method': 'POST',
        'url': common.apiPath + '/Api/GetStudentByStudentID',
        'headers': {
        },
        formData: {
          'studentID': studentID,
          'key': key,
        }
      };

      request(options, function (error, response) {
        if (error) reject(error);
        if(response == "" || response == undefined){
          resolve({
            result : "OK"
          });
          return;
        }
        resolve(response.body)
        return;
      });
    });
  },

  Student_UploadPhoto: (studentID, photo, key, typeUser = "hocsinh", studentName = "", batchName = "", courseID = "", batchID = "", isUploadPhoto = 0) => {
    return new Promise((resolve, reject) => {
      const fs = require("fs");
      var folderPath = path.join(__dirname, '../StudentPhoto/', batchName + " - " + studentID);
      var fileName = studentName + "";
      var fileNameLocal = studentName + ".jpg";
      var pathFile = path.join(folderPath,fileNameLocal);
      if (typeUser == "cha") {
        fileName = studentName + "1";
        fileNameLocal = studentName + "1.jpg";
        pathFile = path.join(folderPath, fileNameLocal);
      }
      if (typeUser == "me") {
        fileName = studentName + "2";
        fileNameLocal = studentName + "2.jpg";
        pathFile = path.join(folderPath, fileNameLocal);
      }
      if (typeUser == "baoho") {
        fileName = studentName + "3";
        fileNameLocal = studentName + "3.jpg";
        pathFile = path.join(folderPath, fileNameLocal);
      }

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      const buffer = Buffer.from(photo, "base64");
      fs.writeFileSync(pathFile, buffer);

      var request = require('request');
      var options = {
        'method': 'POST',
        'url': common.apiPath + '/Api/UploadAvatarByStudentID',
        'headers': {
        },
        formData: {
          'studentID': studentID,
          'photo': photo,
          'key': key,
          'LastOperator': 'AppChupHinh', 
          'typeUser' : typeUser,
          'filename' : fileName,
          'courseID' : courseID,
          'batchID' : batchID,
          'isUploadPhoto': isUploadPhoto,
        }
      };
      request(options, function (error, response) {
        if (error) reject(error);
        if(response == "" || response == undefined){
          resolve({
            result : "OK"
          });
          return;
        }
        resolve(response.body)
        return;
      });
    });
  },

  Student_UploadPhotoFromFile: (studentID, photo, key, typeUser = "hocsinh", studentName = "", batchName = "", courseID = "", batchID = "", isUploadPhoto = 0) => {
    return new Promise((resolve, reject) => {
      const fs = require("fs");
      var fileName = studentName + "";
      if (typeUser == "cha") {
        fileName = studentName + "1";
      }
      if (typeUser == "me") {
        fileName = studentName + "2";
      }
      if (typeUser == "baoho") {
        fileName = studentName + "3";
      }

      var request = require('request');
      var options = {
        'method': 'POST',
        'url': common.apiPath + '/Api/UploadAvatarByStudentID',
        'headers': {
        },
        formData: {
          'studentID': studentID,
          'photo': photo,
          'key': key,
          'LastOperator': 'AppChupHinh', 
          'typeUser' : typeUser,
          'filename' : fileName,
          'courseID' : courseID,
          'batchID' : batchID,
          'isUploadPhoto': isUploadPhoto,
        }
      };

      request(options, function (error, response) {
        if (error) reject(error);
        if(response == "" || response == undefined){
          resolve({
            result : "OK"
          });
          return;
        }
        resolve(response.body)
        return;
      });
    });
  },
})