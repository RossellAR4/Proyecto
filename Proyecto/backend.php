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

         // Asignar un cliente a una caja
         case 'asignarClienteCaja':
            // Asignar un cliente a una caja específica
            $cajaIndex = $_GET['cajaIndex'];  // Obtener el índice de la caja
            if ($cajaIndex >= 0 && $cajaIndex < 4) {
                // Verificar si la caja está vacía y si hay clientes en la cola
                if ($_SESSION['cajas'][$cajaIndex] === null && count($_SESSION['cola']) > 0) {
                    // Asignar el primer cliente de la cola a la caja
                    $_SESSION['cajas'][$cajaIndex] = array_shift($_SESSION['cola']);
                    echo json_encode(['mensaje' => "Cliente asignado a la Caja " . ($cajaIndex + 1)]);
                } else {
                    // Si la caja ya está ocupada o no hay clientes en la cola
                    echo json_encode(['error' => 'No se puede asignar cliente a la caja']);
                }
            } else {
                echo json_encode(['error' => 'Índice de caja inválido']);
            }
            break;


        // Finalizar la consulta de una caja
        case 'finalizarConsulta':
        $cajaIndex = $_GET['cajaIndex'];
        if ($cajaIndex >= 0 && $cajaIndex < 4 && $_SESSION['cajas'][$cajaIndex] !== null) {
        $_SESSION['cajas'][$cajaIndex] = null; // Liberar la caja
        echo json_encode(['mensaje' => "Caja " . ($cajaIndex + 1) . " liberada"]);
        } else {
        echo json_encode(['error' => 'Caja no tiene cliente']);
        }
        break;

                
            
                
                
                
    }
}
?>
