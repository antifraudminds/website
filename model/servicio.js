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
        connection.connect(conexionCreada);
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
    
    this.update = function (data, responseCallback) {
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
                connection.query("select id, nombre, numeracion from Servicios order by CAST(numeracion AS DECIMAL(10,1))", function(err, rows) {
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
    
    this.getEstadosDenuncias = function (responseCallback) {
        instance.crearConexion(function (connection) {
            connection.query("CALL GetEstadosDenuncias()", function (err, rows) {
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
    
    this.getServiciosByUsuario = function (idUsuario, responseCallback) {
        instance.crearConexion(function (connection) {
            connection.query("CALL GetServiciosByUsuario(" + idUsuario + ")", function (err, rows) {
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

