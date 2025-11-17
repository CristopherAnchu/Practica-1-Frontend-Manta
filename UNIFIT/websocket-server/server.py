"""
WebSocket Server para UniFit - Sistema de Gimnasio
Servidor en Python con Socket.IO para comunicación en tiempo real
"""

import socketio
import asyncio
from aiohttp import web
import os
from dotenv import load_dotenv
from datetime import datetime
import json

# Cargar variables de entorno
load_dotenv()

# Configuración del servidor Socket.IO
sio = socketio.AsyncServer(
    cors_allowed_origins='*',
    async_mode='aiohttp',
    logger=True,
    engineio_logger=True
)

app = web.Application()
sio.attach(app)

# Almacenamiento de conexiones por sala
rooms = {
    'dashboard': set(),
    'reservas': set(),
    'rutinas': set(),
    'usuarios': set(),
    'notifications': set()
}

# Contador de conexiones
connection_count = 0

# ==================== EVENTOS DE CONEXIÓN ====================

@sio.event
async def connect(sid, environ):
    """Evento cuando un cliente se conecta"""
    global connection_count
    connection_count += 1
    
    print(f'✅ Cliente conectado: {sid}')
    print(f'📊 Total de conexiones: {connection_count}')
    
    # Enviar mensaje de bienvenida
    await sio.emit('connection_success', {
        'sid': sid,
        'message': 'Conectado al servidor WebSocket de UniFit',
        'timestamp': datetime.now().isoformat(),
        'server': 'Python Socket.IO'
    }, room=sid)
    
    # Actualizar estadísticas de conexiones
    await broadcast_connection_stats()


@sio.event
async def disconnect(sid):
    """Evento cuando un cliente se desconecta"""
    global connection_count
    connection_count -= 1
    
    print(f'❌ Cliente desconectado: {sid}')
    print(f'📊 Total de conexiones: {connection_count}')
    
    # Remover de todas las salas
    for room_name, room_sids in rooms.items():
        if sid in room_sids:
            room_sids.discard(sid)
            print(f'🚪 Cliente {sid} removido de sala: {room_name}')
    
    # Actualizar estadísticas de conexiones
    await broadcast_connection_stats()


# ==================== GESTIÓN DE SALAS ====================

@sio.event
async def join_room(sid, data):
    """Unirse a una sala específica"""
    room_name = data.get('room')
    
    if room_name not in rooms:
        await sio.emit('error', {
            'message': f'Sala "{room_name}" no existe',
            'available_rooms': list(rooms.keys())
        }, room=sid)
        return
    
    # Agregar a la sala
    rooms[room_name].add(sid)
    sio.enter_room(sid, room_name)
    
    print(f'🚪 Cliente {sid} se unió a sala: {room_name}')
    
    # Notificar al cliente
    await sio.emit('room_joined', {
        'room': room_name,
        'message': f'Te has unido a la sala {room_name}',
        'timestamp': datetime.now().isoformat(),
        'members_count': len(rooms[room_name])
    }, room=sid)
    
    # Notificar a otros en la sala
    await sio.emit('user_joined_room', {
        'sid': sid,
        'room': room_name,
        'members_count': len(rooms[room_name])
    }, room=room_name, skip_sid=sid)


@sio.event
async def leave_room(sid, data):
    """Salir de una sala específica"""
    room_name = data.get('room')
    
    if room_name in rooms and sid in rooms[room_name]:
        rooms[room_name].discard(sid)
        sio.leave_room(sid, room_name)
        
        print(f'🚪 Cliente {sid} salió de sala: {room_name}')
        
        # Notificar al cliente
        await sio.emit('room_left', {
            'room': room_name,
            'message': f'Has salido de la sala {room_name}',
            'timestamp': datetime.now().isoformat()
        }, room=sid)
        
        # Notificar a otros en la sala
        await sio.emit('user_left_room', {
            'sid': sid,
            'room': room_name,
            'members_count': len(rooms[room_name])
        }, room=room_name)


# ==================== EVENTOS DEL DASHBOARD ====================

@sio.event
async def request_dashboard_update(sid, data):
    """Cliente solicita actualización del dashboard"""
    print(f'📊 Dashboard update solicitado por: {sid}')
    
    # Simular datos del dashboard
    dashboard_data = {
        'timestamp': datetime.now().isoformat(),
        'estadisticas': {
            'totalReservas': 45,
            'reservasActivas': 23,
            'porcentajeAsistencia': 78.5,
            'calificacionPromedio': 4.3
        },
        'usuariosConectados': connection_count,
        'salasActivas': {room: len(sids) for room, sids in rooms.items()}
    }
    
    await sio.emit('dashboard_update', dashboard_data, room=sid)


@sio.event
async def broadcast_dashboard_update(sid, data):
    """Broadcast actualización del dashboard a todos en la sala"""
    print(f'📢 Broadcasting dashboard update desde: {sid}')
    
    await sio.emit('dashboard_update', {
        'data': data,
        'timestamp': datetime.now().isoformat(),
        'source': sid
    }, room='dashboard')


# ==================== EVENTOS DE RESERVAS ====================

@sio.event
async def nueva_reserva(sid, data):
    """Notificar nueva reserva creada"""
    print(f'🎫 Nueva reserva desde: {sid}')
    print(f'   Datos: {json.dumps(data, indent=2)}')
    
    notification = {
        'type': 'nueva_reserva',
        'data': data,
        'timestamp': datetime.now().isoformat(),
        'sid': sid
    }
    
    # Broadcast a sala de reservas
    await sio.emit('reserva_creada', notification, room='reservas')
    
    # También enviar a dashboard
    await sio.emit('dashboard_notification', notification, room='dashboard')
    
    # Confirmar al emisor
    await sio.emit('reserva_confirmada', {
        'success': True,
        'message': 'Reserva registrada y notificada',
        'timestamp': datetime.now().isoformat()
    }, room=sid)


@sio.event
async def actualizar_reserva(sid, data):
    """Notificar actualización de reserva"""
    print(f'✏️ Actualizar reserva desde: {sid}')
    
    notification = {
        'type': 'reserva_actualizada',
        'data': data,
        'timestamp': datetime.now().isoformat(),
        'sid': sid
    }
    
    await sio.emit('reserva_actualizada', notification, room='reservas')
    await sio.emit('dashboard_notification', notification, room='dashboard')


@sio.event
async def cancelar_reserva(sid, data):
    """Notificar cancelación de reserva"""
    print(f'❌ Cancelar reserva desde: {sid}')
    
    notification = {
        'type': 'reserva_cancelada',
        'data': data,
        'timestamp': datetime.now().isoformat(),
        'sid': sid
    }
    
    await sio.emit('reserva_cancelada', notification, room='reservas')
    await sio.emit('dashboard_notification', notification, room='dashboard')


# ==================== EVENTOS DE RUTINAS ====================

@sio.event
async def nueva_rutina(sid, data):
    """Notificar nueva rutina creada"""
    print(f'💪 Nueva rutina desde: {sid}')
    
    notification = {
        'type': 'nueva_rutina',
        'data': data,
        'timestamp': datetime.now().isoformat(),
        'sid': sid
    }
    
    await sio.emit('rutina_creada', notification, room='rutinas')
    await sio.emit('dashboard_notification', notification, room='dashboard')


@sio.event
async def actualizar_rutina(sid, data):
    """Notificar actualización de rutina"""
    print(f'✏️ Actualizar rutina desde: {sid}')
    
    notification = {
        'type': 'rutina_actualizada',
        'data': data,
        'timestamp': datetime.now().isoformat(),
        'sid': sid
    }
    
    await sio.emit('rutina_actualizada', notification, room='rutinas')
    await sio.emit('dashboard_notification', notification, room='dashboard')


# ==================== EVENTOS DE USUARIOS ====================

@sio.event
async def usuario_actualizado(sid, data):
    """Notificar actualización de usuario"""
    print(f'👤 Usuario actualizado desde: {sid}')
    
    notification = {
        'type': 'usuario_actualizado',
        'data': data,
        'timestamp': datetime.now().isoformat(),
        'sid': sid
    }
    
    await sio.emit('usuario_actualizado', notification, room='usuarios')
    await sio.emit('dashboard_notification', notification, room='dashboard')


# ==================== NOTIFICACIONES GENERALES ====================

@sio.event
async def send_notification(sid, data):
    """Enviar notificación general"""
    print(f'🔔 Notificación desde: {sid}')
    
    target_room = data.get('room', 'notifications')
    message = data.get('message', '')
    notification_type = data.get('type', 'info')
    
    notification = {
        'type': notification_type,
        'message': message,
        'timestamp': datetime.now().isoformat(),
        'sid': sid,
        'data': data.get('data', {})
    }
    
    await sio.emit('notification', notification, room=target_room)


# ==================== ESTADÍSTICAS Y MONITOREO ====================

async def broadcast_connection_stats():
    """Broadcast estadísticas de conexiones a todos"""
    stats = {
        'totalConnections': connection_count,
        'rooms': {
            room: len(sids) for room, sids in rooms.items()
        },
        'timestamp': datetime.now().isoformat()
    }
    
    await sio.emit('connection_stats', stats)


@sio.event
async def get_server_stats(sid, data):
    """Obtener estadísticas del servidor"""
    stats = {
        'totalConnections': connection_count,
        'rooms': {
            room: {
                'members': len(sids),
                'sids': list(sids)
            } for room, sids in rooms.items()
        },
        'timestamp': datetime.now().isoformat(),
        'uptime': 'N/A'  # Implementar contador de uptime si es necesario
    }
    
    await sio.emit('server_stats', stats, room=sid)


# ==================== TAREA PERIÓDICA ====================

async def periodic_dashboard_update():
    """Actualización periódica del dashboard cada 30 segundos"""
    while True:
        await asyncio.sleep(30)
        
        if len(rooms['dashboard']) > 0:
            dashboard_data = {
                'timestamp': datetime.now().isoformat(),
                'estadisticas': {
                    'totalReservas': 45,
                    'reservasActivas': 23,
                    'porcentajeAsistencia': 78.5,
                    'calificacionPromedio': 4.3
                },
                'usuariosConectados': connection_count,
                'salasActivas': {room: len(sids) for room, sids in rooms.items()},
                'auto_update': True
            }
            
            await sio.emit('dashboard_update', dashboard_data, room='dashboard')
            print(f'⏰ Dashboard auto-actualizado - {len(rooms["dashboard"])} clientes')


# ==================== RUTAS HTTP ====================

async def index(request):
    """Página de inicio"""
    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>UniFit WebSocket Server</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                max-width: 800px; 
                margin: 50px auto; 
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            .container {
                background: rgba(255, 255, 255, 0.1);
                padding: 30px;
                border-radius: 10px;
                backdrop-filter: blur(10px);
            }
            h1 { color: white; }
            .status { 
                background: rgba(76, 175, 80, 0.3);
                padding: 15px; 
                border-radius: 5px; 
                margin: 20px 0;
                border-left: 4px solid #4caf50;
            }
            .info { 
                background: rgba(33, 150, 243, 0.3);
                padding: 15px; 
                border-radius: 5px; 
                margin: 10px 0;
                border-left: 4px solid #2196f3;
            }
            ul { list-style: none; padding: 0; }
            li { padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
            code { 
                background: rgba(0,0,0,0.3); 
                padding: 2px 6px; 
                border-radius: 3px; 
                font-family: 'Courier New', monospace;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🏋️ UniFit WebSocket Server</h1>
            <div class="status">
                <h2>✅ Servidor Activo</h2>
                <p>Puerto: <code>5000</code></p>
                <p>Protocolo: <code>Socket.IO (Python)</code></p>
            </div>
            
            <div class="info">
                <h3>📡 Conexión desde Frontend</h3>
                <code>ws://localhost:5000</code>
            </div>
            
            <div class="info">
                <h3>🚪 Salas Disponibles</h3>
                <ul>
                    <li>📊 <code>dashboard</code> - Datos del dashboard en tiempo real</li>
                    <li>🎫 <code>reservas</code> - Notificaciones de reservas</li>
                    <li>💪 <code>rutinas</code> - Actualizaciones de rutinas</li>
                    <li>👥 <code>usuarios</code> - Cambios en usuarios</li>
                    <li>🔔 <code>notifications</code> - Notificaciones generales</li>
                </ul>
            </div>
            
            <div class="info">
                <h3>🎯 Eventos Disponibles</h3>
                <ul>
                    <li><code>join_room</code> - Unirse a una sala</li>
                    <li><code>leave_room</code> - Salir de una sala</li>
                    <li><code>request_dashboard_update</code> - Solicitar datos del dashboard</li>
                    <li><code>nueva_reserva</code> - Notificar nueva reserva</li>
                    <li><code>actualizar_reserva</code> - Actualizar reserva</li>
                    <li><code>cancelar_reserva</code> - Cancelar reserva</li>
                    <li><code>send_notification</code> - Enviar notificación</li>
                    <li><code>get_server_stats</code> - Obtener estadísticas</li>
                </ul>
            </div>
            
            <div class="info">
                <h3>📚 Documentación</h3>
                <p>Ver <code>README.md</code> para ejemplos de uso desde Angular</p>
            </div>
        </div>
    </body>
    </html>
    """
    return web.Response(text=html, content_type='text/html')


async def health(request):
    """Health check endpoint"""
    return web.json_response({
        'status': 'healthy',
        'connections': connection_count,
        'rooms': {room: len(sids) for room, sids in rooms.items()},
        'timestamp': datetime.now().isoformat()
    })


# Configurar rutas
app.router.add_get('/', index)
app.router.add_get('/health', health)


# ==================== INICIAR SERVIDOR ====================

async def init_app():
    """Inicializar aplicación"""
    # Iniciar tarea periódica
    asyncio.create_task(periodic_dashboard_update())
    return app


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    host = os.getenv('HOST', '0.0.0.0')
    
    print("=" * 60)
    print("🏋️  UniFit WebSocket Server")
    print("=" * 60)
    print(f"🚀 Servidor iniciando en: http://{host}:{port}")
    print(f"📡 Socket.IO endpoint: ws://{host}:{port}")
    print(f"💚 Health check: http://{host}:{port}/health")
    print("=" * 60)
    print("📊 Salas disponibles:")
    for room in rooms.keys():
        print(f"   - {room}")
    print("=" * 60)
    
    web.run_app(
        init_app(),
        host=host,
        port=port,
        print=lambda x: None  # Suprimir logs por defecto de aiohttp
    )
