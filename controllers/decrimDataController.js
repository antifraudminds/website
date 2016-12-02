var DecrimData = require("../model/decrimdata.js");
var multipart = require('connect-multiparty');

var DecrimDataController = function (routes) {
    
    routes.push({
        path:"/decrimdata/file",
        type:"PUT",
        func: function (req,res) {
            var decrimData = new DecrimData();
            decrimData.insertar(req.body, req.files, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/decrimdata/insert",
        type:"PUT",
        func: function (req,res) {
            var decrimData = new DecrimData();
            decrimData.insertarArchivo(req.body, req.files, function(responseManager) {
               res.send(responseManager); 
            });
        },
        middleware: multipart()
    });
    
    routes.push({
        path:"/decrimdata/get/:idCaso",
        type:"GET",
        func: function (req,res) {
            var decrimData = new DecrimData();
            decrimData.getDecrimData(req.params.idCaso, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/decrimdata/getall",
        type:"GET",
        func: function (req,res) {
            var decrimData = new DecrimData();
            decrimData.getAllDecrimData(function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/decrimdata/getfiles/:idCaso",
        type:"GET",
        func: function (req,res) {
            var decrimData = new DecrimData();
            decrimData.getDecrimDataFiles(req.params.idCaso, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
  
    return routes;
}

module.exports = DecrimDataController;