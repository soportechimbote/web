//crea elemento
const video = document.createElement("video");

//nuestro camvas
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

//div donde llegara nuestro canvas
const btnScanQR = document.getElementById("btn-scan-qr");

//lectura desactivada
let scanning = false;

const encenderCamara = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then(function (stream) {
        scanning = true;
        btnScanQR.hidden = true;
        canvasElement.hidden = false;
        video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
        video.srcObject = stream;
        video.play();
        tick();
        scan();
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
  const cerrarCamara = () => {
    video.srcObject.getTracks().forEach((track) => {
      track.stop();
    });
    canvasElement.hidden = true;
    btnScanQR.hidden = false;
  };
  
    //   const activarSonido = () => {
    //     var audio = document.getElementById('audioScaner');
    //     audio.play();
    //   }
  
  //callback cuando termina de leer el codigo QR
  qrcode.callback = (respuesta) => {
    if (respuesta) {
      //console.log(respuesta);
      Swal.fire(respuesta)
      //activarSonido();
      //encenderCamara();    
      cerrarCamara();    
  
    }
  };

  const encenderCamaraCB = () =>{
	//const $resultados = document.querySelector("#resultado");
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
			readers: ["ean_reader"]
		}
	}, function (err) {
		if (err) {
			console.log(err);
			return
		}
		console.log("Iniciado correctamente");
		Quagga.start();
        btnScanQR.hidden = true;
        canvasElement.hidden = true;
	});

	Quagga.onDetected((data) => {
        document.getElementById('text-buscar').value =   data.codeResult.code;
	});
}