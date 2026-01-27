# GUÍA RÁPIDA - EXAMEN 2P

## 🚀 Inicio Rápido (5 minutos)

### 1. Iniciar Docker
```powershell
# Windows
.\start-docker.ps1

# Linux/Mac
./start-docker.sh
```

### 2. Instalar y ejecutar microservicio
```bash
cd exam2p-servicio-auditoria
npm install
npm run start:dev
```

### 3. Configurar n8n
- Abrir: http://localhost:5678
- Importar: `n8n-workflow/exam2p-flujo-auditoria.json`
- Configurar credenciales (Gemini + Telegram)
- Activar workflow

## ✅ Checklist de Evidencias

### PREGUNTA 1 (25%) - Microservicio + RabbitMQ
- [ ] Código del microservicio
- [ ] Screenshot de RabbitMQ (cola creada)
- [ ] Screenshot de PostgreSQL (tabla con datos)

### PREGUNTA 2 (25%) - Webhook hacia n8n
- [ ] Código de WebhookEmitterService
- [ ] Screenshot del log en n8n (webhook recibido)

### PREGUNTA 3 (25%) - MCP Tool
- [ ] Código del MCP Tool
- [ ] Screenshot de Gemini usando el tool
- [ ] Response del endpoint GET /exam2p-auditoria

### PREGUNTA 4 (25%) - Workflow n8n
- [ ] JSON exportado del workflow
- [ ] Screenshot de Telegram (notificación recibida)

## 🧪 Pruebas Rápidas

### Probar RabbitMQ → Microservicio → BD → n8n → Telegram
```bash
cd test
npm install
npm run test:rabbitmq
```

### Probar API REST (para MCP)
```bash
cd test
npm run test:rest
```

### Probar MCP Server
```bash
cd mcp-tool
npm install
npm run dev

# En otra terminal
cd test
npm run test:mcp
```

### Probar con Gemini AI (Lenguaje Natural)
```bash
# 1. Configurar API Key en api-gateway/.env
# 2. Iniciar API Gateway
cd api-gateway
npm install
npm run start:dev

# 3. En otra terminal, probar
cd test
npm run test:gemini
```

## 📋 Verificación de Componentes

### Base de Datos
```bash
# Conectar a PostgreSQL
docker exec -it exam2p-postgres-auditoria psql -U postgres -d exam2p_auditoria

# Verificar tabla
\dt
SELECT * FROM exam2p_registro_auditoria;
```

### RabbitMQ
- UI: http://localhost:15672
- Usuario: admin
- Password: admin
- Verificar cola: `exam2p.registro.eliminado`

### n8n
- UI: http://localhost:5678
- Verificar webhook URL: `http://localhost:5678/webhook/exam2p-auditoria`

## 🎯 Endpoints

| Servicio | URL | Descripción |
|----------|-----|-------------|
| Microservicio | http://localhost:3000 | API REST |
| GET Auditoría | http://localhost:3000/exam2p-auditoria | Obtener registros |
| PostgreSQL | localhost:5433 | Base de datos |
| RabbitMQ | amqp://localhost:5672 | Mensajería |
| RabbitMQ UI | http://localhost:15672 | Panel admin |
| n8n | http://localhost:5678 | Automatización |
| Webhook n8n | http://localhost:5678/webhook/exam2p-auditoria | Recibe eventos |

## ⚠️ Troubleshooting

### Puerto 5433 en uso
```powershell
# Windows
netstat -ano | findstr :5433
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5433
kill -9 <PID>
```

### Microservicio no conecta a RabbitMQ
```bash
# Verificar estado de RabbitMQ
docker logs exam2p-rabbitmq

# Reiniciar si es necesario
docker restart exam2p-rabbitmq
```

### n8n no recibe webhook
- Verificar que el workflow esté activado
- Verificar URL en `.env` del microservicio
- Revisar logs del microservicio

## 📖 Documentación Completa

- [README Principal](README.md)
- [Microservicio](exam2p-servicio-auditoria/README.md)
- [MCP Tool](mcp-tool/README.md)
- [Workflow n8n](n8n-workflow/README.md)
- [Tests](test/README-TEST.md)

## 💡 Comandos Útiles

```bash
# Ver logs del microservicio
cd exam2p-servicio-auditoria
npm run start:dev

# Ver logs de Docker
docker-compose logs -f

# Detener todos los servicios
docker-compose down

# Limpiar todo (incluye volúmenes)
docker-compose down -v

# Reiniciar un servicio específico
docker restart exam2p-rabbitmq
```

## 📞 Soporte

Si algo no funciona:
1. Verificar logs: `docker-compose logs -f`
2. Verificar puertos: `netstat -ano | findstr :5433`
3. Reiniciar Docker: `docker-compose restart`
4. Verificar variables de entorno en `.env`
