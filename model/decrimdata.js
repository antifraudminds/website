var ResponseManager = require("../model/responsemanager.js");
var Connection = require("../model/connection.js");
var FileManager = require("../model/filemanager.js");
var sizeOf = require('image-size'); 
var Jimp = require("jimp");

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
    
    this.insertarResultadoValidacion = function(decrimData, responseCallback) {
        instance.crearConexion(function (connection) {
                if (connection) {
                        var sqlInsert = "CALL AgregarResultadoValidacion("+decrimData.idCaso+",'"+decrimData.resultadoValidacion+"','"+decrimData.resultadoIdentificacion+"','"+decrimData.resultadoHuella+"','"+decrimData.resultadoBasedeDatos+"')";
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
                
                var sqlUpdate = "select * from ListaNegra where NumDoc = '" + dataListaNegra.NumDoc + "' or NombreCompleto like '%" + dataListaNegra.NombreCompleto + "%'";
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
                
                var sqlUpdate = "select d.*,da.nombre,da.archivoUrl,e.ciudad from DecrimValidacion as d, DecrimValidacionArchivos as da, Empresas as e where d.idCaso = da.idCaso and d.idCaso = " + dataResult.idCaso + " and e.id = d.idEmpresa order by da.nombre";
                console.log(sqlUpdate);
                 connection.query(sqlUpdate, function(err, rows) {
                     console.log("Resultado");
                     console.log(rows);
                     
                     var archivos = getArchivosFromQuery(rows);
                     archivos.push({nombre:"fotousuario",archivo:rows[0].foto});
                     archivos = getArchivosBase64IfRequired(archivos, 0, function (archivosBase64) {
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
                    //instance.fs.createReadStream(pathPdfTemplate).pipe(instance.fs.createWriteStream(pathPdfForUse));
                    var data = instance.fs.readFileSync(pathPdfTemplate, "utf8");
                    //instance.fs.readFile(pathPdfForUse, 'utf8', function read(err, data) {
                        
                        data = data.replace("%nombres%", rows[0].nombres);
                        data = data.replace("%apellidos%", rows[0].apellidos);
                        data = data.replace("%numDocumento%", rows[0].numDocumento);
                        data = data.replace("%sexo%", rows[0].sexo);
                        data = data.replace("%rh%", rows[0].rh);
                        data = data.replace("%fechaNacimiento%", rows[0].fechaNacimiento);
                        data = data.replace("%fechaActual%", getFormattedDate());
                        data = data.replace("%ciudadEmpresa%", rows[0].ciudad);
                        console.log("Query Data Added well");
                        
                        //Agrega foto del usuario
                        var fotoBase64 = archivosBase64[archivosBase64.length - 1].archivo;
                        data = data.replace("%foto%", '<img src="data:image/jpeg;base64,'+fotoBase64+'" width="200" height="266"/>');
                        
                        //Tags para los archivos, y posición en el pdf de reporte.
                        var tags = [
                            {
                                nombre:"Cedula Adelante", 
                                tag:"cedulaAnverso", 
                                hasDimensions:true, 
                                width:300, 
                                height:225
                                
                            }, {
                                nombre:"Cedula Atras", 
                                tag:"cedulaReverso", 
                                hasDimensions:true, 
                                width:300, 
                                height:225
                                
                            }, {
                                nombre:"Huella", 
                                tag:"huella", 
                                hasDimensions:false, 
                                width:0, 
                                height:0
                                
                            }, {
                                nombre:"UFirma", 
                                tag:"firma", 
                                hasDimensions:true, 
                                width:350, 
                                height:171
                            } 
                            ];
                        
                        //Agrega los archivos que tenga el usuario, Fotos cédula adelante-atrás, Huella. 
                        data = addArchivos(archivosBase64, tags, data);
                        
                        console.log("Photos added well");
                        
                        if (dataResult.porcentajeRiesgo == "0 %") {
                            dataResult.porcentajeRiesgo = "No hay Riesgo";
                        }
                        
                        data = data.replace("%resultadoValidacion%", dataResult.resultadoValidacion);
                        data = data.replace("%resultadoIdentificacion%", dataResult.resultadoIdentificacion);
                        data = data.replace("%resultadoHuella%", dataResult.resultadoHuella);
                        data = data.replace("%listaNegra%", dataResult.listaNegra);
                        data = data.replace("%porcentajeRiesgo%", dataResult.porcentajeRiesgo);
                        
                        console.log("Data sent Added well");
                        
                        instance.fs.writeFile(pathPdfForUse, data, "utf8", function(errWrite) {
                            if (errWrite) {
                                console.log("Error en el write");
                                console.log(errWrite);
                                var responseManager = new ResponseManager();
                                        
                                responseManager.error = errWrite;
                                responseCallback(responseManager);
                            } else {
                                console.log("writeFile succeded" + pathPdfForUse);
                                var options = {
                                    html : pathPdfForUse,
                                    paperSize : {format: 'LEGAL', orientation: 'portrait', border: '0.3cm'},
                                    deleteOnAction : false
                                }
                                
                                var pdf = require('phantom-html2pdf');
     
                                pdf.convert(options, function(error, result) {
                                    console.log("execute call func");
                                    if (error) {
                                        console.log("Error");
                                        console.log(error);
                                        responseCallback({error:error});
                                    } else {
                                        console.log("pdf convert ok");
                                        result.toFile(pathPdfResult, function() {
                                            
                                            var responseManager = new ResponseManager();
                                            if (err) {
                                                console.log("to File error");
                                                responseManager.error = err;
                                                responseCallback(responseManager);   
                                            } else {
                                                console.log("to File ok");
                                                responseManager.object = filename;
                                                responseManager.error = "NO_ERROR";            
                                                responseCallback(responseManager);
                                            }
                                        });
                                        
                                    }
                                    
                                    /* Using the file writer and callback */
                                    
                                });
                            }
                        });
                         
                     });
                        
                    //});
                 });
            }
        });
        
        
        
    }
    
    function getFormattedDate() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        
        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd;
        } 
        if(mm<10){
            mm='0'+mm;
        } 
        return dd+'-'+mm+'-'+yyyy;

    }
    
    function addArchivos(archivos, tags, data) {
        for (var indexTags = 0; indexTags < tags.length; indexTags++) {
            var found = false;
            for (var indexArchivos = 0; indexArchivos < (archivos.length - 1); indexArchivos++) {
                var tag = tags[indexTags];
                var archivo = archivos[indexArchivos];
                if (tag.nombre == archivo.nombre) {
                    found = true;
                    if (tag.hasDimensions) {
                        data = data.replace("%" + tag.tag + "%", '<img src="data:image/jpeg;base64,'+archivo.archivo+'" width="'+tag.width+'" height="'+tag.height+'"/>');
                    } else {
                        data = data.replace("%" + tag.tag + "%", '<img src="data:image/jpeg;base64,'+archivo.archivo+'"/>');
                    }
                }
            }
            if (!found) {
                data = data.replace("%" + tag.tag + "%", 'No encontrado');
            }
        }
        return data;
    }
    
    function getArchivosFromQuery(rows) {
        var archivos = [];
        for (var index = 0; index < rows.length; index++) {
            if (rows[index] && rows[index].archivoUrl) {
                var archivo = rows[index].archivoUrl
                var nombre = rows[index].nombre;
                archivos.push({nombre:nombre, archivo: archivo});
            }
        }
        
        return archivos;
    }
    
    function getArchivosBase64IfRequired(archivos, indexArchivos, callback) {
        
        var dirPath = __dirname;
        var pathForFiles = "../public";
        if (process.env.OPENSHIFT_DATA_DIR != null) {
            dirPath = process.env.OPENSHIFT_DATA_DIR;
            pathForFiles = pathForFiles.replace("../", "");
            console.log(process.env.OPENSHIFT_DATA_DIR);
        }
        //for (var index = 0; index < archivos.length; index++) {
        if (indexArchivos < archivos.length) {
            var archivo = archivos[indexArchivos];
            if (archivo.archivo.indexOf("/uploads") != -1) {
                var imagePathFile = instance.path.join(dirPath, pathForFiles + archivo.archivo);
                var dimensions = sizeOf(imagePathFile);
                var isPortrait = dimensions.width < dimensions.height;
                var scale = 1;
                var desiredValue = 400;
                
                Jimp.read(imagePathFile, function (err, image) {
                    if (!err) {
                        image.resize(Jimp.AUTO, desiredValue);
                        image.getBuffer(Jimp.MIME_PNG, function (err, result) {
                            archivos[indexArchivos].archivo = result.toString("base64");
                            getArchivosBase64IfRequired(archivos, indexArchivos + 1, callback);
                        });
                    } else {
                        getArchivosBase64IfRequired(archivos, indexArchivos + 1, callback);
                    }
                });
            }
        } else {
            callback(archivos);
        }
    }
    
    function base64_encode(file) {
        // read binary data
        var bitmap = instance.fs.readFileSync(file);
        // convert binary data to base64 encoded string
        return new Buffer(bitmap).toString('base64');
    }
    
    this.getFile = function(filename, response) {
        
        var dirName = __dirname;
        var filenamePath = "../pdfgenerated/";
        if (process.env.OPENSHIFT_DATA_DIR != null) {
            dirName = process.env.OPENSHIFT_DATA_DIR;
            filenamePath = "pdfgenerated/";
        }
        var pathPdfResult = instance.path.join(dirName, filenamePath + filename);
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