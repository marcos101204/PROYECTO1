<?php
// reportes.php - CRUD básico para reportes de anuncios

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
            // Si se pasa ?id=, devolver ese reporte
            if (isset($_GET['id'])) {
                $stmt = $pdo->prepare("SELECT * FROM reporte WHERE id_reporte = ?");
                $stmt->execute([$_GET['id']]);
                $data = $stmt->fetch(PDO::FETCH_ASSOC);
                echo json_encode(["status" => "success", "data" => $data]);
            } else {
                $stmt = $pdo->query("SELECT * FROM reporte ORDER BY fecha_reporte DESC");
                $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode(["status" => "success", "data" => $data]);
            }
            break;

        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            if (empty($data['id_producto']) || empty($data['id_usuario_reporta']) || empty($data['motivo'])) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Campos requeridos: id_producto, id_usuario_reporta, motivo"]);
                exit();
            }
            $sql = "INSERT INTO reporte (id_producto, id_usuario_reporta, motivo, fecha_reporte, estado) VALUES (?, ?, ?, NOW(), 'Pendiente')";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$data['id_producto'], $data['id_usuario_reporta'], $data['motivo']]);
            echo json_encode(["status" => "success", "message" => "Reporte creado"]);
            break;

        case 'PUT':
            $data = json_decode(file_get_contents('php://input'), true);
            if (empty($data['id_reporte'])) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "id_reporte es requerido"]);
                exit();
            }
            $fields = [];
            $params = [];
            if (isset($data['estado'])) {
                $fields[] = "estado = ?";
                $params[] = $data['estado'];
            }
            if (isset($data['motivo'])) {
                $fields[] = "motivo = ?";
                $params[] = $data['motivo'];
            }
            if (empty($fields)) {
                echo json_encode(["status" => "success", "message" => "Nada que actualizar"]);
                exit();
            }
            $params[] = $data['id_reporte'];
            $sql = "UPDATE reporte SET " . implode(', ', $fields) . " WHERE id_reporte = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            echo json_encode(["status" => "success", "message" => "Reporte actualizado"]);
            break;

        case 'DELETE':
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "ID requerido para eliminar"]);
                exit();
            }
            $stmt = $pdo->prepare("DELETE FROM reporte WHERE id_reporte = ?");
            $stmt->execute([$_GET['id']]);
            echo json_encode(["status" => "success", "message" => "Reporte eliminado"]);
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
