from datetime import datetime
from ..extensions import sio

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
