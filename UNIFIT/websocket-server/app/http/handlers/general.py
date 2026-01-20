from aiohttp import web
from datetime import datetime
from ...state import state
from ...extensions import sio

async def index(request):
    """Página de inicio"""
    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>UniFit WebSocket Server</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                max-width: 800px; 
                margin: 50px auto; 
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            .container {
                background: rgba(255, 255, 255, 0.1);
                padding: 30px;
                border-radius: 10px;
                backdrop-filter: blur(10px);
            }
            h1 { color: white; }
            .status { 
                background: rgba(76, 175, 80, 0.3);
                padding: 15px; 
                border-radius: 5px; 
                margin: 20px 0;
                border-left: 4px solid #4caf50;
            }
            .info { 
                background: rgba(33, 150, 243, 0.3);
                padding: 15px; 
                border-radius: 5px; 
                margin: 10px 0;
                border-left: 4px solid #2196f3;
            }
            ul { list-style: none; padding: 0; }
            li { padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
            code { 
                background: rgba(0,0,0,0.3); 
                padding: 2px 6px; 
                border-radius: 3px; 
                font-family: 'Courier New', monospace;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🏋️ UniFit WebSocket Server</h1>
            <div class="status">
                <h2>✅ Servidor Activo</h2>
                <p>Puerto: <code>5000</code></p>
                <p>Protocolo: <code>Socket.IO (Python)</code></p>
            </div>
            
            <div class="info">
                <h3>📡 Conexión desde Frontend</h3>
                <code>ws://localhost:5000</code>
            </div>
            
            <div class="info">
                <h3>🚪 Salas Disponibles</h3>
                <ul>
                    <li>📊 <code>dashboard</code> - Datos del dashboard en tiempo real</li>
                    <li>🎫 <code>reservas</code> - Notificaciones de reservas</li>
                    <li>💪 <code>rutinas</code> - Actualizaciones de rutinas</li>
                    <li>👥 <code>usuarios</code> - Cambios en usuarios</li>
                    <li>🔔 <code>notifications</code> - Notificaciones generales</li>
                </ul>
            </div>
            
            <div class="info">
                <h3>🎯 Eventos Disponibles</h3>
                <ul>
                    <li><code>join_room</code> - Unirse a una sala</li>
                    <li><code>leave_room</code> - Salir de una sala</li>
                    <li><code>request_dashboard_update</code> - Solicitar datos del dashboard</li>
                    <li><code>nueva_reserva</code> - Notificar nueva reserva</li>
                    <li><code>actualizar_reserva</code> - Actualizar reserva</li>
                    <li><code>cancelar_reserva</code> - Cancelar reserva</li>
                    <li><code>send_notification</code> - Enviar notificación</li>
                    <li><code>get_server_stats</code> - Obtener estadísticas</li>
                </ul>
            </div>
            
            <div class="info">
                <h3>📚 Documentación</h3>
                <p>Ver <code>README.md</code> para ejemplos de uso desde Angular</p>
            </div>
        </div>
    </body>
    </html>
    """
    return web.Response(text=html, content_type='text/html')


async def health(request):
    """Health check endpoint"""
    return web.json_response({
        'status': 'healthy',
        'connections': state.connection_count,
        'rooms': {room: len(sids) for room, sids in state.rooms.items()},
        'timestamp': datetime.now().isoformat()
    })
