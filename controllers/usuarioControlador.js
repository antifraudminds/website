var Usuario = require("../model/usuario.js");

var UsuarioControlador = function (routes) {
    routes.push({
        path:"/usuario",
        type:"PUT",
        func: function (req,res) {
            var session = req.session;
            if (session.cliente) {
                var usuario = new Usuario();
                usuario.insertarUsuario(req.body, function(responseManager) {
                    res.send(responseManager); 
                });
            } else {
                res.send({error:"No authUser"});
            }
        }
    });
    
    routes.push({
        path:"/usuario",
        type:"POST",
        func: function (req,res) {
            var session = req.session;
            if (session.cliente) {
                var usuario = new Usuario();
                usuario.modificarUsuario(req.body, function(responseManager) {
                    res.send(responseManager); 
                });
            } else {
                res.send({error:"No authUser"});
            }
        }
    });
    
    routes.push({
        path:"/usuario",
        type:"GET",
        func: function (req,res) {
            var session = req.session;
            if (session.cliente) {
                    var usuario = new Usuario();
                    usuario.obtenerUsuarios(function(responseManager) {
                    res.send(responseManager); 
                });
            } else {
                res.send({error:"No authUser"});
            }
        }
    });
    
    routes.push({
        path:"/usuario/get/:id",
        type:"GET",
        func: function (req,res) {
            var session = req.session;
            if (session.cliente) {
                    var usuario = new Usuario();
                    usuario.obtenerUsuario(req.params.id, function(responseManager) {
                    res.send(responseManager); 
                });
            } else {
                res.send({error:"No authUser"});
            }
        }
    });
    
    
    routes.push({
        path:"/usuario/borrar/:idUsuario",
        type:"DELETE",
        func: function (req,res) {
            var usuario = new Usuario();
            usuario.borrarUsuario(req.params.idUsuario, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/usuario/auth",
        type:"POST",
        func: function (req,res) {
            var usuario = new Usuario();
            usuario.authUser(req.body, function(responseManager) {
                if (responseManager.object != null) {
                    var session = req.session;
                    session.cliente = responseManager.object[0] != null ? responseManager.object[0] : responseManager.object;
                    session.cliente.password = "not_delivered";
                    responseManager.object.urlRedirect = session.cliente.tipo == 0 ? "/admin/indexAdmin.html" : "/admin/indexUser.html";
                }
               res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/usuario/logued",
        type:"GET",
        func: function (req,res) {
            var session = req.session;
            if (session.cliente) { session.cliente.password = "not_delivered"; }
            res.send(session.cliente ? { manager:"", error:"NO_ERROR", message: "", object: session.cliente } : { manager:null, error:null, message: null, object: null });
        }
    });
    
    routes.push({
        path:"/usuario/logout",
        type:"GET",
        func: function (req,res) {
            req.session.destroy();            
            res.send({ manager:"", error:"NO_ERROR", message: "", object: null });
        }
    });
    
    routes.push({
        path:"/usuario/notificaciones",
        type:"GET",
        func: function (req,res) {
            var usuario = new Usuario();
            usuario.getNotificaciones(function (responseManager) {
                res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/usuario/notificaciones",
        type:"PUT",
        func: function (req,res) {
            var usuario = new Usuario();
            usuario.insertarNotificaciones(req.body, function (responseManager) {
                res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/usuario/notificaciones/:id",
        type:"DELETE",
        func: function (req,res) {
            var usuario = new Usuario();
            usuario.eliminarNotificacion(req.params.id, function (responseManager) {
                res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/usuario/recoverpass/:email",
        type:"GET",
        func: function (req,res) {
            var usuario = new Usuario();
            usuario.recoverPass(req.params.email, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    routes.push({
        path:"/usuario/contacto",
        type:"PUT",
        func: function (req,res) {
            var usuario = new Usuario();
            usuario.recoverPass(req.body, function(responseManager) {
               res.send(responseManager); 
            });
        }
    });
    
    return routes;
}

module.exports = UsuarioControlador;