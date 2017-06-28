var ResponseManager = require("../model/responsemanager.js");
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var Connection = require("../model/connection.js");
var Usuario = require("../model/usuario.js");
var qrCode = require('qrcode-npm');
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
    
    this.insertar = function (data, prevIdEmpresa,responseCallback) {
        
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
                            responseManager.error = "NO_ERROR";
                            responseManager.object = data;
                            responseCallback(responseManager);
                        }
                    });
                }
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
                                var hasDenunciaServicio = false;
                                if (data.idUsuarioDenuncia >= 0) {
                                    hasDenunciaServicio = true;
                                }
                                var shouldInsertDenuncia = false;
                                var indexServicioDenuncia = data.servicios.indexOf(7);
                                if (indexServicioDenuncia != -1) {
                                    //agregando
                                    data.servicios = removeFromArray(indexServicioDenuncia, data.servicios);
                                    shouldInsertDenuncia = true;
                                }
                                
                                if (data.servicios.length > 0) {
                                    insertarServiciosAEmpresas(data.idEmpresa, data.servicios, function () {
                                        if (shouldInsertDenuncia && !hasDenunciaServicio) {
                                                data.usuarioData = {};
                                                data.usuarioData.email = data.email;
                                                data.usuarioData.tipo = data.tipo;
                                                data.usuarioData.nombres = data.nombre;
                                                data.usuarioData.password = Math.random().toString(36).slice(-22);
                                                data.servicios = [7];
                                                instance.insertar(data, data.idEmpresa, responseCallback);    
                                        } else {
                                            if (!shouldInsertDenuncia && hasDenunciaServicio) {
                                                setEmpresaDenuncia(data.idEmpresa, -1, function() {
                                                   instance.delete(data.idUsuarioDenuncia, responseCallback); 
                                                });
                                            } else {
                                                responseManager.error = "NO_ERROR";
                                                responseManager.object = data;
                                                responseCallback(responseManager);
                                            }
                                        }
                                    });
                                }
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
        var empresa = copyFields(data[0],["id", "ciudad","idUsuario","logo","nit","nombre","idUsuarioDenuncia","email","password","tipo"]);
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
    
    this.getQRCode = function(id, responseCallback) {
        instance.crearConexion(function(connection) {
           var sql = "CALL GetQRCodeData("+id+")";
           connection.query(sql, function (err, rows) {
               var responseManager = new ResponseManager();
                if (err) {
                    responseManager.error = err;
                   console.log(responseManager.error);
                   responseCallback(responseManager);
                } else {
                    if (rows.length > 0 && rows[0].length > 0) {
                        responseManager.error = "NO_ERROR";
                        console.log(rows);
                        //Haciendo el QRCode
                        var qr = qrCode.qrcode(4, 'M');
                        qr.addData(rows[0][0].password);
                        qr.make();
                        responseManager.object = qr.createImgTag(4);
                        responseCallback(responseManager);
                     } else {
                         responseManager.error = "NO_ERROR";
                         responseManager.object = "";
                         responseCallback(responseManager);
                     }
                    
                }
           });
        });
    }
    
    var instance = this;
}

module.exports = Empresa;