var ResponseManager = require("../model/responsemanager.js");
var Connection = require("../model/connection.js");
var FileManager = require("../model/filemanager.js");

//Clase DecrimData
var DecrimData = function () {
    //Obteniendo recursos
    this.mysql = require("mysql");
    this.fs = require("fs");
    this.path = require('path');
    var connection = new Connection();
    
    var connParams = connection.getConnParams();
    
    //funciones
    this.crearConexion = function (conexionCreada) {
        var connection = instance.mysql.createConnection(connParams);
        connection.connect(function(err) {
          if (err) {
            console.error('error connecting: ' + err.stack);
            conexionCreada(null);
            return;
          }
        
          console.log('connected as id ' + connection.threadId);
          conexionCreada(connection);
          connection.end();
        });
    }
    
    this.insertar = function(decrimData, responseCallback) {
        instance.crearConexion(function (connection) {
           if (connection) {
               var sqlInsert = "CALL InsertarDecrimValidacion("+decrimData.idCaso+",'"+decrimData.nombres+"','"+decrimData.apellidos+"','"+decrimData.numDocumento+"','"+decrimData.fechaNacimiento+"','"+decrimData.sexo+"','"+decrimData.rh+"','"+decrimData.huella+"')";
               connection.query(sqlInsert, function (err, rows) {
                   var responseManager = new ResponseManager();
                    if (err) {
                        responseManager.error = err;
                        responseCallback(responseManager);   
                    } else {
                        responseManager.object = decrimData;
                        responseManager.error = "NO_ERROR";            
                        responseCallback(responseManager);
                    }
               });
           } 
        });
    }
    
    this.insertarArchivo = function (decrimData, files, responseCallback) {
        console.log("Files");
        console.log(files);
        if (Object.keys(files).length > 0) {
            console.log("hay archivos");
            var fileManager = new FileManager("../public/uploads/", files);
            fileManager.saveFiles(function (filesPath, err) {
                    instance.crearConexion(function (connection) {
                        if (connection) {
                            var sqlInsert = "CALL InsertarDecrimValidacionArchivo("+decrimData.idCaso+",'"+decrimData.nombre+"','"+filesPath[0].path+"')";
                            connection.query(sqlInsert, function (err, rows) {
                               var responseManager = new ResponseManager();
                                if (err) {
                                    responseManager.error = err;
                                    responseCallback(responseManager);   
                                } else {
                                    responseManager.object = decrimData;
                                    responseManager.error = "NO_ERROR";            
                                    responseCallback(responseManager);
                                }
                           });
                        }
                    })
            }, []);
        }
    }
    
    this.getDecrimData = function (idCaso, responseCallback) {
        instance.crearConexion(function (connection) {
            
            if (connection) {
                
                var sqlUpdate = "CALL GetDecrimValidacion("+idCaso+");";
                 connection.query(sqlUpdate, function(err, rows) {
                            var responseManager = new ResponseManager();
                            if (err) {
                                responseManager.error = err;
                                responseCallback(responseManager);   
                            } else {
                                responseManager.object = rows[0];
                                responseManager.error = "NO_ERROR";            
                                responseCallback(responseManager);
                            }
                 });
                
            }
        });
    }
    
    this.getAllDecrimData = function (responseCallback) {
        instance.crearConexion(function (connection) {
            
            if (connection) {
                
                var sqlUpdate = "select * from DecrimValidacion";
                 connection.query(sqlUpdate, function(err, rows) {
                            var responseManager = new ResponseManager();
                            if (err) {
                                responseManager.error = err;
                                responseCallback(responseManager);   
                            } else {
                                responseManager.object = rows;
                                responseManager.error = "NO_ERROR";            
                                responseCallback(responseManager);
                            }
                 });
                
            }
        });
    }
    
    this.getDecrimDataFiles = function (idCaso, responseCallback) {
        instance.crearConexion(function (connection) {
            
            if (connection) {
                
                var sqlUpdate = "select * from DecrimValidacionArchivos where idCaso = " + idCaso;
                 connection.query(sqlUpdate, function(err, rows) {
                            var responseManager = new ResponseManager();
                            if (err) {
                                responseManager.error = err;
                                responseCallback(responseManager);   
                            } else {
                                responseManager.object = rows;
                                responseManager.error = "NO_ERROR";            
                                responseCallback(responseManager);
                            }
                 });
                
            }
        });
    }
    
    
    var instance = this;
}

module.exports = DecrimData;