function getForm() {
    return document.getElementById("formu");
}

function authUser() {
    var form = getForm();
    if (form.user.value.length > 0 && form.pass.value.length > 0) {
        var usuarioManager = new UsuarioManagerHandler();
        usuarioManager.authCliente(form.user.value, form.pass.value, 0, function (responseManager) {
            console.log(responseManager);
            setTimeout(function () {
                window.location.href = responseManager.getObject().urlRedirect;     
            }, 100);
           
        },  function (responseManager) {
            console.log(responseManager);
        });
    } else {
        alert("Debe ingresar el usuario y el password");
    }
}

var postLogin = null;
var postLogout = null;

function isLogued() {
    var usuarioManager = new UsuarioManagerHandler();
    usuarioManager.isLogued(function (responseManager) {
            console.log(responseManager);
            if (postLogin != null) {
                postLogin(responseManager.getObject());
            }
             
        },  function (responseManager) {
            
        });
}

function logout() {
    var usuarioManager = new UsuarioManagerHandler();
    usuarioManager.logOut(function (responseManager) {
            console.log(responseManager);
             if (postLogout != null) {
                postLogout(responseManager.getObject());
            }
        },  function (responseManager) {
            console.log(responseManager);
            
        });
}

function recuperarPass(form) {
    if (form.user.value.length > 0) {
        var usuarioManager = new UsuarioManagerHandler();
        usuarioManager.recoverPass(form.user.value, function (responseManager) {
                console.log(responseManager);
                alert(responseManager.object);
            },  function (responseManager) {
                console.log(responseManager);
                alert(responseManager.object);
            });
    } else {
        alert("Debe ingresar un correo electrónico");
    }
}