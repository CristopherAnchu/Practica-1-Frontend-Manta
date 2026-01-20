from datetime import datetime
from ..extensions import sio

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
