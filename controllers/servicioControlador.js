var Servicio = require("../model/servicio.js");

var ServicioControlador = function (routes) {
    routes.push({
        path:"/servicio",
        type:"PUT",
        func: function (req,res) {
            var servicio = new Servicio();
            servicio.insertar(req.body, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/servicio/update",
        type:"PUT",
        func: function (req,res) {
            var servicio = new Servicio();
            servicio.update(req.body, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/servicio/get/servicio/:idServicio",
        type:"GET",
        func: function (req,res) {
            var servicio = new Servicio();
            servicio.get(req.params.idServicio, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/servicio/get/all",
        type:"GET",
        func: function (req,res) {
            var servicio = new Servicio();
            servicio.getAll(function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/servicio/get/empresa/:idEmpresa",
        type:"GET",
        func: function (req,res) {
            var servicio = new Servicio();
            servicio.getServiciosByEmpresa(req.params.idEmpresa, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/servicio/get/denuncia/estados",
        type:"GET",
        func: function (req,res) {
            var servicio = new Servicio();
            servicio.getEstadosDenuncias(function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/servicio/get/usuario/:idUsuario",
        type:"GET",
        func: function (req,res) {
            var servicio = new Servicio();
            servicio.getServiciosByUsuario(req.params.idUsuario, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/servicio/:id",
        type:"DELETE",
        func: function (req,res) {
            var servicio = new Servicio();
            servicio.delete(req.params.idEmpresa, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    return routes;
}

module.exports = ServicioControlador;