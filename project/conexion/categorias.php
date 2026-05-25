<?php
// categorias.php - CRUD para categorías

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }

require 'conexion.php';

try {
    $method = $_SERVER['REQUEST_METHOD'];

    switch ($method) {
        case 'GET':
    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare("
            SELECT r.*, u.nombre_completo AS nombre_usuario
            FROM reporte r
            LEFT JOIN usuario u ON r.id_usuario_emisor = u.id_usuario
            WHERE r.id_reporte = ?
        ");
        $stmt->execute([$_GET['id']]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode(["status" => "success", "data" => $data]);
    } else {
        $stmt = $pdo->query("
            SELECT r.*, u.nombre_completo AS nombre_usuario
            FROM reporte r
            LEFT JOIN usuario u ON r.id_usuario_emisor = u.id_usuario
            ORDER BY r.fecha_reporte DESC
        ");
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["status" => "success", "data" => $data]);
    }
    break;

        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            if (empty($data['nombre'])) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "El campo 'nombre' es requerido"]);
                exit();
            }
            $sql = "INSERT INTO categoria (nombre, descripcion) VALUES (?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$data['nombre'], $data['descripcion'] ?? null]);
            echo json_encode(["status" => "success", "message" => "Categoría creada"]);
            break;

        case 'PUT':
            $data = json_decode(file_get_contents('php://input'), true);
            if (empty($data['id_categoria'])) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "id_categoria es requerido"]);
                exit();
            }
            $sql = "UPDATE categoria SET nombre = ?, descripcion = ? WHERE id_categoria = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$data['nombre'], $data['descripcion'] ?? null, $data['id_categoria']]);
            echo json_encode(["status" => "success", "message" => "Categoría actualizada"]);
            break;

        case 'DELETE':
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "ID requerido para eliminar"]);
                exit();
            }
            $stmt = $pdo->prepare("DELETE FROM categoria WHERE id_categoria = ?");
            $stmt->execute([$_GET['id']]);
            echo json_encode(["status" => "success", "message" => "Categoría eliminada"]);
            break;

        default:
            http_response_code(405);
            echo json_encode(["status" => "error", "message" => "Método no permitido"]);
            break;
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

?>
