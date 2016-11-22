
//Clase FileManager
var FileManager = function (pathForFiles, files) {
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
                if (process.env.OPENSHIFT_DATA_DIR != null) {
                    dirPath = process.env.OPENSHIFT_DATA_DIR;
                    pathForFiles = instance.pathForFiles.replace("../", "");
                    console.log(process.env.OPENSHIFT_DATA_DIR);
                }
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