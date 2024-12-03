const API_URL = "backend.php";

// Función para actualizar la cola de espera (en la pantalla de espera)
function actualizarEspera() {
    fetch(`${API_URL}?accion=obtenerCola`)
        .then(response => response.json())
        .then(data => {
            const listaEspera = document.getElementById("colaEspera");
            listaEspera.innerHTML = data.map(cliente => {
                return `<li class="list-group-item">Cliente ${cliente}</li>`;
            }).join("");
        })
        .catch(error => console.error("Error al actualizar cola de espera:", error));
}

// Función para actualizar el estado de las cajas (en la pantalla de espera)
function actualizarCajas() {
    fetch(`${API_URL}?accion=obtenerCajas`)
        .then(response => response.json())
        .then(data => {
            const listaCajas = document.getElementById("listaCajas");
            listaCajas.innerHTML = ""; // Limpiar la lista de cajas

            // Crear la representación de las 4 cajas (solo mostrar información, sin botones)
            data.forEach((caja, index) => {
                const cajaDiv = document.createElement("div");
                cajaDiv.classList.add("col-md-3");
                cajaDiv.classList.add("mb-4");
                cajaDiv.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Caja ${index + 1}</h5>
                            <p class="card-text">
                                ${caja !== null ? `Atendiendo turno ${caja}` : "Caja disponible"}
                            </p>
                        </div>
                    </div>
                `;
                listaCajas.appendChild(cajaDiv);
            });
        })
        .catch(error => console.error("Error al actualizar cajas:", error));
}

// Función para actualizar estado de la cola y las cajas automáticamente (en la pantalla de espera)
function actualizarEstado() {
    actualizarEspera();
    actualizarCajas();
}

// Cargar estado de las cajas y cola cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    actualizarCajas();  // Actualiza las cajas en la pantalla de espera
    actualizarEspera(); // Actualiza la cola de espera
});
