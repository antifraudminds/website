/**
 * Clase Solicitud Manager
 */

/* global $*/
 /* global jQuery*/
 /* global ResponseManager */
 function SolicitudManager() {
     
 this.getSkeleton = function() {
     return { nombres:"", email:"", password:"",tipo:1};
 }
 
     this.insertar = function (jsonData,files, callBackUpdated, callBackError) {
     
        var data = new FormData();
        for (var key in jsonData) {
            data.append(key, jsonData[key]);
        }
        
        if (files != null) {
            for (var i = 0; i < files.length ; i++) {
                data.append('file'+i, files[i]);
            }
        }
     
         $.ajax({
            url: '/solicitud',
            type: 'PUT', //Hace un update - Por definición insert ó update.
            beforeSend: function (request) {
                request.setRequestHeader( "manager-method","ClienteManager");
            },
            cache: false,
            processData: false,
            contentType: false,
            data:data,
            success: function(responseManagerJson) {
                var responseManager = new ResponseManager(responseManagerJson);
                if (responseManager.getError() == "NO_ERROR") {
                    if (callBackUpdated) {
                        callBackUpdated(responseManager);
                    }
                } else {
                    if (callBackError) {
                        callBackError(responseManager);
                    }
                }
            }
        });
     }
     
     this.respuestaSolicitud = function (jsonData,files, callBackUpdated, callBackError) {
     
        var data = new FormData();
        for (var key in jsonData) {
            data.append(key, jsonData[key]);
        }
        
        for (var i = 0; i < files.length ; i++) {
            data.append('file'+i, files[i]);
        }
     
         $.ajax({
            url: '/solicitud/respuesta',
            type: 'PUT', //Hace un update - Por definición insert ó update.
            beforeSend: function (request) {
                request.setRequestHeader( "manager-method","ClienteManager");
            },
            cache: false,
            processData: false,
            contentType: false,
            data:data,
            success: function(responseManagerJson) {
                var responseManager = new ResponseManager(responseManagerJson);
                if (responseManager.getError() == "NO_ERROR") {
                    if (callBackUpdated) {
                        callBackUpdated(responseManager);
                    }
                } else {
                    if (callBackError) {
                        callBackError(responseManager);
                    }
                }
            }
        });
     }
     
     this.get = function (idEmpresa, callBackUpdated, callBackError) {
     
         $.ajax({
            url: '/solicitud/get/' + idEmpresa,
            type: 'GET', //Hace un update - Por definición insert ó update.
            beforeSend: function (request) {
                request.setRequestHeader( "manager-method","ClienteManager");
            },
            dataType   : 'json',
            contentType: 'application/json',
            success: function(responseManagerJson) {
                var responseManager = new ResponseManager(responseManagerJson);
                if (responseManager.getError() == "NO_ERROR") {
                    if (callBackUpdated) {
                        callBackUpdated(responseManager);
                    }
                } else {
                    if (callBackError) {
                        callBackError(responseManager);
                    }
                }
            }
        });
     }
     
     this.getRespuestaSolicitud = function (idSolicitud, callBackUpdated, callBackError) {
     
         $.ajax({
            url: '/solicitud/respuesta/' + idSolicitud,
            type: 'GET', //Hace un update - Por definición insert ó update.
            beforeSend: function (request) {
                request.setRequestHeader( "manager-method","ClienteManager");
            },
            dataType   : 'json',
            contentType: 'application/json',
            success: function(responseManagerJson) {
                var responseManager = new ResponseManager(responseManagerJson);
                if (responseManager.getError() == "NO_ERROR") {
                    if (callBackUpdated) {
                        callBackUpdated(responseManager);
                    }
                } else {
                    if (callBackError) {
                        callBackError(responseManager);
                    }
                }
            }
        });
     }
     
     this.getAll = function (callBackUpdated, callBackError) {
     
         $.ajax({
            url: '/solicitud/all',
            type: 'GET', //Hace un update - Por definición insert ó update.
            beforeSend: function (request) {
                request.setRequestHeader( "manager-method","ClienteManager");
            },
            dataType   : 'json',
            contentType: 'application/json',
            success: function(responseManagerJson) {
                var responseManager = new ResponseManager(responseManagerJson);
                if (responseManager.getError() == "NO_ERROR") {
                    if (callBackUpdated) {
                        callBackUpdated(responseManager);
                    }
                } else {
                    if (callBackError) {
                        callBackError(responseManager);
                    }
                }
            }
        });
     }
     
     this.getSolicitud = function (idSolicitud, callBackUpdated, callBackError) {
     
         $.ajax({
            url: '/solicitud/getSolicitud/' + idSolicitud,
            type: 'GET', //Hace un update - Por definición insert ó update.
            beforeSend: function (request) {
                request.setRequestHeader( "manager-method","ClienteManager");
            },
            dataType   : 'json',
            contentType: 'application/json',
            success: function(responseManagerJson) {
                var responseManager = new ResponseManager(responseManagerJson);
                if (responseManager.getError() == "NO_ERROR") {
                    if (callBackUpdated) {
                        callBackUpdated(responseManager);
                    }
                } else {
                    if (callBackError) {
                        callBackError(responseManager);
                    }
                }
            }
        });
     }
     
     this.getReporte = function (data, callBackUpdated, callBackError ) {
         $.ajax({
            url: '/solicitud/reporte',
            type: 'POST', //Obtiene los datos del cliente.
            data: data,
            dataType   : 'json',
            contentType: 'application/json',
            beforeSend: function (request) {
                request.setRequestHeader( "manager-method","ClienteManager");
            },
            success: function(responseManagerJson) {
                var responseManager = new ResponseManager(responseManagerJson);
                if (responseManager.getError() == "NO_ERROR") {
                    if (callBackUpdated) {
                        callBackUpdated(responseManager);
                    }
                } else {
                    if (callBackError) {
                        callBackError(responseManager);
                    }
                }
            }
        });
     }
     
     this.eliminar = function (idSolicitud, callBackUpdated, callBackError) {
     
         $.ajax({
            url: '/solicitud/' + idSolicitud,
            type: 'DELETE', //Hace un update - Por definición insert ó update.
            beforeSend: function (request) {
                request.setRequestHeader( "manager-method","ClienteManager");
            },
            dataType   : 'json',
            contentType: 'application/json',
            success: function(responseManagerJson) {
                var responseManager = new ResponseManager(responseManagerJson);
                if (responseManager.getError() == "NO_ERROR") {
                    if (callBackUpdated) {
                        callBackUpdated(responseManager);
                    }
                } else {
                    if (callBackError) {
                        callBackError(responseManager);
                    }
                }
            }
        });
     }
     
 }