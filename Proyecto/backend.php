<?php 
session_start();

// Verifica si la cola o las cajas existen en la sesión. Si no, las inicializa.
if (!isset($_SESSION['cola'])) {
    $_SESSION['cola'] = [];  // Cola de espera vacía
}

if (!isset($_SESSION['cajas'])) {
    $_SESSION['cajas'] = [null, null, null, null];  // Las 4 cajas están vacías
}

if (isset($_GET['accion'])) {
    switch ($_GET['accion']) {
        case 'obtenerCola':
            // Devuelve la cola de espera
            echo json_encode($_SESSION['cola']);
            break;

        case 'obtenerCajas':
            // Devuelve el estado de las cajas
            echo json_encode($_SESSION['cajas']);
            break;

        case 'reiniciarSistema':
            // Reinicia la cola y las cajas
            $_SESSION['cola'] = [];
            $_SESSION['cajas'] = [null, null, null, null];
            echo json_encode(['mensaje' => 'Sistema reiniciado']);
            break;

        case 'generarTurno':
            // Genera un nuevo turno y lo agrega a la cola
            $nuevoTurno = count($_SESSION['cola']) + 1;
            $_SESSION['cola'][] = $nuevoTurno;
            echo json_encode(['mensaje' => "Turno $nuevoTurno agregado a la cola"]);
            break;

        case 'asignarClienteCaja':
            // Asignar un cliente a una caja específica
            $cajaIndex = $_GET['cajaIndex'];
            if ($cajaIndex >= 0 && $cajaIndex < 4 && count($_SESSION['cola']) > 0 && $_SESSION['cajas'][$cajaIndex] === null) {
                $_SESSION['cajas'][$cajaIndex] = array_shift($_SESSION['cola']);
                echo json_encode(['mensaje' => "Cliente asignado a la Caja " . ($cajaIndex + 1)]);
            } else {
                echo json_encode(['error' => 'No se puede asignar cliente a la caja']);
            }
            break;

        case 'finalizarConsulta':
            // Finalizar la consulta de una caja y liberar la caja
            $cajaIndex = $_GET['cajaIndex'];
            if ($cajaIndex >= 0 && $cajaIndex < 4 && $_SESSION['cajas'][$cajaIndex] !== null) {
                $_SESSION['cajas'][$cajaIndex] = null;
                echo json_encode(['mensaje' => "Caja " . ($cajaIndex + 1) . " liberada"]);
            } else {
                echo json_encode(['error' => 'Caja no ocupada']);
            }
            break;
    }
}
?>
