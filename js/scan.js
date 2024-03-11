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