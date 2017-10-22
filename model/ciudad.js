var ResponseManager = require("../model/responsemanager.js");
var Connection = require("../model/connection.js");
var FileManager = require("../model/filemanager.js");

//Clase Ciudad
var Ciudad = function () {
    //Obteniendo recursos
    this.mysql = require("mysql");
    this.fs = require("fs");
    this.path = require('path');
    var connection = new Connection();

    var connParams = connection.getConnParams();

    //funciones
    this.crearConexion = function (conexionCreada) {
        connection.connect(conexionCreada);
    }

    this.getAll = function (responseCallback) {
        instance.crearConexion(function (connection) {

            if (connection) {
                var sqlUpdate = "select * from ciudades order by nombre";
                 connection.query(sqlUpdate, function(err, rows) {
                            var responseManager = new ResponseManager();
                            if (err) {
                                responseManager.error = err;
                                responseCallback(responseManager);
                            } else {
                                responseManager.object = rows;
                                responseManager.error = "NO_ERROR";
                                responseCallback(responseManager);
                            }
                 });
            }
        });
    }


    var instance = this;
}

module.exports = Ciudad;
