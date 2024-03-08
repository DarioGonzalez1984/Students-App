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



// Método POST - Agregar un nuevo alumno
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $cedula = $data['cedula'];
    
    // Verificar si la cédula ya existe en la base de datos
    $stmt_verificacion = $conn->prepare("SELECT * FROM alumnos WHERE cedula = ?");
    $stmt_verificacion->bind_param("s", $cedula);
    $stmt_verificacion->execute();
    $result_verificacion = $stmt_verificacion->get_result();
    $alumno_existente = $result_verificacion->fetch_assoc();
    $stmt_verificacion->close();
    
    // Si ya existe un alumno con esa cédula, devolver un mensaje de error
    if ($alumno_existente) {
        echo "Error: Ya existe un alumno con la cédula proporcionada.";
    } else {
        // Si no existe, proceder con la inserción del nuevo registro
        $curso_id = $data['curso_id']; // Obtener el curso_id del cuerpo de la solicitud
        $stmt_insercion = $conn->prepare("INSERT INTO alumnos (cedula, nombre, apellido, fecha_nacimiento, telefono, responsable_nombre, responsable_cedula, curso_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt_insercion->bind_param("sssssssi", $data['cedula'], $data['nombre'], $data['apellido'], $data['fecha_nacimiento'], $data['telefono'], $data['responsable_nombre'], $data['responsable_cedula'], $curso_id);
        
        if ($stmt_insercion->execute()) {
            echo "Alumno agregado correctamente.";
        } else {
            echo "Error al agregar alumno: " . $stmt_insercion->error;
        }
        $stmt_insercion->close();
    }
}

// Método PUT - Actualizar un alumno existente
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Verificar si el ID está presente en la solicitud
    $alumno_id = isset($_GET['id']) ? $_GET['id'] : null;
    
    if ($alumno_id) {
        // Verificar si el campo responsable_nombre no es nulo
        if (!empty($data['responsable_nombre'])) {
            $curso_id = $data['curso_id']; // Obtener el curso_id del cuerpo de la solicitud
            $stmt = $conn->prepare("UPDATE alumnos SET cedula=?, nombre=?, apellido=?, fecha_nacimiento=?, telefono=?, responsable_nombre=?, responsable_cedula=?, curso_id=? WHERE id=?");
            $stmt->bind_param("ssssssssi", $data['cedula'], $data['nombre'], $data['apellido'], $data['fecha_nacimiento'], $data['telefono'], $data['responsable_nombre'], $data['responsable_cedula'], $curso_id, $alumno_id);
            if ($stmt->execute()) {
                echo "Alumno actualizado correctamente.";
            } else {
                echo "Error al actualizar alumno: " . $stmt->error;
            }
            $stmt->close();
        } else {
            echo "Error: El campo responsable_nombre no puede estar vacío.";
        }
    } else {
        echo "Error: ID de alumno no proporcionado.";
    }
}




// Método GET - Obtener un alumno por su ID
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    $id = $_GET['id'];
    $stmt = $conn->prepare("SELECT * FROM alumnos WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $alumno = $result->fetch_assoc();
    
    // Obtener el nombre del curso
    $stmt_curso = $conn->prepare("SELECT nombre_curso FROM cursos WHERE id = ?");
    $stmt_curso->bind_param("i", $alumno['curso_id']);
    $stmt_curso->execute();
    $result_curso = $stmt_curso->get_result();
    $curso = $result_curso->fetch_assoc();
    $alumno['nombre_curso'] = $curso['nombre_curso'];
    
    echo json_encode($alumno); // Devolver el alumno en formato JSON
    $stmt->close();
}

// Método GET - Obtener todos los alumnos ordenados por ID
if ($_SERVER['REQUEST_METHOD'] === 'GET' && !isset($_GET['id'])) {
    $result = $conn->query("SELECT * FROM alumnos ORDER BY id");
    $alumnos = array();
    while ($row = $result->fetch_assoc()) {
        // Obtener el nombre del curso
        $stmt_curso = $conn->prepare("SELECT nombre_curso FROM cursos WHERE id = ?");
        $stmt_curso->bind_param("i", $row['curso_id']);
        $stmt_curso->execute();
        $result_curso = $stmt_curso->get_result();
        $curso = $result_curso->fetch_assoc();
        $row['nombre_curso'] = $curso['nombre_curso'];
        
        $alumnos[] = $row;
    }
    echo json_encode($alumnos); // Devolver todos los alumnos en formato JSON
}

// Método DELETE - Eliminar un alumno por su ID
if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['id'])) {
    $stmt = $conn->prepare("DELETE FROM alumnos WHERE id=?");
    $stmt->bind_param("i", $_GET['id']);
    if ($stmt->execute()) {
        echo "Alumno eliminado correctamente.";
    } else {
        echo "Error al eliminar alumno: " . $stmt->error;
    }
    $stmt->close();
}

// Cerrar conexión a la base de datos
$conn->close();
?>
