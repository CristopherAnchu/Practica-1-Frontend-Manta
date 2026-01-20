import asyncio
from aiohttp import web
from .extensions import sio
from .http.routes import setup_routes
from .tasks import periodic_dashboard_update

# Import event handlers to register them
from .events import (
    connection,
    rooms,
    dashboard,
    reservas,
    rutinas,
    usuarios,
    notifications,
    stats
)

async def init_app():
    """Inicializar aplicación"""
    app = web.Application()
    sio.attach(app)
    
    setup_routes(app)
    
    # Iniciar tarea periódica
    asyncio.create_task(periodic_dashboard_update())
    
    return app
