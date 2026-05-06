<?php
$contrasena = "admin123"; // Pon aquí la contraseña real del admin
$hash = password_hash($contrasena, PASSWORD_DEFAULT);
echo $hash;
?>