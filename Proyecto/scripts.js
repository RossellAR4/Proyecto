const API_URL = "backend.php";  // URL del backend

// Actualizar la cola en la pantalla de espera
function actualizarCola() {
    fetch(`${API_URL}?accion=obtenerCola`)
        .then(response => response.json())
        .then(data => {
            const listaEspera = document.getElementById("colaEspera");
            listaEspera.innerHTML = data.map((turno) => `<li class="list-group-item">Cliente ${turno}</li>`).join("");
        })
        .catch(error => console.error("Error al actualizar la cola de espera:", error));
}

// Actualizar las cajas en la pantalla general
function actualizarCajasGenerales() {
    fetch(`${API_URL}?accion=obtenerCajas`)
        .then(response => response.json())
        .then(data => {
            const listaCajas = document.getElementById("listaCajas");
            listaCajas.innerHTML = data.map((cliente, index) => `
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Caja ${index + 1}</h5>
                        <p class="card-text">
                            ${cliente ? `Atendiendo turno ${cliente}` : "Caja disponible"}
                        </p>
                        <button class="btn btn-primary" onclick="abrirCaja(${index})">Abrir Caja</button>
                    </div>
                </div>
            `).join("");
        })
        .catch(error => console.error("Error al actualizar cajas generales:", error));
}




function actualizarEspera() {
    // Actualizar la cola
    fetch(`${API_URL}?accion=obtenerCola`)
        .then(response => response.json())
        .then(cola => {
            const listaCola = document.getElementById("listaCola");
            listaCola.innerHTML = cola.map(turno => `
                <p>Turno ${turno}</p>
            `).join("");
        })
        .catch(error => console.error("Error al actualizar la cola:", error));

    // Actualizar el estado de las cajas
    fetch(`${API_URL}?accion=obtenerCajas`)
        .then(response => response.json())
        .then(data => {
            const infoCajas = document.getElementById("listaCajas");
            infoCajas.innerHTML = data.map((cliente, index) => `
                <p><strong>Caja ${index + 1}:</strong> ${cliente ? `Atendiendo turno ${cliente}` : "Disponible"}</p>
            `).join("");
        })
        .catch(error => console.error("Error al actualizar el estado de las cajas:", error));
}

function llamarCliente() {
    const cajaIndex = getCajaIndex();  // Obtén el índice de la caja actual

    // Hacer la solicitud al backend para asignar un cliente a la caja
    fetch(`${API_URL}?accion=asignarClienteCaja&cajaIndex=${cajaIndex}`)
        .then(response => response.json())
        .then(data => {
            if (data.mensaje) {
                alert(data.mensaje);  // Mostrar el mensaje de éxito
                actualizarEstadoCaja(cajaIndex);  // Actualizar el estado de la caja
            } else {
                alert(data.error);  // Mostrar el error si no se pudo asignar el cliente
            }
        })
        .catch(error => console.error("Error al asignar cliente a la caja:", error));
}

// Función para finalizar la consulta y liberar la caja
function finalizarConsulta() {
    const cajaIndex = getCajaIndex();  // Obtén el índice de la caja actual

    // Hacer la solicitud al backend para finalizar la consulta de la caja
    fetch(`${API_URL}?accion=finalizarConsulta&cajaIndex=${cajaIndex}`)
        .then(response => response.json())
        .then(data => {
            if (data.mensaje) {
                alert(data.mensaje);
                actualizarEstadoCaja(cajaIndex);  // Actualizar el estado de la caja
            } else {
                alert(data.error);
            }
        })
        .catch(error => console.error("Error al finalizar la consulta:", error));
}

// Función para obtener el índice de la caja actual (esto debería estar en la URL o como dato)
function getCajaIndex() {
    // Suponemos que la caja número está en el DOM
    const cajaNumero = 0;
    alert(cajaNumero);
    return parseInt(cajaNumero);  // Convierte a índice (si la caja 1 es la caja 0 en el array)
}

// Función para actualizar el estado de la caja
function actualizarEstadoCaja(cajaIndex) {
    fetch(`${API_URL}?accion=obtenerCajas`)
        .then(response => response.json())
        .then(data => {
            // Mostrar el estado de la caja en el DOM
            const estadoCaja = data[cajaIndex];
            const estadoCajaDiv = document.getElementById('estadoCaja');
            if (estadoCaja === null) {
                estadoCajaDiv.innerHTML = 'Caja disponible';
            } else {
                estadoCajaDiv.innerHTML = `Atendiendo a cliente con turno: ${estadoCaja}`;
            }
        })
        .catch(error => console.error("Error al obtener el estado de la caja:", error));
}

// Función para redirigir a la pantalla de Cajas Generales
function redirigirACajasGenerales() {
    window.location.href = 'pantallacajasgenerales.html'; // Redirigir a la pantalla de cajas generales
}

// Función para cerrar la caja (opcional)
function cerrarCaja() {
    // Lógica para cerrar la caja, si es necesario
    console.log("Caja cerrada");
}




// Abrir la vista individual de una caja
function abrirCaja(cajaIndex) {
    window.location.href = `pantallaCajaIndividual.html?cajaIndex=${cajaIndex}`;
}

// Generar un nuevo turno en la pantalla del cliente
function generarTurno() {
    fetch(`${API_URL}?accion=generarTurno`)
        .then(response => response.json())
        .then(data => {
            alert(data.mensaje);
            actualizarCola(); // Actualizar cola en tiempo real
        })
        .catch(error => console.error("Error al generar turno:", error));
}

// Función para reiniciar el sistema
function reiniciarSistema() {
    fetch(`${API_URL}?accion=reiniciarSistema`)
        .then(response => response.json())
        .then(data => {
            alert(data.mensaje); // Muestra el mensaje del backend
            actualizarCola(); // Refrescar cola de espera
            actualizarCajasGenerales(); // Refrescar cajas generales
        })
        .catch(error => console.error("Error al reiniciar el sistema:", error));
}

// Inicializar eventos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    const url = window.location.pathname;

    if (url.includes("pantallaEspera.html")) {
        actualizarCola();
        actualizarEspera(); // Actualiza las cajas en espera
        actualizarEstadoCajas();
    } else if (url.includes("pantallaCajaGeneral.html")) {
        actualizarCajasGenerales();
        actualizarEstadoCajas();
    }
});
