var ResponseManager = require("../model/responsemanager.js")
var Connection = require("../model/connection.js")
//Clase Ingrediente
var Mensaje = function () {
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
        
          console.log('connected as id ' + connection.threadId + ' de mysql');
          conexionCreada(connection);
          connection.end();
        });
    }
    
    this.insertMensaje = function (mensajeData, responseCallback) {
        instance.crearConexion(function (connection) {
            
            if (connection) {
                
                var sqlInsert = "insert into Mensajes (nombre,email,asunto,mensaje,fecha) values ('"+mensajeData.nombre+"','"+mensajeData.email+"','"+mensajeData.asunto+"','"+mensajeData.mensaje+"',sysdate());";
                 connection.query(sqlInsert, function(err, rows) {
                            var responseManager = new ResponseManager();
                            if (err) {
                                responseManager.error = err;
                                responseCallback(responseManager);   
                            } else {
                                responseManager.object = mensajeData;
                                responseManager.error = "NO_ERROR";            
                                responseCallback(responseManager);
                            }
                 });
            }
        });
        
    }
    
    this.updateMensaje = function (mensajeData, responseCallback) {
        instance.crearConexion(function (connection) {
            
            if (connection) {
                
                var sqlUpdate = "update Mensajes set nombre = '"+mensajeData.nombre+"', email = '"+mensajeData.email+"', asunto = '"+mensajeData.asunto+"', mensaje = '"+mensajeData.mensaje+"' where id = " + mensajeData.id + ";";
                 connection.query(sqlUpdate, function(err, rows) {
                            var responseManager = new ResponseManager();
                            if (err) {
                                responseManager.error = err;
                                responseCallback(responseManager);   
                            } else {
                                responseManager.object = mensajeData;
                                responseManager.error = "NO_ERROR";            
                                responseCallback(responseManager);
                            }
                 });
                
            }
        });
        
    }
    
    this.deleteMensaje = function (mensajeData, responseCallback) {
        instance.crearConexion(function (connection) {
            
            if (connection) {
                
                var sqlUpdate = "delete from Mensajes where id = " + mensajeData.id + ";";
                 connection.query(sqlUpdate, function(err, rows) {
                            var responseManager = new ResponseManager();
                            if (err) {
                                responseManager.error = err;
                                responseCallback(responseManager);   
                            } else {
                                responseManager.object = mensajeData;
                                responseManager.error = "NO_ERROR";            
                                responseCallback(responseManager);
                            }
                 });
                
            }
        });
    }
    
    this.getMensajeById = function (mensajeData, responseCallback) {
        console.log("getting Mensajes id");
        instance.crearConexion(function (connection) {
            
            if (connection) {
                
                var sqlUpdate = "select * from Mensajes where id = " + mensajeData.id + ";";
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
    
    this.getMensaje = function (mensajeData, responseCallback) {
        console.log("getting Mensajes");
        instance.crearConexion(function (connection) {
            
            if (connection) {
                
                var sqlUpdate = "select * from Mensajes";
                console.log(sqlUpdate);
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

module.exports = Mensaje;