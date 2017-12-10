var JSZip = require("jszip");
//Clase FileManager
var FileManager = function (pathForFiles, files) {
    var pathData = "/opt/data";
    this.fs = require("fs");
    this.path = require('path');
    this.pathForFiles = pathForFiles;
    this.files = getAsArray(files);
    this.saveFiles = function (callback, filesPath) {
        console.log("instance.files.length:"+instance.files.length);
        if (instance.files.length > 0) {
            var file = instance.files.pop();

            instance.fs.readFile(file.path, function (err, data) {

                var ext = file.name.split(".")[1];
                var filePath = guid() + "." + ext;
                var dirPath = __dirname;
                var pathForFiles = instance.pathForFiles;
                if (pathData != null && pathData == "/opt/data") {
                    dirPath = pathData;
                    pathForFiles = instance.pathForFiles.replace("../", "");
                    console.log(pathData);
                }
                var fullpath = instance.path.join(dirPath, pathForFiles + filePath);
                instance.fs.writeFile(instance.path.join(dirPath, pathForFiles + filePath), data, function (errW) {
                                        if(!errW) {
                                            filesPath.push({path:instance.pathForFiles.replace("../public","") + filePath, name:file.name});
                                            instance.saveFiles(callback, filesPath);
                                        } else {
                                            console.log("files Error");
                                            console.log(errW);
                                            console.log(filesPath);
                                            callback(filesPath, errW);
                                        }

                                    });
            });
        } else {
            console.log("files");
            console.log(filesPath ? filesPath.length >0 ? filesPath : null : null);
            callback(filesPath ? filesPath.length >0 ? filesPath : null : null, null);
        }
    }

    this.saveAndZipFiles = function (callback, filesPath) {
        console.log("instance.files.length:"+instance.files.length);
        if (instance.files.length > 0) {
            var file = instance.files.pop();

            instance.fs.readFile(file.path, function (err, data) {

                var ext = file.name.split(".")[1];
                var filePath = guid() + "." + ext;
                var dirPath = __dirname;
                var pathForFiles = instance.pathForFiles;
                if (pathData != null && pathData == "/opt/data") {
                    dirPath = pathData;
                    pathForFiles = instance.pathForFiles.replace("../", "");
                    console.log(pathData);
                }
                var fullpath = instance.path.join(dirPath, pathForFiles + filePath);
                console.log(fullpath);
                instance.fs.writeFile(fullpath, data, function (errW) {
                                        if(!errW) {
                                            filesPath.push({path:instance.pathForFiles.replace("../public","") + filePath, name:file.name, localPath: instance.path.join(dirPath, pathForFiles + filePath)});
                                            instance.saveAndZipFiles(callback, filesPath);
                                        } else {
                                            console.log("files Error");
                                            console.log(errW);
                                            console.log(filesPath);
                                            callback(filesPath, errW);
                                        }

                                    });
            });
        } else {
            console.log("files");
            console.log(filesPath ? filesPath.length >0 ? filesPath : null : null);

            if (filesPath && filesPath.length > 0) {
              var zip = new JSZip();
              for (var index = 0; index < filesPath.length; index++) {
                var fileAdded = filesPath[index];
                console.log("File to zip:");
                console.log(fileAdded);
                zip.file(fileAdded.name, instance.fs.createReadStream(fileAdded.localPath));
              }

              var dirPath = __dirname;
              var pathForFiles = instance.pathForFiles;
              if (pathData != null && pathData == "/opt/data") {
                  dirPath = pathData;
                  pathForFiles = instance.pathForFiles.replace("../", "");
                  console.log(pathData);
              }

              var zipfilename = guid() + ".zip";
              var zipfilepath = instance.path.join(dirPath, pathForFiles + zipfilename);

              zip.generateNodeStream({type:'nodebuffer',streamFiles:true})
              .pipe(instance.fs.createWriteStream(zipfilepath))
              .on('finish', function () {
                // JSZip generates a readable stream with a "end" event,
                // but is piped here in a writable stream which emits a "finish" event.
                callback([{path: instance.pathForFiles.replace("../public","") + zipfilename}], null);
              });

            } else {
                callback(filesPath ? filesPath.length >0 ? filesPath : null : null, null);
            }

        }
    }

    this.saveBase64 = function(base64Image, callback) {
        var filePath = guid() + ".png";
        var dirPath = __dirname;
        var pathForFiles = instance.pathForFiles;
        if (pathData != null && pathData == "/opt/data") {
            dirPath = pathData;
            pathForFiles = instance.pathForFiles.replace("../", "");
            console.log(pathData);
        }
        instance.fs.writeFile(instance.path.join(dirPath, pathForFiles + filePath), base64Image, 'base64', function(err) {
          if (!err) {
              var publicFile = instance.pathForFiles.replace("../public","") + filePath;
              console.log("publicFile:" + publicFile);
              callback(publicFile);
          }
        });
    }

    var instance = this;

}

function guid() {
          function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
          }
          return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

function getAsArray(obj) {
   var objArray = [];
   for(var key in obj){
      objArray.push(obj[key]);
   }
   return objArray;
}

module.exports = FileManager;
