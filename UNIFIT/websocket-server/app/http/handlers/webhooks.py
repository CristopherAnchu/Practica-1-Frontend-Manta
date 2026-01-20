from aiohttp import web
from datetime import datetime
from ...extensions import sio

# ==================== ENDPOINTS HTTP PARA NOTIFICACIONES REST ====================

async def notify_reserva_created(request):
    """Endpoint HTTP para notificar nueva reserva desde REST API"""
    try:
        data = await request.json()
        
        notification = {
            'type': 'reserva_creada',
            'data': data,
            'timestamp': datetime.now().isoformat(),
            'source': 'REST_API'
        }
        
        await sio.emit('reserva_creada', notification, room='reservas')
        await sio.emit('dashboard_notification', notification, room='dashboard')
        
        return web.json_response({
            'success': True,
            'message': 'Notificación enviada',
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return web.json_response({
            'success': False,
            'error': str(e)
        }, status=500)


async def notify_reserva_updated(request):
    """Endpoint HTTP para notificar actualización de reserva desde REST API"""
    try:
        data = await request.json()
        
        notification = {
            'type': 'reserva_actualizada',
            'data': data,
            'timestamp': datetime.now().isoformat(),
            'source': 'REST_API'
        }
        
        await sio.emit('reserva_actualizada', notification, room='reservas')
        await sio.emit('dashboard_notification', notification, room='dashboard')
        
        return web.json_response({
            'success': True,
            'message': 'Notificación enviada',
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return web.json_response({
            'success': False,
            'error': str(e)
        }, status=500)


async def notify_reserva_deleted(request):
    """Endpoint HTTP para notificar eliminación de reserva desde REST API"""
    try:
        data = await request.json()
        
        notification = {
            'type': 'reserva_cancelada',
            'data': data,
            'timestamp': datetime.now().isoformat(),
            'source': 'REST_API'
        }
        
        await sio.emit('reserva_cancelada', notification, room='reservas')
        await sio.emit('dashboard_notification', notification, room='dashboard')
        
        return web.json_response({
            'success': True,
            'message': 'Notificación enviada',
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return web.json_response({
            'success': False,
            'error': str(e)
        }, status=500)


async def notify_rutina_created(request):
    """Endpoint HTTP para notificar nueva rutina desde REST API"""
    try:
        data = await request.json()
        
        notification = {
            'type': 'rutina_creada',
            'data': data,
            'timestamp': datetime.now().isoformat(),
            'source': 'REST_API'
        }
        
        await sio.emit('rutina_creada', notification, room='rutinas')
        await sio.emit('dashboard_notification', notification, room='dashboard')
        
        return web.json_response({
            'success': True,
            'message': 'Notificación enviada',
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return web.json_response({
            'success': False,
            'error': str(e)
        }, status=500)


async def notify_rutina_updated(request):
    """Endpoint HTTP para notificar actualización de rutina desde REST API"""
    try:
        data = await request.json()
        
        notification = {
            'type': 'rutina_actualizada',
            'data': data,
            'timestamp': datetime.now().isoformat(),
            'source': 'REST_API'
        }
        
        await sio.emit('rutina_actualizada', notification, room='rutinas')
        await sio.emit('dashboard_notification', notification, room='dashboard')
        
        return web.json_response({
            'success': True,
            'message': 'Notificación enviada',
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return web.json_response({
            'success': False,
            'error': str(e)
        }, status=500)


async def notify_usuario_updated(request):
    """Endpoint HTTP para notificar actualización de usuario desde REST API"""
    try:
        data = await request.json()
        
        notification = {
            'type': 'usuario_actualizado',
            'data': data,
            'timestamp': datetime.now().isoformat(),
            'source': 'REST_API'
        }
        
        await sio.emit('usuario_actualizado', notification, room='usuarios')
        await sio.emit('dashboard_notification', notification, room='dashboard')
        
        return web.json_response({
            'success': True,
            'message': 'Notificación enviada',
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return web.json_response({
            'success': False,
            'error': str(e)
        }, status=500)


async def notify_generic(request):
    """Endpoint HTTP para notificaciones genéricas desde REST API"""
    try:
        data = await request.json()
        event_type = data.get('type', 'notification')
        room = data.get('room', 'notifications')
        
        notification = {
            'type': event_type,
            'data': data.get('data', {}),
            'message': data.get('message', ''),
            'timestamp': datetime.now().isoformat(),
            'source': 'REST_API'
        }
        
        await sio.emit(event_type, notification, room=room)
        
        return web.json_response({
            'success': True,
            'message': 'Notificación enviada',
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return web.json_response({
            'success': False,
            'error': str(e)
        }, status=500)
