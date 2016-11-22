/**
 * Response Manager Handler
 * 
 * Maneja los la respuesta de un Manager. Cualquier Manager.
 * 
 * Requiere: JQuery
 *
 */
 
 function ResponseManager(responseManagerJson) {
     var manager;
     var error;
     var message;
     var object;
     
     for (var item in responseManagerJson) {
         this[item] = responseManagerJson[item];
     }
     
     this.getMessage = function () {
         return this.message;
     }
     
     this.getError = function () {
         return this.error;
     }
     
     this.getManager = function () {
         return this.manager;
     }
     
     this.getObject = function () {
         return this.object;
     }
 }