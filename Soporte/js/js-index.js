revSesion();
const bd="https://script.google.com/macros/s/AKfycbz0g_YAIggCzGo0dK9OXPuqJGJJhNeHPV2zttieAYU8Zbc0tSPNb--SWm4_vSiU1txH7g/exec";

document.getElementById("sesion").addEventListener('click',(e)=>{
    verificarUsuario();
})
document.getElementById("password").addEventListener("keyup", function(e) {
        if (e.key === 'Enter') {
            verificarUsuario();
        }
});

function verificarUsuario(){
    let usu=document.getElementById("usuario").value;
    let pass=document.getElementById("password").value;
    if (usu==='' && pass===''){
        mensaje('warning','Cuenta de usuario','Ingresa tu usuario y contraseña.');
        return;
    }

    let spinner=document.getElementById("contentspinner");
    spinner.style.visibility='visible';
    let url=`${bd}?type=verUsu`;
    const formData = new FormData();
    formData.append('usu',usu);
    formData.append('pass',pass);
    fetch(url,{
        method : 'POST',
        body : formData
    })
    .then(res=>res.json())
    .then(data=>{
        if (data.rpt.length>10 && data.rpt.match(/^[0-9]+$/)){
            sesion('key',data.rpt);
            sesion('usu',data.usu);
            location.href ='home.html';
        }else{
            if(data.rpt==='NoActivo'){
                mensaje('error','Cuenta de usuario','Comunicate con soporte técnico.');
            }else if(data.rpt==='NoExiste'){
                mensaje('error','Cuenta de usuario','No se ha podido encontrar tu cuenta.');
            }else if(data.rpt==='NoPassword'){
                mensaje('error','Cuenta de usuario','Por favor, verifique sus datos.');
            }else{
                mensaje('error','Cuenta de usuario','Verificar los datos ingresados.');
            }
            spinner.style.visibility='hidden';
        }
    })
    .catch(error => {
        mensaje('error','Error de conexión','Comunicate con soporte técnico.');
        console.log(error);
        spinner.style.visibility='hidden';
    });
}

function sesion(llave, texto){
    if (window.sessionStorage){
        sessionStorage.setItem(llave, texto);
    }else{
        throw new Error('Tu Navegador no soporta sessionStorage!');
    }
}

function revSesion(){
    if(leerSesion('usu')!=null && leerSesion('key')!=null){
        location.href ='home.html';
    }
}

function leerSesion(llave){
    let valor="";
    if (window.sessionStorage) {
        valor= sessionStorage.getItem(llave);
    }
      else{
        throw new Error('Tu Navegador no soporta sessionStorage!');
    }
    return valor;
}

function mensaje(tip, titulo, texto){
    Swal.fire({
        icon: tip,
        title: titulo,
        text: texto
    })
}
