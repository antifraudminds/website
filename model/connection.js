//Datos de Conexion a la Base de Datos.
var DBUSER = "antifraud";
var DBPASS = "4nt1fr4ud";
var DBNAME = "antifraud_minds";

var Connection = function () {
    //OpenShift
    var isOpenShift = false;
    
    try {
        if(process.env.OPENSHIFT_MYSQL_DB_HOST) {
            isOpenShift = true;
        }
    } catch(e) {
        isOpenShift = false;
    }
    
    this.getConnParams = function() {
        return {
          host     : isOpenShift ? process.env.OPENSHIFT_MYSQL_DB_HOST : process.env.IP,
          port     : isOpenShift ? process.env.OPENSHIFT_MYSQL_DB_PORT : 3306,
          user     : DBUSER,
          password : DBPASS,
          database : DBNAME
        };
        
    }
}

module.exports = Connection;