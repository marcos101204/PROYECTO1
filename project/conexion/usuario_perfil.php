<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_errors.log');

// ensure clean JSON
ob_start();
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { ob_end_clean(); exit(0); }

$host = "localhost";
$dbname = "markito";
$username = "root";
$password = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Ensure profile fields exist
    $aliases = $pdo->query("SHOW COLUMNS FROM usuario LIKE 'alias'")->fetch(PDO::FETCH_ASSOC);
    if (!$aliases) {
        $pdo->exec("ALTER TABLE usuario ADD COLUMN alias VARCHAR(100) NULL AFTER correo_institucional");
    }
    $avatars = $pdo->query("SHOW COLUMNS FROM usuario LIKE 'avatar_url'")->fetch(PDO::FETCH_ASSOC);
    if (!$avatars) {
        $pdo->exec("ALTER TABLE usuario ADD COLUMN avatar_url VARCHAR(255) NULL AFTER alias");
    }
    $hasComprador = (bool)$pdo->query("SHOW COLUMNS FROM producto LIKE 'id_comprador'")->fetch(PDO::FETCH_ASSOC);

    $method = $_SERVER['REQUEST_METHOD'];

    switch($method) {
        case 'GET':
            // GET single user: ?id=123  optionally include history=ventas
            $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
            $history = isset($_GET['history']) ? $_GET['history'] : null;

            if (!$id) {
                if (ob_get_length() !== false) ob_end_clean();
                echo json_encode(["status" => "error", "message" => "id parameter required"]);
                exit;
            }

            // select user including alias and avatar_url if present
            $stmt = $pdo->prepare("SELECT id_usuario, nombre_completo, correo_institucional, alias, avatar_url, fecha_creacion FROM usuario WHERE id_usuario = ? LIMIT 1");
            $stmt->execute([$id]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$user) {
                if (ob_get_length() !== false) ob_end_clean();
                echo json_encode(["status" => "error", "message" => "Usuario no encontrado"]);
                exit;
            }

            $result = ["status" => "success", "data" => $user];

            if ($history === 'ventas' || $history === 'compras') {
                if ($history === 'ventas') {
                    // ventas: productos donde es vendedor
                    $sql = "SELECT producto.*, (
                                SELECT url_imagen FROM imagen_producto ip WHERE ip.id_producto = producto.id_producto AND ip.es_principal = 1 LIMIT 1
                            ) AS imagen_url
                            FROM producto WHERE id_vendedor = ? ORDER BY id_producto DESC LIMIT 100";
                    $stmt2 = $pdo->prepare($sql);
                    $stmt2->execute([$id]);
                    $result['ventas'] = $stmt2->fetchAll(PDO::FETCH_ASSOC);
                }

                if ($history === 'compras') {
                    if ($hasComprador) {
                        $sql = "SELECT producto.*, (
                                    SELECT url_imagen FROM imagen_producto ip WHERE ip.id_producto = producto.id_producto AND ip.es_principal = 1 LIMIT 1
                                ) AS imagen_url
                                FROM producto WHERE id_comprador = ? ORDER BY id_producto DESC LIMIT 100";
                        $stmt3 = $pdo->prepare($sql);
                        $stmt3->execute([$id]);
                        $result['compras'] = $stmt3->fetchAll(PDO::FETCH_ASSOC);
                    } else {
                        $result['compras'] = [];
                    }
                }
            }

            if (ob_get_length() !== false) ob_end_clean();
            echo json_encode($result);
            break;

        case 'PUT':
            // Actualizar alias y otros campos via JSON
            $data = json_decode(file_get_contents('php://input'), true);
            if (empty($data['id_usuario'])) {
                if (ob_get_length() !== false) ob_end_clean();
                echo json_encode(["status" => "error", "message" => "id_usuario requerido"]);
                exit;
            }
            $id = (int)$data['id_usuario'];
            $alias = isset($data['alias']) ? $data['alias'] : null;

            // Build dynamic update
            $fields = [];
            $params = [];
            if ($alias !== null) { $fields[] = 'alias = ?'; $params[] = $alias; }

            if (count($fields) === 0) {
                if (ob_get_length() !== false) ob_end_clean();
                echo json_encode(["status" => "error", "message" => "No hay campos para actualizar"]);
                exit;
            }

            $params[] = $id;
            $sql = "UPDATE usuario SET " . implode(', ', $fields) . " WHERE id_usuario = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);

            if (ob_get_length() !== false) ob_end_clean();
            echo json_encode(["status" => "success", "message" => "Perfil actualizado"]);
            break;

        case 'POST':
            // Subir avatar: form-data con id_usuario y archivo 'avatar'
            // Permitimos multipart uploads
            $id = isset($_POST['id_usuario']) ? (int)$_POST['id_usuario'] : null;
            if (!$id) {
                if (ob_get_length() !== false) ob_end_clean();
                echo json_encode(["status" => "error", "message" => "id_usuario requerido en form-data"]);
                exit;
            }

            if (!isset($_FILES['avatar']) || $_FILES['avatar']['error'] !== UPLOAD_ERR_OK) {
                if (ob_get_length() !== false) ob_end_clean();
                echo json_encode(["status" => "error", "message" => "Archivo avatar no recibido o error en upload"]);
                exit;
            }

            $uploadDir = __DIR__ . '/uploads/avatars/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

            $name = time() . '_' . preg_replace('/[^a-zA-Z0-9.]/', '', basename($_FILES['avatar']['name']));
            $dest = $uploadDir . $name;

            if (!move_uploaded_file($_FILES['avatar']['tmp_name'], $dest)) {
                if (ob_get_length() !== false) ob_end_clean();
                echo json_encode(["status" => "error", "message" => "No se pudo mover el archivo"]);
                exit;
            }

            // URL accesible
            $url = "http://localhost/PROYECTO1/project/uploads/avatars/" . $name;

            $stmt = $pdo->prepare("UPDATE usuario SET avatar_url = ? WHERE id_usuario = ?");
            $stmt->execute([$url, $id]);

            if (ob_get_length() !== false) ob_end_clean();
            echo json_encode(["status" => "success", "message" => "Avatar subido", "avatar_url" => $url]);
            break;

        default:
            if (ob_get_length() !== false) ob_end_clean();
            echo json_encode(["status" => "error", "message" => "Método no soportado"]);
            break;
    }

} catch (PDOException $e) {
    if (ob_get_length() !== false) ob_end_clean();
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

?>
