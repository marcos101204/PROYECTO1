<?php
// 1. Cabeceras CORS (Indispensables para React + XAMPP)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// 2. Manejo de petición pre-flight OPTIONS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

// 3. Control de errores y buffer para evitar basura en el JSON
error_reporting(0); 
ob_start(); 

$host = "localhost";
$user = "root";
$pass = ""; 
$db   = "markito"; 

$conn = mysqli_connect($host, $user, $pass, $db);

// Inicializamos el array de respuesta
$respuesta = ["success" => false, "message" => "Error desconocido"];

if (!$conn) {
    $respuesta["message"] = "Error de conexión a la base de datos";
    enviarRespuesta($respuesta);
}

// 4. Capturar el cuerpo de la petición (JSON de React)
$input = json_decode(file_get_contents("php://input"), true);

if (!empty($input["correo"]) && !empty($input["contrasena"])) {
    $correo = mysqli_real_escape_string($conn, $input["correo"]);
    $pass_input = $input["contrasena"];

    // Consulta
    $query = "SELECT nombre, rol, estado_registro, contrasena FROM usuario WHERE correo = '$correo' LIMIT 1";
    $result = mysqli_query($conn, $query);

    if ($row = mysqli_fetch_assoc($result)) {
        // Validación de contraseña
        if ($pass_input === $row['contrasena']) {
            
            if (strtolower(trim($row['estado_registro'])) !== 'aprobado') {
                $respuesta["message"] = "Tu cuenta está pendiente de aprobación.";
            } else {
                // ÉXITO
                $respuesta = [
                    "success" => true,
                    "rol" => strtolower(trim($row['rol'])),
                    "nombre" => $row['nombre'],
                    "message" => "Acceso concedido"
                ];
            }
        } else {
            $respuesta["message"] = "Contraseña incorrecta.";
        }
    } else {
        $respuesta["message"] = "El correo no está registrado.";
    }
} else {
    $respuesta["message"] = "Por favor, llena todos los campos.";
}

// 5. Función para limpiar el buffer y enviar el JSON limpio
function enviarRespuesta($data) {
    ob_clean(); // Borra cualquier error accidental o "echo" previo
    echo json_encode($data);
    exit;
}

mysqli_close($conn);
enviarRespuesta($respuesta);
?>