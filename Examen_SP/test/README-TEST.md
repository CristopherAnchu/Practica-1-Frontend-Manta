# Script de Prueba - Emisor de Eventos RabbitMQ

Este script envía un evento de prueba a la cola RabbitMQ para simular una eliminación y probar todo el flujo del sistema de auditoría.

## Uso

```bash
node test-rabbitmq-emitter.js
```

## Qué hace

1. Se conecta a RabbitMQ
2. Envía un mensaje a la cola `exam2p.registro.eliminado`
3. El microservicio de auditoría lo procesa
4. Se guarda en la base de datos
5. Se emite webhook a n8n
6. n8n envía notificación a Telegram

## Mensaje de Prueba

El script envía el siguiente mensaje:

```json
{
  "entidad": "Producto",
  "registroId": 999,
  "accion": "ELIMINAR",
  "usuario": "test@example.com",
  "detalle": "Prueba de eliminación desde RabbitMQ"
}
```

## Requisitos

- RabbitMQ corriendo en `localhost:5672`
- Credenciales: `admin:admin`
