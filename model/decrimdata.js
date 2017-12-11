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
        connection.connect(conexionCreada);
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

                     var fileTemplateGrab = dataResult.resultadoValidacion != "tipo2" ? "pdf0_1.html" : "pdf1_1.html";
                     var archivos = getArchivosFromQuery(rows);
                     archivos.push({nombre:"fotousuario",archivo:rows[0].foto});
                     archivos = getArchivosBase64IfRequired(archivos, 0, function (archivosBase64) {
                    var pathPdfTemplate = instance.path.join(__dirname, "../public/admin/" + fileTemplateGrab);
                    var identifier = (new Date()).getTime();
                    var dirName = __dirname;
                    var filenamePath = "../pdfgenerated/pdf_nuevo_" + identifier;
                    var pathDirOpt = "/opt/data";
                    if (pathDirOpt != null) {
                        dirName = pathDirOpt;
                        filenamePath = "pdfgenerated/pdf_nuevo_" + identifier;
                    }
                    var pathPdfForUse = instance.path.join(dirName, filenamePath+".html");
                    var pathPdfResult = instance.path.join(dirName, filenamePath+".pdf");
                    var filename = "pdf_nuevo_"+identifier+".pdf";
                    //instance.fs.createReadStream(pathPdfTemplate).pipe(instance.fs.createWriteStream(pathPdfForUse));
                    var data = instance.fs.readFileSync(pathPdfTemplate, "utf8");
                    //instance.fs.readFile(pathPdfForUse, 'utf8', function read(err, data) {

                        data = data.replace("%nombres%", rows[0].nombres.toUpperCase());
                        data = data.replace("%apellidos%", rows[0].apellidos.toUpperCase());
                        data = data.replace("%numDocumento%", rows[0].numDocumento);
                        data = data.replace("%sexo%", rows[0].sexo.toUpperCase());
                        data = data.replace("%rh%", rows[0].rh.toUpperCase());
                        data = data.replace("%fechaNacimiento%", rows[0].fechaNacimiento);
                        data = data.replace("%fechaActual%", getFormattedDate());
                        data = data.replace("%ciudadEmpresa%", rows[0].ciudad.toUpperCase());
                        console.log("Query Data Added well");

                        //Agrega foto del usuario
                        var fotoBase64 = archivosBase64[archivosBase64.length - 1].archivo;
                        data = data.replace("%foto%", '<img src="data:image/jpeg;base64,'+fotoBase64+'" height="66.51%"/>');

                        //Tags para los archivos, y posición en el pdf de reporte.
                        var tags = [
                            {
                                nombre:"Cedula Adelante",
                                tag:"cedulaAnverso",
                                hasDimensions:true,
                                width:"75%",
                                height:"56.25%"

                            }, {
                                nombre:"Cedula Atras",
                                tag:"cedulaReverso",
                                hasDimensions:true,
                                width:"75%",
                                height:"56.25%"

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
                                width:"75%",
                                height:"56.25%"
                            }
                            ];
                            console.log("Archivos convertidos a base 64");
                            console.log(archivosBase64);

                        //Agrega los archivos que tenga el usuario, Fotos cédula adelante-atrás, Huella.
                        data = addArchivos(archivosBase64, tags, data);

                        console.log("Photos added well");

                        if (dataResult.porcentajeRiesgo == "0 %") {
                            dataResult.porcentajeRiesgo = "No hay Riesgo";
                        }

                        if (dataResult.resultadoValidacion != "tipo2") {
                          data = data.replace("%resultadoValidacion%", getImageValidacion(dataResult.resultadoValidacion));
                          data = data.replace("%resultadoIdentificacion%", getImageValidacion(dataResult.resultadoIdentificacion));
                          data = data.replace("%resultadoIdentificacion%", getImageValidacion(dataResult.resultadoIdentificacion));
                          data = data.replace("%resultadoHuella%", getImageValidacion(dataResult.resultadoHuella));
                        }
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

    function getImageValidacion(validacion) {
      return containsString(validacion.toLowerCase(), 'apro') ? '<img src="data:image/png;base64,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"  width="50" height="50"/>' : '<img src="data:image/png;base64,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"  width="50" height="50"/>';
    }

    function containsString(stringTest, string) {
      return stringTest.indexOf(string) != -1;
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
                        data = data.replace("%" + tag.tag + "%", '<img style="width: 70%" src="data:image/jpeg;base64,'+archivo.archivo+'"/>');
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
        var pathOptPath = "/opt/data";
        if (pathOptPath != null) {
            dirPath = pathOptPath;
            pathForFiles = pathForFiles.replace("../", "");
            console.log("/opt/data");
        }
        //for (var index = 0; index < archivos.length; index++) {
        if (indexArchivos < archivos.length) {
            var archivo = archivos[indexArchivos];
            if (archivo.archivo.indexOf("/uploads") != -1) {
                var imagePathFile = instance.path.join(dirPath, pathForFiles + archivo.archivo);
                var desiredValue = 200;

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
        var pathOptPath = "/opt/data";
        if (pathOptPath != null) {
            dirName = pathOptPath;
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

    /*this.getFile = function(filename, res) {
      var dirName = __dirname;
      var filenamePath = "../pdfgenerated/";
      var pathOptPath = null;//"/opt/data";
      if (pathOptPath != null) {
          dirName = pathOptPath;
          filenamePath = "pdfgenerated/";
      }
      var pathPdfResult = instance.path.join(dirName, filenamePath + filename);
      var html = instance.fs.readFileSync(pathPdfResult, 'utf8')
      res.send(html)
    }*/

    var instance = this;
}

module.exports = DecrimData;
