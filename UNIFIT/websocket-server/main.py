import os
from aiohttp import web
from app import init_app
from app.config import PORT, HOST
from app.state import state

if __name__ == '__main__':
    print("=" * 60)
    print("🏋️  UniFit WebSocket Server")
    print("=" * 60)
    print(f"🚀 Servidor iniciando en: http://{HOST}:{PORT}")
    print(f"📡 Socket.IO endpoint: ws://{HOST}:{PORT}")
    print(f"💚 Health check: http://{HOST}:{PORT}/health")
    print("=" * 60)
    print("📊 Salas disponibles:")
    for room in state.rooms.keys():
        print(f"   - {room}")
    print("=" * 60)
    
    web.run_app(
        init_app(),
        host=HOST,
        port=PORT,
        print=lambda x: None  # Suprimir logs por defecto de aiohttp
    )
