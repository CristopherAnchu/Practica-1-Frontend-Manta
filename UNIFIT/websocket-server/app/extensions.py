import socketio

# Configuración del servidor Socket.IO
sio = socketio.AsyncServer(
    cors_allowed_origins='*',
    async_mode='aiohttp',
    logger=True,
    engineio_logger=True
)
