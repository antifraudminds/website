var ResponseManager = require("../model/responsemanager.js")
var Connection = require("../model/connection.js")

//Clase GMailManager
var GMailManager = function () {
    var user = "developer.aminds@gmail.com";
    var pass = "Joaquin3007";
    
    this.buildEmailMessage = function (from, to, subject, text) {
        var emailData = {
            'FromEmail': from,
            'FromName': 'Antifraudminds',
            'Subject': subject,
            'Text-part': text,
            'Recipients': [{'Email': to}]
        };
        
        return emailData;
    }
    
    this.sendEmail = function(data, responseCallback) {
        console.log(data);
        var Mailjet = require('apiv3').connect('01c42d863084eebd93ebecd5491759f9', 'ef6d6e9e7c0414b236910b08d753ba83');
        var sendEmail = Mailjet.post('send');
        sendEmail.request(data).then(function (body) {
            console.log("Body:");
            console.log(body);
            var responseManager = new ResponseManager();
            responseManager.object = "Un correo con la información requerida ha sido enviada.";
            responseManager.error = "NO_ERROR";            
            responseCallback(responseManager);
        }).catch(function (err) {
            console.log("Error:");
            console.log(err);
           var responseManager = new ResponseManager();
           responseManager.object = "Hay un error con el servidor de correos, intente más tarde";
            responseManager.error = err;
            responseCallback(responseManager);
        });
        
        
    }
}

module.exports = GMailManager;