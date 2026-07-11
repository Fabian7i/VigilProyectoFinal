// Configuración de la API del servidor Laravel
const API_URL = "http://127.0.0.1:8000"; 

// Elemento del DOM donde se inyectará la lista
const contenedorDashboard = document.getElementById('contenedorComentariosDashboard');

// 1. Cargar comentarios existentes desde Laravel e insertarlos en el Dashboard
async function cargarComentariosDashboard() {
    try {
        const response = await fetch(`${API_URL}/comentarios`);
        
        if (response.ok) {
            const comentarios = await response.json();
            contenedorDashboard.innerHTML = ''; // Limpiamos el contenedor inicial

            if (comentarios.length === 0) {
                contenedorDashboard.innerHTML = `<p class="text-center text-muted p-4">No hay comentarios registrados en el sistema.</p>`;
                return;
            }

            comentarios.forEach(comentario => {
                // Creamos un bloque contenedor para agrupar el comentario original y su respuesta/formulario abajo
                const wrapperGrupal = document.createElement('div');
                wrapperGrupal.classList.add('grupo-comentario-wrapper', 'mb-4');
                wrapperGrupal.id = `grupo-comentario-${comentario.id}`;

                // Decidir si mostramos la respuesta que ya existe o el cuadro para escribir una nueva
                let respuestaSeccionHTML = '';
                
                if (comentario.respuesta_admin) {
                    respuestaSeccionHTML = `
                        <div class="admin-reply-box">
                            <div class="avatar-admin-reply">AD</div>
                            <div class="comentario-cuerpo">
                                <p class="text-admin-reply-p"><strong>Administrador:</strong> ${comentario.respuesta_admin}</p>
                            </div>
                        </div>
                    `;
                } else {
                    respuestaSeccionHTML = `
                        <form class="form-responder-admin" onsubmit="enviarRespuestaAdmin(event, ${comentario.id})">
                            <input type="text" class="input-responder-admin" placeholder="Responder de forma institucional a este invitado..." required>
                            <button type="submit" class="btn-responder-admin">Responder</button>
                        </form>
                    `;
                }

                // Estructura de la cuadrícula respetando tus clases originales
                wrapperGrupal.innerHTML = `
                    <div class="comentario-item-row" id="comentario-${comentario.id}">
                        <div class="comentario-left-side">
                            <div class="avatar-generico-com">👤</div>
                            <div class="comentario-cuerpo">
                                <div class="comentario-usuario">Invitado</div>
                                <p class="comentario-texto-p">${comentario.content}</p>
                                <div class="comentario-fecha-hora">
                                    ${new Date(comentario.created_at).toLocaleDateString()} - ${new Date(comentario.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </div>
                            </div>
                        </div>
                        <div class="comentario-right-side">
                            <button class="btn-opciones-com" onclick="toggleMenuCom(event, 'menu-${comentario.id}')">⋮</button>
                            <div class="menu-contextual-com" id="menu-${comentario.id}">
                                <button class="btn-opcion-eliminar" onclick="solicitarConfirmacion(${comentario.id})">🗑 Eliminar comentario</button>
                            </div>
                        </div>
                    </div>
                    <!-- Contenedor del hilo para la respuesta -->
                    <div id="zona-respuesta-${comentario.id}">
                        ${respuestaSeccionHTML}
                    </div>
                `;

                contenedorDashboard.appendChild(wrapperGrupal);
            });
        }
    } catch (error) {
        console.error("Error al conectar con la API de comentarios:", error);
    }
}

// 2. Procesar y guardar el envío de la respuesta del Administrador (POST)
async function enviarRespuestaAdmin(event, comentarioId) {
    event.preventDefault();
    
    const formulario = event.target;
    const inputRespuesta = formulario.querySelector('.input-responder-admin');
    const textoRespuesta = inputRespuesta.value;

    try {
        const response = await fetch(`${API_URL}/comentarios/${comentarioId}/responder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ respuesta_admin: textoRespuesta })
        });

        if (response.ok) {
            // Reemplazamos instantáneamente el formulario por la caja elástica de respuesta sin recargar la página
            const zonaRespuesta = document.getElementById(`zona-respuesta-${comentarioId}`);
            zonaRespuesta.innerHTML = `
                <div class="admin-reply-box">
                    <div class="avatar-admin-reply">AD</div>
                    <div class="comentario-cuerpo">
                        <p class="text-admin-reply-p"><strong>Administrador:</strong> ${textoRespuesta}</p>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error("Error al enviar la respuesta del administrador:", error);
    }
}

// 3. Modificar la acción del botón del Cuadro de Confirmación de tu HTML para conectar a la Base de Datos
document.addEventListener('DOMContentLoaded', () => {
    // Buscamos el botón de confirmación que ya tienes definido en tu HTML
    const btnConfirmarBorrado = document.getElementById('btnConfirmarBorrado');
    
    if (btnConfirmarBorrado) {
        // Clonamos el botón para remover eventos previos estáticos que solo borraban visualmente
        const nuevoBtn = btnConfirmarBorrado.cloneNode(true);
        btnConfirmarBorrado.parentNode.replaceChild(nuevoBtn, btnConfirmarBorrado);

        // Agregamos la lógica real de eliminación conectada a Laravel
        nuevoBtn.addEventListener('click', async function () {
            if (idComentarioAEliminar) {
                try {
                    const response = await fetch(`${API_URL}/comentarios/${idComentarioAEliminar}`, {
                        method: 'DELETE'
                    });

                    if (response.ok) {
                        // Seleccionamos todo el bloque grupal (comentario + respuesta) para removerlo de la cuadrícula
                        const grupoElemento = document.getElementById(`grupo-comentario-${idComentarioAEliminar}`);
                        if (grupoElemento) {
                            grupoElemento.style.transition = "all 0.25s ease";
                            grupoElemento.style.opacity = "0";
                            grupoElemento.style.transform = "translateX(25px)";
                            setTimeout(() => {
                                grupoElemento.remove();
                            }, 250);
                        }
                    }
                } catch (error) {
                    console.error("Error al eliminar el comentario de la base de datos:", error);
                }
                cancelarEliminacion();
            }
        });
    }

    // Inicializar la carga al abrir el panel
    cargarComentariosDashboard();
});

async function enviarRespuestaAdmin(event, comentarioId) {
    event.preventDefault();
    
    const formulario = event.target;
    const inputRespuesta = formulario.querySelector('.input-responder-admin');
    const textoRespuesta = inputRespuesta.value;

    try {
        // Forzamos la URL exacta con /responder al final usando POST
        const response = await fetch(`${API_URL}/comentarios/${comentarioId}/responder`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ respuesta_admin: textoRespuesta })
        });

        if (response.ok) {
            // Reemplazamos el formulario por el diseño elástico de la respuesta
            const zonaRespuesta = document.getElementById(`zona-respuesta-${comentarioId}`);
            zonaRespuesta.innerHTML = `
                <div class="admin-reply-box">
                    <div class="avatar-admin-reply">AD</div>
                    <div class="comentario-cuerpo">
                        <p class="text-admin-reply-p"><strong>Administrador:</strong> ${textoRespuesta}</p>
                    </div>
                </div>
            `;
        } else {
            console.error("Error en el servidor. Código recibido:", response.status);
            alert("No se pudo guardar la respuesta. Verifica la ruta en Laravel.");
        }
    } catch (error) {
        console.error("Error al enviar la respuesta del administrador:", error);
    }
}