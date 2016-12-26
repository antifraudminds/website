var ResponseManager = require("../model/responsemanager.js")
var Connection = require("../model/connection.js")

//Clase MailManager
var MailManager = function () {
    var api_key = 'key-13aec7df096d9cdc1dffa9efc06a80ba';
    var domain = 'mailgun.antifraudminds.com';
    var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
    
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
        mailgun.messages().send(data, function (error, body) {
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

module.exports = MailManager;