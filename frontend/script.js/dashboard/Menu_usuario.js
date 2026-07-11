document.addEventListener("DOMContentLoaded", function () {
  const btnMenuUsuario =
    document.getElementById("btnMenuUsuario");

  const menuUsuario =
    document.getElementById("menuUsuario");

  const btnSalir =
    document.getElementById("btnSalir");

  const avataresDashboard =
    document.querySelectorAll(".avatar-dashboard-global");

  const fotoGuardada =
    localStorage.getItem("fotoPerfilDashboard");

  if (fotoGuardada) {
    avataresDashboard.forEach(function (avatar) {
      avatar.src = fotoGuardada;
    });
  }

  if (!btnMenuUsuario || !menuUsuario) {
    return;
  }

  function cerrarMenuUsuario() {
    menuUsuario.classList.remove("show");

    btnMenuUsuario.setAttribute(
      "aria-expanded",
      "false"
    );
  }

  btnMenuUsuario.addEventListener("click", function (evento) {
    evento.stopPropagation();

    const abierto =
      menuUsuario.classList.toggle("show");

    btnMenuUsuario.setAttribute(
      "aria-expanded",
      abierto ? "true" : "false"
    );
  });

  menuUsuario.addEventListener("click", function (evento) {
    evento.stopPropagation();
  });

  document.addEventListener("click", function () {
    cerrarMenuUsuario();
  });

  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") {
      cerrarMenuUsuario();
    }
  });

  if (btnSalir) {
    btnSalir.addEventListener("click", function () {
      const confirmar =
        confirm("¿Deseas cerrar sesión?");

      if (confirmar) {
        window.location.href = "login.html";
      }
    });
  }
});