from datetime import datetime
from ..extensions import sio
from ..state import state

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
        'usuariosConectados': state.connection_count,
        'salasActivas': {room: len(sids) for room, sids in state.rooms.items()}
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
