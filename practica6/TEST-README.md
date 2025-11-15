# 🧪 Guía de Pruebas - Gym App

## 📋 Requisitos Previos

1. Node.js instalado (v18 o superior)
2. Ambos servidores iniciados:
   - REST API: `http://localhost:4000`
   - WebSocket: `http://localhost:3001`

## 🚀 Iniciar los Servidores

### Terminal 1 - REST API
```bash
cd rest
npm install
npm run start:dev
```

### Terminal 2 - WebSocket Server
```bash
cd ws
npm install
npm run start:dev
```

## 🧪 Ejecutar Pruebas

### Opción 1: Cliente HTML (Recomendado)

1. Abrir `test-client.html` en tu navegador
2. Click en "Conectar"
3. Probar cada botón de evento
4. Observar el log en tiempo real

**Pruebas disponibles:**
- ✅ Crear Usuario
- ✅ Crear Reserva
- ✅ Crear Rutina
- ✅ Crear Equipo
- ✅ Crear Incidencia
- ✅ Actualizar Asistencia
- ✅ Eventos personalizados

### Opción 2: Script Automatizado

```bash
# Instalar dependencias
npm install

# Ejecutar todas las pruebas
npm test
```

## 📊 Endpoints REST API (Puerto 4000)

### Usuarios
- `POST /api/users` - Crear usuario
- `GET /api/users` - Listar usuarios
- `GET /api/users/:id` - Obtener usuario
- `PATCH /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Reservas
- `POST /api/reservas` - Crear reserva
- `GET /api/reservas` - Listar reservas
- `GET /api/reservas/:id` - Obtener reserva
- `PATCH /api/reservas/:id` - Actualizar reserva
- `DELETE /api/reservas/:id` - Eliminar reserva

### Rutinas
- `POST /api/rutina` - Crear rutina
- `GET /api/rutina` - Listar rutinas
- `GET /api/rutina/:id` - Obtener rutina
- `PATCH /api/rutina/:id` - Actualizar rutina
- `DELETE /api/rutina/:id` - Eliminar rutina

### Equipos
- `POST /api/equipos` - Crear equipo
- `GET /api/equipos` - Listar equipos
- `GET /api/equipos/:id` - Obtener equipo
- `PATCH /api/equipos/:id` - Actualizar equipo
- `DELETE /api/equipos/:id` - Eliminar equipo

### Incidencias
- `POST /api/incidencias` - Crear incidencia
- `GET /api/incidencias` - Listar incidencias
- `GET /api/incidencias/:id` - Obtener incidencia
- `PATCH /api/incidencias/:id` - Actualizar incidencia
- `DELETE /api/incidencias/:id` - Eliminar incidencia

### Otros Endpoints
- Roles: `/api/rol`
- Horarios: `/api/horarios`
- Capacidades: `/api/capacidades`
- Asistencias: `/api/asistencias`
- Notificaciones: `/api/notifications`

## 🔌 WebSocket Events (Puerto 3001)

### Eventos que puedes enviar (emit):
- `create-user` - Notificar creación de usuario
- `create-reserva` - Notificar creación de reserva
- `create-rutina` - Notificar creación de rutina
- `create-equipo` - Notificar creación de equipo
- `create-incidencia` - Notificar creación de incidencia
- `update-asistencia` - Notificar actualización de asistencia

### Eventos que recibirás (on):
- `connection-status` - Estado de conexión
- `user-created` - Usuario creado
- `reserva-created` - Reserva creada
- `rutina-created` - Rutina creada
- `equipo-created` - Equipo creado
- `incidencia-created` - Incidencia creada
- `asistencia-updated` - Asistencia actualizada
- `notification-created` - Notificación creada
- `general-notification` - Notificación general

## 📡 Endpoints REST para WebSocket

```bash
POST http://localhost:3001/api/notifications/user-created
POST http://localhost:3001/api/notifications/reserva-created
POST http://localhost:3001/api/notifications/rutina-created
POST http://localhost:3001/api/notifications/equipo-created
POST http://localhost:3001/api/notifications/incidencia-created
POST http://localhost:3001/api/notifications/asistencia-updated
POST http://localhost:3001/api/notifications/general
POST http://localhost:3001/api/notifications/emit
```

## ✅ Verificación Manual con cURL

### Crear Usuario
```bash
curl -X POST http://localhost:4000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","correo":"test@example.com","tipo":"cliente"}'
```

### Crear Reserva
```bash
curl -X POST http://localhost:4000/api/reservas \
  -H "Content-Type: application/json" \
  -d '{"fecha":"2024-01-20","horaInicio":"10:00","horaFin":"11:00","tipoActividad":"Pesas","usuarioId":"USER_ID"}'
```

### Enviar Notificación WebSocket
```bash
curl -X POST http://localhost:3001/api/notifications/general \
  -H "Content-Type: application/json" \
  -d '{"message":"Test notification","data":{"priority":"high"}}'
```

## 🐛 Troubleshooting

### Error: ECONNREFUSED
- Verifica que ambos servidores estén corriendo
- REST API debe estar en puerto 4000
- WebSocket debe estar en puerto 3001

### Error: Cannot find module
```bash
cd rest && npm install
cd ../ws && npm install
```

### Base de datos SQLite
- La BD se crea automáticamente en `rest/GYMDB`
- Para resetear: elimina el archivo `GYMDB`

## 📝 Ejemplo de Flujo Completo

1. Iniciar ambos servidores
2. Abrir `test-client.html`
3. Conectarse al WebSocket
4. Crear un usuario (API REST)
5. Observar la notificación en tiempo real
6. Crear una reserva para ese usuario
7. Verificar que se emite el evento `reserva-created`

## 🎯 Resultados Esperados

- ✅ Conexión exitosa al WebSocket
- ✅ Todos los endpoints REST responden correctamente
- ✅ Las notificaciones se reciben en tiempo real
- ✅ Los datos se persisten en SQLite
- ✅ Los eventos se registran en la consola del servidor
