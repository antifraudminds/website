var Banners = require("../model/banners.js");
var multipart = require('connect-multiparty');

var BannersControlador = function (routes) {
    
    routes.push({
        path:"/banners",
        type:"PUT",
        func: function (req,res) {
            var banners = new Banners();
            banners.update(req.body, req.files, function(responseManager) {
               res.send(responseManager); 
            });
        },
        middleware: multipart()
    });
    
    routes.push({
        path:"/banners/:idBanner",
        type:"GET",
        func: function (req,res) {
             var banner = new Banners();
            banner.getBanner({id:req.params.idBanner}, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/banners/all/ban",
        type:"GET",
        func: function (req,res) {
             var banners = new Banners();
            banners.getBanners({}, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
  
    return routes;
}

module.exports = BannersControlador;