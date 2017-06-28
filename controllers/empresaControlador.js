var Empresa = require("../model/empresa.js");

var EmpresaControlador = function (routes) {
    routes.push({
        path:"/empresa",
        type:"PUT",
        func: function (req,res) {
            var empresa = new Empresa();
            empresa.insertar(req.body, -1, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/empresa/update",
        type:"PUT",
        func: function (req,res) {
            var empresa = new Empresa();
            empresa.update(req.body, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/empresa/get/empresa/:idEmpresa",
        type:"GET",
        func: function (req,res) {
            var empresa = new Empresa();
            empresa.get(req.params.idEmpresa, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/empresa/get/qrcode/:idEmpresa",
        type:"GET",
        func: function (req,res) {
            var empresa = new Empresa();
            empresa.getQRCode(req.params.idEmpresa, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/empresa/get/all",
        type:"GET",
        func: function (req,res) {
            var session = req.session;
            if (session.cliente) {
                var empresa = new Empresa();
                empresa.getAll(function(responseManager) {
                    res.send(responseManager); 
                });
            } else {
                res.send({error:"No authUser"});
            }
        }
    });
    
    routes.push({
        path:"/empresa/:idEmpresa",
        type:"DELETE",
        func: function (req,res) {
            var empresa = new Empresa();
            empresa.delete(req.params.idEmpresa, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    return routes;
}

module.exports = EmpresaControlador;