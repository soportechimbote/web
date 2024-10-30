listarEquipos();
tooltipAct();
var consDatos={};
var myModal = new bootstrap.Modal(document.getElementById('forItemHV'));
function listarEquipos(){
    let url=`${bd}?type=listEquipo`;
    fetch(url)
    .then(res=>res.json())
    .then(data=>{
        //if (Object.keys(data).length === 0 || data.constructor !== Object){mensaje('error','Error de conexión','Se Produjo un Error, se volverá a cargar la página.');return;}    
        //listarArray(data)
        //consDatos.equipo=data.equipo; 
        consDatos.estado=data.estado;
        consDatos.marca=data.marca;
        consDatos.modelo=data.modelo;
        consDatos.tipo=data.tipo;
        document.getElementById("listaEquipos").innerHTML="";
        listarEquipoHtml(data.equipo);        
    })
}

function listarEquipoHtml(datos){
    let plantilla='';
    let idEq=[];
    datos.forEach(element => {
        idEq.push(element[0]);
        let idModelo=element[6];
        let idMarca=buscarArrays(consDatos.modelo,0,5,idModelo);
        let idTipo=buscarArrays(consDatos.modelo,0,6,idModelo);
        let idEstado=element[5];
        plantilla =`
                                <div class="pag-card">
                                    <div class="pag-card-body position-relative">
                                        <div class="row">
                                            <div class="col-7 col-md-6">
                                                <div class="row">
                                                    <div class="col-sm-2 p-0 justify-content-center align-items-center">
                                                        <img src="https://drive.google.com/thumbnail?id=${buscarArrays(consDatos.modelo,0,2,idModelo)}" class="align-self-center img-fluid thumb-30" alt="...">
                                                        <div class="fw-normal small text-truncate des-tipo-equipo">${buscarArrays(consDatos.tipo,0,1,idTipo)}</div>
                                                    </div>
                                                    <div class="col-sm-10 text-start">
                                                        <div class="text-truncate">
                                                            <p class="d-inline fw-bold fs-5">${element[1]}</p>
                                                            <div class="d-inline text-truncate small">
                                                                <span class="badge rounded-pill ${buscarArrays(consDatos.estado,0,2,idEstado)}">${buscarArrays(consDatos.estado,0,1,idEstado)}</span> | <i class="bi bi-calendar3"></i> ${element[4].substr(6, 4)} 
                                                            </div>
                                                            <div class="d-block small mostAsig">
                                                                <div class="single-line usu-equipo" atrEquipo="${element[0]}">
                                                                    <span class="loader2"></span>
                                                                </div>
                                                            </div>
                                                        </div>                                                         
                                                    </div>
                                                </div>                        
                                            </div>
                                            <div class="col-5 col-md-6 text-start text-truncate">
                                                <p class="d-inline small">${element[2]}</p>
                                                <div class="fs-6 text-truncate">
                                                    <p class="d-inline text-secondary smaller">${element[3]}</p>
                                                    <p class="d-inline text-info small">${buscarArrays(consDatos.marca,0,2,idMarca)} ${buscarArrays(consDatos.modelo,0,1,idModelo)}</p>
                                                </div>                                                                                                                                               
                                            </div>                                          
                                        </div>  
                                        <div class="position-absolute bottom-0 end-0 m-2">
                                            <a href="#" class="d-inline ico-pag-card text-primary">
                                                <i class="bi bi-binoculars-fill" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Mas datos del equipo"></i>
                                            </a>
                                            <a href="#" class="d-inline ico-pag-card text-success disabled btnHojavida" idEquipo="${element[0]}"  data-bs-toggle="offcanvas" data-bs-target="#hojavidacanva" aria-controls="hojavidacanva">
                                                <i class="bi bi-clipboard2-fill" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Ver Hoja de Vida"></i>
                                            </a>
                                            <a href="#" class="d-inline ico-pag-card text-primary d-none">
                                                <i class="bi bi-pencil-fill"></i>
                                            </a>
                                            <a href="#" class="d-inline ico-pag-card text-danger d-none">
                                                <i class="bi bi-trash3-fill"></i>
                                            </a>                                            
                                        </div>              
                                    </div>
                                </div>  
                    `;
        const contenEquipo = document.createElement("div");
        contenEquipo.classList.add('col-12', 'pb-2');
        contenEquipo.innerHTML=plantilla;
        document.getElementById("listaEquipos").appendChild(contenEquipo);
    });
    listarUsuarios(idEq);
    selHojaVida();
    //selItemHV();
    tooltipAct();
    if(iconoPagCarga()==='1')iconoPagCarga('hide');     
}

function listarUsuarios(list){
    let url=`${bd}?type=usuEquipo`;
    const formData = new FormData();
    formData.append('lisID',list);
    fetch(url,{
        method : 'POST',
        body : formData
    })
    .then(res=>res.json())
    .then(data=>{
        mostrarUsurioHtml(data);
    })
}

function mostrarUsurioHtml(list){    
    let usu= document.querySelectorAll(".usu-equipo");
    if (usu.length  ===0)return;
    for (let i in usu){
        let validar=0;
        const element = usu[i];
        for(let ii in list){            
            const id=list[ii]; 
            if (id[0]===usu[i].getAttribute("atrequipo")){                 
                let txtUsu=id[1]===null ? "":id[1].toLowerCase();
                let txtArea=id[2]===null ? "":id[2].toLowerCase();
                txtUsu=txtUsu.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
                txtArea=txtArea.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
                element.innerHTML = `<h6>${txtUsu}</h6> <small class="text-muted">${txtArea}</small>`;
                delete(list[ii]);
                validar=1;
                element.classList.remove("usu-equipo");
                break;
            }
        }
        if(validar===0)element.innerHTML ="No asignado";     
    }
    btnHVEnabled();   
}

function btnHVEnabled(){
    const btnHV=document.querySelectorAll(".btnHojavida");
    for(var i=0; i<btnHV.length; i++) {
        const btn=btnHV[i];  
        btnHV[i].classList.remove("disabled");
    }
}

function buscarArrays(lista,colb,colm,valor){
    lista.find(a=>{
        if(a[colb]===valor){
            valor=a[colm];
        }
    });
    return valor;
}

EquiScroll()

function EquiScroll() {
    window.onscroll = function(){
        if((window.innerHeight +window.scrollY)>=document.body.offsetHeight) {
            if (iconoPagCarga()==="0"){
                iconoPagCarga('show');
                let cant= document.getElementsByClassName("pag-card").length;
                let url=`${bd}?type=listEquipo`;
                const formData = new FormData();
                formData.append('cant',cant);
                fetch(url,{
                    method : 'POST',
                    body : formData
                })
                .then(res=>res.json())
                .then(data=>{
                    if(data.equipo !== "0"){
                        //consDatos.equipo=consDatos.equipo.concat(data.equipo); 
                        listarEquipoHtml(data.equipo);                        
                    } else{
                        iconoPagCarga('fin');
                    }                    
                })
            }            
        }     
    };
}

function iconoPagCarga(val=''){
    let icoCarga = document.getElementById("loader-equipo");
    let valorCarga=icoCarga.getAttribute("valorScroll");
    if(val==='')return valorCarga;
    if(val==='show'){
        icoCarga.classList.remove("d-none");
        icoCarga.setAttribute("valorScroll","1");
    }else if(val==='hide'){
        icoCarga.setAttribute("valorScroll","0");
        icoCarga.classList.add("d-none");      
    }else if(val==='fin'){
        icoCarga.setAttribute("valorScroll","2");
        icoCarga.classList.add("d-none");
    } else if(val==='ini'){
        icoCarga.setAttribute("valorScroll","0");
        icoCarga.classList.add("d-none");
    }
}

document.getElementById('buscar-text').addEventListener('click',(e)=>{
    buscadorEquipo();
})

document.getElementById("text-buscar").addEventListener("keyup", function(e) {
    if (e.key === 'Enter') {
        buscadorEquipo();
    }
});

function buscadorEquipo(){
    const txt= document.getElementById('text-buscar').value;
    document.getElementById("filtro-equipo").value=0;
    limpiarListaEquipos();
    iconoPagCarga('fin');
    let url=`${bd}?type=busEquipo`;
    const formData = new FormData();
    formData.append('cod',txt);
    fetch(url,{
        method : 'POST',
        body : formData
    })
    .then(res=>res.json())
    .then(data=>{
        document.getElementById("listaEquipos").innerHTML="";
        listarEquipoHtml(data);                   
    }) 
}

function limpiarListaEquipos(){
    const nodo=`<div class="col-12 pb-2">
    <div class="pag-card">
        <div class="pag-card-body position-relative">
            <div class="row">
                <div class="col-7 col-md-6">
                    <div class="row">
                        <div class="col-sm-2 p-0 justify-content-center align-items-center">                                                        
                            <div class="fw-normal text-truncate des-tipo-equipo"></div>
                        </div>
                        <div class="col-sm-10 text-start">
                            <div class="text-truncate">
                                <p class="d-inline fw-bold fs-5"><span class="loader1"></span></p>
                                <div class="d-inline text-truncate small">                                                                
                                </div>
                                <div class="d-block text-truncate small">                                                                
                                </div>
                            </div>                                                         
                        </div>
                    </div>                        
                </div>
                <div class="col-5 col-md-6 text-start">
                    <p class="d-inline small des-modelo-equipo"></p>
                    <div class="fs-6 text-truncate">
                        <p class="d-inline text-secondary smaller"></p>
                        <p class="d-inline text-info small"></p>
                    </div>                                                                                                                                               
                </div>                                            
            </div>            
        </div>
    </div>                                
</div> `;
document.getElementById("listaEquipos").innerHTML=nodo;
}

document.getElementById("filtro-equipo").addEventListener("change", function(e) {
    const valor=e.target.value;
    document.getElementById("text-buscar").value="";
    limpiarListaEquipos();
    if(valor==='1'){        
        listarEquipos();
        iconoPagCarga('ini');
    }else{
        let url=`${bd}?type=filEquipo`;
        const formData = new FormData();
        formData.append('fil',valor);
        fetch(url,{
            method : 'POST',
            body : formData
        })
        .then(res=>res.json())
        .then(data=>{
            document.getElementById("listaEquipos").innerHTML="";
            listarEquipoHtml(data);
            iconoPagCarga('fin');                 
        }) 
    }
});

document.getElementById('buscar-qr').addEventListener('click',(e)=>{
    //buscarAct();
})

function tooltipAct(){
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
    })
}


function selHojaVida(){    
    let iHV = document.getElementsByClassName('btnHojavida');
    for (let i = 0; i < iHV.length; i++) {
        iHV[i].addEventListener('click', detalleNodoEqui);
    } 
}

function selItemHV(){    
    let iHV = document.getElementsByClassName('itemHV');
    for (let i = 0; i < iHV.length; i++) {
        iHV[i].addEventListener('click', detalleNodoItemHV);
    } 
}

function detalleNodoItemHV(e){
    //console.log(this);
}

function detalleNodoEqui(e) {
    document.getElementById("generarPDF").classList.add('d-none'); 
    let nodo=this.parentNode.parentNode;
    const idHV= this.getAttribute("idEquipo");   
    document.getElementById('selCodPatr').innerText=nodo.querySelector(".fs-5").textContent;
    document.getElementById('selCodPatr').setAttribute('idequipo',idHV);
    const noAsig= nodo.querySelector(".mostAsig .single-line");
    if(noAsig.classList.contains('usu-equipo')){
        document.getElementById('selCodPatr').setAttribute('arequipo',"---");
        document.getElementById('selCodPatr').setAttribute('resequipo',"---");
    }else{
        document.getElementById('selCodPatr').setAttribute('arequipo',nodo.querySelector("div.d-block.small small").textContent);
        document.getElementById('selCodPatr').setAttribute('resequipo',nodo.querySelector("div.d-block.small h6").textContent);
    }    
    document.getElementById('selImgEqu').setAttribute("src",nodo.querySelector("img").getAttribute("src"));
    document.getElementById('selModeloEqui').innerHTML=nodo.querySelector("p.d-inline.text-info.small").textContent;
    document.getElementById('selSerieEqui').innerHTML=nodo.querySelector("p.d-inline.text-secondary.smaller").textContent;
    document.getElementById('selDesEqui').innerText=nodo.querySelector("p.d-inline.small").textContent;
    document.getElementById('selTipEqu').innerText=nodo.querySelector(".des-tipo-equipo").textContent;
    loaderHVHtml();
    listarHV(idHV);
}

function loaderHVHtml(){
    document.getElementById("listaHV").innerHTML=`
    <div class="row ps-3 pe-3 mb-1">                
        <div class="list-group w-100 p-0">
            <div class="list-group-item list-group-item-action border">
                <div class="container">
                    <div class="row justify-content-center">
                        <span class="loader3"></span> 
                    </div>   
                </div>      
            </div>
        </div>
    </div>
    `;
}

function listarHV(idHV){
    let url=`${bd}?type=lisHV`;
    const formData = new FormData();
    formData.append('id',idHV);
    fetch(url,{
        method : 'POST',
        body : formData
    })
    .then(res=>res.json())
    .then(data=>{
        if(data==''){
            document.getElementById("listaHV").innerHTML=HtmlHVSinDatos();
        }else{
            listarHVHtml(data); 
        }
        document.getElementById("generarPDF").classList.remove('d-none');            
    })    
}

function listarHVHtml(datos){
    let plantilla='';
    let idEq=[];
    datos.forEach(element => {        
        plantilla +=HtmlHV(element);
    });
    document.getElementById("listaHV").innerHTML=plantilla;    
}
function agregarItemHVHtml(data){
    let element=['',data.get('acc'),data.get('des'),data.get('obs'),data.get('fec'),data.get('cod'),data.get('are'),data.get('res'),''];
    let html=document.getElementById("listaHV").innerHTML;
    document.getElementById("listaHV").innerHTML= html.includes('No hay datos para mostrar') ? HtmlHV(element) : HtmlHV(element) + document.getElementById("listaHV").innerHTML;
}

function HtmlHVSinDatos(){
    return `
    <div class="row ps-3 pe-3 mb-1">                
        <div class="list-group w-100 p-0">
            <div class="list-group-item list-group-item-action border">
                <div class="container">
                    <div class="row justify-content-center">
                        No hay datos para mostrar 
                    </div>   
                </div>      
            </div>
        </div>
    </div>
    `;
}

function HtmlHV(element){
    const fecha=new Date(element[4]);
    let forFecha=  minTwoDigits(fecha.getDay()) +'/'+ minTwoDigits(fecha.getMonth()) +'/'+ fecha.getFullYear() +' '+ fecha.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    return `
    <div class="row ps-3 pe-3 mb-1">                
            <div class="list-group w-100 p-0">
                <div class="list-group-item list-group-item-action border itemHV">
                    <div class="container">
                        <div class="row">
                            <div class="col p-0">
                                <ul class="list-group mb-0">
                                    <li class="d-flex justify-content-between align-items-start text-truncate">
                                        <div class="me-auto">
                                           <strong class="d-inline text-gray-dark font14 iHVCodR">${element[5]}</strong> 
                                        </div>
                                        <small class="d-inline text-muted font11 pt-1"><i class="bi bi-calendar-week"></i> <small class="iHVFech">${forFecha}</small></small>
                                    </li>
                                    <li class="d-flex align-items-start font14">
                                        <strong class="d-inline text-gray-dark pe-1">Acc:</strong>
                                        <p class="text-muted mb-0 text-truncate iHVAcc">${element[1]}</p>
                                    </li>
                                    <li class="d-flex align-items-start font14">
                                        <strong class="d-inline text-gray-dark pe-1">Desc:</strong>
                                        <p class="text-muted mb-0 text-truncate iHVDesc">${element[2]}</p>
                                    </li>
                                    <p class="d-none iHVObs">${element[3]}</p>
                                    <p class="d-none iHVArea">${element[6]}</p>
                                    <p class="d-none iHVResp">${element[7]}</p>
                                </ul>
                            </div>
                        </div>   
                    </div>      
                </div>
            </div>
        </div>
    `;
}

document.getElementById('gbrItemHV').addEventListener('click',(e)=>{
    controlHVactdesc(true);    
    let url=`${bd}?type=regHV`;
    const formData = new FormData();
    formData.append('acc',document.getElementById('accionHV').value);
    formData.append('des',document.getElementById('descrHV').value);
    formData.append('obs',document.getElementById('obserHV').value);
    formData.append('fec',document.getElementById('fechaHV').value);
    formData.append('cod',document.getElementById('codRefHV').value);
    formData.append('ide',document.getElementById('selCodPatr').getAttribute('idequipo'));
    formData.append('are',document.getElementById('selCodPatr').getAttribute('arequipo'));
    formData.append('res',document.getElementById('selCodPatr').getAttribute('resequipo'));
    formData.append('idu',leerSesion('key'));
    fetch(url,{
        method : 'POST',
        body : formData
    })
    .then(res=>res.json())
    .then(data=>{
        if(data==='ok'){
            agregarItemHVHtml(formData);
            limpiarFormHV();
            msgAlerta('Se registró correctamente.','ok');
        }else{
            msgAlerta('Hay problemas para registrar.','er');          
        }
        controlHVactdesc(false);
        myModal.hide();
    })    
});
document.getElementById('btnNuevoHV').addEventListener('click',(e)=>{
    document.getElementById('codPatHV').innerText=document.getElementById('selCodPatr').innerText;
    hoy();
});

function hoy(){
    const fecha = new Date(); //Fecha actual
    const mes = fecha.getMonth()+1; //obteniendo mes
    const dia = fecha.getDate(); //obteniendo dia
    const ano = fecha.getFullYear(); //obteniendo año
    const hora = fecha.getHours(); //obteniendo hora
    const minutos = fecha.getMinutes(); //obteniendo minuto
    document.getElementById('fechaHV').value=ano+"-"+minTwoDigits(mes)+"-"+minTwoDigits(dia)+"T"+minTwoDigits(hora)+":"+minTwoDigits(minutos);
}
function minTwoDigits(n) {
    return (n < 10 ? '0' : '') + n;
}

function controlHVactdesc(valor){
    document.getElementById('accionHV').disabled = valor;
    document.getElementById('descrHV').disabled = valor;
    document.getElementById('obserHV').disabled = valor;
    document.getElementById('fechaHV').disabled = valor;
    document.getElementById('codRefHV').disabled = valor;
    if(valor){
        document.getElementById('gbrItemHV').innerHTML = '<i class="bi bi-pencil"></i> Registrando...';
    }else{
        document.getElementById('gbrItemHV').innerHTML = 'Grabar información';
    }
}

function limpiarFormHV(){
    document.getElementById('accionHV').value = "";
    document.getElementById('descrHV').value = "";
    document.getElementById('obserHV').value = "";
    document.getElementById('fechaHV').value = "";
    document.getElementById('codRefHV').value = "DTI-00000";
    document.getElementById('gbrItemHV').innerHTML = 'Grabar información';
}

document.getElementById('buscar-qr').addEventListener('click',(e)=>{
    encenderCamaraCB();
    document.getElementById("btnScanCB").disabled = true;
    document.getElementById("btnScanCB").innerHTML ="Escaneando código de barras";
    document.getElementById('btnScanQR').disabled=false;
    document.getElementById("btnScanQR").innerHTML ="Encender camara - código QR";
    document.getElementById('btnScanCB').classList.remove("btn-secondary");
    document.getElementById('btnScanCB').classList.add("btn-success");
    document.getElementById('btnScanQR').classList.remove("btn-success");
    document.getElementById('btnScanQR').classList.add("btn-secondary");
});
document.getElementById('cerrarForQR').addEventListener('click',(e)=>{
    cerrarEscaneres();
});
document.getElementById('cerrarForQR2').addEventListener('click',(e)=>{
    cerrarEscaneres();
});
function cerrarEscaneres(){
    if(document.getElementById("btnScanCB").disabled == true){
        cerrarCamaraCB();
    }else{
        cerrarCamaraQR();
    }   
}

///// <! Lector de código QR. >
const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");
const scanCB = document.getElementById("contenedorCB");
var myModalQR = new bootstrap.Modal(document.getElementById('forQR'));
let scanning = false;

const encenderCamaraQR = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then(function (stream) {
        scanning = true;
        canvasElement.hidden = false;
        scanCB.hidden = true;
        video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
        video.srcObject = stream;
        video.play();
        tick();
        scan();
        document.getElementById("btnScanQR").innerHTML ="Escaneando código QR";
      });
  };
  
  //funciones para levantar las funiones de encendido de la camara
  function tick() {
    canvasElement.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
  
    scanning && requestAnimationFrame(tick);
  }
  
  function scan() {
    try {
      qrcode.decode();
    } catch (e) {
      setTimeout(scan, 300);
    }
  }
  
  //apagara la camara
  const cerrarCamaraQR = () => {
    video.srcObject.getTracks().forEach((track) => {
      track.stop();
    });
    canvasElement.hidden = true;
  };

  qrcode.callback = (respuesta) => {
    if (respuesta) {
        document.getElementById('text-buscar').value = respuesta;   
        buscadorEquipo();     
        cerrarCamaraQR();       
        myModalQR.hide();
    }
  };
///// <! /Lector de código QR. >

  ///// <! Lector de código de barras. >
  const encenderCamaraCB = () =>{
	Quagga.init({
		inputStream: {
			constraints: {
				width: 1920,
				height: 1080,
			},
			name: "Live",
			type: "LiveStream",
			target: document.querySelector('#contenedorCB'), // Pasar el elemento del DOM
		},
		decoder: {
			readers: ["code_128_reader"]
		}
	}, function (err) {
		if (err) {
			console.log(err);
			return
		}
		document.getElementById("btnScanCB").innerHTML ="Escaneando código de barras";
		Quagga.start();
        canvasElement.hidden = true;
        scanCB.hidden = false;
	});

	Quagga.onDetected((data) => {
        document.getElementById('text-buscar').value = data.codeResult.code;   
        buscadorEquipo();     
        cerrarCamaraCB();        
        myModalQR.hide();
	});
 }
 
 const cerrarCamaraCB = () => {
    Quagga.stop();
 }
 ///// <! /FinLector de código de barras. >

document.getElementById('btnScanCB').addEventListener('click',(e)=>{
    document.getElementById("btnScanCB").disabled = true;
    document.getElementById('btnScanQR').disabled=false;
    document.getElementById('btnScanCB').classList.remove("btn-secondary");
    document.getElementById('btnScanCB').classList.add("btn-success");
    document.getElementById('btnScanQR').classList.remove("btn-success");
    document.getElementById('btnScanQR').classList.add("btn-secondary");
    document.getElementById("btnScanQR").innerHTML ="Encender camara - código QR";
    cerrarCamaraQR();
    encenderCamaraCB();
});

document.getElementById('btnScanQR').addEventListener('click',(e)=>{
    document.getElementById('btnScanQR').disabled= true;
    document.getElementById('btnScanCB').disabled=false;
    document.getElementById('btnScanCB').classList.remove("btn-success");
    document.getElementById('btnScanCB').classList.add("btn-secondary");
    document.getElementById('btnScanQR').classList.remove("btn-secondary");
    document.getElementById('btnScanQR').classList.add("btn-success");
    document.getElementById("btnScanCB").innerHTML ="Encender camara - código de barras";
    cerrarCamaraCB();
    encenderCamaraQR();
});

var contImpJS=0, pdfout= document.getElementById('generarPDF');
pdfout.onclick= function(){   
    if (contImpJS==0){
        importarScript("js/font/fontArial.js");
        importarScript("js/font/fontCalibri.js",pdf);
        contImpJS++;
    }else{
        pdf();
    }    
}

function pdf(){
    let selCodPatr=document.getElementById('selCodPatr').innerText;
    let selDesEqui=document.getElementById('selDesEqui').innerText;
    let selTipEqu=document.getElementById('selTipEqu').innerText;
    let selModeloEqui=document.getElementById('selModeloEqui').innerText;
    let selSerieEqui=document.getElementById('selSerieEqui').innerText;
    let iHV = document.getElementsByClassName('itemHV');

    var doc= new jsPDF('l','mm','a4');
    doc.addFileToVFS("Arial.ttf", fontArial);            
    doc.addFont("Arial.ttf", "Arial", "normal");
    doc.addFileToVFS("ArialBold.ttf", fontArialBold);
    doc.addFont("ArialBold.ttf", "Arial", "bold");
    doc.addFileToVFS("Calibri.ttf", fontCalibri);
    doc.addFont("Calibri.ttf", "Calibri", "normal");
    doc.addFileToVFS("CalibriBold.ttf", fontCalibriBold);
    doc.addFont("CalibriBold.ttf", "Calibri", "bold");
    doc.addFileToVFS("CalibriItalic.ttf", fontCalibriItalic);
    doc.addFont("CalibriItalic.ttf", "Calibri", "italic");
    doc.addFileToVFS("CalibriBoldItalic.ttf", fontCalibriBoldItal);
    doc.addFont("CalibriBoldItalic.ttf", "Calibri", "bolditalic");

    //
    let limitxPag=10, numPag=0;
    let paginas=Math.trunc(iHV.length/limitxPag);
    paginas=(paginas==0) ? 1 : ((iHV.length % limitxPag ==0)? paginas : paginas +1);
    let itemMostrar= iHV.length;
    let ii=0, iPag=0;
    //
    
    do{        
        if(numPag>0) doc.addPage('a4','l');
        doc.line(14, 14, 273, 14);
        doc.line(14, 30, 273, 30);
        doc.line(14, 14, 14, 30);
        doc.line(273, 14, 273, 30);
        doc.line(75, 14, 75, 30);
        doc.line(222, 14, 222, 30);
    
        doc.line(32, 38, 262, 38);
        doc.line(32, 74, 262, 74);
        doc.line(32, 38, 32, 74);
        doc.line(262, 38, 262, 74);
        doc.line(82, 38, 82, 74);
        doc.line(32, 45.2, 262, 45.2);
        doc.line(32, 52.4, 262, 52.4);
        doc.line(32, 59.6, 262, 59.6);
        doc.line(32, 66.8, 262, 66.8);
    
        doc.line(14.5, 86, 275, 86);
        doc.line(14.5, 163, 275, 163);
        doc.line(14.5, 86, 14.5, 163);
        doc.line(275, 86, 275, 163);
        doc.line(57, 86, 57, 163);
        doc.line(106, 86, 106, 163);
        doc.line(134, 86, 134, 163);
        doc.line(162, 86, 162, 163);
        doc.line(202, 86, 202, 163);
        doc.line(247, 86, 247, 163);
    
        doc.line(14.5, 93, 275, 93);
        doc.line(14.5, 100, 275, 100);
        doc.line(14.5, 107, 275, 107);
        doc.line(14.5, 114, 275, 114);
        doc.line(14.5, 121, 275, 121);
        doc.line(14.5, 128, 275, 128);
        doc.line(14.5, 135, 275, 135);
        doc.line(14.5, 142, 275, 142);
        doc.line(14.5, 149, 275, 149);
        doc.line(14.5, 156, 275, 156);            
    
        let logo = new Image();
        logo.src = 'img/logoucv.png';
        doc.addImage(logo, 'JPEG', 22.22,18.4 ,43.56,7.2);
    
        doc.setFontSize(12);
        doc.setFont('Arial','bold');
        doc.text('HOJA DE VIDA', 135, 23);
        doc.setFontSize(9);
        doc.setFont('Arial','normal');
        doc.text('Código     :  F04-PS-PR-04.02', 223.8, 17);
        doc.text('Página     :  '+ (numPag +1) +' de '+ (paginas), 223.8, 29);
        doc.setTextColor(0,0,255);
        doc.text('Versión    :  07', 223.8, 21);
        doc.text('Fecha      :  06-07-2023', 223.8, 25);
        doc.setTextColor(0,0,0);
        doc.setFont('Calibri','normal');
        doc.setFontSize(11);
        doc.text("Código de Patrimonio:", 80.4, 43, "right");
        doc.text("Descripción del Equipo:", 80.4, 50.2, "right");
        doc.text("Tipo de Equipo:", 80.4, 57.4, "right");
        doc.text("Marca:", 80.4, 64.6, "right");
        doc.text("Serie:", 80.4, 71.8, "right");
        //acá va el contenido 
        doc.text(selCodPatr, 172, 43, "center"); //+7.2
        doc.text(selDesEqui, 172, 50.2, "center");
        doc.text(selTipEqu, 172, 57.4, "center");
        doc.text(selModeloEqui, 172, 64.6, "center");
        doc.text(selSerieEqui, 172, 71.8, "center");
        //\acá va el contenido 
        doc.text("Acción", 35.75, 90.9, "center");
        doc.text("Descripción", 81.5, 90.9, "center");
        doc.text("Fecha y Hora", 120, 90.9, "center");
        doc.text("Área", 148, 90.9, "center");
        doc.text("Responsable", 182, 90.9, "center");
        doc.text("Observación", 224.5, 90.9, "center");
        doc.text("Cod. Referencia", 261, 90.9, "center");
        //acá va el contenido
        doc.setFontSize(10);    
        let detEjeY=97.9;
        let cantI= (itemMostrar<=limitxPag) ? itemMostrar : limitxPag;
        iPag=ii+cantI;
        for (let i = ii; i < iPag; i++) {            
            let nodo=iHV[i];
            let iHVAcc=doc.splitTextToSize(nodo.querySelector(".iHVAcc").textContent, 42);
            let iHVDesc=doc.splitTextToSize(nodo.querySelector(".iHVDesc").textContent, 49);
            let iHVFech=doc.splitTextToSize(nodo.querySelector(".iHVFech").textContent, 28);
            let iHVCodR=doc.splitTextToSize(nodo.querySelector(".iHVCodR").textContent, 28);
            let iHVObs=doc.splitTextToSize(nodo.querySelector(".iHVObs").textContent, 45);
            let iHVAre=doc.splitTextToSize(nodo.querySelector(".iHVArea").textContent, 28);
            let iHVResp=doc.splitTextToSize(nodo.querySelector(".iHVResp").textContent, 40);
            doc.text(iHVAcc[0], 35.75, detEjeY, "center");
            doc.text(iHVDesc[0], 81.5, detEjeY, "center");
            doc.text(iHVFech[0], 120, detEjeY, "center");
            doc.text(iHVAre[0], 148, detEjeY, "center");
            doc.text(iHVResp[0], 182, detEjeY, "center");
            doc.text(iHVObs[0], 224.5, detEjeY, "center");
            doc.text(iHVCodR[0], 261, detEjeY, "center");
            detEjeY+=7;
            ii++;
        }
        doc.setFontSize(8.5);
        doc.setFont('Calibri','bolditalic');
        doc.text("NOTA: ", 32.3, 198);
        doc.setFont('Calibri','italic');
        doc.text("Cualquier documento impreso diferente del original, y cualquier archivo electrónico que se encuentren fuera del campus virtual Trilce serán considerados como COPIA NO CONTROLADA.", 41.5, 198);
        itemMostrar-=limitxPag;
        numPag++;
    }while(itemMostrar>0)    
    doc.save('HV_' + selCodPatr);
}