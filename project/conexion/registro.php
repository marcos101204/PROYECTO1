<?php
// registro.php

header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'conexion.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->nombre) && !empty($data->correo) && !empty($data->contrasena)) {
    
    $password_hash = password_hash($data->contrasena, PASSWORD_BCRYPT);

    try {
        // CORRECCIÓN: Cambié 'estado' por 'esta_activo' para que coincida con tu login
        $sql = "INSERT INTO usuario (nombre_completo, correo_institucional, contrasena, esta_activo) 
                VALUES (:nombre, :correo, :contrasena, 0)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':nombre' => $data->nombre,
            ':correo' => $data->correo,
            ':contrasena' => $password_hash
        ]);

        http_response_code(201); 
        echo json_encode(["status" => "success", "message" => "¡Cuenta creada exitosamente! Tu cuenta está en espera de activación."]);

    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Este correo institucional ya está registrado."]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Error del servidor: " . $e->getMessage()]);
        }
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Por favor, envía todos los datos requeridos."]);
}
?>