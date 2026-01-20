import json
from datetime import datetime
from ..extensions import sio

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
