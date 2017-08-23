var ResponseManager = require("../model/responsemanager.js");
var Connection = require("../model/connection.js");
var FileManager = require("../model/filemanager.js");

//Clase Clientes
var Clientes = function () {
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
    
    this.update = function (bannersData, files, responseCallback) {
        console.log("Files");
        console.log(files);
        if (Object.keys(files).length > 0) {
            console.log("hay archivos");
            var fileManager = new FileManager("../public/uploads/", files);
            fileManager.saveFiles(function (filesPath, err) {
                    updateDataBanners(bannersData, filesPath[0].path, responseCallback);
            }, []);
        } else {
            console.log("No hay archivos No");
            updateDataBanners(bannersData, "", responseCallback);
        }
    }
    
    function updateDataBanners(bannersData, path, responseCallback) {
        instance.crearConexion(function (connection) {
            
                if (connection) {
                    var urlImage = path.length > 0 ? "urlImage = '" + path + "'," : "";
                    var sqlUpdate = "update ClientesBanners set " + urlImage + "url = '" + bannersData.url + "' where id = " + bannersData.id + ";";
                    var sqlUpdate = "insert into ClientesBanners (urlImage, url) values ('"+urlImage+"','"+bannersData.url+"');";
                    console.log(sqlUpdate);
                     connection.query(sqlUpdate, function(err, rows) {
                                var responseManager = new ResponseManager();
                                if (err) {
                                    responseManager.error = err;
                                    responseCallback(responseManager);   
                                } else {
                                    responseManager.object = bannersData;
                                    responseManager.error = "NO_ERROR";            
                                    responseCallback(responseManager);
                                }
                     });
                    
                }
            });
    }
    
    this.getBanner = function (bannersData, responseCallback) {
        instance.crearConexion(function (connection) {
            
            if (connection) {
                
                var sqlUpdate = "select * from ClientesBanners where id = " + bannersData.id + ";";
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
    
    this.getBanners = function (bannersData, responseCallback) {
        instance.crearConexion(function (connection) {
            
            if (connection) {
                
                var sqlUpdate = "select * from ClientesBanners";
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
    
    this.eliminar = function (idBanner, responseCallback) {
        instance.crearConexion(function (connection) {
            
            if (connection) {
                
                var sqlUpdate = "delete from ClientesBanners where id = " + idBanner + ";";
                 connection.query(sqlUpdate, function(err, rows) {
                            var responseManager = new ResponseManager();
                            if (err) {
                                responseManager.error = err;
                                responseCallback(responseManager);   
                            } else {
                                responseManager.object = idBanner;
                                responseManager.error = "NO_ERROR";            
                                responseCallback(responseManager);
                            }
                 });
                
            }
        });
    }
    
    var instance = this;
}

module.exports = Clientes;