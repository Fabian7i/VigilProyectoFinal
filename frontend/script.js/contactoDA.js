document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargar los mensajes de la BD al abrir la página
    fetch('http://127.0.0.1:8000/mensajes')
        .then(res => res.json())
        .then(mensajes => {
            const contenedor = document.getElementById('lista-mensajes-dinamica');
            contenedor.innerHTML = ''; 

            mensajes.forEach(msg => {
                const item = document.createElement('div');
                item.className = 'mensaje-item';
                item.innerHTML = `
                    <div class="info-mensaje">
                        <strong>${msg.nombre}</strong><br>
                        <small>${msg.correo}</small>
                        <p>${msg.asunto}</p>
                    </div>
                    <button class="btn btn-sm btn-primary" onclick="abrirDetalle(${JSON.stringify(msg).replace(/"/g, '&quot;')})">
                        Ver mensaje
                    </button>
                `;
                contenedor.appendChild(item);
            });
        });
});

// 2. Función que abre el panel lateral y prepara Gmail
function abrirDetalle(msg) {
    document.getElementById('det-nombre').innerText = msg.nombre;
    document.getElementById('det-correo').innerText = msg.correo;
    document.getElementById('det-asunto').innerText = msg.asunto;
    document.getElementById('det-mensaje').innerText = msg.mensaje;

    // Configurar el botón de Gmail con los datos del mensaje
    const btnGmail = document.getElementById('btn-responder-gmail');
    const asuntoEncoded = encodeURIComponent("Respuesta a su consulta: " + msg.asunto);
    btnGmail.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${msg.correo}&su=${asuntoEncoded}`;
    
    document.getElementById('drawer-detalle-mensaje').classList.add('active');
}