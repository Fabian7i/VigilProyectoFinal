document.addEventListener("DOMContentLoaded", () => {
    cargarNoticiasPaillardelle();
});

async function cargarNoticiasPaillardelle() {
    // Seleccionamos los contenedores usando las clases exactas de tu HTML
    const contenedorDestacada = document.querySelector(".seccion-noticia-destacada");
    const contenedorRecientes = document.querySelector(".grid-noticias-recientes");

    // URL base de tu backend Laravel (Cámbiala si usas otro puerto local)
    const URL_BASE = "http://127.0.0.1:8000"; 

    try {
        // Consumimos la API JSON de Laravel
        const respuesta = await fetch(`${URL_BASE}/api/noticias`);
        if (!respuesta.ok) throw new Error(`Error en servidor: ${respuesta.status}`);
        
        const datos = await respuesta.json();

        // 1. COMPONENTE: NOTICIA DESTACADA
        if (datos.destacada && contenedorDestacada) {
            // Desestructuramos la fecha del registro (Formato SQL: YYYY-MM-DD...)
            const fechaObj = new Date(datos.destacada.created_at);
            const dia = fechaObj.getDate().toString().padStart(2, '0');
            const meses = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SET", "OCT", "NOV", "DIC"];
            const mes = meses[fechaObj.getMonth()];
            const anio = fechaObj.getFullYear();

            // Reemplazamos el Homenaje al Día del Padre estático por la de la BD
            contenedorDestacada.innerHTML = `
                <div class="fila-destacada">
                    <!-- Imagen Izquierda -->
                    <div class="columna-imagen-destacada">
                        <img src="${URL_BASE}/storage/imagenes/${datos.destacada.imagen}" alt="${datos.destacada.titulo}">
                    </div>
                    
                    <!-- Contenido Derecha -->
                    <div class="columna-info-destacada">
                        <div class="contenedor-cabecera-destacada">
                            <!-- Bloque de Fecha Azul -->
                            <div class="bloque-fecha">
                                <span class="dia">${dia}</span>
                                <span class="mes-anio">${mes}<br>${anio}</span>
                            </div>
                            <!-- Etiqueta amarilla -->
                            <span class="etiqueta-destacada">NOTICIA DESTACADA</span>
                        </div>

                        <h3>${datos.destacada.titulo}</h3>
                        <p>${datos.destacada.cuerpo}</p>
                        
                        <!-- Enlace dinámico con ID único -->
                        <a href="noticia-detalle.html?id=${datos.destacada.id}" target="_blank" class="btn-leer-noticia-completa">Leer noticia completa →</a>
                    </div>
                </div>
            `;
        }

        // 2. COMPONENTE: GRID DE NOTICIAS RECIENTES
        if (datos.recientes && datos.recientes.length > 0 && contenedorRecientes) {
            contenedorRecientes.innerHTML = ""; // Limpiamos las 3 tarjetas de prueba (Matemáticas, Ciencia, Olimpiadas)

            datos.recientes.forEach(noticia => {
                const fechaObj = new Date(noticia.created_at);
                const dia = fechaObj.getDate().toString().padStart(2, '0');
                const meses = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SET", "OCT", "NOV", "DIC"];
                const mes = meses[fechaObj.getMonth()];
                const anio = fechaObj.getFullYear();
                
                // Recortamos el texto para que las tarjetas mantengan simetría visual en la cuadrícula
                const resumenCuerpo = noticia.cuerpo.length > 130 
                    ? noticia.cuerpo.substring(0, 130) + "..." 
                    : noticia.cuerpo;

                // Inyectamos la estructura exacta de tu <article>
                contenedorRecientes.innerHTML += `
                    <article class="tarjeta-noticia-reciente">
                        <div class="imagen-tarjeta">
                            <img src="${URL_BASE}/storage/imagenes/${noticia.imagen}" alt="${noticia.titulo}">
                        </div>
                        <div class="cuerpo-tarjeta">
                            <span class="fecha-noticia">${dia} ${mes} ${anio}</span>
                            <h4>${noticia.titulo}</h4>
                            <p>${resumenCuerpo}</p>
                            <a href="noticia-detalle.html?id=${noticia.id}" target="_blank" class="enlace-leer-mas">Leer más →</a>
                        </div>
                    </article>
                `;
            });
        }

    } catch (error) {
        console.error("Error al sincronizar el panel de noticias:", error);
    }
}