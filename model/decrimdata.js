var ResponseManager = require("../model/responsemanager.js");
var Connection = require("../model/connection.js");
var FileManager = require("../model/filemanager.js");

//Clase DecrimData
var DecrimData = function () {
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
    
    this.insertar = function(decrimData, responseCallback) {
        var fileManager = new FileManager("../public/uploads/", {});
               fileManager.saveBase64(decrimData.foto, function (urlFoto) {
            instance.crearConexion(function (connection) {
               if (connection) {
                   //Insertar firmar.... TODO.....
                   
                       var sqlInsert = "CALL InsertarDecrimValidacion("+decrimData.idCaso+",'"+decrimData.nombres+"','"+decrimData.apellidos+"','"+decrimData.numDocumento+"','"+decrimData.fechaNacimiento+"','"+decrimData.rh+"','"+decrimData.sexo+"','"+urlFoto+"',"+decrimData.idEmpresa+")";
                       console.log(sqlInsert);
                       connection.query(sqlInsert, function (err, rows) {
                           var responseManager = new ResponseManager();
                            if (err) {
                                responseManager.error = err;
                                responseCallback(responseManager);   
                            } else {
                                responseManager.object = decrimData;
                                responseManager.error = "NO_ERROR";            
                                responseCallback(responseManager);
                            }
                       });
               } 
            });
        });
    }
    
    this.insertarArchivo = function (decrimData, responseCallback) {
        var fileManager = new FileManager("../public/uploads/", {});
        fileManager.saveBase64(decrimData.archivoUrl, function (urlFoto) {
            instance.crearConexion(function (connection) {
                if (connection) {
                        var sqlInsert = "CALL InsertarDecrimValidacionArchivo("+decrimData.idCaso+",'"+decrimData.nombre+"','"+urlFoto+"')";
                        connection.query(sqlInsert, function (err, rows) {
                           var responseManager = new ResponseManager();
                            if (err) {
                                responseManager.error = err;
                                responseCallback(responseManager);   
                            } else {
                                responseManager.object = decrimData;
                                responseManager.error = "NO_ERROR";            
                                responseCallback(responseManager);
                            }
                       });
                    
                }
            });
        });
    }
    
    
    this.getDecrimData = function (idCaso, responseCallback) {
        instance.crearConexion(function (connection) {
            
            if (connection) {
                
                var sqlUpdate = "CALL GetDecrimValidacion("+idCaso+");";
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
    
    this.getAllDecrimData = function (idEmpresa, responseCallback) {
        instance.crearConexion(function (connection) {
            
            if (connection) {
                
                var sqlUpdate = "select * from DecrimValidacion where idEmpresa = " + idEmpresa;
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
    
    this.getDecrimDataFiles = function (idCaso, responseCallback) {
        instance.crearConexion(function (connection) {
            
            if (connection) {
                
                var sqlUpdate = "select * from DecrimValidacionArchivos where idCaso = " + idCaso;
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
    
    this.getSearchListaNegra = function (dataListaNegra, responseCallback) {
        instance.crearConexion(function (connection) {
            
            if (connection) {
                
                var sqlUpdate = "select * from ListaNegra where NumDoc = '" + dataListaNegra.NumDoc + "' or NombreCompleto='%" + dataListaNegra.NombreCompleto + "%'";
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
    
    this.createPDF = function(dataResult, responseCallback) {
        instance.crearConexion(function (connection) {
            
            if (connection) {
                
                var sqlUpdate = "select d.*,da.nombre,da.archivoUrl from DecrimValidacion as d, DecrimValidacionArchivos as da where d.idCaso = da.idCaso and d.idCaso = " + dataResult.idCaso + " order by da.nombre";
                console.log(sqlUpdate);
                 connection.query(sqlUpdate, function(err, rows) {
                     
                    var pathPdfTemplate = instance.path.join(__dirname, "../public/admin/pdf.html");
                    var identifier = (new Date()).getTime();
                    var dirName = __dirname;
                    var filenamePath = "../pdfgenerated/pdf_nuevo_" + identifier;
                    if (process.env.OPENSHIFT_DATA_DIR != null) {
                        dirName = process.env.OPENSHIFT_DATA_DIR;
                        filenamePath = "pdfgenerated/pdf_nuevo_" + identifier;
                    }
                    var pathPdfForUse = instance.path.join(dirName, filenamePath+".html");
                    var pathPdfResult = instance.path.join(dirName, filenamePath+".pdf");
                    var filename = "pdf_nuevo_"+identifier+".pdf";
                    instance.fs.createReadStream(pathPdfTemplate).pipe(instance.fs.createWriteStream(pathPdfForUse));
                    
                    instance.fs.readFile(pathPdfForUse, 'utf8', function read(err, data) {
                        if (err) {
                            throw err;
                        }
                        
                        data = data.replace("%nombres%", rows[0].nombres);
                        data = data.replace("%apellidos%", rows[0].apellidos);
                        data = data.replace("%numDocumento%", rows[0].numDocumento);
                        data = data.replace("%sexo%", rows[0].sexo);
                        data = data.replace("%rh%", rows[0].rh);
                        data = data.replace("%fechaNacimiento%", rows[0].fechaNacimiento);
                        if (rows[0].foto.indexOf("upload/") == -1) {
                            data = data.replace("%foto%", '<img src="data:image/jpeg;base64,'+rows[0].foto+'"/>');
                        } else {
                            data = data.replace("%foto%", '<img src="'+rows[0].foto+'"/>');
                        }
                        if (rows[0].archivoUrl.indexOf("upload/") == -1) {
                            data = data.replace("%cedulaAnverso%", '<img src="data:image/jpeg;base64,'+rows[0].archivoUrl+'"/>');
                        } else {
                            data = data.replace("%cedulaAnverso%", '<img src="'+rows[0].archivoUrl+'"/>');
                        }
                        
                        if (rows[1].archivoUrl.indexOf("upload/") == -1) {
                            data = data.replace("%cedulaReverso%", '<img src="data:image/jpeg;base64,'+rows[1].archivoUrl+'"/>');
                        } else {
                            data = data.replace("%cedulaReverso%", '<img src="'+rows[1].archivoUrl+'"/>');
                        }
                        if (rows[2]) {
                            if (rows[2].archivoUrl.indexOf("upload/") == -1) {
                                data = data.replace("%huella%", '<img src="data:image/jpeg;base64,'+rows[2].archivoUrl+'"/>');
                            } else {
                                data = data.replace("%huella%", '<img src="'+rows[2].archivoUrl+'"/>');
                            }
                        }
                        data = data.replace("%resultadoValidacion%", dataResult.resultadoValidacion);
                        data = data.replace("%resultadoIdentificacion%", dataResult.resultadoIdentificacion);
                        data = data.replace("%resultadoHuella%", dataResult.resultadoHuella);
                        data = data.replace("%listaNegra%", dataResult.listaNegra);
                        
                        instance.fs.writeFile(pathPdfForUse, data, "utf8", function(errWrite) {
                            var options = {
                                html : pathPdfForUse,
                                paperSize : {format: 'A4', orientation: 'portrait', border: '1cm'},
                                deleteOnAction : false
                            }
                            
                            var pdf = require('phantom-html2pdf');
 
                            pdf.convert(options, function(error, result) {
                             
                                if (error) {
                                    console.log("Error");
                                    console.log(error);
                                    responseCallback.send({error:error});
                                } else {
                                    result.toFile(pathPdfResult, function() {
                                        var responseManager = new ResponseManager();
                                        if (err) {
                                            responseManager.error = err;
                                            responseCallback(responseManager);   
                                        } else {
                                            responseManager.object = filename;
                                            responseManager.error = "NO_ERROR";            
                                            responseCallback(responseManager);
                                        }
                                    });
                                    
                                }
                                /* Using the file writer and callback */
                                
                            });
                        });
                    });
                 });
            }
        });
        
        
        
    }
    
    this.getFile = function(filename, response) {
        var pathPdfResult = instance.path.join(__dirname, "../pdfgenerated/" + filename);
        var file = instance.fs.createReadStream(pathPdfResult);
        var stat = instance.fs.statSync(pathPdfResult);
        response.setHeader('Content-Type', 'application/pdf');
        response.setHeader('Content-Disposition', 'attachment; filename=' + filename);
        response.setHeader('Content-Length', stat.size);
        file.pipe(response);
    }
    
    
    var instance = this;
}

module.exports = DecrimData;