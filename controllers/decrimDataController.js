var DecrimData = require("../model/decrimdata.js");
var multipart = require('connect-multiparty');

var DecrimDataController = function (routes) {
    
    routes.push({
        path:"/decrimdata/insert",
        type:"PUT",
        func: function (req,res) {
            var decrimData = new DecrimData();
            decrimData.insertar(req.body, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/decrimdata/file",
        type:"PUT",
        func: function (req,res) {
            var decrimData = new DecrimData();
            decrimData.insertarArchivo(req.body, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/decrimdata/insertarresultadovalidacion",
        type:"POST",
        func: function (req,res) {
            var decrimData = new DecrimData();
            decrimData.insertarResultadoValidacion(req.body, function(responseManager) {
               res.send(responseManager); 
            });
        }
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
        path:"/decrimdata/getall/:idEmpresa",
        type:"GET",
        func: function (req,res) {
            var decrimData = new DecrimData();
            decrimData.getAllDecrimData(req.params.idEmpresa, function(responseManager) {
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
    
    routes.push({
        path:"/decrimdata/getresultlistanegra",
        type:"POST",
        func: function (req,res) {
            var decrimData = new DecrimData();
            decrimData.getSearchListaNegra(req.body, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/decrimdata/createpdf",
        type:"POST",
        func: function (req,res) {
            var decrimData = new DecrimData();
            decrimData.createPDF(req.body, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/decrimdata/getfile/:filename",
        type:"GET",
        func: function (req,res) {
            var decrimData = new DecrimData();
            decrimData.getFile(req.params.filename, res);
        }
    });
  
    return routes;
}

module.exports = DecrimDataController;