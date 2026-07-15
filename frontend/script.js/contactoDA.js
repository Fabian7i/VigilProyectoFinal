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