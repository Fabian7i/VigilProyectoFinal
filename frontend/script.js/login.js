document.getElementById('form-login').addEventListener('submit', async function(e) {
    e.preventDefault(); // Evita que la página se recargue

    // Capturamos los datos del formulario (email y password)
    const formData = new FormData(this);

    try {
        // Apuntamos a la ruta de Breeze para loguear
        const respuesta = await fetch('http://127.0.0.1:8000/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json' // Le exige a Laravel responder con JSON en lugar de redirigir
            },
            body: formData
        });

        // Si las credenciales son correctas (Laravel Breeze suele responder con un estado 200 o 204)
        if (respuesta.ok) {
            alert('¡Inicio de sesión correcto! Bienvenido de nuevo.');
            window.location.href = 'dashboard.html'; // Te manda a tu panel local
        } else {
            // Si las credenciales no coinciden o falló la validación
            const datos = await respuesta.json();
            console.error('Errores del servidor:', datos);
            
            if (datos.errors) {
                alert('Error de acceso:\n' + Object.values(datos.errors).flat().join('\n'));
            } else {
                alert(datos.message || 'Correo o contraseña incorrectos.');
            }
        }

    } catch (error) {
        console.error('Error de conexión:', error);
        alert('No se pudo conectar con el servidor para iniciar sesión.');
    }
});