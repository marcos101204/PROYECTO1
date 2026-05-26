<?php
// mensajes.php - Endpoints básicos para chat por polling
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }

require 'conexion.php';

$action = $_GET['action'] ?? null;

try {
    switch ($action) {
        case 'create_conversation':
            $data = json_decode(file_get_contents('php://input'), true);
            $u1 = (int)($data['user1'] ?? 0);
            $u2 = (int)($data['user2'] ?? 0);
            $id_producto = isset($data['id_producto']) ? (int)$data['id_producto'] : null;
            if (!$u1 || !$u2) {
                http_response_code(400);
                echo json_encode(['status'=>'error','message'=>'user1 y user2 requeridos']);
                exit();
            }
            // Normalizar orden para buscar conversaciones entre los mismos usuarios
            $minU = min($u1,$u2); $maxU = max($u1,$u2);
            $stmt = $pdo->prepare('SELECT id_conversacion FROM conversacion WHERE id_usuario_1 = ? AND id_usuario_2 = ? AND (id_producto = ? OR id_producto IS NULL) LIMIT 1');
            $stmt->execute([$minU, $maxU, $id_producto]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($row) {
                echo json_encode(['status'=>'success','id_conversacion'=>$row['id_conversacion']]);
                exit();
            }
            $stmt = $pdo->prepare('INSERT INTO conversacion (id_producto, id_usuario_1, id_usuario_2) VALUES (?, ?, ?)');
            $stmt->execute([$id_producto, $minU, $maxU]);
            $id = $pdo->lastInsertId();
            echo json_encode(['status'=>'success','id_conversacion'=>$id]);
            break;

        case 'send_message':
            $data = json_decode(file_get_contents('php://input'), true);
            $conv = (int)($data['id_conversacion'] ?? 0);
            $emisor = (int)($data['id_emisor'] ?? 0);
            $texto = $data['texto'] ?? null;
            $tipo = $data['tipo'] ?? 'text';
            $url_media = $data['url_media'] ?? null;
            if (!$conv || !$emisor) {
                http_response_code(400);
                echo json_encode(['status'=>'error','message'=>'id_conversacion e id_emisor requeridos']);
                exit();
            }
            $stmt = $pdo->prepare('INSERT INTO chat_mensaje (id_conversacion, id_emisor, texto, tipo, url_media) VALUES (?, ?, ?, ?, ?)');
            $stmt->execute([$conv, $emisor, $texto, $tipo, $url_media]);
            // actualizar timestamp de conversacion para que aparezca como activa
            $upd = $pdo->prepare('UPDATE conversacion SET ultimo_actualizado = NOW() WHERE id_conversacion = ?');
            $upd->execute([$conv]);
            $msgId = $pdo->lastInsertId();
            $stmt = $pdo->prepare('SELECT * FROM chat_mensaje WHERE id_mensaje = ?');
            $stmt->execute([$msgId]);
            $msg = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode(['status'=>'success','message'=>$msg]);
            break;

        case 'get_messages':
            $conv = isset($_GET['conv']) ? (int)$_GET['conv'] : 0;
            $since = $_GET['since'] ?? null; // timestamp optional
            if (!$conv) {
                http_response_code(400);
                echo json_encode(['status'=>'error','message'=>'conv requerido']);
                exit();
            }
                if ($since) {
                    $stmt = $pdo->prepare('SELECT m.*, u.nombre_completo AS nombre_emisor, u.avatar_url FROM chat_mensaje m LEFT JOIN usuario u ON u.id_usuario = m.id_emisor WHERE m.id_conversacion = ? AND m.fecha_creacion > ? ORDER BY m.fecha_creacion ASC');
                    $stmt->execute([$conv, $since]);
                } else {
                    $stmt = $pdo->prepare('SELECT m.*, u.nombre_completo AS nombre_emisor, u.avatar_url FROM chat_mensaje m LEFT JOIN usuario u ON u.id_usuario = m.id_emisor WHERE m.id_conversacion = ? ORDER BY m.fecha_creacion ASC');
                    $stmt->execute([$conv]);
            }
            $msgs = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['status'=>'success','data'=>$msgs]);
            break;

        case 'list_conversations':
            $user = isset($_GET['user']) ? (int)$_GET['user'] : 0;
            if (!$user) { http_response_code(400); echo json_encode(['status'=>'error','message'=>'user requerido']); exit(); }
            $sql = "SELECT c.*, (
                SELECT texto FROM chat_mensaje m WHERE m.id_conversacion = c.id_conversacion ORDER BY fecha_creacion DESC LIMIT 1
            ) AS ultimo_texto,
            (
                SELECT fecha_creacion FROM chat_mensaje m WHERE m.id_conversacion = c.id_conversacion ORDER BY fecha_creacion DESC LIMIT 1
            ) AS ultima_fecha
            FROM conversacion c
            WHERE c.id_usuario_1 = ? OR c.id_usuario_2 = ?
            ORDER BY COALESCE(ultima_fecha, c.ultimo_actualizado) DESC";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$user,$user]);
            $convs = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['status'=>'success','data'=>$convs]);
            break;

        default:
            http_response_code(400);
            echo json_encode(['status'=>'error','message'=>'action inválido']);
            break;
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status'=>'error','message'=>$e->getMessage()]);
}

?>
