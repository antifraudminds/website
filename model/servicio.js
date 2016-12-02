var ResponseManager = require("../model/responsemanager.js");
var Connection = require("../model/connection.js");
//Clase Servicio
var Servicio = function () {

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
    
    this.insertar = function (data, responseCallback) {
        instance.crearConexion(function (connection) {
            //console.log(connection);
            if (connection) {
                //var sqlInsertUsuario = "insert into usuarios (nombre,email,password, tipo) values ('"+usuarioData.nombres+"','"+usuarioData.email+"','"+usuarioData.password+"', "+usuarioData.tipo+")";
                var sqlInsert = "CALL InsertarServicios('"+data.nombre+"')";
                console.log("Insertando servicio");
                console.log(sqlInsert);//muestro la consulta para ver que esta saliendo mal.....
                connection.query(sqlInsert, function(err, rows) {
                    var responseManager = new ResponseManager();
                    if (err) {
                        responseManager.error = err;
                       console.log(responseManager.error);
                    } else {
                        responseManager.error = "NO_ERROR";
                        responseManager.object = rows[0].id;
                    }
                     responseCallback(responseManager);
                });
            }
        });
    }
    
    this.udpate = function (data, responseCallback) {
        instance.crearConexion(function (connection) {
            //console.log(connection);
            if (connection) {
                //var sqlInsertUsuario = "insert into usuarios (nombre,email,password, tipo) values ('"+usuarioData.nombres+"','"+usuarioData.email+"','"+usuarioData.password+"', "+usuarioData.tipo+")";
                var sqlInsert = "CALL ModificarServicios("+data.id+",'"+data.nombre+"')";
                console.log("Insertando servicio");
                console.log(sqlInsert);//muestro la consulta para ver que esta saliendo mal.....
                connection.query(sqlInsert, function(err, rows) {
                    var responseManager = new ResponseManager();
                    if (err) {
                        responseManager.error = err;
                       console.log(responseManager.error);
                    } else {
                        responseManager.error = "NO_ERROR";
                        responseManager.object = data;
                    }
                     responseCallback(responseManager);
                });
            }
        });
    }
    
    this.get = function (id, responseCallback) {
        instance.crearConexion(function (connection) {
            if (connection) {
                connection.query("select * from Servicios where id = " + id, function(err, rows) {
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
    
    this.getAll = function (responseCallback) {
        instance.crearConexion(function (connection) {
            if (connection) {
                connection.query("select * from Servicios", function(err, rows) {
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
    
    this.getServiciosByEmpresa = function (idEmpresa, responseCallback) {
        instance.crearConexion(function (connection) {
            connection.query("CALL GetServiciosEmpresa(" + idEmpresa + ")", function (err, rows) {
                var responseManager = new ResponseManager();
                    if (err) {
                        responseManager.error = err;
                        
                    } else {
                        responseManager.error = "NO_ERROR";
                        responseManager.object = rows[0];
                    }
                    responseCallback(responseManager);
            });
        });
    }
    
    this.delete = function (id, responseCallback) {
        instance.crearConexion(function (connection) {
            if (connection) {
                connection.query("CALL EliminarServicios(" + id + ")", function(err, rows) {
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
    
    var instance = this;

}

module.exports = Servicio;

