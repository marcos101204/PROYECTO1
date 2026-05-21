<?php
// registro.php

// 1. Encabezados CORS (Vitales para que React y PHP se puedan hablar)
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Manejo del pre-flight de CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 2. Incluir la conexión
require 'conexion.php';

// 3. Recibir el JSON desde React
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->nombre) && !empty($data->correo) && !empty($data->contrasena)) {
    
    // 4. Encriptar la contraseña por seguridad
    $password_hash = password_hash($data->contrasena, PASSWORD_BCRYPT);

    try {
        // 5. Preparar y ejecutar el INSERT
        $sql = "INSERT INTO usuario (nombre_completo, correo_institucional, contrasena) 
                VALUES (:nombre, :correo, :contrasena)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':nombre' => $data->nombre,
            ':correo' => $data->correo,
            ':contrasena' => $password_hash
        ]);

        http_response_code(201); // 201 = Created
        echo json_encode(["status" => "success", "message" => "¡Cuenta creada exitosamente!"]);

    } catch (PDOException $e) {
        // El código 23000 salta si se viola la regla UNIQUE (correo repetido)
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