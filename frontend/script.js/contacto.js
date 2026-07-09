/* ==========================================================================
   LÓGICA INTERACTIVA: MÓDULO DE CONTACTO (DASHBOARD)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  
  // 1. Datos iniciales de prueba (Simulación de mensajes recibidos)
  let mensajesArr = [
    {
      id: 1,
      nombre: "Juan Pérez",
      correo: "juanperez@gmail.com",
      fecha: "10/07/2026 - 09:45 a. m.",
      asunto: "Consulta sobre matrícula",
      mensaje: "Buenas tardes. Quisiera saber cuándo inicia el proceso de matrícula 2027 y cuáles son los requisitos. Gracias.",
      estado: "Pendiente",
      respuesta: ""
    },
    {
      id: 2,
      nombre: "María López",
      correo: "marialopez@gmail.com",
      fecha: "09/07/2026 - 03:20 p. m.",
      asunto: "Solicitud de certificado",
      mensaje: "Necesito solicitar una constancia de estudios de mi menor hijo del 3er grado de primaria.",
      estado: "Respondido",
      respuesta: "Estimada María, la solicitud se realiza por secretaría externa de lunes a viernes."
    },
    {
      id: 3,
      nombre: "Carlos Ramos",
      correo: "carlosramos@gmail.com",
      fecha: "08/07/2026 - 12:10 p. m.",
      asunto: "Vacantes 2027",
      mensaje: "¿Aún existen vacantes disponibles para el próximo año académico en el nivel secundario?",
      estado: "Pendiente",
      respuesta: ""
    },
    {
      id: 4,
      nombre: "Ana Quispe",
      correo: "anaquispe@gmail.com",
      fecha: "07/07/2026 - 11:05 a. m.",
      asunto: "Información general",
      mensaje: "Me gustaría recibir información sobre los niveles educativos y talleres que ofrece la institución.",
      estado: "Respondido",
      respuesta: "Hola Ana, contamos con inicial, primaria y secundaria. Le adjuntamos los folletos."
    }
  ];

  // ID para saber qué mensaje tiene abierto el administrador en el panel lateral
  let idMensajeSeleccionado = null;

  // 2. Captura de elementos del DOM (Elementos de la página)
  const contenedorLista = document.getElementById("lista-mensajes-dinamica");
  const inputBuscar = document.getElementById("input-buscar");
  const selectFiltro = document.getElementById("select-filtro-estado");
  
  // Elementos del Panel Lateral (Drawer)
  const drawer = document.getElementById("drawer-detalle-mensaje");
  const detNombre = document.getElementById("det-nombre");
  const detCorreo = document.getElementById("det-correo");
  const detFecha = document.getElementById("det-fecha");
  const detAsunto = document.getElementById("det-asunto");
  const detMensaje = document.getElementById("det-mensaje");
  const detEstado = document.getElementById("det-select-estado");
  const detRespuesta = document.getElementById("det-respuesta");
  
  // Botones de acción
  const btnCerrarX = document.getElementById("btn-cerrar-drawer-x");
  const btnCancelar = document.getElementById("btn-cancelar-drawer");
  const btnGuardar = document.getElementById("btn-guardar-respuesta");

  // Indicadores de las Tarjetas Superiores (Métricas)
  const txtTotal = document.getElementById("txt-total-mensajes");
  const txtPendientes = document.getElementById("txt-pendientes-mensajes");
  const txtRespondidos = document.getElementById("txt-respondidos-mensajes");

  // 3. Función Principal de Inicialización
  function inicializarModulo() {
    renderizarMensajes();
    
    // Escuchar cuando el usuario escribe en el buscador o cambia el filtro de estado
    if (inputBuscar) inputBuscar.addEventListener("input", renderizarMensajes);
    if (selectFiltro) selectFiltro.addEventListener("change", renderizarMensajes);
    
    // Asignar cierres al panel lateral derecho
    if (btnCerrarX) btnCerrarX.addEventListener("click", cerrarDrawer);
    if (btnCancelar) btnCancelar.addEventListener("click", cerrarDrawer);
    
    // Acción del botón principal: Guardar Respuesta
    if (btnGuardar) {
      btnGuardar.addEventListener("click", function() {
        if (!idMensajeSeleccionado) return;
        
        const index = mensajesArr.findIndex(m => m.id === idMensajeSeleccionado);
        if (index !== -1) {
          // Guardar el texto escrito y cambiar automáticamente el estado a Respondido
          mensajesArr[index].respuesta = detRespuesta.value;
          mensajesArr[index].estado = "Respondido";
          
          cerrarDrawer();
          inicializarModulo(); // Re-renderiza la lista completa y recalcula tarjetas
          alert("¡Respuesta guardada con éxito! El estado de la consulta se actualizó a 'Respondido'.");
        }
      });
    }

    // Cerrar menús contextuales flotantes de tres puntos si se hace clic afuera de ellos
    document.addEventListener("click", function(e) {
      if (!e.target.classList.contains('fa-ellipsis-vertical') && !e.target.closest('.btn-accion-icono')) {
        document.querySelectorAll(".dropdown-menu-contextual").forEach(m => m.classList.remove("show"));
      }
    });
  }

  // 4. Calcular y actualizar las tarjetas numéricas superiores
  function calcularMetricas() {
    if (!txtTotal) return;
    const total = mensajesArr.length;
    const pendientes = mensajesArr.filter(m => m.estado === "Pendiente").length;
    const respondidos = mensajesArr.filter(m => m.estado === "Respondido").length;

    txtTotal.textContent = total;
    txtPendientes.textContent = pendientes;
    txtRespondidos.textContent = respondidos;
  }

  // 5. Dibujar la lista de mensajes aplicando buscadores y filtros
  function renderizarMensajes() {
    calcularMetricas();
    if (!contenedorLista) return;
    contenedorLista.innerHTML = "";

    const busqueda = inputBuscar ? inputBuscar.value.toLowerCase().trim() : "";
    const filtroEstado = selectFiltro ? selectFiltro.value : "Todos";

    // Filtrar el array en base a los criterios del administrador
    const mensajesFiltrados = mensajesArr.filter(msg => {
      const cumpleFiltro = (filtroEstado === "Todos") || (msg.estado === filtroEstado);
      const cumpleBusqueda = msg.nombre.toLowerCase().includes(busqueda) || 
                             msg.correo.toLowerCase().includes(busqueda) || 
                             msg.asunto.toLowerCase().includes(busqueda);
      return cumpleFiltro && cumpleBusqueda;
    });

    // Mensaje alternativo si el filtro no devuelve nada
    if (mensajesFiltrados.length === 0) {
      contenedorLista.innerHTML = `<div class="text-center text-muted p-4 bg-light rounded">No se encontraron mensajes con los criterios seleccionados.</div>`;
      return;
    }

    // Generar la estructura de tarjetas HTML por cada mensaje filtrado
    mensajesFiltrados.forEach(msg => {
      const tarjeta = document.createElement("div");
      tarjeta.className = "tarjeta-mensaje-horizontal";
      
      const badgeClase = msg.estado === "Pendiente" ? "badge-pendiente" : "badge-respondido";
      const badgeIcono = msg.estado === "Pendiente" ? "🟡" : "🟢";

      tarjeta.innerHTML = `
        <div class="msg-avatar">
          <i class="fa-solid fa-user"></i>
        </div>
        <div class="msg-datos-usuario">
          <p class="msg-nombre">${msg.nombre}</p>
          <p class="msg-correo">${msg.correo}</p>
          <p class="msg-fecha">${msg.fecha}</p>
        </div>
        <div class="msg-cuerpo-resumen">
          <p class="msg-asunto-tag">Asunto: ${msg.asunto}</p>
          <p class="msg-extracto">${msg.mensaje}</p>
        </div>
        <div class="msg-acciones-derecha">
          <span class="${badgeClase}">${badgeIcono} ${msg.estado}</span>
          <button class="btn-accion-icono btn-ver-trigger" title="Ver Detalle">
            <i class="fa-solid fa-eye"></i>
          </button>
          <div class="menu-contextual-contenedor">
            <button class="btn-accion-icono btn-menu-contextual-trigger" title="Más opciones">
              <i class="fa-solid fa-ellipsis-vertical"></i>
            </button>
            <div class="dropdown-menu-contextual">
              <button class="opc-ver"><i class="fa-solid fa-eye me-2"></i> Ver detalle</button>
              <button class="opc-marcar-resp"><i class="fa-solid fa-circle-check me-2"></i> Marcar respondido</button>
              <button class="opc-marcar-pend"><i class="fa-solid fa-circle-notch me-2"></i> Marcar pendiente</button>
              <button class="opc-eliminar text-danger"><i class="fa-solid fa-trash me-2"></i> Eliminar mensaje</button>
            </div>
          </div>
        </div>
      `;

      // Evento directo del botón del ojo (👁)
      tarjeta.querySelector(".btn-ver-trigger").addEventListener("click", () => abrirDrawer(msg.id));
      
      // Control de despliegue del menú contextual (Los tres puntos ⋮)
      const btnPuntos = tarjeta.querySelector(".btn-menu-contextual-trigger");
      const menuFlotante = tarjeta.querySelector(".dropdown-menu-contextual");
      
      btnPuntos.addEventListener("click", (e) => {
        e.stopPropagation();
        // Cierra otros menús que estén abiertos antes de abrir este
        document.querySelectorAll(".dropdown-menu-contextual").forEach(m => { if (m !== menuFlotante) m.classList.remove("show"); });
        menuFlotante.classList.toggle("show");
      });

      // Acciones internas del menú desplegable de los tres puntos
      tarjeta.querySelector(".opc-ver").addEventListener("click", () => abrirDrawer(msg.id));
      
      tarjeta.querySelector(".opc-marcar-resp").addEventListener("click", () => {
        cambiarEstadoMensajeDirecto(msg.id, "Respondido");
      });
      
      tarjeta.querySelector(".opc-marcar-pend").addEventListener("click", () => {
        cambiarEstadoMensajeDirecto(msg.id, "Pendiente");
      });
      
      tarjeta.querySelector(".opc-eliminar").addEventListener("click", () => {
        if (confirm(`¿Está seguro de eliminar permanentemente el mensaje enviado por ${msg.nombre}?`)) {
          mensajesArr = mensajesArr.filter(m => m.id !== msg.id);
          if (idMensajeSeleccionado === msg.id) cerrarDrawer();
          renderizarMensajes();
        }
      });

      contenedorLista.appendChild(tarjeta);
    });
  }

  // 6. Cambiar el estado de un mensaje sin necesidad de abrir el panel lateral
  function cambiarEstadoMensajeDirecto(id, nuevoEstado) {
    const index = mensajesArr.findIndex(m => m.id === id);
    if (index !== -1) {
      mensajesArr[index].estado = nuevoEstado;
      if (idMensajeSeleccionado === id) detEstado.value = nuevoEstado;
      renderizarMensajes();
    }
  }

  // 7. Cargar datos en el panel lateral derecho (Drawer) y mostrarlo
  function abrirDrawer(id) {
    idMensajeSeleccionado = id;
    const msg = mensajesArr.find(m => m.id === id);
    if (!msg || !drawer) return;

    // Rellenar campos de texto
    detNombre.textContent = msg.nombre;
    detCorreo.textContent = msg.correo;
    detFecha.textContent = msg.fecha;
    detAsunto.textContent = msg.asunto;
    detMensaje.textContent = msg.mensaje;
    detEstado.value = msg.estado;
    detRespuesta.value = msg.respuesta;

    // Agregar clase CSS para desplazar el panel hacia la pantalla
    drawer.classList.add("abierto");
  }

  // 8. Ocultar el panel lateral derecho
  function cerrarDrawer() {
    if (drawer) drawer.classList.remove("abierto");
    idMensajeSeleccionado = null;
  }

  // Ejecución automática al cargar el archivo
  inicializarModulo();
});