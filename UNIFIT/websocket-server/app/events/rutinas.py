from datetime import datetime
from ..extensions import sio

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
