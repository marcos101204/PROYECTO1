<?php
// login.php

// 1. Encabezados CORS
header("Access-Control-Allow-Origin: http://localhost:5173"); // O "*" si prefieres
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'conexion.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->correo) && !empty($data->contrasena)) {
    try {
        // Buscamos al usuario
        $sql = "SELECT id_usuario, nombre_completo, contrasena, rol, esta_activo 
                FROM usuario 
                WHERE correo_institucional = :correo";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':correo' => $data->correo]);
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
        // Justo después del fetch, antes del if de password_verify
if (!$usuario) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "❌ Correo no encontrado en BD"]);
    exit();
}

if (!password_verify($data->contrasena, $usuario['contrasena'])) {
    http_response_code(401);  
    echo json_encode(["success" => false, "message" => "❌ Contraseña incorrecta (¿está hasheada?)"]);
    exit();
}
        // Verificación de contraseña
        if ($usuario && password_verify($data->contrasena, $usuario['contrasena'])) {
            
            if ($usuario['esta_activo'] == 1) {
                http_response_code(200);
                // IMPORTANTE: Cambié "status" => "success" por "success" => true para que React lo entienda
                echo json_encode([
                    "success" => true, 
                    "message" => "¡Bienvenido a MarkITO!",
                    "nombre" => $usuario['nombre_completo'],
                    "rol" => $usuario['rol'],
                    "id" => $usuario['id_usuario']
                ]);
            } else {
                http_response_code(403);
                echo json_encode(["success" => false, "message" => "Tu cuenta ha sido desactivada."]);
            }
        } else {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Correo o contraseña incorrectos."]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error de servidor"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Ingresa todos los campos."]);
}
?>