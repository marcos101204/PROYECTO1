<?php
header("Access-Control-Allow-Origin: http://localhost:5173"); // Permite específicamente tu puerto de React
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// IMPORTANTE: Manejo del pre-flight (petición OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
// conexion.php
$host = "localhost";
$db   = "markito1";
$user = "root";
$pass = "";

try {
    // Aquí se crea la variable $pdo
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}
?>