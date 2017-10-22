var Ciudad = require("../model/ciudad.js");

var CiudadControlador = function (routes) {

    routes.push({
        path:"/ciudad/all",
        type:"GET",
        func: function (req,res) {
             var ciudad = new Ciudad();
            ciudad.getAll(function(responseManager) {
               res.send(responseManager);
            });
        }
    });
    return routes;
}

module.exports = CiudadControlador;
