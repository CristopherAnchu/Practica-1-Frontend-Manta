import { DataSource } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { Rol } from './entities/rol.entity';
import { Rutina } from './entities/rutina.entity';
import { Reserva } from './entities/reserva.entity';

export async function seedDatabase(dataSource: DataSource) {
  console.log('🌱 Iniciando carga de datos de prueba...');

  const rolRepository = dataSource.getRepository(Rol);
  const usuarioRepository = dataSource.getRepository(Usuario);
  const rutinaRepository = dataSource.getRepository(Rutina);
  const reservaRepository = dataSource.getRepository(Reserva);

  // Limpiar datos existentes
  await reservaRepository.delete({});
  await usuarioRepository.delete({});
  await rutinaRepository.delete({});
  await rolRepository.delete({});

  // Crear Roles
  console.log('📝 Creando roles...');
  const rolEstudiante = await rolRepository.save({
    nombre: 'Estudiante',
    descripcion: 'Usuario estudiante con acceso básico',
    permisos: ['ver_rutinas', 'crear_reservas', 'ver_horarios', 'calificar_rutinas'],
  });

  const rolDocente = await rolRepository.save({
    nombre: 'Docente',
    descripcion: 'Usuario docente con privilegios extendidos',
    permisos: ['ver_rutinas', 'crear_reservas', 'ver_horarios', 'calificar_rutinas', 'ver_reportes'],
  });

  const rolAdmin = await rolRepository.save({
    nombre: 'Administrador',
    descripcion: 'Usuario administrador con acceso completo',
    permisos: ['*'],
  });

  // Crear Usuarios
  console.log('👤 Creando usuarios...');
  const usuarios = await usuarioRepository.save([
    {
      nombre: 'Carlos Mendoza',
      correo: 'carlos.mendoza@unifit.com',
      tipo: 'estudiante',
      telefono: '0987654321',
      cedula: '1234567890',
      rol: rolEstudiante,
      activo: true,
    },
    {
      nombre: 'Ana García',
      correo: 'ana.garcia@unifit.com',
      tipo: 'estudiante',
      telefono: '0987654322',
      cedula: '1234567891',
      rol: rolEstudiante,
      activo: true,
    },
    {
      nombre: 'Luis Torres',
      correo: 'luis.torres@unifit.com',
      tipo: 'docente',
      telefono: '0987654323',
      cedula: '1234567892',
      rol: rolDocente,
      activo: true,
    },
    {
      nombre: 'María Rodríguez',
      correo: 'maria.rodriguez@unifit.com',
      tipo: 'estudiante',
      telefono: '0987654324',
      cedula: '1234567893',
      rol: rolEstudiante,
      activo: true,
    },
    {
      nombre: 'Pedro Sánchez',
      correo: 'pedro.sanchez@unifit.com',
      tipo: 'administrativo',
      telefono: '0987654325',
      cedula: '1234567894',
      rol: rolAdmin,
      activo: true,
    },
    {
      nombre: 'Laura Pérez',
      correo: 'laura.perez@unifit.com',
      tipo: 'estudiante',
      telefono: '0987654326',
      cedula: '1234567895',
      rol: rolEstudiante,
      activo: true,
    },
    {
      nombre: 'Diego Vargas',
      correo: 'diego.vargas@unifit.com',
      tipo: 'estudiante',
      telefono: '0987654327',
      cedula: '1234567896',
      rol: rolEstudiante,
      activo: true,
    },
    {
      nombre: 'Carmen López',
      correo: 'carmen.lopez@unifit.com',
      tipo: 'docente',
      telefono: '0987654328',
      cedula: '1234567897',
      rol: rolDocente,
      activo: true,
    },
  ]);

  // Crear Rutinas
  console.log('💪 Creando rutinas...');
  const rutinas = await rutinaRepository.save([
    {
      nombre: 'Yoga Matutino',
      descripcion: 'Sesión de yoga suave para empezar el día con energía positiva',
      cupoMaximo: 20,
      duracionMinutos: 60,
      instructor: 'María García',
      nivel: 'principiante',
      activa: true,
    },
    {
      nombre: 'CrossFit Intensivo',
      descripcion: 'Entrenamiento de alta intensidad para mejorar fuerza y resistencia',
      cupoMaximo: 15,
      duracionMinutos: 45,
      instructor: 'Carlos Ruiz',
      nivel: 'avanzado',
      activa: true,
    },
    {
      nombre: 'Spinning',
      descripcion: 'Clase de ciclismo indoor con música motivadora',
      cupoMaximo: 25,
      duracionMinutos: 50,
      instructor: 'Ana Martínez',
      nivel: 'intermedio',
      activa: true,
    },
    {
      nombre: 'Pilates',
      descripcion: 'Fortalecimiento del core y mejora de la postura',
      cupoMaximo: 18,
      duracionMinutos: 55,
      instructor: 'Laura Silva',
      nivel: 'principiante',
      activa: true,
    },
    {
      nombre: 'Funcional Avanzado',
      descripcion: 'Entrenamiento funcional de alto rendimiento',
      cupoMaximo: 12,
      duracionMinutos: 60,
      instructor: 'Roberto Díaz',
      nivel: 'avanzado',
      activa: true,
    },
    {
      nombre: 'Zumba',
      descripcion: 'Baile fitness lleno de ritmo latino',
      cupoMaximo: 30,
      duracionMinutos: 50,
      instructor: 'Carmen López',
      nivel: 'principiante',
      activa: true,
    },
    {
      nombre: 'Boxeo',
      descripcion: 'Técnicas de boxeo para fitness y defensa personal',
      cupoMaximo: 16,
      duracionMinutos: 60,
      instructor: 'Miguel Ángel Torres',
      nivel: 'intermedio',
      activa: true,
    },
    {
      nombre: 'Natación',
      descripcion: 'Clases de natación para todos los niveles',
      cupoMaximo: 10,
      duracionMinutos: 45,
      instructor: 'Sofía Ramírez',
      nivel: 'principiante',
      activa: true,
    },
  ]);

  // Crear Reservas
  console.log('📅 Creando reservas...');
  const ahora = new Date();
  const reservas = [];

  // Reservas pasadas (completadas)
  for (let i = 1; i <= 15; i++) {
    const fechaPasada = new Date(ahora);
    fechaPasada.setDate(ahora.getDate() - Math.floor(Math.random() * 30));
    
    reservas.push({
      fecha: fechaPasada,
      estado: 'finalizada',
      asistio: Math.random() > 0.2, // 80% asistencia
      calificacion: Math.random() > 0.3 ? Math.floor(Math.random() * 2) + 4 : null, // 4-5
      observaciones: 'Clase completada',
      usuario: usuarios[Math.floor(Math.random() * usuarios.length)],
      rutina: rutinas[Math.floor(Math.random() * rutinas.length)],
    });
  }

  // Reservas activas (futuras)
  for (let i = 1; i <= 10; i++) {
    const fechaFutura = new Date(ahora);
    fechaFutura.setDate(ahora.getDate() + Math.floor(Math.random() * 15) + 1);
    
    reservas.push({
      fecha: fechaFutura,
      estado: 'activa',
      asistio: false,
      observaciones: Math.random() > 0.5 ? 'Primera vez en esta clase' : null,
      usuario: usuarios[Math.floor(Math.random() * usuarios.length)],
      rutina: rutinas[Math.floor(Math.random() * rutinas.length)],
    });
  }

  // Algunas reservas canceladas
  for (let i = 1; i <= 5; i++) {
    const fechaCancelada = new Date(ahora);
    fechaCancelada.setDate(ahora.getDate() - Math.floor(Math.random() * 20));
    
    reservas.push({
      fecha: fechaCancelada,
      estado: 'cancelada',
      asistio: false,
      observaciones: 'Cancelada por el usuario',
      usuario: usuarios[Math.floor(Math.random() * usuarios.length)],
      rutina: rutinas[Math.floor(Math.random() * rutinas.length)],
    });
  }

  await reservaRepository.save(reservas);

  // Actualizar calificaciones promedio de rutinas
  console.log('⭐ Actualizando calificaciones promedio...');
  for (const rutina of rutinas) {
    const reservasRutina = await reservaRepository.find({
      where: { rutina: { id: rutina.id } },
    });
    
    const reservasConCalificacion = reservasRutina.filter(r => r.calificacion);
    if (reservasConCalificacion.length > 0) {
      const suma = reservasConCalificacion.reduce((acc, r) => acc + (r.calificacion || 0), 0);
      rutina.calificacionPromedio = parseFloat((suma / reservasConCalificacion.length).toFixed(2));
      await rutinaRepository.save(rutina);
    }
  }

  console.log('✅ Datos de prueba cargados exitosamente!');
  console.log(`   - ${await rolRepository.count()} roles`);
  console.log(`   - ${await usuarioRepository.count()} usuarios`);
  console.log(`   - ${await rutinaRepository.count()} rutinas`);
  console.log(`   - ${await reservaRepository.count()} reservas`);
}
