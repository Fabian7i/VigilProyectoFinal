document.addEventListener("DOMContentLoaded", () => {
 
  const API_URL = '/comunicados'; 
  
  const contenedor = document.getElementById('contenedor-comunicados-api');
  const inputBuscar = document.getElementById('buscarComunicado');
  let comunicadosData = [];

  // 1. Función para obtener los comunicados desde Laravel
  async function cargarComunicados() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error al obtener los datos de la lista');
      
      comunicadosData = await response.json();
      renderizarComunicados(comunicadosData);
    } catch (error) {
      console.error(error);
      contenedor.innerHTML = `
        <div class="alert alert-danger text-center m-3" role="alert">
          <i class="fa-solid fa-triangle-exclamation me-2"></i> 
          No se pudieron cargar los comunicados. Intente más tarde.
        </div>`;
    }
  }

  // 2. Función para pintar los comunicados en el HTML con el diseño original
  function renderizarComunicados(lista) {
    if (lista.length === 0) {
      contenedor.innerHTML = '<p class="text-center text-muted py-4">No se encontraron comunicados disponibles.</p>';
      return;
    }

    let html = '';
    lista.forEach(comunicado => {
      const fechaFormateada = formatearFecha(comunicado.created_at || comunicado.fecha);
      // Ajusta 'archivo_pdf' al nombre de la columna que almacena la ruta de tu PDF en tu BD
      const rutaPdf = comunicado.archivo_pdf || `documentos/${comunicado.ruta}`; 

      html += `
        <div class="item-comunicado-fila row g-3 align-items-center py-3 border-bottom text-center text-md-start">
          <div class="col-12 col-md-6 d-flex align-items-center justify-content-center justify-content-md-start">
            <div class="icono-archivo-tipo me-3 flex-shrink-0 text-danger fs-4">
              <i class="fa-solid fa-file-pdf"></i>
            </div>
            <a href="${rutaPdf}" target="_blank" class="titulo-comunicado-link text-break fw-semibold text-decoration-none text-dark">
              ${comunicado.titulo}
            </a>
          </div>
          <div class="col-12 col-sm-6 col-md-3 text-muted">
            <i class="fa-regular fa-calendar-days me-2"></i> ${fechaFormateada}
          </div>
          <div class="col-12 col-sm-6 col-md-3 text-center d-flex justify-content-center gap-2">
            <a href="${rutaPdf}" target="_blank" class="btn btn-sm btn-outline-danger d-flex align-items-center gap-1">
              <i class="fa-regular fa-eye"></i> <span>Ver PDF</span>
            </a>
            <a href="${rutaPdf}" download="${comunicado.titulo}.pdf" class="btn btn-sm btn-danger d-flex align-items-center gap-1">
              <i class="fa-solid fa-download"></i> <span>Descargar</span>
            </a>
          </div>
        </div>
      `;
    });

    contenedor.innerHTML = html;
  }

  // 3. Lógica del Buscador en tiempo real
  inputBuscar.addEventListener('input', (e) => {
    const termino = e.target.value.toLowerCase().trim();
    const filtrados = comunicadosData.filter(c => 
      c.titulo.toLowerCase().includes(termino)
    );
    renderizarComunicados(filtrados);
  });

  function formatearFecha(fechaString) {
    if (!fechaString) return "Reciente";
    const opciones = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(fechaString).toLocaleDateString('es-ES', opciones);
  }

  cargarComunicados();
});