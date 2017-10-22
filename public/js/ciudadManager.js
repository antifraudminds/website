
/**
 * Clase CiudadManager
 */

/* global $*/
 /* global jQuery*/
 /* global ResponseManager */
 function CiudadManager() {

 this.getSkeleton = function() {
     return {id:-1,url:"",urlImage:""};
 }

 this.obtener = function (callBackUpdated, callBackError) {

         $.ajax({
            url: '/ciudad/all',
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
  }
