<?php
// create_chat_mensaje.php - Crea tabla chat_mensaje si no existe
header('Content-Type: text/plain; charset=UTF-8');
require 'conexion.php';

try {
    $sql = "CREATE TABLE IF NOT EXISTS chat_mensaje (
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
        CONSTRAINT fk_chatmsg_conversacion FOREIGN KEY (id_conversacion) REFERENCES conversacion(id_conversacion) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

    $pdo->exec($sql);
    echo "Tabla 'chat_mensaje' creada o ya existía.\n";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}

?>
