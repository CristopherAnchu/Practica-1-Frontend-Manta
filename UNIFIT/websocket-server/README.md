# 🔌 UniFit WebSocket Server

Servidor WebSocket en Python con Socket.IO para comunicación en tiempo real en el sistema UniFit.

---

## 🚀 Inicio Rápido

### 1. Instalar Dependencias

```powershell
cd websocket-server
pip install -r requirements.txt
```

### 2. Configurar Variables de Entorno

Editar `.env` si es necesario (configuración por defecto funciona):

```env
PORT=5000
HOST=0.0.0.0
CORS_ORIGINS=*
DEBUG=True
```

### 3. Iniciar Servidor

```powershell
python server.py
```

**Servidor corriendo en:** http://localhost:5000  
**WebSocket endpoint:** ws://localhost:5000

---

## 🏗️ Arquitectura

```
Frontend (Angular)
       ↓
Socket.IO Client
       ↓
ws://localhost:5000
       ↓
Python WebSocket Server
       ↓
Salas (Rooms):
  - dashboard
  - reservas
  - rutinas
  - usuarios
  - notifications
```

---

## 🚪 Salas Disponibles

| Sala | Propósito | Eventos |
|------|-----------|---------|
| **dashboard** | Datos del dashboard en tiempo real | `dashboard_update`, `dashboard_notification` |
| **reservas** | Notificaciones de reservas | `reserva_creada`, `reserva_actualizada`, `reserva_cancelada` |
| **rutinas** | Actualizaciones de rutinas | `rutina_creada`, `rutina_actualizada` |
| **usuarios** | Cambios en usuarios | `usuario_actualizado` |
| **notifications** | Notificaciones generales | `notification` |

---

## 📡 Eventos del Cliente → Servidor

### Gestión de Salas

#### Unirse a una Sala
```typescript
socket.emit('join_room', { room: 'dashboard' });
```

#### Salir de una Sala
```typescript
socket.emit('leave_room', { room: 'dashboard' });
```

### Dashboard

#### Solicitar Actualización
```typescript
socket.emit('request_dashboard_update', {});
```

#### Broadcast Actualización
```typescript
socket.emit('broadcast_dashboard_update', {
  estadisticas: {
    totalReservas: 45,
    reservasActivas: 23
  }
});
```

### Reservas

#### Nueva Reserva
```typescript
socket.emit('nueva_reserva', {
  usuarioId: 1,
  rutinaId: 2,
  fechaReserva: '2025-06-15',
  horaInicio: '08:00',
  horaFin: '09:00'
});
```

#### Actualizar Reserva
```typescript
socket.emit('actualizar_reserva', {
  reservaId: 10,
  estado: 'confirmada'
});
```

#### Cancelar Reserva
```typescript
socket.emit('cancelar_reserva', {
  reservaId: 10
});
```

### Rutinas

#### Nueva Rutina
```typescript
socket.emit('nueva_rutina', {
  nombre: 'CrossFit Avanzado',
  descripcion: '...',
  cupoMaximo: 15
});
```

#### Actualizar Rutina
```typescript
socket.emit('actualizar_rutina', {
  rutinaId: 5,
  cupoMaximo: 20
});
```

### Usuarios

#### Usuario Actualizado
```typescript
socket.emit('usuario_actualizado', {
  usuarioId: 3,
  nombre: 'Juan Pérez'
});
```

### Notificaciones

#### Enviar Notificación
```typescript
socket.emit('send_notification', {
  room: 'notifications',
  type: 'info',
  message: 'Sistema actualizado',
  data: { version: '1.0.1' }
});
```

### Estadísticas

#### Obtener Estadísticas del Servidor
```typescript
socket.emit('get_server_stats', {});
```

---

## 📨 Eventos del Servidor → Cliente

### Conexión

#### Conexión Exitosa
```typescript
socket.on('connection_success', (data) => {
  console.log('Conectado:', data.message);
  // { sid, message, timestamp, server }
});
```

#### Estadísticas de Conexión
```typescript
socket.on('connection_stats', (data) => {
  console.log('Conexiones:', data.totalConnections);
  console.log('Salas:', data.rooms);
});
```

### Salas

#### Unido a Sala
```typescript
socket.on('room_joined', (data) => {
  console.log(`Te uniste a ${data.room}`);
  // { room, message, timestamp, members_count }
});
```

#### Usuario se Unió a Sala
```typescript
socket.on('user_joined_room', (data) => {
  console.log(`Usuario ${data.sid} se unió a ${data.room}`);
});
```

#### Salió de Sala
```typescript
socket.on('room_left', (data) => {
  console.log(`Saliste de ${data.room}`);
});
```

#### Usuario Salió de Sala
```typescript
socket.on('user_left_room', (data) => {
  console.log(`Usuario ${data.sid} salió de ${data.room}`);
});
```

### Dashboard

#### Actualización del Dashboard
```typescript
socket.on('dashboard_update', (data) => {
  console.log('Dashboard actualizado:', data);
  // { timestamp, estadisticas, usuariosConectados, salasActivas }
});
```

#### Notificación del Dashboard
```typescript
socket.on('dashboard_notification', (data) => {
  console.log('Notificación:', data.type, data.data);
});
```

### Reservas

#### Reserva Creada
```typescript
socket.on('reserva_creada', (data) => {
  console.log('Nueva reserva:', data.data);
  // { type, data, timestamp, sid }
});
```

#### Reserva Actualizada
```typescript
socket.on('reserva_actualizada', (data) => {
  console.log('Reserva actualizada:', data.data);
});
```

#### Reserva Cancelada
```typescript
socket.on('reserva_cancelada', (data) => {
  console.log('Reserva cancelada:', data.data);
});
```

#### Reserva Confirmada (al emisor)
```typescript
socket.on('reserva_confirmada', (data) => {
  console.log('Confirmación:', data.message);
});
```

### Rutinas

#### Rutina Creada
```typescript
socket.on('rutina_creada', (data) => {
  console.log('Nueva rutina:', data.data);
});
```

#### Rutina Actualizada
```typescript
socket.on('rutina_actualizada', (data) => {
  console.log('Rutina actualizada:', data.data);
});
```

### Usuarios

#### Usuario Actualizado
```typescript
socket.on('usuario_actualizado', (data) => {
  console.log('Usuario actualizado:', data.data);
});
```

### Notificaciones

#### Notificación General
```typescript
socket.on('notification', (data) => {
  console.log(`[${data.type}] ${data.message}`);
  // { type, message, timestamp, sid, data }
});
```

### Estadísticas

#### Estadísticas del Servidor
```typescript
socket.on('server_stats', (data) => {
  console.log('Stats:', data);
  // { totalConnections, rooms, timestamp, uptime }
});
```

### Errores

#### Error
```typescript
socket.on('error', (data) => {
  console.error('Error:', data.message);
});
```

---

## 🔄 Actualización Periódica

El servidor envía automáticamente actualizaciones del dashboard cada **30 segundos** a todos los clientes conectados a la sala `dashboard`.

```typescript
// Recibir actualizaciones automáticas
socket.on('dashboard_update', (data) => {
  if (data.auto_update) {
    console.log('Auto-actualización del dashboard');
  }
});
```

---

## 🧪 Probar el Servidor

### 1. Health Check (HTTP)

```powershell
curl http://localhost:5000/health
```

Respuesta:
```json
{
  "status": "healthy",
  "connections": 2,
  "rooms": {
    "dashboard": 1,
    "reservas": 0,
    "rutinas": 0,
    "usuarios": 0,
    "notifications": 1
  },
  "timestamp": "2025-11-16T12:30:00"
}
```

### 2. Página de Inicio (HTTP)

Abrir en navegador: http://localhost:5000

### 3. Cliente de Prueba (Python)

```python
import socketio

sio = socketio.Client()

@sio.event
def connect():
    print('Conectado al servidor')
    sio.emit('join_room', {'room': 'dashboard'})

@sio.event
def dashboard_update(data):
    print('Dashboard actualizado:', data)

sio.connect('http://localhost:5000')
sio.wait()
```

---

## 🛠️ Comandos Útiles

### Iniciar Servidor
```powershell
python server.py
```

### Instalar Dependencias
```powershell
pip install -r requirements.txt
```

### Ver Logs en Tiempo Real
Los logs se muestran automáticamente en la consola.

---

## 📊 Monitoreo

### Ver Conexiones Activas

El servidor imprime en consola:
```
✅ Cliente conectado: abc123
📊 Total de conexiones: 3
🚪 Cliente abc123 se unió a sala: dashboard
```

### Estadísticas en Tiempo Real

```typescript
socket.emit('get_server_stats', {});

socket.on('server_stats', (stats) => {
  console.log('Total conexiones:', stats.totalConnections);
  console.log('Salas:', stats.rooms);
});
```

---

## 🔐 Seguridad (Producción)

Para producción, configurar CORS correctamente en `.env`:

```env
CORS_ORIGINS=http://localhost:4200,https://unifit.com
```

Y actualizar en `server.py`:

```python
sio = socketio.AsyncServer(
    cors_allowed_origins=os.getenv('CORS_ORIGINS', '*').split(','),
    async_mode='aiohttp'
)
```

---

## 🐛 Solución de Problemas

### Puerto ocupado

**Error:** `OSError: [WinError 10048] Only one usage of each socket address`

**Solución:** Cambiar puerto en `.env`:
```env
PORT=5001
```

### Módulo no encontrado

**Error:** `ModuleNotFoundError: No module named 'socketio'`

**Solución:**
```powershell
pip install -r requirements.txt
```

### Cliente no conecta

1. Verificar que el servidor esté corriendo
2. Verificar URL de conexión: `ws://localhost:5000`
3. Ver logs del servidor para errores

---

## 📚 Recursos

- **Socket.IO Python:** https://python-socketio.readthedocs.io/
- **Aiohttp:** https://docs.aiohttp.org/
- **Socket.IO Client (Angular):** https://socket.io/docs/v4/client-api/

---

## 🎯 Próximos Pasos

1. **Autenticación:** Agregar JWT tokens
2. **Persistencia:** Integrar con base de datos
3. **Redis:** Para escalabilidad horizontal
4. **Rate Limiting:** Limitar eventos por cliente
5. **Logging:** Guardar logs en archivo

---

**Servidor listo para producción** 🚀
