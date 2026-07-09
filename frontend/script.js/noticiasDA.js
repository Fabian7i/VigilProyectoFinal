document.addEventListener("DOMContentLoaded", () => {
    const URL_API = "http://127.0.0.1:8000/noticias";
    const URL_IMAGENES = "http://127.0.0.1:8000/storage/imagenes/";

    const destacadaContainer = document.getElementById("noticia-destacada-container");
    const recientesContainer = document.getElementById("noticias-recientes-container");
    const paginacionContainer = document.getElementById("paginacion-container");

    // Configuración de paginación
    let noticiasGlobales = []; 
    let paginaActual = 1;
    const NOTICIAS_POR_PAGINA = 3;

    // Helper para recortar texto por palabras de forma exacta
    function limitarPalabras(texto, maxPalabras) {
        if (!texto) return "";
        const palabras = texto.split(/\s+/); // Separa por cualquier tipo de espacio
        if (palabras.length <= maxPalabras) return texto;
        return palabras.slice(0, maxPalabras).join(" ") + "...";
    }

    function separarFecha(fechaString) {
        if (!fechaString) return { dia: "00", mes: "AAA", anio: "0000" };
        const fecha = new Date(fechaString);
        const dia = String(fecha.getDate()).padStart(2, '0');
        const meses = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SET", "OCT", "NOV", "DIC"];
        const mes = meses[fecha.getMonth()];
        const anio = fecha.getFullYear();
        return { dia, mes, anio };
    }

    // Cargar los datos desde Laravel
    fetch(URL_API)
        .then(response => {
            if (!response.ok) throw new Error("Error en la respuesta del servidor");
            return response.json();
        })
        .then(data => {
            let noticiaDestacada = data.destacada;
            let listaRecientes = data.recientes || [];

            // Si no hay destacada manual, la primera de recientes toma su lugar
            if (!noticiaDestacada && listaRecientes.length > 0) {
                noticiaDestacada = listaRecientes[0];
                listaRecientes = listaRecientes.slice(1);
            }

            // --- 1. RENDERIZAR NOTICIA DESTACADA (CON LÍMITE DE 50 PALABRAS) ---
            if (noticiaDestacada) {
                const { dia, mes, anio } = separarFecha(noticiaDestacada.created_at);
                const cuerpoRecortado = limitarPalabras(noticiaDestacada.cuerpo, 50); // ✂️ Recorte seguro

                destacadaContainer.innerHTML = `
                    <div class="fila-destacada">
                        <div class="columna-imagen-destacada">
                            <img src="${URL_IMAGENES}${noticiaDestacada.imagen}" alt="${noticiaDestacada.titulo}" onerror="this.src='https://via.placeholder.com/600x400?text=Error+Imagen'">
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
                            <p>${cuerpoRecortado}</p>
                            <a href="#" class="btn-leer-noticia-completa">Leer noticia completa →</a>
                        </div>
                    </div>
                `;
            } else {
                destacadaContainer.innerHTML = `<p class="text-center">No hay ninguna noticia publicada todavía.</p>`;
            }

            // Guardar el resto de noticias para la paginación dinámica
            noticiasGlobales = listaRecientes;
            renderizarPaginaRecientes(paginaActual);
            construirBotonesPaginacion();
        })
        .catch(error => {
            console.error("Error cargando el módulo de noticias:", error);
            destacadaContainer.innerHTML = `<p class="text-center" style="color: red;">Error al conectar con el servidor.</p>`;
        });

    // --- 2. RENDERIZAR TARJETAS RECIENTES SEGÚN LA PÁGINA ---
    function renderizarPaginaRecientes(pagina) {
        recientesContainer.innerHTML = "";
        
        // Calcular los índices de corte matemático
        const indiceInicio = (pagina - 1) * NOTICIAS_POR_PAGINA;
        const indiceFin = indiceInicio + NOTICIAS_POR_PAGINA;
        const noticiasAPresentar = noticiasGlobales.slice(indiceInicio, indiceFin);

        if (noticiasAPresentar.length === 0) {
            recientesContainer.innerHTML = `<p class="text-center w-100">No hay más noticias registradas.</p>`;
            return;
        }

        noticiasAPresentar.forEach(noticia => {
            const { dia, mes, anio } = separarFecha(noticia.created_at);
            // Para las tarjetas recortamos a 20 palabras máximo para mantener simetría
            const cuerpoTarjeta = limitarPalabras(noticia.cuerpo, 20);

            const cardHTML = `
                <article class="tarjeta-noticia-reciente">
                    <div class="imagen-tarjeta">
                        <img src="${URL_IMAGENES}${noticia.imagen}" alt="${noticia.titulo}" onerror="this.src='https://via.placeholder.com/300x200?text=Error+Imagen'">
                    </div>
                    <div class="cuerpo-tarjeta">
                        <span class="fecha-noticia">${dia} ${mes} ${anio}</span>
                        <h4>${noticia.titulo}</h4>
                        <p>${cuerpoTarjeta}</p>
                        <a href="#" class="enlace-leer-mas">Leer más →</a>
                    </div>
                </article>
            `;
            recientesContainer.innerHTML += cardHTML;
        });
    }

    // --- 3. CONSTRUCCIÓN EN VIVO DEL ENUMERADOR (1 2 3 4...) ---
    function construirBotonesPaginacion() {
        paginacionContainer.innerHTML = "";
        const totalPaginas = Math.ceil(noticiasGlobales.length / NOTICIAS_POR_PAGINA);

        if (totalPaginas <= 1) return; // Si hay 3 noticias o menos, no hace falta pintar números

        // Botón "Anterior" si la lista crece
        const btnAnterior = document.createElement("button");
        btnAnterior.className = "btn-pagina";
        btnAnterior.innerHTML = "«";
        btnAnterior.disabled = paginaActual === 1;
        btnAnterior.addEventListener("click", () => cambiarPagina(paginaActual - 1));
        paginacionContainer.appendChild(btnAnterior);

        // Renderizador numérico interactivo
        for (let i = 1; i <= totalPaginas; i++) {
            const btnNumero = document.createElement("button");
            btnNumero.className = `btn-pagina ${i === paginaActual ? 'activo' : ''}`;
            btnNumero.innerText = i;
            
            btnNumero.addEventListener("click", () => cambiarPagina(i));
            paginacionContainer.appendChild(btnNumero);
        }

        // Botón "Siguiente"
        const btnSiguiente = document.createElement("button");
        btnSiguiente.className = "btn-pagina";
        btnSiguiente.innerHTML = "»";
        btnSiguiente.disabled = paginaActual === totalPaginas;
        btnSiguiente.addEventListener("click", () => cambiarPagina(paginaActual + 1));
        paginacionContainer.appendChild(btnSiguiente);
    }

    function cambiarPagina(nuevaPagina) {
        paginaActual = nuevaPagina;
        renderizarPaginaRecientes(paginaActual);
        construirBotonesPaginacion();
        
        // Scroll suave hacia las noticias recientes para mejorar experiencia móvil
        document.querySelector(".seccion-noticias-recientes").scrollIntoView({ behavior: "smooth" });
    }
});