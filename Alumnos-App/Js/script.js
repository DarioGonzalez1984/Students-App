   // Función para cargar los alumnos en la tabla
        // Función para cargar los alumnos en la tabla
        function cargarAlumnos() {
            fetch('http://localhost/students-app/alumnos-api/api.php')
            .then(response => response.json())
            .then(data => {
                // Ordenar los alumnos por su ID de forma ascendente
                data.sort((a, b) => a.id - b.id);
                
                const alumnosTableBody = document.getElementById('alumnosTableBody');
                alumnosTableBody.innerHTML = ''; // Limpiar tabla antes de agregar datos
        
                data.forEach(alumno => {
                    // Obtener el nombre del curso
                    fetch(`http://localhost/students-app/alumnos-api/api.php?id=${alumno.id}`)
                    .then(response => response.json())
                    .then(curso => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                        <td>${alumno.id}</td>
                            <td>${alumno.cedula}</td>
                            <td>${alumno.nombre}</td>
                            <td>${alumno.apellido}</td>
                            <td>${alumno.fecha_nacimiento}</td>
                            <td>${alumno.telefono}</td>
                            <td>${alumno.responsable_nombre}</td>
                            <td>${alumno.responsable_cedula}</td>
                            <td>${curso.nombre_curso}</td>
                            <td>
    <button class="editar-btn btn btn-warning" onclick="editarAlumno(${alumno.id})">
        <i class="bi bi-pencil-fill"></i>
    </button>
    <button class="eliminar-btn btn btn-danger" onclick="eliminarAlumno(${alumno.id})">
        <i class="bi bi-trash-fill"></i>
    </button>
</td>
                        `;
                        alumnosTableBody.appendChild(row);
                    })
                    .catch(error => console.error('Error al cargar los datos del curso:', error));
                });
            })
            .catch(error => console.error('Error al cargar los datos de los alumnos:', error));
        }
        
        
                // Función para cargar los datos de un alumno en el formulario para su edición
                function cargarDatosAlumnoEnFormulario(id) {
                    fetch(`http://localhost/students-app/alumnos-api/api.php?id=${id}`)
                    .then(response => response.json())
                    .then(alumno => {
                        // Asignar valores a los campos del formulario
                        document.getElementById('cedula').value = alumno.cedula;
                        document.getElementById('nombre').value = alumno.nombre;
                        document.getElementById('apellido').value = alumno.apellido;
                        document.getElementById('fecha_nacimiento').value = alumno.fecha_nacimiento;
                        document.getElementById('telefono').value = alumno.telefono;
                        document.getElementById('responsable_nombre').value = alumno.responsable_nombre;
                        document.getElementById('responsable_cedula').value = alumno.responsable_cedula;
                        document.getElementById('curso_id').value = alumno.curso_id;
                        // Asignar valor al campo oculto 'alumno_id'
                        document.getElementById('alumno_id').value = alumno.id;
                        // Actualizar el atributo 'data-id' del formulario con el ID del alumno
                        document.getElementById('formularioAlumno').setAttribute('data-id', alumno.id);
                    })
                    .catch(error => console.error('Error al cargar los datos del alumno:', error));
                }
        
                // Función para limpiar los campos del formulario
                function limpiarFormulario() {
                    document.getElementById('formularioAlumno').reset();
                    // Cambiar el texto del botón de enviar a su valor predeterminado ('Agregar Alumno')
                    const submitButton = document.querySelector('#formularioAlumno button[type="submit"]');
                    submitButton.textContent = 'Agregar Alumno';
                }
        
                // Función para editar un alumno
                function editarAlumno(id) {
                    cargarDatosAlumnoEnFormulario(id);
                    // Cambiar el texto del botón de enviar
                    const submitButton = document.querySelector('#formularioAlumno button[type="submit"]');
                    submitButton.textContent = 'Guardar Cambios';
                }
        
                // Función para eliminar un alumno
                function eliminarAlumno(id) {
                    // Confirmar si el usuario realmente desea eliminar al alumno
                    if (confirm("¿Estás seguro de que deseas eliminar este alumno?")) {
                        // Llamar a la API para eliminar el alumno
                        fetch(`http://localhost/students-app/alumnos-api/api.php?id=${id}`, {
                            method: 'DELETE'
                        })
                        .then(response => response.text())
                        .then(data => {
                            alert(data);
                            cargarAlumnos(); // Recargar la tabla después de eliminar el alumno
                            limpiarFormulario(); // Limpiar el formulario después de eliminar el alumno
                        })
                        .catch(error => console.error('Error al eliminar el alumno:', error));
                    }
                }
        
                // Evento submit del formulario para agregar/editar alumno
              // Evento submit del formulario para agregar/editar alumno
        document.getElementById("formularioAlumno").addEventListener("submit", function(event) {
            event.preventDefault();
            var formData = new FormData(this);
            // Obtener el ID del alumno del campo oculto
            const alumnoId = document.getElementById('alumno_id').value;
            // Obtener el valor del campo curso_id
            const cursoId = document.getElementById('curso_id').value;
            // Establecer curso_id en el formData
            formData.append('curso_id', cursoId);
            // Determinar si se está agregando un nuevo alumno o editando uno existente
            const url = alumnoId ? `http://localhost/students-app/alumnos-api/api.php?id=${alumnoId}` : 'http://localhost/students-app/alumnos-api/api.php';
            const method = alumnoId ? 'PUT' : 'POST';
            fetch(url, {
                method: method,
                body: JSON.stringify(Object.fromEntries(formData)),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.text())
            .then(data => {
                alert(data);
                this.reset();
                limpiarFormulario(); // Limpiar el formulario después de agregar/editar un alumno
                // Recargar la tabla después de agregar/editar un alumno
                cargarAlumnos();
            })
            .catch(error => console.error('Error:', error));
        });
        // Obtener referencia al campo de búsqueda
        const campoBusqueda = document.getElementById('busqueda');
        
        // Agregar un event listener para detectar cambios en el campo de búsqueda
        campoBusqueda.addEventListener('input', function() {
            const valorBusqueda = this.value.toLowerCase(); // Convertir el valor de búsqueda a minúsculas
            const filas = document.querySelectorAll('#alumnosTableBody tr'); // Obtener todas las filas de la tabla
        
            // Iterar sobre todas las filas de la tabla
            filas.forEach(fila => {
                const celdas = fila.querySelectorAll('td'); // Obtener todas las celdas de la fila
        
                // Iterar sobre todas las celdas de la fila
                let coincide = false;
                celdas.forEach(celda => {
                    if (celda.textContent.toLowerCase().includes(valorBusqueda)) { // Verificar si el contenido de la celda coincide con la búsqueda
                        coincide = true;
                    }
                });
        
                // Mostrar u ocultar la fila dependiendo del resultado de la búsqueda
                if (coincide) {
                    fila.style.display = '';
                } else {
                    fila.style.display = 'none';
                }
            });
        });
        
        
        
                // Llamar a la función para cargar los datos al cargar la página
                cargarAlumnos();