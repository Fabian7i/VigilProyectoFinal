// 1. Selección de elementos del DOM usando las clases del HTML
const contenedorSlides = document.querySelector('.slides');
const todosLosSlides = document.querySelectorAll('.slide');
const todasLasBolitas = document.querySelectorAll('.dot');
const botonPrev = document.querySelector('.prev');
const botonNext = document.querySelector('.next');

let indexActual = 0;
let temporizadorAutomatico;

// 2. Función principal que mueve el carrusel
function actualizarCarrusel(nuevoIndex) {
  indexActual = nuevoIndex;

  // Si el índice se pasa del límite derecho, regresa al primero
  if (indexActual >= todosLosSlides.length) {
    indexActual = 0;
  }
  // Si se pasa del límite izquierdo, va al último
  if (indexActual < 0) {
    indexActual = todosLosSlides.length - 1;
  }

  // MUEVE EL TREN: Mueve horizontalmente el contenedor base en múltiplos de 100%
  if (contenedorSlides) {
    contenedorSlides.style.transform = `translateX(-${indexActual * 100}%)`;
  }

  // Actualiza los estados visuales de las bolitas inferiores
  todasLasBolitas.forEach((bolita, i) => {
    bolita.classList.toggle('active', i === indexActual);
  });
  
  // Actualiza los estados visuales de los slides
  todosLosSlides.forEach((slide, i) => {
    slide.classList.toggle('active', i === indexActual);
  });
}

// 3. Funciones de dirección
function avanzarSlide() {
  actualizarCarrusel(indexActual + 1);
}

function retrocederSlide() {
  actualizarCarrusel(indexActual - 1);
}

// 4. Temporizador automático (Mueve el carrusel cada 5 segundos de forma autónoma)
function iniciarAutoplay() {
  // Limpiamos cualquier intervalo activo previo para que no se dupliquen
  clearInterval(temporizadorAutomatico);
  temporizadorAutomatico = setInterval(avanzarSlide, 5000); // 5000ms = 5 segundos
}

// 5. Asignación de Eventos de Clic (Flechas)
if (botonNext && botonPrev) {
  botonNext.addEventListener('click', () => {
    avanzarSlide();
    iniciarAutoplay(); // Reinicia el contador tras la interacción del usuario
  });

  botonPrev.addEventListener('click', () => {
    retrocederSlide();
    iniciarAutoplay(); // Reinicia el contador tras la interacción del usuario
  });
}

// 6. Asignación de Eventos de Clic (Bolitas inferiores)
todasLasBolitas.forEach((bolita, i) => {
  bolita.addEventListener('click', () => {
    actualizarCarrusel(i);
    iniciarAutoplay(); // Reinicia el contador tras la interacción del usuario
  });
});

// 7. Arrancar el carrusel automático por primera vez al cargar la página
iniciarAutoplay();



/*--- scroll ---*/
document.addEventListener("DOMContentLoaded", function () {
  const tarjetas = document.querySelectorAll('.tarjeta-didactica');

  const opciones = {
    root: null,          
    threshold: 0.15      
  };

  const observador = new IntersectionObserver(function (entradas, observer) {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visible'); 
        observer.unobserve(entrada.target);     
      }
    });
  }, opciones);

  tarjetas.forEach(tarjeta => {
    observador.observe(tarjeta);
  });
});