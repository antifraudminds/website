/**
 * Clase BannersManager
 */

/* global $*/
 /* global jQuery*/
 /* global ResponseManager */
 function BannersManager() {

 this.getSkeleton = function() {
     return {id:-1,url:"",urlImage:""};
 }

 this.update = function (jsonData, files, callBackUpdated, callBackError) {

        var data = new FormData();
        for (var key in jsonData) {
            data.append(key, jsonData[key]);
        }
        for (var i = 0; i < files.length ; i++) {
            data.append('file'+i, files[i]);
        }

         $.ajax({
            url: '/banners',
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

 this.obtener = function (callBackUpdated, callBackError) {

         $.ajax({
            url: '/banners/all/ban',
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

    this.obtenerFondo = function (idFondo, callBackUpdated, callBackError) {

         $.ajax({
            url: '/fondo/' + idFondo,
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

  this.eliminar = function(idBanner, callBackUpdated, callBackError) {
    $.ajax({
            url: '/banners/'+idBanner,
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

  this.authCliente = function (user,pass, callBackUpdated, callBackError) {
      $.ajax({
            url: '/usuario/auth',
            type: 'POST', //Obtiene los datos del cliente.
            data: JSON.stringify({email:user,password:pass}),
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

    this.logOutCliente = function(callBackUpdated, callBackError) {
        $.ajax({
            url: '/manager',
            type: 'OPTIONS',
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

    this.getNumClientes = function(callBackUpdated, callBackError) {
        $.ajax({
            url: '/manager',
            type: 'PATCH',
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

 function fechaFormated(fecha) {
     var date = new Date(fecha);
     date.setTime(date.getTime()+(1000*60*60*24));
     return getMes(date.getMonth()+1) + " de " + date.getFullYear();
 }

 function getMes(mes) {
     switch (mes) {
         case 1:
             return "Enero";
             break;
        case 2:
             return "Febrero";
             break;
        case 3:
             return "Marzo";
             break;
        case 4:
             return "Abril";
             break;
        case 5:
             return "Mayo";
             break;
        case 6:
             return "Junio";
             break;
        case 7:
             return "Julio";
             break;
        case 8:
             return "Agosto";
             break;
        case 9:
             return "Septiembre";
             break;
        case 10:
             return "Octubre";
             break;
        case 11:
             return "Noviembre";
             break;
        case 12:
             return "Diciembre";
             break;
         default:
             // code
     }
 }
