document.addEventListener("DOMContentLoaded", function () {
    let fotografias = [
        { id: 1, titulo: "Actividad educativa", descripcion: "Estudiantes participando en una actividad educativa.", categoria: "actividades", fecha: "2026-07-12", imagen: "img/carrusel1.jpg", estado: "publicada" },
        { id: 2, titulo: "Aniversario institucional", descripcion: "Celebración por el aniversario de nuestra institución.", categoria: "aniversario", fecha: "2026-06-25", imagen: "img/carrusel2.jpg", estado: "publicada" },
        { id: 3, titulo: "Campeonato deportivo", descripcion: "Participación de estudiantes en actividades deportivas.", categoria: "deportes", fecha: "2026-06-18", imagen: "img/carrusel3.jpg", estado: "publicada" },
        { id: 4, titulo: "Feria de ciencias", descripcion: "Presentación de proyectos elaborados por los estudiantes.", categoria: "ferias", fecha: "2026-06-10", imagen: "img/imagen_carrusel1.png", estado: "publicada" },
        { id: 5, titulo: "Ceremonia cívica", descripcion: "Ceremonia institucional realizada en el patio principal.", categoria: "ceremonias", fecha: "2026-06-02", imagen: "img/imagen_carrusel2.png", estado: "oculta" },
        { id: 6, titulo: "Trabajo colaborativo", descripcion: "Actividad desarrollada mediante trabajo en equipo.", categoria: "actividades", fecha: "2026-05-24", imagen: "img/imagen_carrusel3.png", estado: "publicada" },
        { id: 7, titulo: "Juegos escolares", descripcion: "Participación de los estudiantes en los juegos escolares.", categoria: "deportes", fecha: "2026-05-15", imagen: "img/carrusel1.jpg", estado: "publicada" }
    ];

    const grid = document.getElementById("gridGaleriaDashboard");
    const buscar = document.getElementById("buscarFotoDashboard");
    const filtroCategoria = document.getElementById("filtroCategoriaDashboard");
    const filtroEstado = document.getElementById("filtroEstadoDashboard");
    const paginacion = document.getElementById("paginacionGaleriaDashboard");
    const estadoVacio = document.getElementById("estadoVacioGaleria");
    const modal = document.getElementById("modalGaleriaOverlay");
    const confirmacion = document.getElementById("confirmacionGaleriaOverlay");
    const form = document.getElementById("formGaleriaDashboard");
    const fotoId = document.getElementById("fotoId");
    const titulo = document.getElementById("tituloFoto");
    const categoria = document.getElementById("categoriaFoto");
    const fecha = document.getElementById("fechaFoto");
    const descripcion = document.getElementById("descripcionFoto");
    const imagen = document.getElementById("imagenFoto");
    const estado = document.getElementById("estadoFoto");
    const vistaPrevia = document.getElementById("vistaPreviaFoto");
    const estadoSubidaImagen = document.getElementById("estadoSubidaImagen");
    const modalTitulo = document.getElementById("modalTitulo");
    const modalSubtitulo = document.getElementById("modalSubtitulo");

    let paginaActual = 1;
    let fotoAEliminar = null;
    const fotosPorPagina = 6;

    function normalizar(texto) {
        return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    function formatearFecha(valor) {
        if (!valor) return "";
        return new Date(valor + "T00:00:00").toLocaleDateString("es-PE");
    }

    function nombreCategoria(valor) {
        const nombres = { actividades: "Actividades", aniversario: "Aniversario", deportes: "Deportes", ferias: "Ferias", ceremonias: "Ceremonias" };
        return nombres[valor] || valor;
    }

    function obtenerFiltradas() {
        const texto = normalizar(buscar.value.trim());
        return fotografias.filter(function (foto) {
            const coincideTexto = normalizar(foto.titulo + " " + foto.descripcion).includes(texto);
            const coincideCategoria = filtroCategoria.value === "todas" || foto.categoria === filtroCategoria.value;
            const coincideEstado = filtroEstado.value === "todos" || foto.estado === filtroEstado.value;
            return coincideTexto && coincideCategoria && coincideEstado;
        });
    }

    function actualizarMetricas() {
        document.getElementById("totalFotografias").textContent = fotografias.length;
        document.getElementById("totalPublicadas").textContent = fotografias.filter(f => f.estado === "publicada").length;
        document.getElementById("totalOcultas").textContent = fotografias.filter(f => f.estado === "oculta").length;
        document.getElementById("totalCategorias").textContent = new Set(fotografias.map(f => f.categoria)).size;
    }

    function renderizar() {
        const filtradas = obtenerFiltradas();
        const totalPaginas = Math.ceil(filtradas.length / fotosPorPagina);

        if (paginaActual > totalPaginas) paginaActual = Math.max(totalPaginas, 1);

        const inicio = (paginaActual - 1) * fotosPorPagina;
        const visibles = filtradas.slice(inicio, inicio + fotosPorPagina);

        grid.innerHTML = "";
        estadoVacio.classList.toggle("activo", visibles.length === 0);

        visibles.forEach(function (foto) {
            const tarjeta = document.createElement("article");
            tarjeta.className = "tarjeta-foto-dashboard";

            tarjeta.innerHTML = `
<div class="imagen-foto-dashboard">
<img src="${foto.imagen}" alt="${foto.titulo}" onerror="this.src='img/logo_enriquepaillardelle.png'">
<span class="estado-foto-dashboard ${foto.estado}">${foto.estado}</span>
</div>
<div class="contenido-foto-dashboard">
<span class="categoria-foto-dashboard">${nombreCategoria(foto.categoria)}</span>
<h3>${foto.titulo}</h3>
<p>${foto.descripcion || "Sin descripción."}</p>
<span class="fecha-foto-dashboard"><i class="fa-regular fa-calendar"></i> ${formatearFecha(foto.fecha)}</span>
<div class="acciones-foto-dashboard">
<button type="button" class="btn-editar-foto" data-id="${foto.id}"><i class="fa-solid fa-pen"></i> Editar</button>
<button type="button" class="btn-estado-foto" data-id="${foto.id}">${foto.estado === "publicada" ? "Ocultar" : "Publicar"}</button>
<button type="button" class="btn-eliminar-foto" data-id="${foto.id}" aria-label="Eliminar"><i class="fa-regular fa-trash-can"></i></button>
</div>
</div>`;

            grid.appendChild(tarjeta);
        });

        agregarEventosTarjetas();
        renderizarPaginacion(totalPaginas);
        actualizarMetricas();
    }

    function renderizarPaginacion(totalPaginas) {
        paginacion.innerHTML = "";
        if (totalPaginas <= 1) return;

        function crearBoton(contenido, deshabilitado, activo, accion) {
            const boton = document.createElement("button");
            boton.type = "button";
            boton.className = "btn-pagina-dashboard" + (activo ? " activo" : "");
            boton.innerHTML = contenido;
            boton.disabled = deshabilitado;
            boton.addEventListener("click", accion);
            return boton;
        }

        paginacion.appendChild(crearBoton('<i class="fa-solid fa-chevron-left"></i>', paginaActual === 1, false, function () {
            paginaActual--;
            renderizar();
        }));

        for (let i = 1; i <= totalPaginas; i++) {
            paginacion.appendChild(crearBoton(String(i), false, i === paginaActual, function () {
                paginaActual = i;
                renderizar();
            }));
        }

        paginacion.appendChild(crearBoton('<i class="fa-solid fa-chevron-right"></i>', paginaActual === totalPaginas, false, function () {
            paginaActual++;
            renderizar();
        }));
    }

    function agregarEventosTarjetas() {
        document.querySelectorAll(".btn-editar-foto").forEach(function (boton) {
            boton.addEventListener("click", function () {
                abrirModalEditar(Number(this.dataset.id));
            });
        });

        document.querySelectorAll(".btn-estado-foto").forEach(function (boton) {
            boton.addEventListener("click", function () {
                cambiarEstado(Number(this.dataset.id));
            });
        });

        document.querySelectorAll(".btn-eliminar-foto").forEach(function (boton) {
            boton.addEventListener("click", function () {
                fotoAEliminar = Number(this.dataset.id);
                abrirConfirmacion();
            });
        });
    }

    function limpiarVistaPrevia() {
        imagen.value = "";
        vistaPrevia.src = "";
        vistaPrevia.className = "vista-previa-foto-oculta";
        estadoSubidaImagen.style.display = "flex";
    }

    function mostrarVistaPrevia(ruta) {
        vistaPrevia.src = ruta;
        vistaPrevia.className = "vista-previa-foto-activa";
        estadoSubidaImagen.style.display = "none";
    }

    function abrirModalAgregar() {
        form.reset();
        fotoId.value = "";
        modalTitulo.textContent = "Agregar fotografía";
        modalSubtitulo.textContent = "Nueva fotografía";
        limpiarVistaPrevia();
        modal.classList.add("activo");
        modal.setAttribute("aria-hidden", "false");
    }

    function abrirModalEditar(id) {
        const foto = fotografias.find(f => f.id === id);
        if (!foto) return;

        form.reset();
        fotoId.value = foto.id;
        titulo.value = foto.titulo;
        categoria.value = foto.categoria;
        fecha.value = foto.fecha;
        descripcion.value = foto.descripcion;
        estado.value = foto.estado;
        imagen.value = "";
        mostrarVistaPrevia(foto.imagen);

        modalTitulo.textContent = "Editar fotografía";
        modalSubtitulo.textContent = "Actualizar información";
        modal.classList.add("activo");
        modal.setAttribute("aria-hidden", "false");
    }

    function cerrarModal() {
        modal.classList.remove("activo");
        modal.setAttribute("aria-hidden", "true");
    }

    function cambiarEstado(id) {
        const foto = fotografias.find(f => f.id === id);
        if (!foto) return;
        foto.estado = foto.estado === "publicada" ? "oculta" : "publicada";
        renderizar();
    }

    function abrirConfirmacion() {
        confirmacion.classList.add("activo");
        confirmacion.setAttribute("aria-hidden", "false");
    }

    function cerrarConfirmacion() {
        confirmacion.classList.remove("activo");
        confirmacion.setAttribute("aria-hidden", "true");
        fotoAEliminar = null;
    }

    imagen.addEventListener("change", function () {
        const archivo = this.files[0];

        if (!archivo) {
            limpiarVistaPrevia();
            return;
        }

        if (!archivo.type.startsWith("image/")) {
            alert("Selecciona un archivo de imagen válido.");
            limpiarVistaPrevia();
            return;
        }

        const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];

        if (!tiposPermitidos.includes(archivo.type)) {
            alert("Solo se permiten imágenes JPG, PNG o WEBP.");
            limpiarVistaPrevia();
            return;
        }

        const maximo = 5 * 1024 * 1024;

        if (archivo.size > maximo) {
            alert("La imagen no debe superar los 5 MB.");
            limpiarVistaPrevia();
            return;
        }

        const lector = new FileReader();

        lector.onload = function (evento) {
            mostrarVistaPrevia(evento.target.result);
        };

        lector.readAsDataURL(archivo);
    });

    form.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const archivoSeleccionado = imagen.files[0];
        let imagenGuardada = "";

        if (archivoSeleccionado) {
            imagenGuardada = vistaPrevia.src;
        } else if (fotoId.value) {
            const fotoExistente = fotografias.find(f => f.id === Number(fotoId.value));
            imagenGuardada = fotoExistente ? fotoExistente.imagen : "";
        }

        const datos = {
            titulo: titulo.value.trim(),
            categoria: categoria.value,
            fecha: fecha.value,
            descripcion: descripcion.value.trim(),
            imagen: imagenGuardada,
            estado: estado.value
        };

        if (!datos.titulo || !datos.categoria || !datos.fecha || !datos.imagen) {
            alert("Completa los campos obligatorios y selecciona una imagen.");
            return;
        }

        if (fotoId.value) {
            const foto = fotografias.find(f => f.id === Number(fotoId.value));
            if (foto) Object.assign(foto, datos);
        } else {
            fotografias.unshift({ id: Date.now(), ...datos });
        }

        paginaActual = 1;
        cerrarModal();
        renderizar();
    });

    document.getElementById("btnAbrirModalAgregar").addEventListener("click", abrirModalAgregar);
    document.getElementById("btnCerrarModalGaleria").addEventListener("click", cerrarModal);
    document.getElementById("btnCancelarModalGaleria").addEventListener("click", cerrarModal);
    document.getElementById("btnCancelarEliminarFoto").addEventListener("click", cerrarConfirmacion);

    document.getElementById("btnConfirmarEliminarFoto").addEventListener("click", function () {
        if (fotoAEliminar !== null) {
            fotografias = fotografias.filter(f => f.id !== fotoAEliminar);
        }
        cerrarConfirmacion();
        renderizar();
    });

    modal.addEventListener("click", function (evento) {
        if (evento.target === modal) cerrarModal();
    });

    confirmacion.addEventListener("click", function (evento) {
        if (evento.target === confirmacion) cerrarConfirmacion();
    });

    buscar.addEventListener("input", function () {
        paginaActual = 1;
        renderizar();
    });

    filtroCategoria.addEventListener("change", function () {
        paginaActual = 1;
        renderizar();
    });

    filtroEstado.addEventListener("change", function () {
        paginaActual = 1;
        renderizar();
    });

    document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape") {
            cerrarModal();
            cerrarConfirmacion();
        }
    });

    renderizar();
});