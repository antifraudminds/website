var ResponseManager = require("../model/responsemanager.js")
var Connection = require("../model/connection.js")
var request = require('request');
//Clase GMailManager
var GMailManager = function () {
    var user = "developer.aminds@gmail.com";
    var pass = "Joaquin3007";
    
    this.buildEmailMessage = function (from, to, subject, text) {
        var message = {};
        message.email = to;
        message.message = text;
        message["_subject"] = subject;
        message["_replyto"] = user;
        return message;
    }
    
    this.sendEmail = function(data, responseCallback) {
        console.log(data);
        var error = null;
        request.post({url:'https://formspree.io/'+user, form: data}, function(err,httpResponse,body) { 
          var responseManager = new ResponseManager();
            if (error) {
                responseManager.object = "Hay un error con el servidor de correos, intente más tarde";
                responseManager.error = error;
                responseCallback(responseManager);   
            } else {
                responseManager.object = "Un correo con la información requerida ha sido enviada.";
                responseManager.error = "NO_ERROR";            
                responseCallback(responseManager);
            }
        });
    }
}

module.exports = GMailManager;