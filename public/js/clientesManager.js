/**
 * Clase ClientesManager
 */

/* global $*/
 /* global jQuery*/
 /* global ResponseManager */
 function ClientesManager() {

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
            url: '/clientebanners',
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
            url: '/clientebanners/all/ban',
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
            url: '/clientebanners/'+idBanner,
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
 }
