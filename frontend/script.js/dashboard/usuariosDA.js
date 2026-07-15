document.addEventListener('DOMContentLoaded', async () => {

    const contenedor = document.getElementById('contenedor-usuarios');

    try {

       const response = await fetch('http://127.0.0.1:8000/usuarios');

        if (!response.ok) {
            throw new Error('Error al obtener los usuarios');
        }

        const usuarios = await response.json();

        contenedor.innerHTML = '';

        usuarios.forEach((user, index) => {

            const fila = document.createElement('div');
            fila.className = 'usuario-item-row';

            fila.innerHTML = `
                <div class="usuario-texto-box">
                    ${index + 1}. ${user.name}
                </div>

                <div class="usuario-acciones">

                    <button class="btn-accion-icon azul-claro"
                            onclick="verUsuario(${user.id})">
                        <i class="bi bi-eye"></i>
                    </button>

                    <button class="btn-accion-icon azul-oscuro"
                            onclick="editarUsuario(${user.id})">
                        <i class="bi bi-pencil"></i>
                    </button>

                    <button class="btn-accion-icon azul-medio"
                            onclick="descargarUsuario(${user.id})">
                        <i class="bi bi-download"></i>
                    </button>

                    <button class="btn-accion-icon celeste"
                            onclick="eliminarUsuario(${user.id})">
                        <i class="bi bi-trash"></i>
                    </button>

                </div>
            `;

            contenedor.appendChild(fila);

        });

    } catch (error) {

        console.error(error);

    }

});
// Funciones de navegación (GET)
function verUsuario(id) {
    window.location.href = `/usuarios/${id}`;
}

// Asegúrate de que esta ruta exista en tu Web.php o Controller
function editarUsuario(id) {
    window.location.href = `/usuarios/${id}/edit`; 
}

// Función de eliminación (DELETE)
async function eliminarUsuario(id) {
    if (!confirm('¿Deseas eliminar este usuario?')) {
        return;
    }

    try {
        const response = await fetch(`/usuarios/${id}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert('Usuario eliminado correctamente');
            location.reload(); // Recarga para actualizar la lista
        } else {
            const data = await response.json();
            alert(data.message || 'Error al eliminar el usuario.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Ocurrió un error inesperado.');
    }
}
// Funciones
function verUsuario(id) {
    window.location.href = `/usuarios/${id}`;
}

function editarUsuario(id) {
    window.location.href = `/usuarios/${id}/edit`;
}

function descargarUsuario(id) {
    window.location.href = `/usuarios/${id}/pdf`;
}

async function eliminarUsuario(id) {

    if (!confirm('¿Deseas eliminar este usuario?')) {
        return;
    }

    const response = await fetch(`/usuarios/${id}`, {
        method: 'DELETE',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        }
    });

    if (response.ok) {
        location.reload();
    } else {
        alert('No se pudo eliminar el usuario.');
    }

}