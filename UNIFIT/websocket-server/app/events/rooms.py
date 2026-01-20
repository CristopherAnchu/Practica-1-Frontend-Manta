from datetime import datetime
from ..extensions import sio
from ..state import state

@sio.event
async def join_room(sid, data):
    """Unirse a una sala específica"""
    room_name = data.get('room')
    
    if room_name not in state.rooms:
        await sio.emit('error', {
            'message': f'Sala "{room_name}" no existe',
            'available_rooms': list(state.rooms.keys())
        }, room=sid)
        return
    
    # Agregar a la sala
    state.rooms[room_name].add(sid)
    sio.enter_room(sid, room_name)
    
    print(f'🚪 Cliente {sid} se unió a sala: {room_name}')
    
    # Notificar al cliente
    await sio.emit('room_joined', {
        'room': room_name,
        'message': f'Te has unido a la sala {room_name}',
        'timestamp': datetime.now().isoformat(),
        'members_count': len(state.rooms[room_name])
    }, room=sid)
    
    # Notificar a otros en la sala
    await sio.emit('user_joined_room', {
        'sid': sid,
        'room': room_name,
        'members_count': len(state.rooms[room_name])
    }, room=room_name, skip_sid=sid)


@sio.event
async def leave_room(sid, data):
    """Salir de una sala específica"""
    room_name = data.get('room')
    
    if room_name in state.rooms and sid in state.rooms[room_name]:
        state.rooms[room_name].discard(sid)
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
            'members_count': len(state.rooms[room_name])
        }, room=room_name)
