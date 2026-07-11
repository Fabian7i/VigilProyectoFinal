document.addEventListener("DOMContentLoaded", () => {

    const btnMenu = document.getElementById("btnMenuUsuario");
    const menu = document.getElementById("menuUsuario");
    const btnSalir = document.getElementById("btnSalir");

    // Si la página no tiene menú, termina aquí
    if (!btnMenu || !menu) return;

    // Abrir / cerrar menú
    btnMenu.addEventListener("click", (e) => {
        e.stopPropagation();
        menu.classList.toggle("show");
    });

    // Evita que se cierre al hacer clic dentro
    menu.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    // Cerrar al hacer clic fuera
    document.addEventListener("click", () => {
        menu.classList.remove("show");
    });

    // Cerrar con ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            menu.classList.remove("show");
        }
    });

    // Botón salir
    if (btnSalir) {

        btnSalir.addEventListener("click", () => {

            const confirmar = confirm("¿Deseas cerrar sesión?");

            if (confirmar) {

                // Por ahora
                window.location.href = "login.html";

                // Cuando uses Laravel será:
                // window.location.href = "/logout";

            }

        });

    }

});