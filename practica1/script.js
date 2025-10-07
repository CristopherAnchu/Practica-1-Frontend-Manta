// Credenciales de ejemplo (puedes cambiarlas o conectar con backend)
const USERS = [
    { username: "ronny", password: "1234" },
    { username: "admin", password: "admin" }
];

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // Validaciones
    if (!username || !password) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos vacíos',
            text: 'Por favor, completa todos los campos.',
            confirmButtonColor: '#ff3c3c'
        });
        return;
    }

    // Validar usuario
    const user = USERS.find(u => u.username === username && u.password === password);

    if (!user) {
        Swal.fire({
            icon: 'error',
            title: 'Acceso denegado',
            text: 'Usuario o contraseña incorrectos.',
            confirmButtonColor: '#ff3c3c'
        });
        return;
    }

    // Autenticación exitosa
    Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: 'Ingreso exitoso al gimnasio.',
        confirmButtonColor: '#ff3c3c',
        timer: 1200,
        showConfirmButton: false
    }).then(() => {
        // Redirigir a calendario
        window.location.href = "calendario.html";
    });
});