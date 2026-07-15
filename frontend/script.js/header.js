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

            // Funcionalidad del menú hamburguesa para móviles
            const hamburgerBtn = document.getElementById("hamburger-btn");
            const nav = document.querySelector("nav");
            const dropdowns = document.querySelectorAll(".dropdown");

            if (hamburgerBtn && nav) {
                hamburgerBtn.addEventListener("click", () => {
                    nav.classList.toggle("active");
                    
                    // Animación del botón hamburguesa
                    const spans = hamburgerBtn.querySelectorAll("span");
                    if (nav.classList.contains("active")) {
                        spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
                        spans[1].style.opacity = "0";
                        spans[2].style.transform = "rotate(-45deg) translate(7px, -6px)";
                    } else {
                        spans[0].style.transform = "none";
                        spans[1].style.opacity = "1";
                        spans[2].style.transform = "none";
                    }
                });

                // Cerrar menú al hacer clic en un enlace
                nav.querySelectorAll("a").forEach(link => {
                    link.addEventListener("click", () => {
                        nav.classList.remove("active");
                        const spans = hamburgerBtn.querySelectorAll("span");
                        spans[0].style.transform = "none";
                        spans[1].style.opacity = "1";
                        spans[2].style.transform = "none";
                    });
                });

                // Cerrar menú al hacer clic fuera
                document.addEventListener("click", (e) => {
                    if (!nav.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                        nav.classList.remove("active");
                        const spans = hamburgerBtn.querySelectorAll("span");
                        spans[0].style.transform = "none";
                        spans[1].style.opacity = "1";
                        spans[2].style.transform = "none";
                    }
                });
            }

            // Funcionalidad de dropdowns en móviles
            dropdowns.forEach(dropdown => {
                const link = dropdown.querySelector("a");
                if (link && window.innerWidth <= 768) {
                    link.addEventListener("click", (e) => {
                        e.preventDefault();
                        dropdown.classList.toggle("active");
                    });
                }
            });

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

            if (buscador && resultados) {
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
            }
        })
        .catch(error => console.error("Error al cargar el header:", error));
});
