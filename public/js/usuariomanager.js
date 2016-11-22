/**
 * Clase Usuario Manager
 */

/* global $*/
 /* global jQuery*/
 /* global ResponseManager */
 function UsuarioManagerHandler() {
     
 this.getSkeleton = function() {
     return { nombres:"", email:"", password:"",tipo:1};
 }
 
 this.insertarUsuario = function (clienteJsonData, callBackUpdated, callBackError) {
     
         $.ajax({
            url: '/usuario',
            type: 'PUT', //Hace un update - Por definición insert ó update.
            beforeSend: function (request) {
                request.setRequestHeader( "manager-method","ClienteManager");
            },
            dataType   : 'json',
            contentType: 'application/json',
            data:JSON.stringify(clienteJsonData),
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
 
 this.getUsuarios = function (callBackUpdated, callBackError) {
     
         $.ajax({
            url: '/usuario',
            type: 'GET', //Obtiene los datos del cliente.
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
     
  this.eliminarUsuario = function(id, callBackUpdated, callBackError) {
    $.ajax({
            url: '/usuario/borrar/'+id,
            type: 'DELETE', //Obtiene los datos del cliente.
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
     
  this.isLogued = function (callBackUpdated, callBackError) {
     
         $.ajax({
            url: '/usuario/logued',
            type: 'GET', //Obtiene los datos del cliente.
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

  this.authCliente = function (user,pass,tipo, callBackUpdated, callBackError) {
      $.ajax({
            url: '/usuario/auth',
            type: 'POST', //Obtiene los datos del cliente.
            data: JSON.stringify({email:user,password:pass,tipo:tipo}),
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
    
    this.logOut = function(callBackUpdated, callBackError) {
        $.ajax({
            url: '/usuario/logout',
            type: 'GET',
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
    
    this.recoverPass = function(email, callBackUpdated, callBackError) {
        $.ajax({
            url: '/usuario/recoverpass/' + email,
            type: 'GET',
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
    
    this.setEstablecimientoACliente = function(idCliente,idEstablecimiento, callBackUpdated, callBackError) {
        $.ajax({
            url: '/manager',
            type: 'PATCH',
            contentType: 'application/json',
            data:JSON.stringify({idCliente:idCliente, idEstablecimiento:idEstablecimiento}),
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
     
 }