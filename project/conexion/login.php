<?php
// login.php

header("Access-Control-Allow-Origin: http://localhost:5173"); 
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
        $sql = "SELECT id_usuario, nombre_completo, contrasena, rol, esta_activo 
                FROM usuario 
                WHERE correo_institucional = :correo";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':correo' => $data->correo]);
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        // 1. Validar si el usuario existe
        if (!$usuario) {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "❌ El correo no se encuentra registrado."]);
            exit();
        }

        // 2. Validar la contraseña
        if (!password_verify($data->contrasena, $usuario['contrasena'])) {
            http_response_code(401);  
            echo json_encode(["success" => false, "message" => "❌ La contraseña es incorrecta."]);
            exit();
        }
        
        // 3. Validar si está activo (Candado para evitar acceso al Home)
        if ((int)$usuario['esta_activo'] === 1) {
            http_response_code(200);
            echo json_encode([
                "success" => true, 
                "message" => "¡Bienvenido a MarkITO!",
                "nombre" => $usuario['nombre_completo'],
                "rol" => $usuario['rol'],
                "id" => $usuario['id_usuario']
            ]);
        } else {
            // 🛑 Bloqueo: Retorna un 403 (Prohibido) si es 0
            http_response_code(403);
            echo json_encode([
                "success" => false, 
                "message" => "⚠️ Tu cuenta está en espera de ser aprobada por un administrador."
            ]);
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