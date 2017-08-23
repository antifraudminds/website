var Clientes = require("../model/clientes.js");
var multipart = require('connect-multiparty');

var ClientesControlador = function (routes) {
    
    routes.push({
        path:"/clientebanners",
        type:"PUT",
        func: function (req,res) {
            var banners = new Clientes();
            banners.update(req.body, req.files, function(responseManager) {
               res.send(responseManager); 
            });
        },
        middleware: multipart()
    });
    
    routes.push({
        path:"/clientebanners/:idBanner",
        type:"GET",
        func: function (req,res) {
             var banner = new Clientes();
            banner.getBanner({id:req.params.idBanner}, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/clientebanners/all/ban",
        type:"GET",
        func: function (req,res) {
             var banners = new Clientes();
            banners.getBanners({}, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/clientebanners/:idBanner",
        type:"DELETE",
        func: function (req,res) {
             var banners = new Clientes();
            banners.eliminar(req.params.idBanner, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
  
    return routes;
}

module.exports = ClientesControlador;