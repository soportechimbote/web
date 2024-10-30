const bd="https://script.google.com/macros/s/AKfycbz0g_YAIggCzGo0dK9OXPuqJGJJhNeHPV2zttieAYU8Zbc0tSPNb--SWm4_vSiU1txH7g/exec";

function importarScript(nombre) {
    var s = document.createElement("script");
    s.src = nombre;
    document.querySelector("head").appendChild(s);
}
function importarScript(nombre, callback) {
    var s = document.createElement("script");
    s.onload = callback;
    s.src = nombre;
    document.querySelector("head").appendChild(s);
}

revSesion();
window.onload=function(){
    let url=`${bd}?type=verToken`;
    const formData = new FormData();
    formData.append('key',leerSesion('key'));
    fetch(url,{
        method : 'POST',
        body : formData
    })
    .then(res=>res.json())
    .then(data=>{
        if (data===leerSesion('key')){
            let contenedor=document.getElementById('contenedor_carga');
            contenedor.style.visibility='hidden';
            contenedor.style.opacity='0';            
        }else{
            borrarSesion();
        }
    })
    .catch(error => {
        mensaje('error','Error de conexión','Comunicate con soporte técnico.');
        borrarSesion();
    });      
}

mostrarNomUsuario();

function revSesion(){
    if(leerSesion('usu')===null && leerSesion('key')===null){
        location.replace('index.html');
    }
}
function borrarSesion(){
    cerrarSesion('usu');
    cerrarSesion('key');
    location.replace('index.html');
}

function cerrarSesion(llave){
    if (window.sessionStorage) {
        sessionStorage.removeItem(llave);
    }
      else{
        throw new Error('Tu Navegador no soporta sessionStorage!');
    }
}

function mostrarNomUsuario(){
    let nombre=leerSesion('usu');
    document.getElementById('nUsuario').textContent=nombre +' ';
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

function msgAlerta(texto,tipo){	
	if(tipo==="ok"){
		Swal.fire({
			icon: 'success',
			title: texto,
			toast: true,
			position: 'bottom-end',
			showConfirmButton: false,
			background: '#D4EDDA',
			iconColor: "#157347",
			color: '#157347',
			timer: 2500,
			timerProgressBar: true,
			didOpen: (toast) => {
				toast.addEventListener('mouseenter', Swal.stopTimer)
				toast.addEventListener('mouseleave', Swal.resumeTimer)
			}
		})
	}else if(tipo==="er"){
		Swal.fire({
			icon: 'error',
			title: texto,
			toast: true,
			position: 'bottom-end',
			showConfirmButton: false,
			background: '#F8D7DA',
			iconColor: "#491217",
			color: '#491217',
			timer: 2500,
			timerProgressBar: true,
			didOpen: (toast) => {
				toast.addEventListener('mouseenter', Swal.stopTimer)
				toast.addEventListener('mouseleave', Swal.resumeTimer)
			}
		})
	}
	
}

document.getElementById('closeApp').addEventListener('click',(e)=>{
    cerrarSesion('key');
    cerrarSesion('usu');
    location.href ='index.html';
});

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