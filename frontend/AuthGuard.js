
// script.js/authGuard.js
(function() {
    // 1. Definimos las rutas protegidas (Dashboard y los archivos DA)
    const urlActual = window.location.pathname;
    const esPaginaProtegida = urlActual.includes('dashboard') || urlActual.includes('DA');

    // 2. Verificamos si existe la cookie de sesión
    const tieneSesion = document.cookie.split(';').some((item) => item.trim().startsWith('token='));

    // 3. Si intenta entrar a una protegida sin sesión, lo enviamos al login
    if (esPaginaProtegida && !tieneSesion) {
        window.location.href = 'login.html';
    }
})();