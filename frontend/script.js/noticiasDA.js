document.addEventListener("DOMContentLoaded", () => {
    const URL_API = "http://127.0.0.1:8000/noticias";
    const URL_IMAGENES = "http://127.0.0.1:8000/storage/imagenes/";

    const destacadaContainer = document.getElementById("noticia-destacada-container");
    const recientesContainer = document.getElementById("noticias-recientes-container");

    function separarFecha(fechaString) {
        if (!fechaString) return { dia: "00", mes: "AAA", anio: "0000" };
        const fecha = new Date(fechaString);
        const dia = String(fecha.getDate()).padStart(2, '0');
        const meses = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SET", "OCT", "NOV", "DIC"];
        const mes = meses[fecha.getMonth()];
        const anio = fecha.getFullYear();
        return { dia, mes, anio };
    }

    fetch(URL_API)
        .then(response => {
            if (!response.ok) throw new Error("Error en la respuesta del servidor");
            return response.json();
        })
        .then(data => {
            let noticiaDestacada = data.destacada;
            let noticiasRecientes = data.recientes || [];

            // 🚀 TRUCO CLAVE: Si no hay destacada manual, agarramos la última subida como destacada
            if (!noticiaDestacada && noticiasRecientes.length > 0) {
                noticiaDestacada = noticiasRecientes[0]; // La primera es la más nueva
                noticiasRecientes = noticiasRecientes.slice(1); // Quitamos esa del grupo de recientes para que no se repita
            }

            // --- 1. RENDERIZAR NOTICIA DESTACADA ---
            if (noticiaDestacada) {
                const { dia, mes, anio } = separarFecha(noticiaDestacada.created_at);
                
                // Asegurar que la imagen traiga su nombre limpio
                const nombreImagen = noticiaDestacada.imagen ? noticiaDestacada.imagen : '';

                destacadaContainer.innerHTML = `
                    <div class="fila-destacada">
                        <div class="columna-imagen-destacada">
                            <img src="${URL_IMAGENES}${nombreImagen}" alt="${noticiaDestacada.titulo}" onerror="this.src='https://via.placeholder.com/600x400?text=Error+al+cargar+imagen'">
                        </div>
                        
                        <div class="columna-info-destacada">
                            <div class="contenedor-cabecera-destacada">
                                <div class="bloque-fecha">
                                    <span class="dia">${dia}</span>
                                    <span class="mes-anio">${mes}<br>${anio}</span>
                                </div>
                                <span class="etiqueta-destacada">NOTICIA DESTACADA</span>
                            </div>

                            <h3>${noticiaDestacada.titulo}</h3>
                            <p>${noticiaDestacada.cuerpo}</p>
                            
                            <a href="#" class="btn-leer-noticia-completa">Ver detalles →</a>
                        </div>
                    </div>
                `;
            } else {
                destacadaContainer.innerHTML = `<p class="text-center">No hay ninguna noticia publicada todavía.</p>`;
            }

            // --- 2. RENDERIZAR NOTICIAS RECIENTES ---
            if (noticiasRecientes.length > 0) {
                recientesContainer.innerHTML = ""; 

                noticiasRecientes.forEach(noticia => {
                    const { dia, mes, anio } = separarFecha(noticia.created_at);
                    const nombreImagenReciente = noticia.imagen ? noticia.imagen : '';
                    
                    const cardHTML = `
                        <article class="tarjeta-noticia-reciente">
                            <div class="imagen-tarjeta">
                                <img src="${URL_IMAGENES}${nombreImagenReciente}" alt="${noticia.titulo}" onerror="this.src='https://via.placeholder.com/300x200?text=Error+Imagen'">
                            </div>
                            <div class="cuerpo-tarjeta">
                                <span class="fecha-noticia">${dia} ${mes} ${anio}</span>
                                <h4>${noticia.titulo}</h4>
                                <p>${noticia.cuerpo.length > 120 ? noticia.cuerpo.substring(0, 120) + "..." : noticia.cuerpo}</p>
                                <a href="#" class="enlace-leer-mas">Leer más →</a>
                            </div>
                        </article>
                    `;
                    recientesContainer.innerHTML += cardHTML;
                });
            } else {
                recientesContainer.innerHTML = `<p class="text-center w-100">No hay más noticias recientes registradas.</p>`;
            }
        })
        .catch(error => {
            console.error("Error cargando el módulo de noticias:", error);
            destacadaContainer.innerHTML = `<p class="text-center" style="color: red;">Error al conectar con el servidor.</p>`;
        });
});