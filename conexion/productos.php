<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 1. Conexión (Asegúrate de que la base de datos sea 'markito')
$conn = mysqli_connect("localhost", "root", "", "markito");

if (!$conn) {
    echo json_encode(["status" => "error", "message" => "Error de conexión: " . mysqli_connect_error()]);
    exit;
}

// 2. Consulta SQL 
// He simplificado la consulta para evitar errores de JOIN por ahora. 
// Si esto funciona, luego añadimos la categoría.
$query = "SELECT id_producto, nombre, precio, detalles, fecha_creacion FROM producto";

$result = mysqli_query($conn, $query);

// 3. Verificación de la consulta
if (!$result) {
    // Si la consulta falla, esto nos dirá POR QUÉ (ej: la tabla no existe)
    echo json_encode(["status" => "error", "message" => "Error en SQL: " . mysqli_error($conn)]);
    exit;
}

$productos = [];
while($row = mysqli_fetch_assoc($result)) {
    $productos[] = $row;
}

// 4. Respuesta exitosa
echo json_encode(["status" => "success", "data" => $productos]);

mysqli_close($conn);