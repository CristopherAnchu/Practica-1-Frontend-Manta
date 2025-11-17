# 🔌 Integración WebSocket - UniFit

## 🚀 Inicio Rápido

### Paso 1: Iniciar Servidor WebSocket (Python)

```powershell
cd websocket-server
pip install -r requirements.txt
python server.py
```

**Servidor corriendo en:** ws://localhost:5000

### Paso 2: Iniciar Frontend (Angular)

```powershell
cd gym-uleam
ng serve
```

**Frontend corriendo en:** http://localhost:4200

### Paso 3: Acceder al Dashboard en Tiempo Real

**URL:** http://localhost:4200/dashboard-realtime

---

## 🏗️ Arquitectura Completa

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (Angular)                         │
│                   http://localhost:4200                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  DashboardRealtimeComponent                                     │
│           ↓                                                     │
│  WebsocketService                                               │
│           ↓                                                     │
│  Socket.IO Client                                               │
│           ↓                                                     │
└─────────────────────────────────────────────────────────────────┘
                        │
                        │ WebSocket Connection
                        │ ws://localhost:5000
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│                   WEBSOCKET SERVER (Python)                     │
│                   http://localhost:5000                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Python Socket.IO Server                                        │
│           ↓                                                     │
│  Salas (Rooms):                                                 │
│    - dashboard                                                  │
│    - reservas                                                   │
│    - rutinas                                                    │
│    - usuarios                                                   │
│    - notifications                                              │
│           ↓                                                     │
│  Eventos y Notificaciones                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Estructura de Archivos

```
UNIFIT/
├── websocket-server/                    # Servidor Python
│   ├── server.py                        # Servidor principal
│   ├── requirements.txt                 # Dependencias Python
│   ├── .env                            # Variables de entorno
│   └── README.md                       # Documentación del servidor
│
└── gym-uleam/                          # Frontend Angular
    └── src/app/
        ├── services/
        │   └── websocket.service.ts    # Servicio WebSocket
        │
        └── pages/
            └── dashboard-realtime/
                ├── dashboard-realtime.component.ts
                ├── dashboard-realtime.component.html
                └── dashboard-realtime.component.css
```

---

## 🎯 Funcionalidades Implementadas

### ✅ Servidor WebSocket (Python)

1. **Gestión de Conexiones**
   - Conexión/desconexión de clientes
   - Tracking de conexiones activas
   - Auto-reconexión

2. **Sistema de Salas**
   - 5 salas predefinidas (dashboard, reservas, rutinas, usuarios, notifications)
   - Join/Leave sala
   - Broadcast por sala

3. **Dashboard en Tiempo Real**
   - Actualizaciones automáticas cada 30 segundos
   - Estadísticas en tiempo real
   - Conexiones activas por sala

4. **Eventos de Reservas**
   - Nueva reserva creada
   - Reserva actualizada
   - Reserva cancelada

5. **Eventos de Rutinas**
   - Nueva rutina creada
   - Rutina actualizada

6. **Eventos de Usuarios**
   - Usuario actualizado

7. **Notificaciones**
   - Sistema de notificaciones general
   - Notificaciones por sala
   - Tipos de notificación (info, success, warning, error)

8. **Estadísticas del Servidor**
   - Total de conexiones
   - Miembros por sala
   - Health check endpoint

### ✅ Frontend Angular

1. **WebsocketService**
   - Conexión al servidor
   - Gestión de salas
   - Emisión y escucha de eventos
   - Observables para eventos

2. **DashboardRealtimeComponent**
   - Visualización en tiempo real
   - Panel de notificaciones
   - Estado de conexión
   - Estadísticas del servidor
   - Actualización automática

---

## 🔄 Flujo de Datos en Tiempo Real

### 1. Conexión Inicial

```
Usuario abre dashboard-realtime
       ↓
WebsocketService.connect()
       ↓
Socket.IO conecta a ws://localhost:5000
       ↓
Servidor envía 'connection_success'
       ↓
Cliente se une a sala 'dashboard'
       ↓
Cliente solicita dashboard_update
       ↓
Servidor envía datos actuales
       ↓
Dashboard muestra datos
```

### 2. Actualización Automática

```
Cada 30 segundos:
       ↓
Servidor emite 'dashboard_update' a sala 'dashboard'
       ↓
Cliente recibe actualización
       ↓
WebsocketService emite Observable
       ↓
Componente actualiza UI
       ↓
Usuario ve datos actualizados
```

### 3. Evento de Reserva

```
Usuario crea reserva (desde otro componente)
       ↓
Componente emite evento 'nueva_reserva'
       ↓
Servidor recibe y procesa
       ↓
Servidor broadcast a sala 'reservas'
       ↓
También envía a sala 'dashboard'
       ↓
Dashboard recibe notificación
       ↓
Nueva notificación aparece en panel
       ↓
Datos del dashboard se actualizan
```

---

## 📡 Uso del WebSocket Service

### Conectar al Servidor

```typescript
import { WebsocketService } from './services/websocket.service';

constructor(private wsService: WebsocketService) {}

ngOnInit() {
  // Conectar
  this.wsService.connect('http://localhost:5000');
  
  // Verificar estado de conexión
  this.wsService.isConnected().subscribe(connected => {
    console.log('Conectado:', connected);
  });
}
```

### Unirse a una Sala

```typescript
// Unirse a sala dashboard
this.wsService.joinRoom('dashboard');

// Unirse a sala reservas
this.wsService.joinRoom('reservas');
```

### Escuchar Actualizaciones del Dashboard

```typescript
this.wsService.onDashboardUpdate().subscribe(data => {
  console.log('Dashboard actualizado:', data);
  this.estadisticas = data.estadisticas;
});
```

### Notificar Nueva Reserva

```typescript
this.wsService.notifyNuevaReserva({
  usuarioId: 1,
  rutinaId: 2,
  fechaReserva: '2025-06-15',
  horaInicio: '08:00',
  horaFin: '09:00'
});
```

### Escuchar Notificaciones

```typescript
this.wsService.onNotification().subscribe(notification => {
  console.log('Nueva notificación:', notification);
  this.mostrarNotificacion(notification);
});
```

### Enviar Notificación Personalizada

```typescript
this.wsService.sendNotification({
  room: 'dashboard',
  type: 'info',
  message: 'Sistema actualizado correctamente',
  data: { version: '1.0.1' }
});
```

### Desconectar

```typescript
ngOnDestroy() {
  // Salir de sala
  this.wsService.leaveRoom('dashboard');
  
  // Desconectar
  this.wsService.disconnect();
}
```

---

## 🧪 Probar la Integración

### 1. Iniciar Todo

**Terminal 1 - WebSocket Server:**
```powershell
cd websocket-server
python server.py
```

**Terminal 2 - Angular Frontend:**
```powershell
cd gym-uleam
ng serve
```

### 2. Abrir Dashboard en Tiempo Real

Navegar a: http://localhost:4200/dashboard-realtime

### 3. Verificar Conexión

- Debe mostrar "Conectado" en verde
- Debe mostrar el ID de conexión
- Debe mostrar estadísticas del dashboard

### 4. Probar Notificaciones

Click en botón "Test" para enviar notificación de prueba.

### 5. Abrir Múltiples Ventanas

Abrir el dashboard en 2+ ventanas y ver cómo se sincronizan.

### 6. Ver Actualizaciones Automáticas

Esperar 30 segundos y ver la actualización automática del dashboard.

---

## 🔍 Debugging

### Ver Logs del Servidor Python

Los logs aparecen en la consola donde se ejecutó `python server.py`:

```
✅ Cliente conectado: abc123
📊 Total de conexiones: 1
🚪 Cliente abc123 se unió a sala: dashboard
```

### Ver Logs del Cliente Angular

Abrir DevTools (F12) → Console:

```
🔌 Conectando a WebSocket: http://localhost:5000
✅ Conectado al WebSocket
🎉 Conexión exitosa: {sid: 'abc123', ...}
🚪 Unido a sala: dashboard
📊 Dashboard actualizado: {...}
```

### Health Check del Servidor

```powershell
curl http://localhost:5000/health
```

Respuesta:
```json
{
  "status": "healthy",
  "connections": 2,
  "rooms": {...}
}
```

---

## 📊 Eventos Disponibles

### Emitir desde Frontend

| Evento | Datos | Descripción |
|--------|-------|-------------|
| `join_room` | `{ room: string }` | Unirse a sala |
| `leave_room` | `{ room: string }` | Salir de sala |
| `request_dashboard_update` | `{}` | Solicitar datos del dashboard |
| `nueva_reserva` | `{ ... }` | Notificar nueva reserva |
| `actualizar_reserva` | `{ ... }` | Notificar actualización |
| `cancelar_reserva` | `{ ... }` | Notificar cancelación |
| `send_notification` | `{ room, type, message, data }` | Enviar notificación |
| `get_server_stats` | `{}` | Obtener estadísticas |

### Escuchar desde Frontend

| Evento | Datos | Descripción |
|--------|-------|-------------|
| `connection_success` | `{ sid, message, ... }` | Conexión exitosa |
| `room_joined` | `{ room, members_count }` | Unido a sala |
| `dashboard_update` | `{ estadisticas, ... }` | Actualización del dashboard |
| `reserva_creada` | `{ type, data, ... }` | Nueva reserva |
| `reserva_actualizada` | `{ type, data, ... }` | Reserva actualizada |
| `reserva_cancelada` | `{ type, data, ... }` | Reserva cancelada |
| `notification` | `{ type, message, ... }` | Notificación general |
| `server_stats` | `{ totalConnections, rooms }` | Estadísticas del servidor |

---

## ⚠️ Solución de Problemas

### Error: "No hay conexión con el servidor WebSocket"

**Causa:** Servidor Python no está corriendo

**Solución:**
```powershell
cd websocket-server
python server.py
```

### Error: "ModuleNotFoundError: No module named 'socketio'"

**Causa:** Dependencias no instaladas

**Solución:**
```powershell
pip install -r requirements.txt
```

### Error: Puerto 5000 ocupado

**Causa:** Otro proceso usa el puerto 5000

**Solución:** Cambiar puerto en `.env`:
```env
PORT=5001
```

Y actualizar en Angular:
```typescript
this.wsService.connect('http://localhost:5001');
```

### Dashboard no actualiza automáticamente

**Verificar:**
1. Conexión activa (verde)
2. Unido a sala 'dashboard'
3. Logs del servidor (actualizaciones cada 30s)

---

## 🔐 Producción

### Configurar CORS

**Servidor Python** - `server.py`:
```python
sio = socketio.AsyncServer(
    cors_allowed_origins=['http://unifit.com', 'https://unifit.com'],
    async_mode='aiohttp'
)
```

### Variables de Entorno

**`.env`:**
```env
PORT=5000
HOST=0.0.0.0
CORS_ORIGINS=https://unifit.com
DEBUG=False
```

### Deploy del Servidor Python

Opciones:
- **Heroku:** `heroku create && git push heroku main`
- **AWS EC2:** Instalar Python y correr con `systemd`
- **Docker:** Crear `Dockerfile` y desplegar

---

## 📈 Próximas Mejoras

- [ ] Autenticación JWT en WebSocket
- [ ] Persistencia de eventos (base de datos)
- [ ] Redis para escalabilidad horizontal
- [ ] Rate limiting por cliente
- [ ] Reconexión exponencial
- [ ] Compresión de mensajes
- [ ] Heartbeat/ping automático
- [ ] Métricas y monitoreo

---

## 📚 Recursos

- **Socket.IO Python:** https://python-socketio.readthedocs.io/
- **Socket.IO Client Angular:** https://socket.io/docs/v4/client-api/
- **Aiohttp:** https://docs.aiohttp.org/

---

**¡Sistema de tiempo real completamente funcional!** 🚀
