import asyncio
from datetime import datetime
from .extensions import sio
from .state import state

async def periodic_dashboard_update():
    """Actualización periódica del dashboard cada 30 segundos"""
    while True:
        try:
            await asyncio.sleep(30)
            
            # Check if there are any clients in the dashboard room
            if len(state.rooms['dashboard']) > 0:
                dashboard_data = {
                    'timestamp': datetime.now().isoformat(),
                    'estadisticas': {
                        'totalReservas': 45,
                        'reservasActivas': 23,
                        'porcentajeAsistencia': 78.5,
                        'calificacionPromedio': 4.3
                    },
                    'usuariosConectados': state.connection_count,
                    'salasActivas': {room: len(sids) for room, sids in state.rooms.items()},
                    'auto_update': True
                }
                
                await sio.emit('dashboard_update', dashboard_data, room='dashboard')
                print(f'⏰ Dashboard auto-actualizado - {len(state.rooms["dashboard"])} clientes')
        except Exception as e:
            print(f"Error in periodic task: {e}")
            await asyncio.sleep(5)  # Wait a bit before retrying on error
