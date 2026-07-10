document.addEventListener("DOMContentLoaded", () => {
    const URL_API = "http://127.0.0.1:8000/noticias";
    const URL_IMAGENES = "http://127.0.0.1:8000/storage/imagenes/";

    const contenedorFotos = document.getElementById("contenedor-fotos-noticias");
    const form = document.getElementById("form-noticias-dashboard");

    // ==========================================
    // 1. TRAER EL LISTADO DE NOTICIAS E ITERAR LAS IMÁGENES
    // ==========================================
    if (contenedorFotos) {
        fetch(URL_API)
            .then(response => {
                if (!response.ok) throw new Error("Error al obtener el listado de noticias");
                return response.json();
            })
            .then(data => {
                // Combinamos la destacada (si existe) y las recientes en un solo array para la galería
                let todasLasNoticias = [];
                
                if (data.destacada) {
                    todasLasNoticias.push(data.destacada);
                }
                if (data.recientes && data.recientes.length > 0) {
                    todasLasNoticias = todasLasNoticias.concat(data.recientes);
                }

                // Si no hay ninguna noticia en la base de datos
                if (todasLasNoticias.length === 0) {
                    contenedorFotos.innerHTML = `<p class="text-white p-3">No hay imágenes que mostrar.</p>`;
                    return;
                }

                // Limpiamos los placeholders estáticos del HTML
                contenedorFotos.innerHTML = "";

                // Iteramos el listado para renderizar cada foto-item
                todasLasNoticias.forEach(noticia => {
                    if (noticia.imagen) {
                        const fotoItem = document.createElement("div");
                        fotoItem.className = "foto-item";
                        fotoItem.innerHTML = `
                            <img src="${URL_IMAGENES}${noticia.imagen}" 
                                 alt="${noticia.titulo || 'Imagen de noticia'}" 
                                 title="${noticia.titulo || 'Sin título'}"
                                 onerror="this.src='https://via.placeholder.com/180x100?text=Error+Foto'">
                        `;
                        contenedorFotos.appendChild(fotoItem);
                    }
                });
            })
            .catch(error => {
                console.error("Error cargando la galería del dashboard:", error);
                contenedorFotos.innerHTML = `<p class="text-danger p-3">Error al conectar con el servidor para listar imágenes.</p>`;
            });
    }

    // ==========================================
    // 2. LÓGICA DEL BOTÓN "SIGUIENTE NOTICIA" (Scroll Horizontal)
    // ==========================================
    const btnSiguiente = document.querySelector(".btn-siguiente-noticia");
    if (btnSiguiente && contenedorFotos) {
        btnSiguiente.addEventListener("click", () => {
            // Desplaza la galería hacia la derecha de forma suave
            contenedorFotos.scrollBy({ left: 200, behavior: "smooth" });
        });
    }

    // ==========================================
    // 3. PROCESAR Y GUARDAR NUEVA NOTICIA (POST)
    // ==========================================
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const formData = new FormData(form);

            // Validación simple antes de mandar los datos
            const titulo = document.getElementById("input-titulo").value.trim();
            const cuerpo = document.getElementById("input-cuerpo").value.trim();
            
            if (!titulo || !cuerpo) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campos incompletos',
                    text: 'Por favor, completa el título y el cuerpo de la noticia.'
                });
                return;
            }

            fetch(URL_API, {
                method: "POST",
                body: formData
                // Importante: No se añade cabecera Content-Type para que el navegador maneje el boundary de la imagen automáticamente.
            })
            .then(res => {
                if (!res.ok) throw new Error("Error en el servidor al intentar guardar");
                return res.json();
            })
            .then(data => {
                Swal.fire({
                    icon: 'success',
                    title: '¡Guardado!',
                    text: 'La noticia se ha publicado correctamente.',
                    timer: 2000,
                    showConfirmButton: false
                });

                form.reset();
                
                // Opcional: Recargar la página o volver a ejecutar la función de listado para ver la nueva foto al instante
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            })
            .catch(err => {
                console.error("Error al enviar el formulario:", err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'No se pudo registrar la noticia en el servidor.'
                });
            });
        });
    }
});