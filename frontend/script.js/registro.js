document.getElementById('form-registro').addEventListener('submit', async function(e) {
    e.preventDefault(); 

    // Volvemos a capturar los datos como FormData (así Laravel lo entiende nativamente)
    const formData = new FormData(this);

    try {
        const respuesta = await fetch('http://127.0.0.1:8000/register', {
            method: 'POST',
            headers: {
                // DETALLE CRUCIAL: Le dice a Laravel que ignore las redirecciones web
                // y que devuelva cualquier respuesta (éxito o error) como JSON.
                'Accept': 'application/json' 
            },
            body: formData // Enviamos el formData directamente
        });

        // Ahora que forzamos 'Accept': 'application/json', esto no debería romperse
        const datos = await respuesta.json();

        if (respuesta.ok || respuesta.status === 201) {
            alert('¡Registro exitoso!');
            window.location.href = 'dashboard.html'; // Te manda a tu HTML local
        } else {
            console.error('Errores de validación del servidor:', datos);
            if (datos.errors) {
                alert('Error en el registro:\n' + Object.values(datos.errors).flat().join('\n'));
            } else {
                alert('Error: ' + (datos.message || 'Error desconocido en el servidor.'));
            }
        }

    } catch (error) {
        console.error('Error en el proceso:', error);
        alert('Ocurrió un problema al procesar el registro.');
    }
});