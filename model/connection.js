//Datos de Conexion a la Base de Datos.
var DBUSER = "antifraudminds";
var DBPASS = "4nt1fr4udm1nd5";
var DBNAME = "antifraud_minds";

var hosts = ["10.128.17.37", "mysql.antifraudminds.svc", "172.30.189.141"];

var Mysql = require("mysql");

var Connection = function () {
    //OpenShift
    var isOpenShift = false;
    
    this.attempt = 0;
    
    try {
        if(process.env.OPENSHIFT_MYSQL_DB_HOST) {
            isOpenShift = true;
        }
    } catch(e) {
        isOpenShift = false;
    }
    
    this.getConnParams = function() {
        return {
          host     : hosts[instance.attempt], //isOpenShift ? process.env.OPENSHIFT_MYSQL_DB_HOST : process.env.IP,
          port     : 3306,
          user     : DBUSER,
          password : DBPASS,
          database : DBNAME
        };
        
    }
    
    this.connect = function(conexionCreada) {
        var connParams = instance.getConnParams();
        var connection = Mysql.createConnection(connParams);
        connection.connect(function(err) {
          if (err) {
              instance.attempt++;
                console.error('error connecting: ' + err.stack);
                console.log("retry fallback");
                if (instance.attempt < hosts.length) {
                    instance.connect(conexionCreada);
                }
                return;
          }
        
          console.log('connected as id ' + connection.threadId);
          conexionCreada(connection);
          connection.end();
        });
    }
    
    var instance = this;
}

module.exports = Connection;