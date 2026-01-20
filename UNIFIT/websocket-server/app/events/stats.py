from datetime import datetime
from ..extensions import sio
from ..state import state

async def broadcast_connection_stats():
    """Broadcast estadísticas de conexiones a todos"""
    stats = {
        'totalConnections': state.connection_count,
        'rooms': {
            room: len(sids) for room, sids in state.rooms.items()
        },
        'timestamp': datetime.now().isoformat()
    }
    
    await sio.emit('connection_stats', stats)

@sio.event
async def get_server_stats(sid, data):
    """Obtener estadísticas del servidor"""
    stats = {
        'totalConnections': state.connection_count,
        'rooms': {
            room: {
                'members': len(sids),
                'sids': list(sids)
            } for room, sids in state.rooms.items()
        },
        'timestamp': datetime.now().isoformat(),
        'uptime': 'N/A'  # Implementar contador de uptime si es necesario
    }
    
    await sio.emit('server_stats', stats, room=sid)
