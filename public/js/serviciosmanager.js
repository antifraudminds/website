/**
 * Clase Solicitud Manager
 */

/* global $*/
 /* global jQuery*/
 /* global ResponseManager */
 function ServiciosManager() {
     
 this.getSkeleton = function() {
     return { nombres:"", email:"", password:"",tipo:1};
 }
 
     this.insertar = function (jsonData,files, callBackUpdated, callBackError) {
     
        var data = new FormData();
        for (var key in jsonData) {
            data.append(key, jsonData[key]);
        }
        
        for (var i = 0; i < files.length ; i++) {
            data.append('file'+i, files[i]);
        }
     
         $.ajax({
            url: '/servicio',
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
     
     this.get = function (id, callBackUpdated, callBackError) {
     
         $.ajax({
            url: '/servicio/get/servicio/' + id,
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
     
     this.getServiciosByEmpresa = function (id, callBackUpdated, callBackError) {
     
         $.ajax({
            url: '/servicio/get/empresa/' + id,
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
     
     this.getEstadosDenuncia = function (callBackUpdated, callBackError) {
     
         $.ajax({
            url: '/servicio/get/denuncia/estados',
            type: 'GET',
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
     
     this.getServiciosByUsuario = function (id, callBackUpdated, callBackError) {
     
         $.ajax({
            url: '/servicio/get/usuario/' + id,
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
            url: '/servicio/get/all',
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
     
     this.eliminar = function (idSolicitud, callBackUpdated, callBackError) {
     
         $.ajax({
            url: '/servicio/' + idSolicitud,
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