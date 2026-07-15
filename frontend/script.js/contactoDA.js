document.addEventListener('DOMContentLoaded', () => {
    cargarMensajes();
});

function cargarMensajes() {
    fetch('http://127.0.0.1:8000/mensajes')
        .then(response => {
            if (!response.ok) throw new Error('Error en el servidor: ' + response.status);
            return response.json();
        })
        .then(mensajes => {
            const contenedor = document.getElementById('lista-mensajes-dinamica');
            contenedor.innerHTML = ''; 

            // 1. Actualizar contadores
            actualizarContadores(mensajes);

            // 2. Renderizar lista
            mensajes.forEach(msg => {
                const item = document.createElement('div');
                item.className = 'mensaje-item';
                
                // Escapar comillas para el JSON en onclick
                const msgJson = JSON.stringify(msg).replace(/"/g, '&quot;');
                
                item.innerHTML = `
                    <div class="info-mensaje">
                        <strong>${msg.nombre}</strong><br>
                        <small>${msg.correo}</small>
                        <p>${msg.asunto}</p>
                    </div>
                    <button class="btn btn-sm btn-primary" onclick="abrirDetalle(${msgJson})">
                        Ver mensaje
                    </button>
                `;
                contenedor.appendChild(item);
            });
        })
        .catch(error => {
            console.error('Error al cargar los mensajes:', error);
            // Mostrar 0 en contadores si falla la carga
            actualizarContadores([]); 
        });
}

function actualizarContadores(mensajes) {
    const total = mensajes.length || 0;
    const pendientes = mensajes.filter(m => m.estado === 'Pendiente').length || 0;
    const respondidos = mensajes.filter(m => m.estado === 'Respondido').length || 0;

    document.getElementById('txt-total-mensajes').innerText = total;
    document.getElementById('txt-pendientes-mensajes').innerText = pendientes;
    document.getElementById('txt-respondidos-mensajes').innerText = respondidos;
}

function abrirDetalle(msg) {
    document.getElementById('det-nombre').innerText = msg.nombre || 'N/A';
    document.getElementById('det-correo').innerText = msg.correo || 'N/A';
    document.getElementById('det-asunto').innerText = msg.asunto || 'N/A';
    document.getElementById('det-fecha').innerText = msg.created_at || 'N/A';
    document.getElementById('det-mensaje').innerText = msg.mensaje || '';

    const btnGmail = document.getElementById('btn-responder-gmail');
    const asuntoEncoded = encodeURIComponent("Respuesta a su consulta: " + (msg.asunto || ""));
    btnGmail.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${msg.correo}&su=${asuntoEncoded}`;
    
    document.getElementById('drawer-detalle-mensaje').classList.add('active');
}
// Función para abrir el detalle y configurar el botón de respuesta
function abrirDetalle(msg) {
    // 1. Llenar datos
    document.getElementById('det-nombre').innerText = msg.nombre;
    document.getElementById('det-correo').innerText = msg.correo;
    document.getElementById('det-fecha').innerText = new Date(msg.created_at).toLocaleDateString();
    document.getElementById('det-asunto').innerText = msg.asunto;
    document.getElementById('det-mensaje').innerText = msg.mensaje;

    // 2. Configurar el botón de Responder en Gmail de forma profesional
    const btnResponder = document.getElementById('btn-responder-gmail');
    
    // Codificamos el asunto para que la URL sea válida
    const asuntoEncoded = encodeURIComponent(`Respuesta a su consulta: ${msg.asunto}`);
    
    // URL de redacción de Gmail
    btnResponder.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${msg.correo}&su=${asuntoEncoded}&body=Hola ${msg.nombre}, en respuesta a su consulta...`;
    
    // 3. Abrir el panel
    document.getElementById('drawer-detalle-mensaje').classList.add('active');
}

// Asegurar que el botón cerrar funcione
document.getElementById('btn-cerrar-drawer-x').addEventListener('click', () => {
    document.getElementById('drawer-detalle-mensaje').classList.remove('active');
});document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('lista-mensajes-dinamica');

    // Delegación de eventos: El clic se escucha en el contenedor padre
    contenedor.addEventListener('click', (e) => {
        // Buscamos si el clic fue en un botón con clase 'btn-leer-mensaje'
        const boton = e.target.closest('.btn-leer-mensaje');
        if (boton) {
            const mensajeData = JSON.parse(boton.dataset.mensaje);
            abrirDetalle(mensajeData);
        }
    });

    // Función para cerrar el panel
    document.getElementById('btn-cerrar-drawer-x').addEventListener('click', () => {
        document.getElementById('drawer-detalle-mensaje').classList.remove('active');
    });
});

// Función de renderizado (asegúrate de usar esta estructura)
function renderizarLista(mensajes) {
    const contenedor = document.getElementById('lista-mensajes-dinamica');
    contenedor.innerHTML = ''; 

    mensajes.forEach(msg => {
        const item = document.createElement('div');
        // Aquí usamos data-mensaje para pasar el objeto JSON de forma segura
        item.innerHTML = `
            <div class="card p-3 mb-2 shadow-sm border-0">
                <h6 class="mb-0 text-primary">${msg.nombre}</h6>
                <small class="text-muted">${msg.correo}</small>
                <button class="btn btn-outline-primary btn-sm mt-2 btn-leer-mensaje" 
                        data-mensaje='${JSON.stringify(msg)}'>
                    <i class="fa-solid fa-eye"></i> Leer mensaje completo
                </button>
            </div>
        `;
        contenedor.appendChild(item);
    });
}
document.addEventListener('DOMContentLoaded', () => {
    console.log("Script cargado correctamente");
    
    // 1. Delegación de eventos (Funciona aunque el contenido sea dinámico)
    const contenedor = document.getElementById('lista-mensajes-dinamica');
    
    if (contenedor) {
        contenedor.addEventListener('click', (e) => {
            // Buscamos si el clic fue en un botón o en el icono dentro del botón
            const boton = e.target.closest('.btn-leer-mensaje');
            
            if (boton) {
                const dataString = boton.getAttribute('data-mensaje');
                try {
                    const msg = JSON.parse(dataString);
                    abrirDetalle(msg); // Llamamos a la función
                } catch (error) {
                    console.error("Error al procesar el mensaje:", error);
                }
            }
        });
    }

    // 2. Cerrar drawer
    const btnCerrar = document.getElementById('btn-cerrar-drawer-x');
    if (btnCerrar) {
        btnCerrar.addEventListener('click', () => {
            document.getElementById('drawer-detalle-mensaje').classList.remove('active');
        });
    }
});


function abrirDetalle(msg) {
    Swal.fire({
        title: 'DETALLE DEL MENSAJE',
        html: `
            <div style="text-align: left;">
                <p><strong>Nombre:</strong> ${msg.nombre}</p>
                <p><strong>Correo:</strong> ${msg.correo}</p>
                <p><strong>Asunto:</strong> ${msg.asunto}</p>
                <hr>
                <p><strong>Mensaje:</strong></p>
                <div style="background: #f8f9fa; padding: 10px; border-radius: 5px;">${msg.mensaje}</div>
            </div>
        `,
        icon: 'info',
        showCancelButton: true,
        cancelButtonText: 'Cerrar',
        confirmButtonText: '<i class="fa-brands fa-google"></i> Responder en Gmail',
        confirmButtonColor: '#00204a',
        width: '600px'
    }).then((result) => {
        if (result.isConfirmed) {
            // Abrir Gmail con los datos listos
            const asuntoEncoded = encodeURIComponent("Respuesta: " + msg.asunto);
            const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${msg.correo}&su=${asuntoEncoded}`;
            window.open(url, '_blank');
        }
    });
}