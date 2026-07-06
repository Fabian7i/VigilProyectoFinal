// URL base de tu backend Laravel
const URL_BASE = 'http://127.0.0.1:8000';
const contenedor = document.getElementById('contenedor-fotos-noticias');
const formulario = document.getElementById('form-noticias-dashboard');

// ==========================================
// 1. FUNCIÓN PARA ITERAR Y PINTAR LAS IMÁGENES
// ==========================================
async function cargarNoticiasEnGaleria() {
    try {
        const respuesta = await fetch(`${URL_BASE}/noticias`, {
            headers: { 'Accept': 'application/json' }
        });
        const datos = await respuesta.json();

        if (respuesta.ok) {
            // Limpiamos por completo las 4 imágenes estáticas que vienen por defecto en el HTML
            contenedor.innerHTML = '';

            // Combinamos la noticia destacada y las recientes en una sola lista para iterar
            let todasLasNoticias = [];
            
            if (datos.destacada) {
                todasLasNoticias.push(datos.destacada);
            }
            if (datos.recientes && datos.recientes.length > 0) {
                todasLasNoticias = todasLasNoticias.concat(datos.recientes);
            }

            // Si la base de datos está vacía, ponemos un indicador visual limpio
            if (todasLasNoticias.length === 0) {
                contenedor.innerHTML = '<p class="text-muted text-center w-100">No hay noticias publicadas todavía.</p>';
                return;
            }

            // Iteramos cada noticia e inyectamos su imagen correspondiente en el contenedor
            todasLasNoticias.forEach(noticia => {
                // Armamos la ruta a la carpeta pública donde comprobamos que se guardan
                const rutaImagen = noticia.imagen 
                    ? `${URL_BASE}/storage/imagenes/${noticia.imagen}` 
                    : 'https://via.placeholder.com/180x100?text=Sin+Imagen';

                // Creamos el nodo div con la clase exacta de tus estilos CSS
                const fotoItem = document.createElement('div');
                fotoItem.classList.add('foto-item');

                // Inyectamos la etiqueta img respetando la estructura original
                fotoItem.innerHTML = `
                    <img src="${rutaImagen}" alt="${noticia.titulo || 'Noticia'}" onerror="this.src='https://via.placeholder.com/180x100?text=Error+Imagen'">
                `;

                // Lo añadimos al contenedor en caliente
                contenedor.appendChild(fotoItem);
            });
        }
    } catch (error) {
        console.error("Error al conectar con el backend para iterar imágenes:", error);
    }
}

// ==========================================
// 2. ESCUCHAR EL ENVÍO DEL FORMULARIO (POST)
// ==========================================
formulario.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(formulario);

    try {
        const respuesta = await fetch(`${URL_BASE}/noticias`, {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: formData
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            console.error("Error devuelto por Laravel:", datos);
            alert(`No se pudo guardar: ${datos.message || 'Error desconocido'}`);
            return;
        }

        alert("¡Noticia guardada con éxito!");
        formulario.reset(); // Limpia los inputs del formulario automáticamente

        // 🔥 LA CLAVE: Volvemos a llamar a la función para que refresque la galería e itere la nueva imagen sin recargar la página por completo
        cargarNoticiasEnGaleria();

    } catch (error) {
        console.error("Error en la petición de guardado:", error);
    }
});

// ==========================================
// 3. CARGA INICIAL
// ==========================================
// Cuando la página se termine de renderizar por primera vez, ejecuta la iteración
document.addEventListener('DOMContentLoaded', cargarNoticiasEnGaleria);