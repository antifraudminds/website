var ResponseManager = require("../model/responsemanager.js");
var GMailManager = require("../model/gmailmanager.js");
var Connection = require("../model/connection.js");
//Clase Usuario
var Usuario = function () {

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
    }
    this.insertarUsuario = function (data, responseCallback) {
        instance.crearConexion(function (connection) {
            //console.log(connection);
            if (connection) {
                //var sqlInsertUsuario = "insert into usuarios (nombre,email,password, tipo) values ('"+usuarioData.nombres+"','"+usuarioData.email+"','"+usuarioData.password+"', "+usuarioData.tipo+")";
                var sqlInsertUsuario = "CALL InsertarUsuario('"+data.nombre+"','"+data.email+"','"+data.password+"', "+data.tipo+",'"+data.cargo+"','"+data.cedula+"',"+data.idEmpresa+")";
                console.log("Insertando Usuario");
                console.log(sqlInsertUsuario);//muestro la consulta para ver que esta saliendo mal.....
                connection.query(sqlInsertUsuario, function(err, rows) {
                    var responseManager = new ResponseManager();
                    if (err) {
                        responseManager.error = err;
                        console.log(responseManager.error);
                        responseCallback(responseManager);
                    } else {
                        var idUsuario = rows[0][0].id;
                        if (data.servicios.length > 0) {
                         insertarServiciosAUsuario(idUsuario, data.servicios, function () {
                                responseManager.error = "NO_ERROR";
                                responseManager.object = data;
                                responseCallback(responseManager);
                            });
                        } else {
                            responseManager.error = "NO_ERROR";
                            responseManager.object = data;
                            responseCallback(responseManager);
                        }
                    }
                     
                });
            }
        });
    }
    
    this.modificarUsuario = function (data, responseCallback) {
        instance.crearConexion(function (connection) {
            //console.log(connection);
            if (connection) {
                //var sqlInsertUsuario = "insert into usuarios (nombre,email,password, tipo) values ('"+usuarioData.nombres+"','"+usuarioData.email+"','"+usuarioData.password+"', "+usuarioData.tipo+")";
                var sqlUpdateUsuario = "CALL ModificarUsuario("+data.id+",'"+data.nombre+"','"+data.email+"','"+data.cargo+"','"+data.cedula+"',"+data.idEmpresa+")";
                console.log("Modificando Usuario");
                console.log(sqlUpdateUsuario);//muestro la consulta para ver que esta saliendo mal.....
                connection.query(sqlUpdateUsuario, function(err, rows) {
                    var responseManager = new ResponseManager();
                    if (err) {
                        responseManager.error = err;
                        console.log(responseManager.error);
                        responseCallback(responseManager);
                    } else {
                        var idUsuario = data.id;
                        if (data.servicios.length > 0) {
                         insertarServiciosAUsuario(idUsuario, data.servicios, function () {
                                responseManager.error = "NO_ERROR";
                                responseManager.object = data;
                                responseCallback(responseManager);
                            });
                        } else {
                            responseManager.error = "NO_ERROR";
                            responseManager.object = data;
                            responseCallback(responseManager);
                        }
                    }
                });
            }
        });
    }
    
    function insertarServiciosAUsuario(idUsuario, servicios, callback) {
        instance.crearConexion(function (connServicios) {
            var sqlInsertServicios = "CALL InsertarServiciosAUsuario ("+idUsuario+",'"+servicios.join(",")+"')";
            connServicios.query(sqlInsertServicios, function (err, rows) {
                callback();
            });
        });
    }
  
    this.obtenerUsuarios = function (responseCallback) {
        instance.crearConexion(function (connection) {
            if (connection) {
                connection.query("CALL GetUsuarios()", function(err, rows) {
                    var responseManager = new ResponseManager();
                    if (err) {
                        responseManager.error = err;
                        
                    } else {
                        responseManager.error = "NO_ERROR";
                        responseManager.object = rows[0];
                    }
                    responseCallback(responseManager);
                });
            }
        });
    }
    
    this.obtenerUsuario = function (id, responseCallback) {
        instance.crearConexion(function (connection) {
            if (connection) {
                connection.query("CALL GetUsuario("+id+")", function(err, rows) {
                    var responseManager = new ResponseManager();
                    if (err) {
                        responseManager.error = err;
                        
                    } else {
                        responseManager.error = "NO_ERROR";
                        responseManager.object = rows[0][0];
                    }
                    responseCallback(responseManager);
                });
            }
        });
    }
    
    this.authUser = function (userAuthData, responseCallback) {
        instance.crearConexion(function (connection) {
            if (connection) {
                var sql = "CALL AuthUser('" + userAuthData.email + "', '"+userAuthData.password+"');";
                console.log(sql);
                connection.query(sql, function(err, rows) {
                    var responseManager = new ResponseManager();
                    if (err) {
                        responseManager.error = err;
                    } else {
                        if (rows.length <= 0) {
                            responseManager.error = "Usuario o password incorrecto";
                        } else {
                           responseManager.error = "NO_ERROR";
                           responseManager.object = rows[0][0]; 
                        }
                    }
                    responseCallback(responseManager);
                });
            }
        });
    }
    
    this.changePass = function (userAuthData, responseCallback) {
        instance.crearConexion(function (connection) {
            if (connection) {
                var sql = "CALL ChangePass('" + userAuthData.email + "', '"+userAuthData.password+"');";
                console.log(sql);
                connection.query(sql, function(err, rows) {
                    var responseManager = new ResponseManager();
                    if (err) {
                        responseManager.error = err;
                    } else {
                       responseManager.error = "NO_ERROR";
                       responseManager.object = "Password ha cambiado con exito.";
                    }
                    responseCallback(responseManager);
                });
            }
        });
    }
    
    this.borrarUsuario = function (idUsuario, responseCallback) {
        instance.crearConexion(function (connection) {
            if (connection) {
                connection.query("CALL EliminarUsuario(" + idUsuario + ")", function(err, rows) {
                    var responseManager = new ResponseManager();
                    if (err) {
                        responseManager.error = err;
                    } else {
                       responseManager.error = "NO_ERROR";
                       responseManager.object = rows; 
                    }
                    responseCallback(responseManager);
                });
            }
        });
    }
    
    this.insertarNotificaciones = function (data, responseCallback) {
        instance.crearConexion(function (connection) {
           if (connection) {
               connection.query("CALL InsertarNotificacion('"+data.email+"','"+data.servicios+"','"+data.nombreServicios+"')", function (err, rows) {
                   var responseManager = new ResponseManager();
                    if (err) {
                        responseManager.error = err;
                        
                    } else {
                        responseManager.error = "NO_ERROR";
                       responseManager.object = rows; 
                    }
                    responseCallback(responseManager);
                });
                }
            });
    }
    
    
    this.getNotificaciones = function (responseCallback) {
        instance.crearConexion(function (connection) {
           if (connection) {
               connection.query("CALL getNotificaciones()", function (err, rows) {
                   var responseManager = new ResponseManager();
                    if (err) {
                        responseManager.error = err;
                        
                    } else {
                        responseManager.error = "NO_ERROR";
                       responseManager.object = rows[0]; 
                    }
                    responseCallback(responseManager);
                });
                }
            });
    }
    
    this.eliminarNotificacion = function (id, responseCallback) {
        instance.crearConexion(function (connection) {
            if (connection) {
                connection.query("CALL EliminarNotificacion(" + id + ")", function(err, rows) {
                    var responseManager = new ResponseManager();
                    if (err) {
                        responseManager.error = err;
                    } else {
                       responseManager.error = "NO_ERROR";
                       responseManager.object = rows; 
                    }
                    responseCallback(responseManager);
                });
            }
        });
    }
    
    this.sendNotificacion = function(solicitudData, responseCallback) {
        instance.getNotificaciones(function (rm) {
            console.log("solicitud data:");
            console.log(solicitudData);
            var notificaciones = rm.object;
            console.log("notificaciones:");
            console.log(notificaciones);
            var emails = [];
            var servicioNombre = "";
            for (var index = 0; index < notificaciones.length; index++) {
                var notificacion = notificaciones[index];
                var serviciosAsignados = notificacion.tipoServicio.split(",");
                var serviciosNombres = notificacion.nombreServicios.split(",");
                if (serviciosAsignados.indexOf("" + solicitudData.idServicio) != -1) {
                    servicioNombre = servicioNombre.length <= 0 ? findNombreServicio(solicitudData.idServicio, serviciosAsignados, serviciosNombres) : servicioNombre;
                    emails.push(notificacion.email);    
                }
            }
            
            var mailManager = new GMailManager();
            var dataMsg = "<b>Nueva solicitud creada<b><br/> <b>No. Solicitud:</b>" + solicitudData.consecutivo + "<br/><b>Servicio:</b>" + servicioNombre + "<br/><b>Titulo:</b>" + solicitudData.tituloSolicitud + "<br/><b>Texto:</b>" + solicitudData.txtRequerimiento + "<br/> Esta informaci&oacute;n puede ser observada en el Sistema de Administración de AntifraudMinds.";
            var mensajeData = mailManager.buildEmailMessage("developer.aminds@gmail.com", emails, "Solicitud de servicio creada",dataMsg);
            mailManager.sendEmail(mensajeData, responseCallback);
        });
    }
    
    function findNombreServicio(idServicio, serviciosAsignados, serviciosNombres) {
        for (var i = 0; i < serviciosAsignados.length; i++) {
            if (serviciosAsignados[i] == idServicio) {
                return serviciosNombres[i];
            }
        }
        return "";
    }
    
    this.recoverPass = function (email, responseCallback) {
        instance.crearConexion(function (connection) {
            if (connection) {
                connection.query("select * from usuarios where email = '" + email + "' and tipo = 1", function(err, rows) {
                    var responseManager = new ResponseManager();
                    if (err) {
                        responseManager.error = err;
                        responseCallback(responseManager);
                    } else {
                       if (rows.length > 0) {
                           responseManager.error = "NO_ERROR";
                           
                           responseManager.object = "contraseña enviada a su correo"; 
                           var useremail = rows[0].email;
                           var userpass = rows[0].password;
                           sendEmail(useremail, userpass, responseCallback);
                       } else {
                           responseManager.object = "Usuario no encontrado, verifique sus datos y vuelva a intentarlo.";
                           responseCallback(responseManager);
                       }
                       
                    }
                });
            }
        });
    }
    
    function sendEmail(email, password, responseCallback) {
        console.log(email);
        console.log(password);
        var mailManager = new GMailManager();
        var mensajeData = mailManager.buildEmailMessage("developer.aminds@gmail.com",email,"Recuperación de Contraseña - www.antifraudminds.com","Los datos de inicio de sesión son: usuario: " + email + " password: " + password);
        mailManager.sendEmail(mensajeData, responseCallback);
    }
    
    var instance = this;

}

module.exports = Usuario;

