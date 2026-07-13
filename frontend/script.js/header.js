document.addEventListener("DOMContentLoaded", () => {
    const headerContainer = document.getElementById("header-container");
    
    if (headerContainer) {
        fetch('header.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error("No se pudo cargar el header de manera dinámica.");
                }
                return response.text();
            })
            .then(data => {
                headerContainer.innerHTML = data;
            })
            .catch(error => console.error("Error al cargar el header:", error));
    }
});