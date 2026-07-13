const API_URL = 'http://localhost:8080/comunicados';


document.addEventListener("DOMContentLoaded", () => {
  const API_URL = 'http://localhost:8080/comunicados'; // Tu puerto 8080 directo a web.php
  const contenedor = document.getElementById('contenedor-comunicados-api');
  const inputBuscar = document.getElementById('buscarComunicado');
  let comunicadosData = [];

  async function cargarComunicados() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error en el servidor');
      
      comunicadosData = await response.json();
      renderizarComunicados(comunicadosData);
    } catch (error) {
      console.error(error);
      contenedor.innerHTML = `
        <div class="alert alert-danger text-center m-3" role="alert">
          No se pudieron cargar los comunicados.
        </div>`;
    }
  }

  function renderizarComunicados(lista) {
    if (lista.length === 0) {
      contenedor.innerHTML = '<p class="text-center text-muted py-4">No hay comunicados.</p>';
      return;
    }

    let html = '';
    lista.forEach(comunicado => {
      const fecha = comunicado.created_at || comunicado.fecha || "Reciente";
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
            <i class="fa-regular fa-calendar-days me-2"></i> ${fecha}
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

  // Buscador básico
  if (inputBuscar) {
    inputBuscar.addEventListener('input', (e) => {
      const termino = e.target.value.toLowerCase().trim();
      const filtrados = comunicadosData.filter(c => c.titulo.toLowerCase().includes(termino));
      renderizarComunicados(filtrados);
    });
  }

  cargarComunicados();
});