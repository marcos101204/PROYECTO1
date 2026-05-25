<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'conexion.php';

// Los datos llegan como JSON desde el componente React
$input = json_decode(file_get_contents('php://input'), true);

$id_producto  = $input['id_producto']  ?? null;
$id_usuario   = $input['id_usuario']   ?? null;
$calificacion = $input['calificacion'] ?? null;
$comentario   = trim($input['comentario'] ?? '');

// Validaciones básicas
if (!$id_producto || !$id_usuario || !$calificacion || empty($comentario)) {
    http_response_code(400);
    echo json_encode([
        "status"  => "error",
        "message" => "Todos los campos son obligatorios."
    ]);
    exit();
}

if ($calificacion < 1 || $calificacion > 5) {
    http_response_code(400);
    echo json_encode([
        "status"  => "error",
        "message" => "La calificación debe ser entre 1 y 5."
    ]);
    exit();
}

if (strlen($comentario) < 5) {
    http_response_code(400);
    echo json_encode([
        "status"  => "error",
        "message" => "El comentario es demasiado corto."
    ]);
    exit();
}

try {
    // Evitar que el mismo usuario deje más de una reseña por producto
    $stmtCheck = $pdo->prepare(
        "SELECT COUNT(*) FROM valoracion_producto 
         WHERE id_producto = ? AND id_usuario = ?"
    );
    $stmtCheck->execute([$id_producto, $id_usuario]);
    if ($stmtCheck->fetchColumn() > 0) {
        http_response_code(409);
        echo json_encode([
            "status"  => "error",
            "message" => "Ya dejaste una reseña para este producto."
        ]);
        exit();
    }

    $sql = "INSERT INTO valoracion_producto 
                (id_producto, id_usuario, calificacion, comentario, fecha_creacion)
            VALUES (?, ?, ?, ?, NOW())";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$id_producto, $id_usuario, $calificacion, $comentario]);

    http_response_code(201);
    echo json_encode([
        "status"  => "success",
        "message" => "¡Valoración publicada exitosamente!"
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status"  => "error",
        "message" => "Error de base de datos: " . $e->getMessage()
    ]);
}
?>