document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('gridGaleria');
    const buscador = document.getElementById('buscarGaleria');
    let todasLasFotos = []; // Aquí guardaremos los datos del servidor

    // 1. Obtener datos desde Laravel
    try {
        const respuesta = await fetch('/api/galeria');
        todasLasFotos = await respuesta.json();
        renderizarFotos(todasLasFotos);
    } catch (error) {
        console.error("Error al cargar galería:", error);
    }

    // 2. Función para pintar las tarjetas
    function renderizarFotos(fotos) {
        grid.innerHTML = fotos.length ? fotos.map(f => `
            <article class="tarjeta-galeria" data-categoria="${f.categoria.toLowerCase()}">
                <button type="button" class="abrir-imagen">
                    <img src="/storage/galeria/${f.imagen}" alt="${f.titulo}">
                    <div class="capa-tarjeta-galeria">
                        <div>
                            <span class="categoria-galeria">${f.categoria}</span>
                            <h3>${f.titulo}</h3>
                        </div>
                        <i class="fa-solid fa-expand icono-ampliar"></i>
                    </div>
                </button>
            </article>
        `).join('') : '<p>No hay fotos disponibles.</p>';
    }

    // 3. Lógica de Búsqueda (Filtro en tiempo real)
    buscador.addEventListener('input', (e) => {
        const termino = e.target.value.toLowerCase();
        const filtradas = todasLasFotos.filter(f => 
            f.titulo.toLowerCase().includes(termino) || 
            f.categoria.toLowerCase().includes(termino)
        );
        renderizarFotos(filtradas);
    });
});