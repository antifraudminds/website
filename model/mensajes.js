var ResponseManager = require("../model/responsemanager.js")
var Connection = require("../model/connection.js")
var GMailManager = require("../model/gmailmanager.js")
//Clase Mensaje
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
                                sendEmail(mensajeData, function() {
                                    responseCallback(responseManager);    
                                });
                            }
                 });
            }
        });
        
    }
    
    this.insertComentarioCliente = function (mensajeData, responseCallback) {
        instance.crearConexion(function (connection) {
            
            if (connection) {
                
                var sqlInsert = "insert into ComentariosCliente (cliente, comentario) values ('"+mensajeData.cliente+"','"+mensajeData.comentario+"');";
                 connection.query(sqlInsert, function(err, rows) {
                            var responseManager = new ResponseManager();
                            if (err) {
                                responseManager.error = err;
                                responseCallback(responseManager);   
                            } else {
                                responseManager.object = mensajeData;
                                responseManager.error = "NO_ERROR";
                                sendEmailClienteComentario(mensajeData, function() {
                                    responseCallback(responseManager);    
                                });
                            }
                 });
            }
        });
        
    }
    
    function sendEmail(data, responseCallback) {
        instance.crearConexion(function (connection) {
           if (connection) {
               connection.query("CALL getNotificaciones()", function (err, rows) {
                        var emails = rows[0]; 
                        var emailsTosend = [];
                        for (var index = 0; index < emails.length; index++) {
                            emailsTosend.push(emails[index].email);
                        }
                        var mailManager = new GMailManager();
                        var empresa = data.nombreEmpresa != null ? "<b>Empresa: </b>" + data.nombreEmpresa + "<br>" : "";
                        var mensaje = "Enviado por <b>" + data.nombre + "</b><br>"+empresa+"<b>Email: </b>"+data.email + "<br><b>Fecha: </b>" + new     Date()+"<br><br>" + data.mensaje;
                        var mensajeData = mailManager.buildEmailMessage("developer.aminds@gmail.com", emailsTosend, "Enviado por cliente desde AntifraudMinds.com " + data.asunto, mensaje);
                        mailManager.sendEmail(mensajeData, responseCallback);
                });
                }
            });
    }
    
    function sendEmailClienteComentario(data, responseCallback) {
        instance.crearConexion(function (connection) {
           if (connection) {
               connection.query("CALL getNotificaciones()", function (err, rows) {
                        var emails = rows[0]; 
                        var emailsTosend = [];
                        for (var index = 0; index < emails.length; index++) {
                            emailsTosend.push(emails[index].email);
                        }
                        var mailManager = new GMailManager();
                        var mensaje = "Enviado por <b>" + data.cliente + "</b><br>" + data.comentario;
                        var mensajeData = mailManager.buildEmailMessage("developer.aminds@gmail.com", emailsTosend, "Enviado por cliente desde AntifraudMinds.com " + "Comentario de un cliente", mensaje);
                        mailManager.sendEmail(mensajeData, responseCallback);
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