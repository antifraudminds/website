function checkInsertUser(form, objectFields) {
    var errors = "";
    for (var key in objectFields) {
        if (form[key] && form[key].value.length <= 0) {
            errors += "Debe diligenciar el campo " + form[key].getAttribute("placeholder") + "\r\n";
        }
    }
    
    if (errors) {
        alert(errors);
        return false;
    } else {
        return true;
    }
}

function createUser() {
    var form = getForm();
    var usuarioManager = new UsuarioManagerHandler();
    var newUsuario = usuarioManager.getSkeleton();
        if (checkInsertUser(form, newUsuario)) {
        
        
        for (var key in newUsuario) {
            if (form[key]) {
                newUsuario[key] = form[key].value;
            }
        }
        
        usuarioManager.insertarUsuario(newUsuario, function (rs) {
            loadUsuarios();
            form.reset();
            console.log(rs);
        }, function (rs) {
            console.log(rs);
        });
    }
}

function loadUsuarios() {
    var usuarioManager = new UsuarioManagerHandler();
    usuarioManager.getUsuarios(renderUsuarios, function (rs) {
        console.log(rs);
    });
    
}

function renderUsuarios(rs) {
    /*var usuarios = rs.getObject();
    document.getElementById('usuariosContainer').innerHTML = '';
    var htmlUsuarios = "";
    for (var i = 0; i < usuarios.length ; i++) {
        var usuario = usuarios[i];
        htmlUsuarios += '<tr class=""><td>'+usuario.nombres+'</td><td>'+usuario.email+'</td><td>'+usuario.telefono+'</td><td class="center">'+usuario.password+'</td><td><a class="delete" href="javascript:eliminarUsuario('+usuario.id+');">Eliminar</a></td></tr>';
    }
    document.getElementById('usuariosContainer').innerHTML = htmlUsuarios;*/
}

function eliminarUsuario(id) {
    if (confirm("Seguro desea borrar este usuario?")) {
        var usuarioManager = new UsuarioManagerHandler();
        usuarioManager.eliminarUsuario(id, function (rs) {
            console.log(rs);
            loadUsuarios();
        }, function (rs) {
            console.log(rs);
        });
    }
}

$(document).ready(function () {
   loadUsuarios(); 
});