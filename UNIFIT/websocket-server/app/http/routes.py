from .handlers import general, webhooks

def setup_routes(app):
    # Configurar rutas
    app.router.add_get('/', general.index)
    app.router.add_get('/health', general.health)

    # Endpoints para notificaciones REST
    app.router.add_post('/api/notify/reserva/created', webhooks.notify_reserva_created)
    app.router.add_post('/api/notify/reserva/updated', webhooks.notify_reserva_updated)
    app.router.add_post('/api/notify/reserva/deleted', webhooks.notify_reserva_deleted)
    app.router.add_post('/api/notify/rutina/created', webhooks.notify_rutina_created)
    app.router.add_post('/api/notify/rutina/updated', webhooks.notify_rutina_updated)
    app.router.add_post('/api/notify/usuario/updated', webhooks.notify_usuario_updated)
    app.router.add_post('/api/notify', webhooks.notify_generic)
