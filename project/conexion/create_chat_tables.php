<?php
// create_chat_tables.php - Ejecutar una vez para crear tablas de chat
header('Content-Type: text/plain; charset=UTF-8');
require 'conexion.php';

try {
    $sql1 = "CREATE TABLE IF NOT EXISTS conversacion (
        id_conversacion INT AUTO_INCREMENT PRIMARY KEY,
        id_producto INT NULL,
        id_usuario_1 INT NOT NULL,
        id_usuario_2 INT NOT NULL,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ultimo_actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

    $sql2 = "CREATE TABLE IF NOT EXISTS mensaje (
        id_mensaje INT AUTO_INCREMENT PRIMARY KEY,
        id_conversacion INT NOT NULL,
        id_emisor INT NOT NULL,
        texto TEXT NULL,
        tipo VARCHAR(20) DEFAULT 'text',
        url_media VARCHAR(255) NULL,
        leido TINYINT(1) DEFAULT 0,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX (id_conversacion),
        INDEX (id_emisor),
        CONSTRAINT fk_mensaje_conversacion FOREIGN KEY (id_conversacion) REFERENCES conversacion(id_conversacion) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

    $pdo->exec($sql1);
    $pdo->exec($sql2);

    echo "Tablas 'conversacion' y 'mensaje' creadas o ya existían.\n";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}

?>
