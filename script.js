const btnComenzar = document.getElementById('btn-comenzar');
const pantallaInicio = document.getElementById('pantalla-inicio');
const pantallaPrincipal = document.getElementById('pantalla-principal');
const canvas = document.getElementById('lienzoAnimacion');
const ctx = canvas.getContext('2d');

const canvasParticulas = document.getElementById('lienzoParticulas');
const ctxParticulas = canvasParticulas.getContext('2d');

canvas.width = 800;
canvas.height = 500;
canvasParticulas.width = 800;
canvasParticulas.height = 500;

const txtTitulo = document.getElementById('titulo');
const txtMensaje = document.getElementById('mensaje');
const txtTextoTiempo = document.getElementById('texto-tiempo');
const txtCronometro = document.getElementById('cronometro');

// Fecha de inicio: 28 de Mayo de 2016
const fechaInicio = new Date(2016, 4, 28, 0, 0, 0); 

const centroX_Arbol = canvas.width - 250; 
const sueloY = canvas.height - 60;
const copaY = sueloY - 220; 

var particulasCaida = [];
var floresSuelo = []; 

btnComenzar.addEventListener('click', () => {
    pantallaInicio.classList.add('oculto');
    pantallaPrincipal.classList.remove('oculto');
    animarSemilla();
});

function dibujarGirasol(ctxToDraw, x, y, rPétalo, rCentro) {
    ctxToDraw.fillStyle = '#FFD700'; 
    ctxToDraw.beginPath();
    ctxToDraw.arc(x, y, rPétalo, 0, Math.PI * 2);
    ctxToDraw.fill();

    ctxToDraw.fillStyle = '#8B4513'; 
    ctxToDraw.beginPath();
    ctxToDraw.arc(x, y, rCentro, 0, Math.PI * 2);
    ctxToDraw.fill();
}

function ParticulaCaida(x, y) {
    this.x = x; 
    this.y = y;
    this.vx = (Math.random() - 0.5) * 1; 
    this.vy = 0.5 + Math.random() * 0.8; // Caída lenta
    let sizeRandom = 0.8 + Math.random() * 0.6; // Ligeramente más grandes
    this.radioPétalo = 4 * sizeRandom;
    this.radioCentro = 2 * sizeRandom;
}

ParticulaCaida.prototype.actualizar = function() {
    this.x += this.vx;
    this.y += this.vy;
};

ParticulaCaida.prototype.dibujar = function(ctxToDraw) {
    dibujarGirasol(ctxToDraw, this.x, this.y, this.radioPétalo, this.radioCentro);
};

function animarSemilla() {
    let semillaY = 0;
    function caer() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        ctx.fillStyle = '#5c4033';
        ctx.beginPath();
        ctx.arc(centroX_Arbol, semillaY, 5, 0, Math.PI * 2);
        ctx.fill();

        if (semillaY < sueloY) {
            semillaY += 8;
            requestAnimationFrame(caer);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            setTimeout(dibujarArbol, 200);
        }
    }
    caer();
}

function dibujarArbol() {
    let ramas = [];
    let progreso = 0;
    let terminado = false;

    function crearRamas(x, y, longitud, angulo, grosor, nivel) {
        // Reducido a 5 para evitar que salgan puntas largas fuera del corazón
        if (nivel > 5) return;
        ramas.push({x, y, longitud, angulo, grosor, nivel});

        let nuevoX = x + longitud * Math.cos(angulo);
        let nuevoY = y + longitud * Math.sin(angulo);

        let apertura = 0.35 + (nivel * 0.03);

        // Multiplicador reducido de 0.75 a 0.60 para que las ramas sean más cortas y compactas
        crearRamas(nuevoX, nuevoY, longitud * 0.60, angulo - apertura, grosor * 0.7, nivel + 1);
        crearRamas(nuevoX, nuevoY, longitud * 0.60, angulo + apertura, grosor * 0.7, nivel + 1);
    }

    crearRamas(centroX_Arbol, sueloY, 100, -Math.PI / 2, 10, 0);

    function animarRamas() {
        let limite = Math.min(progreso + 1, ramas.length); 
        for (let i = progreso; i < limite; i++) {
            let r = ramas[i];
            ctx.beginPath();
            ctx.moveTo(r.x, r.y);
            ctx.lineTo(r.x + r.longitud * Math.cos(r.angulo), r.y + r.longitud * Math.sin(r.angulo));
            ctx.strokeStyle = '#5c4033';
            ctx.lineCap = 'round';
            ctx.lineWidth = r.grosor;
            ctx.stroke();
        }
        progreso = limite;

        if (progreso < ramas.length) {
            requestAnimationFrame(animarRamas);
        } else if (!terminado) {
            terminado = true;
            dibujarCorazonLlenoAnimado(centroX_Arbol, copaY);
        }
    }
    animarRamas();
}

function dibujarCorazonLlenoAnimado(offsetX, offsetY) {
    const escala = 10.5; 
    let girasolesDibujados = 0;
    const totalGirasoles = 3500; 

    // Rellenar el suelo base antes de que caigan más
    for(let i = 0; i < 400; i++) {
        let x = Math.random() * canvas.width;
        let y = sueloY - Math.random() * 12; 
        let sizeRandom = 0.7 + Math.random() * 0.5;
        dibujarGirasol(ctx, x, y, 4 * sizeRandom, 2 * sizeRandom);
    }

    function animar() {
        for (let i = 0; i < 10; i++) { 
            if (girasolesDibujados >= totalGirasoles) {
                iniciarTextos();
                animarParticulasCaida(offsetX, offsetY); 
                return;
            }

            let t = Math.random() * Math.PI * 2;
            let r = Math.sqrt(Math.random()); 

            let hx = 16 * Math.pow(Math.sin(t), 3);
            let hy = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));

            let x = offsetX + (hx * escala * r);
            let y = offsetY + (hy * escala * r);

            let sizeRandom = 0.8 + Math.random() * 0.6;
            dibujarGirasol(ctx, x, y, 4 * sizeRandom, 2 * sizeRandom);
            girasolesDibujados++;
        }
        requestAnimationFrame(animar);
    }
    animar();
}

function animarParticulasCaida(offsetX, offsetY) {
    ctxParticulas.clearRect(0, 0, canvasParticulas.width, canvasParticulas.height);

    if (Math.random() < 0.08) { 
        let t = Math.random() * Math.PI * 2;
        let r = Math.random(); 
        let hx = 16 * Math.pow(Math.sin(t), 3);
        let hy = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        
        let startX = offsetX + (hx * 10.5 * r);
        let startY = offsetY + (hy * 10.5 * r);
        particulasCaida.push(new ParticulaCaida(startX, startY));
    }

    for (var i = particulasCaida.length - 1; i >= 0; i--) {
        var p = particulasCaida[i];
        p.actualizar();
        p.dibujar(ctxParticulas); 

        if (p.y >= sueloY - 5) { 
            p.y = sueloY - 5; 
            floresSuelo.push(p); 
            p.dibujar(ctx); 
            particulasCaida.splice(i, 1); 
        }
    }

    requestAnimationFrame(function() { animarParticulasCaida(offsetX, offsetY); });
}

function iniciarTextos() {
    escribirTexto(txtTitulo, "Flores Amarillas", () => {
        escribirTexto(txtMensaje, `para el amor de mi vida, mi musa:\n\nSi pudiera elegir un lugar seguro, sería a tu lado...
            Te amo, te quiero y te deceo en todo momento mi querida melissa.`, () => {
            txtTextoTiempo.innerText = "Mi amor por ti comenzó hace...";
            setInterval(actualizarCronometro, 1000);
            actualizarCronometro();
        });
    });
}

function escribirTexto(elemento, texto, callback, i = 0) {
    if (i < texto.length) {
        if (texto.charAt(i) === '\n') {
            elemento.innerHTML += '<br>';
        } else {
            elemento.innerHTML += texto.charAt(i);
        }
        setTimeout(() => escribirTexto(elemento, texto, callback, i + 1), 20);
    } else if (callback) {
        setTimeout(callback, 500);
    }
}

function actualizarCronometro() {
    const ahora = new Date();
    const dif = ahora - fechaInicio;

    const dias = Math.floor(dif / (1000 * 60 * 60 * 24));
    const horas = Math.floor((dif / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((dif / 1000 / 60) % 60);
    const segundos = Math.floor((dif / 1000) % 60);

    txtCronometro.innerText = `${dias} días ${horas} horas ${minutos} minutos ${segundos} segundos`;
}