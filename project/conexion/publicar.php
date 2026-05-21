<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
// publicar.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
// Permitimos POST para enviar datos
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'conexion.php';

// Al usar FormData en React, los datos llegan en $_POST y las imágenes en $_FILES
$titulo = $_POST['titulo'] ?? '';
$precio = $_POST['precio'] ?? '';
$condicion = $_POST['condicion'] ?? '';
$id_categoria = $_POST['id_categoria'] ?? '';
$id_vendedor = $_POST['id_vendedor'] ?? '';

if (empty($titulo) || empty($precio) || empty($condicion) || empty($id_categoria) || empty($id_vendedor)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Por favor, completa todos los campos obligatorios."]);
    exit();
}

try {
    // Iniciamos una transacción (para asegurar que si falla la imagen, no se guarde el producto a medias)
    $pdo->beginTransaction();

    // 1. Insertar el producto
    $sql = "INSERT INTO producto (titulo, precio, condicion, id_categoria, id_vendedor, estado_vendedor, estado_moderacion) 
            VALUES (?, ?, ?, ?, ?, 'Disponible', 'Aprobado')";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$titulo, $precio, $condicion, $id_categoria, $id_vendedor]);
    
    // Obtenemos el ID del producto recién creado
    $id_producto = $pdo->lastInsertId();

    // 2. Manejar la imagen (si el usuario subió una)
    if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = 'uploads/';
        
        // Si no existe la carpeta uploads, la crea
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // Generamos un nombre único para evitar que se sobreescriban imágenes con el mismo nombre
        $nombreArchivo = time() . '_' . preg_replace("/[^a-zA-Z0-9.]/", "", basename($_FILES['imagen']['name']));
        $rutaDestino = $uploadDir . $nombreArchivo;

        if (move_uploaded_file($_FILES['imagen']['tmp_name'], $rutaDestino)) {
            // URL completa para guardarla en la BD
            $url_imagen = "http://localhost/markito-api/" . $rutaDestino;

            $sqlImg = "INSERT INTO imagen_producto (id_producto, url_imagen, es_principal) VALUES (?, ?, 1)";
            $stmtImg = $pdo->prepare($sqlImg);
            $stmtImg->execute([$id_producto, $url_imagen]);
        }
    }

    $pdo->commit();
    http_response_code(201);
    echo json_encode(["status" => "success", "message" => "¡Producto publicado exitosamente!"]);

} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Error de base de datos: " . $e->getMessage()]);
}
?>