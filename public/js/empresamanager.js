/**
 * Clase Empresa Manager
 */

/* global $*/
 /* global jQuery*/
 /* global ResponseManager */
 function EmpresaManager() {
     
 this.getSkeleton = function() {
     return { nombres:"", email:"", password:"",tipo:1};
 }
 
     this.insertar = function (jsonData, callBackUpdated, callBackError) {
     
         $.ajax({
            url: '/empresa',
            type: 'PUT', //Hace un update - Por definición insert ó update.
            beforeSend: function (request) {
                request.setRequestHeader( "manager-method","ClienteManager");
            },
            dataType   : 'json',
            contentType: 'application/json',
            data:JSON.stringify(jsonData),
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
     
     this.update = function (jsonData, callBackUpdated, callBackError) {
     
         $.ajax({
            url: '/empresa/update',
            type: 'PUT', //Hace un update - Por definición insert ó update.
            beforeSend: function (request) {
                request.setRequestHeader( "manager-method","ClienteManager");
            },
            dataType   : 'json',
            contentType: 'application/json',
            data:JSON.stringify(jsonData),
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
            url: '/empresa/get/all',
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
     
     this.getAllEmpresas = function (callBackUpdated, callBackError) {
     
         $.ajax({
            url: '/empresa',
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
     
     this.get = function (idEmpresa, callBackUpdated, callBackError) {
     
         $.ajax({
            url: '/empresa/get/empresa/' + idEmpresa,
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
     
     this.getQRCode = function (idEmpresa, callBackUpdated, callBackError) {
     
         $.ajax({
            url: '/empresa/get/qrcode/' + idEmpresa,
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
     
     this.delete = function (idEmpresa, callBackUpdated, callBackError) {
     
         $.ajax({
            url: '/empresa/' + idEmpresa,
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
     
     this.getAll = function (callBackUpdated, callBackError) {
     
         $.ajax({
            url: '/empresa/get/all',
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
 }