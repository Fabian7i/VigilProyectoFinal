// Configuración inicial
const API_URL = "http://127.0.0.1:8000"; 
let todosLosComentarios = []; // Aquí guardaremos la lista completa que venga de la BD
let comentariosVisibles = 5;  // Cuántos queremos mostrar al principio

// Elementos del DOM
const listaComentarios = document.getElementById('listaComentarios');
const btnVerMas = document.querySelector('.enlace-ver-mas-comentarios');
const formComentario = document.getElementById('formComentario');
const txtContenido = document.getElementById('txtContenido');
const contador = document.getElementById('contador');

// 1. Cargar comentarios desde el backend de Laravel
async function cargarComentarios() {
    try {
        // Ajusta esta URL a la ruta de tu Laravel que haga el GET de los comentarios
        const response = await fetch(`${API_URL}/comentarios`); 
        if (response.ok) {
            todosLosComentarios = await response.json();
            renderizarComentarios();
        }
    } catch (error) {
        console.error("Error al obtener los comentarios:", error);
    }
}

// 2. Función encargada de pintar los comentarios en base al límite actual
function renderizarComentarios() {
    // Limpiamos el contenedor pero mantenemos el título interno si lo hubiera
    listaComentarios.innerHTML = '<h3>Comentarios recientes</h3>';

    // Cortamos el array para que solo tome los primeros 'comentariosVisibles' (ej. 5, 10, 15...)
    const comentariosAMostrar = todosLosComentarios.slice(0, comentariosVisibles);

    if (comentariosAMostrar.length === 0) {
        listaComentarios.innerHTML += '<p class="no-comments">No hay comentarios aún. ¡Sé el primero!</p>';
        btnVerMas.style.display = 'none'; // Escondemos el botón si está vacío
        return;
    }

    // Iteramos y creamos el HTML para cada comentario
    comentariosAMostrar.forEach(comentario => {
        const divComentario = document.createElement('div');
        divComentario.classList.add('comentario-item'); // Usa las clases de tu CSS
        divComentario.innerHTML = `
            <div class="comentario-cuerpo">
                <strong>Invitado</strong> <small>${new Date(comentario.created_at).toLocaleDateString()}</small>
              <p>${comentario.content}</p>
            </div>
        `;
        listaComentarios.appendChild(divComentario);
    });

    // Controlar la visibilidad del botón "Ver más"
    // Si ya mostramos todos los comentarios que existen, escondemos el botón
    if (comentariosVisibles >= todosLosComentarios.length) {
        btnVerMas.style.display = 'none';
    } else {
        btnVerMas.style.display = 'inline-block';
    }
}

// 3. Evento para el botón "Ver más comentarios"
btnVerMas.addEventListener('click', function(e) {
    e.preventDefault(); // Evita que la página salte hacia arriba
    comentariosVisibles += 5; // Sumamos 5 más al límite
    renderizarComentarios();  // Volvemos a pintar los elementos actualizados
});

// 4. Contador de caracteres del textarea (Detalle estético)
txtContenido.addEventListener('input', function() {
    contador.textContent = `${this.value.length} / 500`;
});

// 5. Enviar un nuevo comentario (POST)
formComentario.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const contenido = txtContenido.value;

    try {
        const response = await fetch(`${API_URL}/comentarios/anonimo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ contenido: contenido })
        });

        if (response.ok) {
            const nuevoComentario = await response.json();
            
            // Lo agregamos al principio de nuestra lista local para que se vea de inmediato
            todosLosComentarios.unshift(nuevoComentario); 
            
            // Limpiamos el formulario
            txtContenido.value = '';
            contador.textContent = '0 / 500';
            
            // Volvemos a renderizar manteniendo el comportamiento
            renderizarComentarios();
        }
    } catch (error) {
        console.error("Error al enviar el comentario:", error);
    }
});

// Ejecución inicial al cargar la página web
document.addEventListener('DOMContentLoaded', cargarComentarios);