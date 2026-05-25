<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'conexion.php';

$id_producto = $_GET['id_producto'] ?? null;

if (!$id_producto) {
    http_response_code(400);
    echo json_encode([
        "status"  => "error",
        "message" => "Se requiere id_producto."
    ]);
    exit();
}

try {
    // JOIN con usuario para obtener el nombre en la misma consulta
    $sql = "SELECT 
                vp.id_valoracion,
                vp.id_usuario,
                vp.calificacion,
                vp.comentario,
                vp.fecha_creacion,
                u.nombre AS nombre_usuario
            FROM valoracion_producto vp
            LEFT JOIN usuario u ON u.id_usuario = vp.id_usuario
            WHERE vp.id_producto = ?
            ORDER BY vp.fecha_creacion DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$id_producto]);
    $valoraciones = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "data"   => $valoraciones
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status"  => "error",
        "message" => "Error de base de datos: " . $e->getMessage()
    ]);
}
?>