var Mensajes = require("../model/mensajes.js");

var MensajesControlador = function (routes) {
    
    routes.push({
        path:"/mensajes",
        type:"PUT",
        func: function (req,res) {
            var mensajes = new Mensajes();
            mensajes.insertMensaje(req.body, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/mensajes/update",
        type:"PUT",
        func: function (req,res) {
            var mensajes = new Mensajes();
            mensajes.updateMensaje(req.body, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/mensajes/borrar/:idMensaje",
        type:"DELETE",
        func: function (req,res) {
            var mensajes = new Mensajes();
            mensajes.deleteMensaje({id:req.params.idMensaje}, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
   routes.push({
        path:"/mensajes/:idMensaje",
        type:"GET",
        func: function (req,res) {
            var mensajes = new Mensajes();
            mensajes.getMensajeById({id:req.params.idMensaje}, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/mensajes/all/msg",
        type:"GET",
        func: function (req,res) {
            var mensajes = new Mensajes();
            mensajes.getMensaje({}, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    
  
    return routes;
}

module.exports = MensajesControlador;