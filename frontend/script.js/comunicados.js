document.addEventListener("DOMContentLoaded", () => {
  const API_URL = 'http://localhost:8080/comunicados'; 
  const contenedor = document.getElementById('contenedor-comunicados-api');
  const inputBuscar = document.getElementById('buscarComunicado');
  let comunicadosData = [];

  // 1. Obtener comunicados desde Laravel
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

  // 2. Pintar la lista con el diseño premium
  function renderizarComunicados(lista) {
    if (lista.length === 0) {
      contenedor.innerHTML = '<p class="text-center text-muted py-4">No hay comunicados.</p>';
      return;
    }

    let html = '';
    lista.forEach(comunicado => {
      const fecha = comunicado.created_at || comunicado.fecha || "Reciente";

      html += `
        <div class="item-comunicado-fila row g-3 align-items-center py-3 border-bottom text-center text-md-start">
          <div class="col-12 col-md-6 d-flex align-items-center justify-content-center justify-content-md-start">
            <div class="icono-archivo-tipo me-3 flex-shrink-0 text-danger fs-4">
              <i class="fa-solid fa-file-pdf"></i>
            </div>
            <!-- Al hacer clic en el título también se genera el PDF -->
            <a href="#" data-id="${comunicado.id}" class="btn-generar-pdf titulo-comunicado-link text-break fw-semibold text-decoration-none text-dark">
              ${comunicado.titulo}
            </a>
          </div>
          <div class="col-12 col-sm-6 col-md-3 text-muted">
            <i class="fa-regular fa-calendar-days me-2"></i> ${formatearFechaSimple(fecha)}
          </div>
          <div class="col-12 col-sm-6 col-md-3 text-center d-flex justify-content-center gap-2">
            <button data-id="${comunicado.id}" class="btn-generar-pdf btn btn-sm btn-outline-danger d-flex align-items-center gap-1">
              <i class="fa-regular fa-eye"></i> <span>Ver PDF</span>
            </button>
            <button data-id="${comunicado.id}" class="btn-generar-pdf btn btn-sm btn-danger d-flex align-items-center gap-1">
              <i class="fa-solid fa-download"></i> <span>Descargar</span>
            </button>
          </div>
        </div>
      `;
    });
    contenedor.innerHTML = html;

    // Asignar el evento click a todos los botones que generan el PDF de tu plantilla
    document.querySelectorAll('.btn-generar-pdf').forEach(elemento => {
      elemento.addEventListener('click', (e) => {
        e.preventDefault();
        const id = elemento.getAttribute('data-id');
        const comunicadoSeleccionado = comunicadosData.find(c => c.id == id);
        if (comunicadoSeleccionado) {
          descargarPDF(comunicadoSeleccionado);
        }
      });
    });
  }

  // 3. TU PLANTILLA ORIGINAL DE IMPRESIÓN/CONVERSIÓN PDF
  function descargarPDF(comunicado) {
    const fechaFormateada = new Date(comunicado.created_at || comunicado.fecha).toLocaleDateString();
    const creador = comunicado.usuario_creador || 'Administración';
    const cuerpo = comunicado.cuerpo || comunicado.contenido || '';

    const htmlContenido = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <title>${comunicado.titulo}</title>
          <style>
              body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 45px; color: #333; line-height: 1.6; }
              .header { text-align: center; border-bottom: 3px solid #003366; padding-bottom: 15px; margin-bottom: 25px; }
              .header h1 { color: #003366; font-size: 22px; margin: 0; text-transform: uppercase; }
              .header p { margin: 5px 0 0 0; color: #666; font-size: 13px; }
              .meta-pdf { text-align: right; font-size: 12px; color: #555; margin-bottom: 25px; font-style: italic; }
              .titulo-comunicado { font-size: 18px; color: #111; font-weight: bold; margin-bottom: 20px; text-align: center; text-transform: uppercase; }
              .contenido { font-size: 14px; text-align: justify; white-space: pre-line; margin-bottom: 50px; color: #222; }
              .footer { margin-top: 60px; text-align: center; font-size: 11px; color: #777; border-top: 1px solid #ddd; padding-top: 10px; }
          </style>
      </head>
      <body>
          <div class="header">
              <h1>Colegio Enrique Paillardelle</h1>
              <p>Comunicado Oficial Institucional</p>
          </div>
          <div class="meta-pdf">
              <strong>Publicado por:</strong> ${creador}<br>
              <strong>Fecha de emisión:</strong> ${fechaFormateada}
          </div>
          <div class="titulo-comunicado">${comunicado.titulo}</div>
          <div class="contenido">${cuerpo}</div>
          <div class="footer">
              Dirección General • Institución Educativa Enrique Paillardelle<br>
              Documento digital válido emitido desde el Panel Administrativo.
          </div>
          <script>
              window.onload = function() { window.print(); window.close(); }
          <\/script>
      </body>
      </html>
    `;

    // Abrir una nueva ventana de impresión con tu plantilla inyectada
    const ventanaImpresion = window.open('', '_blank');
    ventanaImpresion.document.write(htmlContenido);
    ventanaImpresion.document.close();
  }

  // Buscador en tiempo real
  if (inputBuscar) {
    inputBuscar.addEventListener('input', (e) => {
      const termino = e.target.value.toLowerCase().trim();
      const filtrados = comunicadosData.filter(c => c.titulo.toLowerCase().includes(termino));
      renderizarComunicados(filtrados);
    });
  }

  function formatearFechaSimple(fechaString) {
    if (!fechaString) return "Reciente";
    const opciones = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(fechaString).toLocaleDateString('es-ES', opciones);
  }

  cargarComunicados();
});