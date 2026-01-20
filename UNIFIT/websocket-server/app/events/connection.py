from datetime import datetime
from ..extensions import sio
from ..state import state
from .stats import broadcast_connection_stats

@sio.event
async def connect(sid, environ):
    """Evento cuando un cliente se conecta"""
    state.connection_count += 1
    
    print(f'✅ Cliente conectado: {sid}')
    print(f'📊 Total de conexiones: {state.connection_count}')
    
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
    state.connection_count -= 1
    
    print(f'❌ Cliente desconectado: {sid}')
    print(f'📊 Total de conexiones: {state.connection_count}')
    
    # Remover de todas las salas
    for room_name, room_sids in state.rooms.items():
        if sid in room_sids:
            room_sids.discard(sid)
            print(f'🚪 Cliente {sid} removido de sala: {room_name}')
    
    # Actualizar estadísticas de conexiones
    await broadcast_connection_stats()
