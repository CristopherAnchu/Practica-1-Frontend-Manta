import axios from 'axios';

const REST_API = 'http://localhost:4000/api';
const WS_API = 'http://localhost:3001/api';

interface TestResult {
  test: string;
  status: 'success' | 'error';
  message: string;
  data?: any;
}

const results: TestResult[] = [];

function logResult(result: TestResult) {
  results.push(result);
  const icon = result.status === 'success' ? '✅' : '❌';
  console.log(`${icon} ${result.test}: ${result.message}`);
  if (result.data) {
    console.log('   Data:', result.data);
  }
}

async function testRestEndpoint(
  method: 'get' | 'post' | 'patch' | 'delete',
  endpoint: string,
  data?: any,
  testName?: string
) {
  try {
    const response = await axios[method](`${REST_API}${endpoint}`, data);
    logResult({
      test: testName || `${method.toUpperCase()} ${endpoint}`,
      status: 'success',
      message: `Status: ${response.status}`,
      data: response.data
    });
    return response.data;
  } catch (error: any) {
    logResult({
      test: testName || `${method.toUpperCase()} ${endpoint}`,
      status: 'error',
      message: error.message,
      data: error.response?.data
    });
    return null;
  }
}

async function testWebSocketNotification(event: string, data: any) {
  try {
    const response = await axios.post(`${WS_API}/notifications/${event}`, data, {
      timeout: 2000
    });
    logResult({
      test: `WS Notification: ${event}`,
      status: 'success',
      message: 'Notificación enviada',
      data: response.data
    });
    return response.data;
  } catch (error: any) {
    logResult({
      test: `WS Notification: ${event}`,
      status: 'error',
      message: error.code === 'ECONNREFUSED' 
        ? 'Servidor WebSocket no disponible (puerto 3001)'
        : (error.response?.data?.message || error.message),
      data: error.response?.data
    });
    return null;
  }
}

async function runTests() {
  console.log('🧪 Iniciando pruebas del sistema GYM APP\n');
  console.log('=' .repeat(60));

  // Test 1: Crear Rol
  console.log('\n📋 Test 1: Crear Rol');
  const rol = await testRestEndpoint('post', '/rol', {
    nombre: 'Cliente Premium'
  }, 'Crear Rol');

  // Test 2: Crear Usuario
  console.log('\n👤 Test 2: Crear Usuario');
  const timestamp = Date.now();
  const usuario = await testRestEndpoint('post', '/users', {
    name: 'Carlos Mendez',
    email: `carlos.${timestamp}@test.com`,
    tipo: 'cliente'
  }, 'Crear Usuario');

  if (usuario) {
    // Notificar creación de usuario
    await testWebSocketNotification('user-created', usuario);
  }

  // Test 3: Crear Rutina
  console.log('\n💪 Test 3: Crear Rutina');
  if (usuario) {
    const rutina = await testRestEndpoint('post', '/rutina', {
      nombre: 'Rutina de Cardio',
      descripcion: 'Ejercicios cardiovasculares',
      duracionMinutos: 30,
      usuarioId: usuario.id
    }, 'Crear Rutina');

    if (rutina) {
      await testWebSocketNotification('rutina-created', rutina);
    }
  }

  // Test 4: Crear Equipo
  console.log('\n🏋️ Test 4: Crear Equipo');
  const equipo = await testRestEndpoint('post', '/equipos', {
    nombre: 'Bicicleta Estática',
    descripcion: 'Bicicleta para cardio',
    tipo: 'Cardio'
  }, 'Crear Equipo');

  if (equipo) {
    await testWebSocketNotification('equipo-created', equipo);
  }

  // Test 5: Crear Reserva
  console.log('\n📅 Test 5: Crear Reserva');
  if (usuario) {
    const reserva = await testRestEndpoint('post', '/reservas', {
      fecha: new Date().toISOString(),
      horaInicio: '10:00',
      horaFin: '11:00',
      tipoActividad: 'Pesas',
      usuarioId: usuario.id
    }, 'Crear Reserva');

    if (reserva) {
      await testWebSocketNotification('reserva-created', reserva);
    }
  }

  // Test 6: Crear Horario
  console.log('\n⏰ Test 6: Crear Horario');
  const horario = await testRestEndpoint('post', '/horarios', {
    hora_inicio: '08:00',
    hora_fin: '20:00',
    dia_semana: 'Lunes',
    estado: 'activo'
  }, 'Crear Horario');

  // Test 7: Crear Capacidad
  console.log('\n📊 Test 7: Crear Capacidad');
  if (horario) {
    await testRestEndpoint('post', '/capacidades', {
      id_horario: horario.id,
      fecha: new Date().toISOString().split('T')[0],
      capacidad_maxima: '50',
      capacidad_minima: '10'
    }, 'Crear Capacidad');
  }

  // Test 8: Crear Asistencia
  console.log('\n✅ Test 8: Crear Asistencia');
  const asistencia = await testRestEndpoint('post', '/asistencias', {
    id_reserva: 'test-reserva-id',
    hora_entrada: '10:00',
    hora_salida: '11:00',
    estado: 'presente'
  }, 'Crear Asistencia');

  if (asistencia) {
    await testWebSocketNotification('asistencia-updated', asistencia);
  }

  // Test 9: Crear Incidencia
  console.log('\n⚠️ Test 9: Crear Incidencia');
  const incidencia = await testRestEndpoint('post', '/incidencias', {
    descripcion: 'Maquina de press averiada',
    estado: 'pendiente',
    usuarioId: usuario?.id || 'test-user-id'
  }, 'Crear Incidencia');

  if (incidencia) {
    await testWebSocketNotification('incidencia-created', incidencia);
  }

  // Test 10: Crear Notificación
  console.log('\n🔔 Test 10: Crear Notificación');
  await testRestEndpoint('post', '/notifications', {
    message: 'Bienvenido al gimnasio',
    userId: usuario?.id || 'test-user-id'
  }, 'Crear Notificación');

  // Test 11: Obtener todos los usuarios
  console.log('\n📋 Test 11: Listar Usuarios');
  await testRestEndpoint('get', '/users', undefined, 'Listar Usuarios');

  // Test 12: Obtener todas las reservas
  console.log('\n📋 Test 12: Listar Reservas');
  await testRestEndpoint('get', '/reservas', undefined, 'Listar Reservas');

  // Test 13: Notificación general
  console.log('\n📢 Test 13: Notificación General');
  await testWebSocketNotification('general', {
    message: 'Mantenimiento programado para mañana',
    priority: 'high'
  });

  // Resumen
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN DE PRUEBAS\n');
  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  
  console.log(`Total de pruebas: ${results.length}`);
  console.log(`✅ Exitosas: ${successCount}`);
  console.log(`❌ Fallidas: ${errorCount}`);
  console.log(`📈 Tasa de éxito: ${((successCount / results.length) * 100).toFixed(2)}%`);
  
  console.log('\n' + '='.repeat(60));
}

// Ejecutar pruebas
runTests().catch(console.error);
