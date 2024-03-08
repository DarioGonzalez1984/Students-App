document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada
    
    // Obtener los valores de usuario y contraseña
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Datos a enviar al servidor
    const data = {
        username: username,
        password: password
    };

    // Configurar la solicitud Fetch
    fetch('http://localhost/students-app/alumnos-api/loginApi.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la solicitud Fetch');
        }
        return response.json();
    })
    .then(data => {
        // Manejar la respuesta del servidor
        if (data.success) {
            console.log("Login exitoso");
            // Login exitoso, redirigir a la página de inicio
            window.location.href = '/students-app/Alumnos-App/index.html';
        } else {
            // Mostrar mensaje de error
            console.log("se rompió todo");
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
