document.addEventListener('DOMContentLoaded', () => {
    const btnAbrir = document.getElementById('btnAbrirModalAgregar');

    if (btnAbrir) {
        btnAbrir.addEventListener('click', mostrarFormularioSwal);
    }
});

async function mostrarFormularioSwal() {
    const { value: formValues } = await Swal.fire({
        title: 'Agregar fotografía',
        html: `
            <input id="swal-titulo" class="swal2-input" placeholder="Título de la foto">
            <input id="swal-imagen" type="file" class="swal2-file" accept="image/*">
        `,
        focusConfirm: false,
        confirmButtonText: 'Guardar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const titulo = document.getElementById('swal-titulo').value;
            const imagen = document.getElementById('swal-imagen').files[0];
            if (!titulo || !imagen) {
                Swal.showValidationMessage('Debes ingresar un título y seleccionar una imagen');
                return false;
            }
            return { titulo, imagen };
        }
    });

    if (formValues) {
        enviarAlServidor(formValues);
    }
}

async function enviarAlServidor(data) {
    const formData = new FormData();
    formData.append('titulo', data.titulo);
    formData.append('imagen', data.imagen);

    try {
        Swal.fire({ title: 'Guardando...', didOpen: () => Swal.showLoading() });

        const response = await fetch('http://127.0.0.1:8000/galeria', {
            method: 'POST',
            body: formData,
            headers: { 
                // Asegúrate de que este selector encuentra el valor real
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            }
        });

        // Primero verificamos el estado
        if (response.status === 419) {
            throw new Error("Token CSRF expirado o inválido.");
        }

        const resultado = await response.json();

        if (response.ok) {
            Swal.fire('¡Éxito!', 'Fotografía guardada correctamente', 'success');
        } else {
            Swal.fire('Error', resultado.message || 'Error en el servidor', 'error');
        }
    } catch (error) {
        console.error(error);
        Swal.fire('Error', error.message || 'Fallo de conexión con el servidor', 'error');
    }
}