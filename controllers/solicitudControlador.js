var Solicitud = require("../model/solicitud.js");
var multipart = require('connect-multiparty');

var SolicitudControlador = function (routes) {
    routes.push({
        path:"/solicitud",
        type:"PUT",
        func: function (req,res) {
            var solicitud = new Solicitud();
            solicitud.insertar(req.body, req.files, function(responseManager) {
               res.send(responseManager); 
            });
        },
        middleware: multipart()
    });
    
    routes.push({
        path:"/solicitud/nofile",
        type:"PUT",
        func: function (req,res) {
            var solicitud = new Solicitud();
            solicitud.insertar(req.body, {}, function(responseManager) {
               res.send(responseManager); 
            });
        },
        middleware: multipart()
    });
    
    routes.push({
        path:"/solicitud/respuesta",
        type:"PUT",
        func: function (req,res) {
            var solicitud = new Solicitud();
            solicitud.respuestaSolicitud(req.body, req.files, function(responseManager) {
               res.send(responseManager); 
            });
        },
        middleware: multipart()
    });
    
    routes.push({
        path:"/solicitud/respuesta/:idSolicitud",
        type:"GET",
        func: function (req,res) {
            var solicitud = new Solicitud();
            solicitud.getRespuestaSolicitud(req.params.idSolicitud, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/solicitud/reporte",
        type:"POST",
        func: function (req,res) {
            var solicitud = new Solicitud();
            solicitud.getReporte(req.body, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/solicitud/get/:idEmpresa",
        type:"GET",
        func: function (req,res) {
            var solicitud = new Solicitud();
            solicitud.get(req.params.idEmpresa, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/solicitud/getsolicitud/:idSolicitud",
        type:"GET",
        func: function (req,res) {
            var solicitud = new Solicitud();
            solicitud.getSolicitud(req.params.idSolicitud, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/solicitud/all",
        type:"GET",
        func: function (req,res) {
            var solicitud = new Solicitud();
            solicitud.getAll(function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/solicitud/:idSolicitud",
        type:"DELETE",
        func: function (req,res) {
            var solicitud = new Solicitud();
            solicitud.delete(req.params.idSolicitud, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    return routes;
}

module.exports = SolicitudControlador;