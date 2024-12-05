<?php
session_start();
header("Content-Type: application/json");

// Inicializar las cajas y la cola de turnos si no existen
if (!isset($_SESSION["colaTurnos"])) {
    $_SESSION["colaTurnos"] = [];
}
if (!isset($_SESSION["cajas"])) {
    $_SESSION["cajas"] = array_fill(0, 4, null); // Inicializa 4 cajas disponibles
}

$accion = $_GET["accion"] ?? null;

// Obtener el estado de las cajas
if ($accion === "obtenerCajas") {
    echo json_encode($_SESSION["cajas"]);
    exit;
}

if ($accion === "obtenerCola") {
    echo json_encode($_SESSION["colaTurnos"]);
    exit;
}

// Reiniciar el sistema
if ($accion === "reiniciarSistema") {
    $_SESSION["colaTurnos"] = []; // Vaciar la cola
    $_SESSION["cajas"] = array_fill(0, 4, null); // Reiniciar las cajas (4 como ejemplo)
    echo json_encode(["mensaje" => "Sistema reiniciado correctamente."]);
    exit;
}


// Obtener el último turno en la cola
if ($accion === "obtenerUltimoTurno") {
    $ultimoTurno = end($_SESSION["colaTurnos"]) ?: 0;
    echo json_encode(["ultimoTurno" => $ultimoTurno]);
    exit;
}

// Generar un nuevo turno
if ($accion === "generarTurno") {
    $turno = intval($_GET["turno"]);
    $_SESSION["colaTurnos"][] = $turno;
    echo json_encode(["mensaje" => "Nuevo ticket generado: Turno $turno"]);
    exit;
}

// Llamar al siguiente cliente en la caja
if ($accion === "llamarCliente") {
    $cajaIndex = intval($_GET["cajaIndex"]);

    // Liberar caja si ya estaba ocupada
    if (!isset($_SESSION["cajas"][$cajaIndex])) {
        $_SESSION["cajas"][$cajaIndex] = null;
    }

    // Obtener el siguiente cliente de la cola
    $cliente = array_shift($_SESSION["colaTurnos"]);
    if ($cliente === null) {
        echo json_encode(["error" => "No hay clientes en la cola"]);
        exit;
    }

    // Asignar cliente a la caja
    $_SESSION["cajas"][$cajaIndex] = $cliente;
    echo json_encode(["cliente" => $cliente]);
    exit;
}

echo json_encode(["error" => "Acción no reconocida"]);
