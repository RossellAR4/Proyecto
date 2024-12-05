const API_URL = "backend.php"; // URL del backend

// Actualizar la cola en la pantalla de espera
function actualizarCola() {
    fetch(`${API_URL}?accion=obtenerCola`)
        .then(response => response.json())
        .then(data => {
            const listaEspera = document.getElementById("colaEspera");
            listaEspera.innerHTML = data.map(turno => `<li class="list-group-item">Cliente ${turno}</li>`).join("");
        })
        .catch(error => console.error("Error al actualizar la cola de espera:", error));
}
// Actualizar las cajas generales en la pantalla
function actualizarCajasGenerales() {
    fetch(`${API_URL}?accion=obtenerCajas`)
        .then(response => response.json())
        .then(data => {
            const listaCajas = document.getElementById("listaCajas");

            // Verificar si se recibió un arreglo de cajas
            if (!Array.isArray(data)) {
                console.error("Respuesta inesperada:", data);
                listaCajas.innerHTML = "<p>Error al cargar las cajas.</p>";
                return;
            }

            // Renderizar las cajas
            listaCajas.innerHTML = data.map((cliente, index) => `
                <div class="col-md-4">
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">Caja ${index + 1}</h5>
                            <p class="card-text">${cliente ? `Atendiendo turno ${cliente}` : "Caja disponible"}</p>
                            <button class="btn btn-primary" onclick="abrirCaja(${index})">Abrir Caja</button>
                        </div>
                    </div>
                </div>
            `).join("");
        })
        .catch(error => {
            console.error("Error al actualizar las cajas generales:", error);
            document.getElementById("listaCajas").innerHTML = "<p>Error al cargar las cajas.</p>";
        });
}

function abrirCaja(cajaIndex) {
    window.location.href = `pantallaCajaIndividual.html?cajaIndex=${cajaIndex}`;
}


// Generar un nuevo turno en la pantalla del cliente
function generarTurno() {
    fetch(`${API_URL}?accion=obtenerUltimoTurno`)
        .then(response => response.json())
        .then(data => {
            const ultimoTurno = data.ultimoTurno || 0;
            const nuevoTurno = ultimoTurno + 1;

            fetch(`${API_URL}?accion=generarTurno&turno=${nuevoTurno}`)
                .then(response => response.json())
                .then(data => {
                    alert(data.mensaje);
                    actualizarCola();
                    mostrarTicketEnPantalla(nuevoTurno);
                    imprimirTicketConsola(nuevoTurno);
                })
                .catch(error => console.error("Error al generar turno:", error));
        })
        .catch(error => console.error("Error al obtener el último turno:", error));
}

// Mostrar ticket en la pantalla del cliente
function mostrarTicketEnPantalla(turno) {
    const container = document.querySelector(".container");
    const ticketHtml = `
        <div class="mt-4 p-3 border rounded bg-light">
            <h4>Nuevo Ticket Generado</h4>
            <pre>
--- TICKET DE SERVICIO ---
|   Turno: ${turno}         |
| ¡Por favor, espere su    |
| turno para ser atendido! |
---------------------------
            </pre>
        </div>
    `;
    container.insertAdjacentHTML("beforeend", ticketHtml);
}

// Imprimir ticket en la consola
function imprimirTicketConsola(turno) {
    console.log(`
--- IMPRESIÓN DE TICKET ---
|   TICKET DE SERVICIO   |
|------------------------|
| Turno: ${turno}         |
|                        |
| ¡Por favor, espere su  |
| turno para ser atendido!|
--------------------------
--- FIN DE LA IMPRESIÓN ---
`);
}

// Llamar al siguiente cliente en la caja
function llamarCliente() {
    const urlParams = new URLSearchParams(window.location.search);
    const cajaIndex = parseInt(urlParams.get("cajaIndex")) || 0;

    fetch(`${API_URL}?accion=llamarCliente&cajaIndex=${cajaIndex}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
                return;
            }

            const estadoCaja = document.getElementById("estadoCaja");
            estadoCaja.innerHTML = `Atendiendo a cliente con turno: ${data.cliente}`;
            enviarAlertaPantallaEspera(data.cliente, cajaIndex + 1);
        })
        .catch(error => console.error("Error al llamar cliente:", error));
}

// Enviar alerta a la pantalla de espera
function enviarAlertaPantallaEspera(cliente, caja) {
    alert(`Cliente Turno ${cliente} Dirigirse a la Caja ${caja}`);
}

function actualizarEspera() {
    // Actualizar la cola
    fetch(`${API_URL}?accion=obtenerCola`)
        .then(response => response.json())
        .then(cola => {
            const listaEspera = document.getElementById("colaEspera");
            listaEspera.innerHTML = cola.map(turno => `<li class="list-group-item">Cliente ${turno}</li>`).join("");
        })
        .catch(error => console.error("Error al actualizar la cola de espera:", error));

    // Actualizar las cajas
    fetch(`${API_URL}?accion=obtenerCajas`)
        .then(response => response.json())
        .then(cajas => {
            const listaCajas = document.getElementById("listaCajas");
            listaCajas.innerHTML = cajas.map((cliente, index) => `
                <div class="col-md-4">
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">Caja ${index + 1}</h5>
                            <p class="card-text">${cliente ? `Atendiendo turno ${cliente}` : "Caja disponible"}</p>
                        </div>
                    </div>
                </div>
            `).join("");

            // Mostrar el mensaje de cliente asignado
            actualizarMensajeClienteCaja(cajas);
        })
        .catch(error => console.error("Error al actualizar las cajas:", error));
}

// Actualizar el mensaje dinámico
function actualizarMensajeClienteCaja(cajas) {
    const mensajeDiv = document.getElementById("mensajeClienteCaja");
    const asignaciones = cajas
        .map((cliente, index) => cliente ? `Cliente Turno ${cliente} dirigirse a la Caja ${index + 1}` : null)
        .filter(mensaje => mensaje !== null);

    mensajeDiv.innerHTML = asignaciones.length > 0
        ? asignaciones.map(mensaje => `<p>${mensaje}</p>`).join("")
        : "<p>No hay clientes asignados en este momento.</p>";
}

function cargarNumeroCaja() {
    // Obtener los parámetros de la URL
    alert("hola");
    const urlParams = new URLSearchParams(window.location.search);
    const cajaIndex = urlParams.get("cajaIndex");

    // Mostrar el número de la caja (suma 1 para que sea humano legible)
    const cajaNumeroSpan = document.getElementById("cajaNumero");
    cajaNumeroSpan.textContent = parseInt(cajaIndex) + 1;
}
function reiniciarSistema() {
    fetch(`${API_URL}?accion=reiniciarSistema`)
        .then(response => response.json())
        .then(data => {
            alert(data.mensaje); // Mostrar mensaje de confirmación
            actualizarCola(); // Refrescar la lista de espera
            actualizarCajasGenerales(); // Refrescar el estado de las cajas
        })
        .catch(error => console.error("Error al reiniciar el sistema:", error));
}



// Inicializar actualización automática
document.addEventListener("DOMContentLoaded", () => {
    /*if (url.includes("pantallaCajaIndividual.html")) {
        cargarNumeroCaja(); // Cargar número de caja
    }*/
    actualizarEspera();
    setInterval(actualizarEspera, 3000); // Actualizar cada 5 segundos
});

