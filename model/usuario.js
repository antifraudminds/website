var ResponseManager = require("../model/responsemanager.js");
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
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
    
    this.sendContacto = function (data, responseCallback) {
        sendContactoFunc(data);
        var responseManager = new ResponseManager();
        responseManager.error = "NO_ERROR";
        responseManager.object = "El contacto enviado"; 
    }
    
    function sendContactoFunc(data) {
        var email = "info@upli.co";
        /*var smtpConfig = {
            host: 'smtp.office365.com',
            port: 587,
            secure: true, // use SSL
            auth: {
                user: 'developer@upli.co',
                pass: 'D1m3t1l102938.'
            }
        };*/
        var smtpConfig = {
            service:'gmail',
            auth: {
                user: 'uplideveloper@gmail.com',
                pass: 'D1m3t1l102938.'
            }
        };
        
        var transporter = nodemailer.createTransport(smtpConfig);
        //var transporter = nodemailer.createTransport(smtpTransport(smtpConfig));
        console.log(transporter);
        if (transporter) {
            console.log("enviando correo");
            transporter.sendMail(
                {
                    from:"uplideveloper@gmail.com",
                    to:email,
                    subject: 'Contacto desde Upli.co ✔',
                    html:"<b>Nombres:</b> " + data.FirstName + "<b>Apellidos:</b> " + data.LastName + "<b>Asunto:</b> " + data.subject + "<b>Comentarios:</b> " + data.comment
                }, function (errEmail, response) {
                    console.log("Estatus correo.....");
                    console.log(errEmail);
                    console.log(response);
                });
        }
    }
    
    function sendEmail(email, password, responseCallback) {
        console.log(email);
        console.log(password);
        var mailManager = new GMailManager();
        var mensajeData = mailManager.buildEmailMessage("Antifraudminds <info@antifraudminds.com>",email,"Recuperación de Contraseña - www.antifraudminds.com","Los datos de inicio de sesión son: usuario:" + email + " password:" + password);
        mailManager.sendEmail(mensajeData, responseCallback);
    }
    
    var instance = this;

}

module.exports = Usuario;

