var ResponseManager = require("../model/responsemanager.js");
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var Connection = require("../model/connection.js");
var Usuario = require("../model/usuario.js");
var FileManager = require("../model/filemanager.js");
//Clase Solicitud
var Solicitud = function () {

    //Obteniendo recursos
    this.mysql = require("mysql");
    
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
          setTimeout(function() {connection.end();}, 1000);
          
        });
    };
    
    this.insertar = function (dataSolicitud, files, responseCallback) {
        if (Object.keys(files).length > 0) {
          var fileManager = new FileManager("../public/uploads/", files);
            fileManager.saveFiles(function (filesPath, errFiles) {
                if (!errFiles) {
                        dataSolicitud.urlArchivo = filesPath[0].path;
                        insertarSolicitud(dataSolicitud, responseCallback);
                    }
                }, []);
            } else {
                dataSolicitud.urlArchivo = "";
                insertarSolicitud(dataSolicitud, responseCallback);
            }
            
            
    }
        
    function insertarSolicitud(dataSolicitud, responseCallback) {
        
        instance.crearConexion(function (connection) {
           var sql = "CALL InsertarPeticionServicio (" + dataSolicitud.idEmpresa + "," + dataSolicitud.idServicio + ",'" + dataSolicitud.txtRequerimiento + "','" + dataSolicitud.urlArchivo + "','" + dataSolicitud.tituloSolicitud + "')"; 
           connection.query(sql, function(err, rows) {
               var responseManager = new ResponseManager();
               if (err) {
                    responseManager.error = err;
                   console.log(responseManager.error);
                   responseCallback(responseManager);
                } else {
                    responseManager.error = "NO_ERROR";
                    responseManager.object = dataSolicitud;
                    responseCallback(responseManager);
                }
                   
               });
               
           });
    }
    
    this.respuestaSolicitud = function(respuestaData, files, responseCallback) {
        if (Object.keys(files).length > 0) {
          var fileManager = new FileManager("../public/uploads/", files);
            fileManager.saveFiles(function (filesPath, errFiles) {
                if (!errFiles) {
                        respuestaData.urlArchivo = filesPath[0].path;
                        insertarRespuestaSolicitud(respuestaData, responseCallback);
                    }
                }, []);
            } else {
                respuestaData.urlArchivo = "";
                insertarRespuestaSolicitud(respuestaData, responseCallback);
            }
        
    }
    
    function insertarRespuestaSolicitud(respuestaData, responseCallback) {
        instance.crearConexion(function (connection) {
           var sql = "CALL InsertarRespuestaPeticionServicio(" + respuestaData.idSolicitud + ", " + respuestaData.idEmpresa + "," + respuestaData.idServicio + ",'" + respuestaData.textRequerimiento + "','" + respuestaData.urlArchivo + "','" + respuestaData.tituloSolicitud + "')"; 
           connection.query(sql, function (err, rows) {
               var responseManager = new ResponseManager();
               if (err) {
                    responseManager.error = err;
                   console.log(responseManager.error);
                   responseCallback(responseManager);
                } else {
                    responseManager.error = "NO_ERROR";
                    responseManager.object = respuestaData;
                    responseCallback(responseManager);
                }
           });
        });
    }
    
    this.getRespuestaSolicitud = function (idSolicitud, responseCallback) {
        instance.crearConexion(function (connection) {
           var sql = "CALL GetRespuestasSolicitud(" + idSolicitud + ")"; 
           connection.query(sql, function (err, rows) {
               var responseManager = new ResponseManager();
               if (err) {
                    responseManager.error = err;
                   console.log(responseManager.error);
                   responseCallback(responseManager);
                } else {
                    responseManager.error = "NO_ERROR";
                    responseManager.object = rows;
                    responseCallback(responseManager);
                }
           });
        });
    }
    
    this.get = function(idEmpresa, responseCallback) {
        instance.crearConexion(function (connection) {
            var sql = "CALL getPeticionServiciosPorEmpresa(" + idEmpresa + ");";
            connection.query(sql, function (err, rows) {
                var responseManager = new ResponseManager();
                       if (err) {
                            responseManager.error = err;
                           console.log(responseManager.error);
                           responseCallback(responseManager);
                        } else {
                            responseManager.error = "NO_ERROR";
                            responseManager.object = rows[0];
                            responseCallback(responseManager);
                        }
            });
        });
    }
    
    this.getAll = function(responseCallback) {
        instance.crearConexion(function (connection) {
            var sql = "CALL getAllPeticiones();";
            connection.query(sql, function (err, rows) {
                var responseManager = new ResponseManager();
                       if (err) {
                            responseManager.error = err;
                           console.log(responseManager.error);
                           responseCallback(responseManager);
                        } else {
                            responseManager.error = "NO_ERROR";
                            responseManager.object = rows[0];
                            responseCallback(responseManager);
                        }
            });
        });
    }
    
    this.getSolicitud = function(idSolicitud, responseCallback) {
        instance.crearConexion(function (connection) {
            var sql = "CALL getPeticionServiciosPorSolicitud(" + idSolicitud + ");";
            connection.query(sql, function (err, rows) {
                var responseManager = new ResponseManager();
                       if (err) {
                            responseManager.error = err;
                           console.log(responseManager.error);
                           responseCallback(responseManager);
                        } else {
                            responseManager.error = "NO_ERROR";
                            responseManager.object = rows[0];
                            responseCallback(responseManager);
                        }
            });
        });
    }
    
    this.delete = function(idSolicitud, responseCallback) {
        instance.crearConexion(function (connection) {
            var sql = "CALL EliminarSolicitud(" + idSolicitud + ");";
            connection.query(sql, function (err, rows) {
                var responseManager = new ResponseManager();
                       if (err) {
                            responseManager.error = err;
                           console.log(responseManager.error);
                           responseCallback(responseManager);
                        } else {
                            responseManager.error = "NO_ERROR";
                            responseManager.object = "Solicitud Eliminada con Exito";
                            responseCallback(responseManager);
                        }
            });
        });
    }
     
    var instance = this;
}

module.exports = Solicitud;