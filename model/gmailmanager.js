var ResponseManager = require("../model/responsemanager.js")
var Connection = require("../model/connection.js")
var GmailSendModule = require('mailsender')

//Clase GMailManager
var GMailManager = function () {
    var user = "developer.aminds@gmail.com";
    var pass = "Joaquin3007";
    
    this.buildEmailMessage = function (from, to, subject, text) {
        return {
              from: from,
              to: to,
              subject: subject,
              text: text
            };
    }
    
    this.sendEmail = function(data, responseCallback) {
        console.log(data);
        var error = null;
        try {
        GmailSendModule.from(data.from).to(data.to).body(data.subject, data.text, true).send();
        } catch(err) {
            error = err;
        }
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
    }
}

module.exports = GMailManager;