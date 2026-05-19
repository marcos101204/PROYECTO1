<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }

$host = "localhost";
$dbname = "markito"; 
$username = "root";
$password = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $method = $_SERVER['REQUEST_METHOD'];

    switch($method) {
        case 'GET':
            // Soporta varios modos: ?id= (producto), ?id_vendedor= (mis publicaciones), o lista general
            if (isset($_GET['id'])) {
                $stmt = $pdo->prepare("SELECT * FROM producto WHERE id_producto = ?");
                $stmt->execute([$_GET['id']]);
                echo json_encode(["status" => "success", "data" => $stmt->fetch(PDO::FETCH_ASSOC)]);
            } elseif (isset($_GET['id_vendedor'])) {
                $stmt = $pdo->prepare("SELECT * FROM producto WHERE id_vendedor = ? ORDER BY id_producto DESC");
                $stmt->execute([$_GET['id_vendedor']]);
                echo json_encode(["status" => "success", "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
            } else {
                $stmt = $pdo->query("SELECT * FROM producto ORDER BY id_producto DESC");
                echo json_encode(["status" => "success", "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
            }
            break;

        case 'POST':
            $data = json_decode(file_get_contents("php://input"), true);
            // Ajustado a los nombres de columnas de tu imagen
            $sql = "INSERT INTO producto (titulo, descripcion, precio, condicion, estado_vendedor, estado_moderacion, id_vendedor, id_categoria) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $data['titulo'], 
                $data['descripcion'], 
                $data['precio'], 
                $data['condicion'], 
                $data['estado_vendedor'] ?? 'Disponible',
                $data['estado_moderacion'] ?? 'Aprobado',
                $data['id_vendedor'] ?? 1,
                $data['id_categoria']
            ]);
            echo json_encode(["status" => "success", "message" => "Producto creado"]);
            break;

        case 'PUT':
            $data = json_decode(file_get_contents("php://input"), true);
            // Ajustado para actualizar los campos visibles en tu captura
            $sql = "UPDATE producto SET titulo=?, descripcion=?, precio=?, condicion=?, id_categoria=? WHERE id_producto=?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $data['titulo'], 
                $data['descripcion'], 
                $data['precio'], 
                $data['condicion'], 
                $data['id_categoria'],
                $data['id_producto']
            ]);
            echo json_encode(["status" => "success", "message" => "Producto actualizado"]);
            break;

        case 'DELETE':
            if (isset($_GET['id'])) {
                $stmt = $pdo->prepare("DELETE FROM producto WHERE id_producto = ?");
                $stmt->execute([$_GET['id']]);
                echo json_encode(["status" => "success", "message" => "Producto eliminado"]);
            }
            break;
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>