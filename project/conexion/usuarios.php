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
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $method = $_SERVER['REQUEST_METHOD'];

    switch($method) {
        case 'GET':
            $stmt = $pdo->query("SELECT id_usuario, nombre_completo, correo_institucional, rol, esta_activo, fecha_creacion FROM usuario ORDER BY id_usuario ASC");
            echo json_encode(["status" => "success", "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
            break;

        case 'POST':
            $data = json_decode(file_get_contents("php://input"), true);
            
            // HASHEO DE CONTRASEÑA
            $pass_plana = $data['contrasena'] ?? '123456';
            $pass_hash = password_hash($pass_plana, PASSWORD_BCRYPT);

            $sql = "INSERT INTO usuario (nombre_completo, correo_institucional, contrasena, rol, esta_activo) VALUES (?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            
            $stmt->execute([
                $data['nombre_completo'], 
                $data['correo_institucional'], 
                $pass_hash,
                $data['rol'] ?? 'Estudiante', 
                $data['esta_activo'] ?? 1
            ]);
            echo json_encode(["status" => "success", "message" => "Usuario creado y contraseña hasheada"]);
            break;

        case 'PUT':
            $data = json_decode(file_get_contents("php://input"), true);
            // Actualización sin tocar contraseña para evitar sobreescritura accidental
            $sql = "UPDATE usuario SET nombre_completo=?, correo_institucional=?, rol=?, esta_activo=? WHERE id_usuario=?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $data['nombre_completo'], 
                $data['correo_institucional'], 
                $data['rol'], 
                $data['esta_activo'], 
                $data['id_usuario']
            ]);
            echo json_encode(["status" => "success", "message" => "Usuario actualizado"]);
            break;

        case 'DELETE':
            $id = $_GET['id'] ?? null;
            if ($id) {
                $stmt = $pdo->prepare("DELETE FROM usuario WHERE id_usuario = ?");
                $stmt->execute([$id]);
                echo json_encode(["status" => "success", "message" => "Usuario eliminado"]);
            } else {
                echo json_encode(["status" => "error", "message" => "ID no proporcionado"]);
            }
            break;
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Error: " . $e->getMessage()]);
}
?>