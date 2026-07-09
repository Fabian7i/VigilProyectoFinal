// Filtro interactivo para la tabla de comunicados
document.addEventListener("DOMContentLoaded", function () {
    const buscador = document.getElementById("buscarComunicado");
    const filas = document.querySelectorAll(".item-comunicado-fila");

    if (buscador) {
        buscador.addEventListener("keyup", function (e) {
            const textoBusqueda = e.target.value.toLowerCase();

            filas.forEach(fila => {
                // Busca el texto dentro del enlace del título del comunicado
                const titulo = fila.querySelector(".titulo-comunicado-link").textContent.toLowerCase();
                
                if (titulo.includes(textoBusqueda)) {
                    fila.style.setProperty("display", "flex", "important");
                } else {
                    fila.style.setProperty("display", "none", "important");
                }
            });
        });
    }
});