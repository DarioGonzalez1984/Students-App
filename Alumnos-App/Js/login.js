// Obtener referencias a los elementos del formulario de inicio de sesión
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

// Agregar un event listener al formulario de inicio de sesión
loginForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto

    // Obtener los valores ingresados por el usuario
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // Validar que los campos no estén vacíos
    if (username === '' || password === '') {
        alert('Por favor, ingrese su nombre de usuario y contraseña.');
        return;
    }

    // Crear un objeto con los datos de inicio de sesión
    const loginData = {
        username: username,
        password: password
    };

    // Realizar una solicitud POST a la API de PHP para iniciar sesión
    fetch('http://localhost/students-app/alumnos-api/api.php?action=login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => response.json())
    .then(data => {
        // Manejar la respuesta de la API
        if (data.success) {
            alert('Inicio de sesión exitoso.');
            // Redirigir al usuario a la página principal
            window.location.href = 'index.html';
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error al realizar la solicitud:', error);
        alert('Ocurrió un error. Por favor, inténtalo de nuevo más tarde.');
    });

    // Limpiar los campos del formulario de inicio de sesión
    usernameInput.value = '';
    passwordInput.value = '';
});

// Obtener referencias a los elementos del formulario de registro
const signupForm = document.getElementById('signupForm');
const newUsernameInput = document.getElementById('newUsername');
const newPasswordInput = document.getElementById('newPassword');

// Agregar un event listener al formulario de registro
signupForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto

    // Obtener los valores ingresados por el usuario
    const newUsername = newUsernameInput.value.trim();
    const newPassword = newPasswordInput.value.trim();

    // Validar que los campos no estén vacíos
    if (newUsername === '' || newPassword === '') {
        alert('Por favor, complete todos los campos.');
        return;
    }

    // Crear un objeto con los datos del nuevo usuario
    const signupData = {
        username: newUsername,
        password: newPassword
    };

    // Realizar una solicitud POST a la API de PHP para registrar al nuevo usuario
    fetch('http://localhost/students-app/alumnos-api/api.php?action=signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupData)
    })
    .then(response => response.json())
    .then(data => {
        // Manejar la respuesta de la API
        if (data.success) {
            alert('Registro exitoso. Ahora puedes iniciar sesión.');
            // Limpiar los campos del formulario de registro después del registro exitoso
            newUsernameInput.value = '';
            newPasswordInput.value = '';
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error al realizar la solicitud:', error);
        alert('Ocurrió un error. Por favor, inténtalo de nuevo más tarde.');
    });
});
