document.addEventListener("DOMContentLoaded", () => {

// Déjalo exactamente así, sin barra "/" al final:
const API_URL = "http://127.0.0.1:8000";
    const form = document.getElementById("formComentario");
    const textarea = document.getElementById("txtContenido");
    const listaComentarios = document.getElementById("listaComentarios");

    // 1. CARGAR COMENTARIOS AL INICIAR LA PÁGINA
    const cargarComentarios = async () => {
        try {
            const response = await fetch(`${API_URL}/comentarios`);
            const comentarios = await response.json();

            // Limpiar lista manteniendo el título
            listaComentarios.innerHTML = '<h3>Comentarios recientes</h3>';

            if (comentarios.length === 0) {
                listaComentarios.innerHTML += '<p style="text-align:center; color:#888;">No hay comentarios aún. ¡Sé el primero!</p>';
                return;
            }

            comentarios.forEach(comment => {
                // Renderizar comentario principal
                let comentarioHTML = `
                    <div class="tarjeta-comentario-item">
                      <div class="avatar-usuario-item"><i class="fa-solid fa-user"></i></div>
                      <div class="contenido-comentario-item">
                        <div class="meta-comentario-item">
                          <span class="nombre-autor-item">Invitado</span>
                          <span class="tiempo-comentario-item">• ${calcularTiempo(comment.created_at)}</span>
                        </div>
                        <p class="texto-comentario-item">${comment.content}</p>
                      </div>
                    </div>
                `;

                // Renderizar el hilo de respuestas si el admin respondió
                if (comment.replies && comment.replies.length > 0) {
                    comment.replies.forEach(reply => {
                        comentarioHTML += `
                            <div class="tarjeta-comentario-item" style="margin-left: 50px; border-left: 3px solid #ffc107; background-color: #f9f9f9; padding-left: 15px;">
                              <div class="avatar-usuario-item" style="color: #ffc107;"><i class="fa-solid fa-shield-halved"></i></div>
                              <div class="contenido-comentario-item">
                                <div class="meta-comentario-item">
                                  <span class="nombre-autor-item" style="color: #ffc107; font-weight: bold;">Administración Paillardelle</span>
                                  <span class="tiempo-comentario-item">• ${calcularTiempo(reply.created_at)}</span>
                                </div>
                                <p class="texto-comentario-item">${reply.content}</p>
                              </div>
                            </div>
                        `;
                    });
                }

                listaComentarios.innerHTML += comentarioHTML;
            });

        } catch (error) {
            console.error("Error al cargar comentarios:", error);
        }
    };

    // 2. ENVIAR NUEVO COMENTARIO ANÓNIMO
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const contenido = textarea.value.trim();
        if (!contenido) return;

        try {
            const response = await fetch(`${API_URL}/comentarios/anonimo`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    body: JSON.stringify({ content: contenido })
});

            if (response.ok) {
                textarea.value = ""; // Limpiar el campo
                document.getElementById("contador").innerText = "0 / 500";
                cargarComentarios(); // Recargar la lista para mostrar el nuevo comentario
            } else {
                alert("Hubo un error al enviar el comentario.");
            }
        } catch (error) {
            console.error("Error en la petición:", error);
        }
    });

    // Función auxiliar para dar formato legible a la fecha
    const calcularTiempo = (fechaISO) => {
        const fecha = new Date(fechaISO);
        const ahora = new Date();
        const diferenciaMs = ahora - fecha;
        const minutos = Math.floor(diferenciaMs / 60000);

        if (minutos < 1) return "Hace unos segundos";
        if (minutos < 60) return `Hace ${minutos} minutos`;
        const horas = Math.floor(minutos / 60);
        if (horas < 24) return `Hace ${horas} horas`;
        return fecha.toLocaleDateString();
    };

    // Contador de caracteres básico
    textarea.addEventListener("input", (e) => {
        document.getElementById("contador").innerText = `${e.target.value.length} / 500`;
    });

    // Carga inicial al entrar a la web
    cargarComentarios();
});