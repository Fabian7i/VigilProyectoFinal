document.addEventListener("DOMContentLoaded", () => {
    const headerContainer = document.getElementById("header-container");
    if (!headerContainer) return;

    if (!document.querySelector('link[href="css/header.css"]')) {
        const estilos = document.createElement("link");
        estilos.rel = "stylesheet";
        estilos.href = "css/header.css";
        document.head.appendChild(estilos);
    }

    fetch("header.html")
        .then(response => {
            if (!response.ok) throw new Error("No se pudo cargar el header.");
            return response.text();
        })
        .then(data => {
            headerContainer.innerHTML = data;

            const buscador = document.getElementById("buscador-sitio");
            const resultados = document.getElementById("resultados-buscador");
            const paginas = [
                { nombre: "Admisión y matrícula", enlace: "admision.html" },
                { nombre: "Proceso de matrícula", enlace: "proceso.html" },
                { nombre: "Galería institucional", enlace: "galeria.html" },
                { nombre: "Instalaciones", enlace: "instalaciones.html" },
                { nombre: "Comunicados", enlace: "comunicados.html" },
                { nombre: "Contacto", enlace: "contacto.html" },
                { nombre: "Preguntas frecuentes", enlace: "preguntas_frecuentes.html" }
            ];

            buscador.addEventListener("input", () => {
                const texto = buscador.value.toLowerCase().trim();
                if (!texto) { resultados.innerHTML = ""; return; }
                const coincidencias = paginas.filter(pagina => pagina.nombre.toLowerCase().includes(texto));
                resultados.innerHTML = coincidencias.length
                    ? coincidencias.map(pagina => `<a href="${pagina.enlace}"><i class="fa-solid fa-arrow-right"></i> ${pagina.nombre}</a>`).join("")
                    : '<p class="resultado-vacio">No se encontraron resultados.</p>';
            });

            document.addEventListener("click", evento => {
                if (!evento.target.closest(".contenedor-buscador")) resultados.innerHTML = "";
            });
        })
        .catch(error => console.error("Error al cargar el header:", error));
});
