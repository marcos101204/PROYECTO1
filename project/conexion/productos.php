<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Evitar que PHP imprima warnings/notices en HTML en la respuesta JSON.
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_errors.log');

// Capturamos cualquier salida accidental y la descartamos para asegurar JSON limpio
ob_start();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { ob_end_clean(); exit(0); }

$host = "localhost";
$dbname = "markito"; 
$username = "root";
$password = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $method = $_SERVER['REQUEST_METHOD'];

    switch($method) {
case 'GET':
    $busqueda = isset($_GET['q']) ? $_GET['q'] : '';
    $categoria = isset($_GET['cat']) ? $_GET['cat'] : '';
    $minPrice = isset($_GET['minPrice']) ? (float)$_GET['minPrice'] : null;
    $maxPrice = isset($_GET['maxPrice']) ? (float)$_GET['maxPrice'] : null;
    $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
    $limit = isset($_GET['limit']) ? max(1, (int)$_GET['limit']) : 12;
    $offset = ($page - 1) * $limit;
    
    // Seleccionamos campos del producto y añadimos la URL de la imagen principal si existe
    $sql = "SELECT producto.*, (
                SELECT url_imagen FROM imagen_producto ip WHERE ip.id_producto = producto.id_producto AND ip.es_principal = 1 LIMIT 1
            ) AS imagen_url
            FROM producto WHERE estado_moderacion = 'Aprobado'";
    $params = [];

    if (!empty($busqueda)) {
        $sql .= " AND (titulo LIKE ? OR descripcion LIKE ?)";
        $params[] = "%$busqueda%";
        $params[] = "%$busqueda%";
    }

    $idVendedor = isset($_GET['id_vendedor']) ? $_GET['id_vendedor'] : '';

    if (!empty($categoria)) {
        $sql .= " AND id_categoria = ?";
        $params[] = $categoria;
    }

    if (!empty($idVendedor)) {
        $sql .= " AND id_vendedor = ?";
        $params[] = $idVendedor;
    }

    if ($minPrice !== null) {
        $sql .= " AND precio >= ?";
        $params[] = $minPrice;
    }

    if ($maxPrice !== null) {
        $sql .= " AND precio <= ?";
        $params[] = $maxPrice;
    }

    // Contar total de resultados
    $countSql = "SELECT COUNT(*) as total FROM producto WHERE estado_moderacion = 'Aprobado'";
    if (!empty($busqueda)) {
        $countSql .= " AND (titulo LIKE ? OR descripcion LIKE ?)";
    }
    if (!empty($categoria)) {
        $countSql .= " AND id_categoria = ?";
    }
    if (!empty($idVendedor)) {
        $countSql .= " AND id_vendedor = ?";
    }
    if ($minPrice !== null) {
        $countSql .= " AND precio >= ?";
    }
    if ($maxPrice !== null) {
        $countSql .= " AND precio <= ?";
    }

    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute($params);
    $totalCount = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Nota: algunos motores de MySQL/MariaDB no aceptan LIMIT/OFFSET como parámetros preparados
    // (pueden terminar siendo tratados como strings y producir sintaxis con comillas).
    // Por seguridad convertimos a enteros y los concatenamos directamente.
    $limitInt = (int)$limit;
    $offsetInt = (int)$offset;
    $sql .= " ORDER BY id_producto DESC LIMIT " . $limitInt . " OFFSET " . $offsetInt;
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    if (ob_get_length() !== false) { ob_end_clean(); }
    echo json_encode([
        "status" => "success", 
        "data" => $stmt->fetchAll(PDO::FETCH_ASSOC),
        "pagination" => [
            "page" => $page,
            "limit" => $limit,
            "total" => (int)$totalCount,
            "pages" => ceil($totalCount / $limit)
        ]
    ]);
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
            if (ob_get_length() !== false) { ob_end_clean(); }
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
            if (ob_get_length() !== false) { ob_end_clean(); }
            echo json_encode(["status" => "success", "message" => "Producto actualizado"]);
            break;

        case 'DELETE':
            if (isset($_GET['id'])) {
                $stmt = $pdo->prepare("DELETE FROM producto WHERE id_producto = ?");
                $stmt->execute([$_GET['id']]);
                if (ob_get_length() !== false) { ob_end_clean(); }
                echo json_encode(["status" => "success", "message" => "Producto eliminado"]);
            }
            break;
    }
} catch (PDOException $e) {
    if (ob_get_length() !== false) { ob_end_clean(); }
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>