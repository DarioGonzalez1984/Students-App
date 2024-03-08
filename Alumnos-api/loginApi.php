<?php
// Configuración de la base de datos
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "alumnos_api";

// Conexión a la base de datos
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
// Obtener los datos JSON de la solicitud
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

// Verificar si se recibieron datos
if (!empty($data['username']) && !empty($data['password'])) {
    // Sanitizar y escapar los datos de entrada para evitar inyección de SQL
    $username = $conn->real_escape_string($data['username']);
    $password = $conn->real_escape_string($data['password']);

    // Consulta SQL para buscar el usuario en la base de datos
    $sql = "SELECT * FROM acceso WHERE usuario='$username' AND pass='$password'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // Si se encontró un usuario con los datos proporcionados, el inicio de sesión es exitoso
        $response = array("success" => true, "message" => "Inicio de sesión exitoso");
    } else {
        // Si no se encontró un usuario, mostrar un mensaje de error
        $response = array("success" => false, "message" => "Usuario o contraseña incorrectos");
    }
} else {
    // Si no se enviaron los datos esperados, mostrar un mensaje de error
    $response = array("success" => false, "message" => "Faltan datos de inicio de sesión");
}

// Devolver la respuesta en formato JSON
header('Content-Type: application/json');
echo json_encode($response);

// Cerrar la conexión a la base de datos
$conn->close();
?>