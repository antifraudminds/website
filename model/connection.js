//Datos de Conexion a la Base de Datos.
var DBUSER = "antifraudminds";
var DBPASS = "4nt1fr4udm1nd5";
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
          host     : "172.30.189.141", //isOpenShift ? process.env.OPENSHIFT_MYSQL_DB_HOST : process.env.IP,
          port     : 3306,
          user     : DBUSER,
          password : DBPASS,
          database : DBNAME
        };
        
    }
}

module.exports = Connection;