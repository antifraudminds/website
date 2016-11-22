var ResponseManager = require("../model/responsemanager.js");
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var Connection = require("../model/connection.js");
var Usuario = require("../model/usuario.js");
//Clase Empresa
var Empresa = function () {

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
        //insertar Usuario
        var usuario = new Usuario();
        usuario.insertarUsuario(data.usuarioData, function (rm) {
           var idUsuario = rm.object;
           data.idUsuario = idUsuario;
           instance.crearConexion(function (connection) {
            //console.log(connection);
            if (connection) {
                
                var sqlInsert = "CALL InsertarEmpresa('"+data.nombre+"','"+data.nit+"','"+data.ciudad+"','"+data.logo+"', "+data.idUsuario+")";
                console.log(sqlInsert);
                connection.query(sqlInsert, function(err, rows) {
                        var responseManager = new ResponseManager();
                        if (err) {
                            responseManager.error = err;
                           console.log(responseManager.error);
                           responseCallback(responseManager);
                        } else {
                            console.log("Empresa Insertada");
                            if (data.servicios.length > 0) {
                                var indexServicioDenuncia = data.servicios.indexOf(7);
                                if (indexServicioDenuncia != -1) {
                                    data.servicios.pop();
                                }
                                instance.crearConexion(function (connServicios) {
                                    var sqlInsertEmpresas = "CALL InsertarServiciosAEmpresas ("+rows[0][0].id+",'"+data.servicios.join(",")+"')";
                                    connServicios.query(sqlInsertEmpresas, function (err, rows) {
                                        responseManager.error = "NO_ERROR";
                                        responseManager.object = data;
                                        responseCallback(responseManager);
                                    });
                                });
                            }
                        }
                     
                    });
                }
            });
        });
        
    }
    
    this.update = function (data, responseCallback) {
        
           instance.crearConexion(function (connection) {
            //console.log(connection);
            if (connection) {
                
                var sqlInsert = "CALL ModificarEmpresa("+data.idEmpresa+",'"+data.nombre+"','"+data.nit+"','"+data.ciudad+"','"+data.logo+"')";
                console.log(sqlInsert);
                connection.query(sqlInsert, function(err, rows) {
                        var responseManager = new ResponseManager();
                        if (err) {
                            responseManager.error = err;
                           console.log(responseManager.error);
                           responseCallback(responseManager);
                        } else {
                            console.log("Empresa Modificada");
                            if (data.servicios.length > 0) {
                                instance.crearConexion(function (connServicios) {
                                    var sqlInsertEmpresas = "CALL InsertarServiciosAEmpresas ("+data.idEmpresa+",'"+data.servicios.join(",")+"')";
                                    connServicios.query(sqlInsertEmpresas, function (err, rows) {
                                        responseManager.error = "NO_ERROR";
                                        responseManager.object = data;
                                        responseCallback(responseManager);
                                    });
                                });
                            }
                        }
                     
                    });
                }
            });
    }
    
    this.delete = function(idEmpresa, responseCallback) {
        instance.crearConexion(function(connection) {
           var sql = "CALL EliminarEmpresa("+idEmpresa+")";
           console.log(sql);
           connection.query(sql, function (err, rows) {
               var responseManager = new ResponseManager();
                if (err) {
                    responseManager.error = err;
                   console.log(responseManager.error);
                   responseCallback(responseManager);
                } else {
                    responseManager.error = "NO_ERROR";
                    responseManager.object = idEmpresa + " Eliminada.";
                    responseCallback(responseManager);
                }
           });
        });
    }
    
     this.get = function(idEmpresa, responseCallback) {
        instance.crearConexion(function(connection) {
           var sql = "CALL getEmpresa("+idEmpresa+")";
           console.log(sql);
           connection.query(sql, function (err, rows) {
               var responseManager = new ResponseManager();
                if (err) {
                    responseManager.error = err;
                   console.log(responseManager.error);
                   responseCallback(responseManager);
                } else {
                    responseManager.error = "NO_ERROR";
                    responseManager.object = groupDataByIdEmpresaQuery(rows[0], idEmpresa);
                    responseCallback(responseManager);
                }
           });
        });
    }
    
    this.getAll = function(responseCallback) {
        instance.crearConexion(function(connection) {
           var sql = "CALL getEmpresasDatos()";
           connection.query(sql, function (err, rows) {
               var responseManager = new ResponseManager();
                if (err) {
                    responseManager.error = err;
                   console.log(responseManager.error);
                   responseCallback(responseManager);
                } else {
                    responseManager.error = "NO_ERROR";
                    responseManager.object = groupDataByIdEmpresa(rows[0]);
                    responseCallback(responseManager);
                }
           });
        });
    }
    
    function groupDataByIdEmpresaQuery(data, idEmpresaRequired) {
        var empresa = copyFields(data[0],["id", "ciudad","idUsuario","logo","nit","nombre"]);
        empresa.servicios = getServicios(data, empresa.id);
        return empresa;
    }
    
    function groupDataByIdEmpresa(data) {
        var empresas = [];
        var idAdded = [];
        for (var i=0; i < data.length; i++) {
            if (idAdded.indexOf(data[i].id) == -1) {
                var empresa = copyFields(data[i],["id", "ciudad","idUsuario","logo","nit","nombre"]);
                empresa.servicios = getServicios(data, empresa.id);
                idAdded.push(empresa.id);
                empresas.push(empresa);
            }
        }
        return empresas;
    }
    
    function copyFields(obj, fields) {
        var newobj = {};
        for (var i = 0; i < fields.length; i++) {
            newobj[fields[i]] = obj[fields[i]];
        }
        return newobj;
    }
    
    function getServicios(data, idEmpresa) {
        var servicios = [];
        for (var i=0; i < data.length; i++) {
            if (data[i].id == idEmpresa) {
                servicios.push({idServicio:data[i].idServicio, nombreServicio:data[i].nombreServicio, numeroUso:data[i].numeroUso});
            }
        }
        return servicios;
    }
    
    var instance = this;
}

module.exports = Empresa;