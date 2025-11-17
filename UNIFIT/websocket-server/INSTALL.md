# 🚀 Inicio Rápido - WebSocket Server

## Instalación Automática (Windows PowerShell)

```powershell
cd websocket-server
.\install.ps1
```

## Instalación Manual

```powershell
pip install -r requirements.txt
```

## Iniciar Servidor

```powershell
python server.py
```

**Servidor corriendo en:** http://localhost:5000

---

## Verificar Instalación

```powershell
# Health check
curl http://localhost:5000/health

# Página de inicio
# Abrir en navegador: http://localhost:5000
```

---

## Dependencias Instaladas

- `python-socketio` - Servidor Socket.IO
- `aiohttp` - Servidor HTTP asíncrono
- `python-dotenv` - Variables de entorno
- `asyncio` - Programación asíncrona

---

## Solución de Problemas

### Python no encontrado

Descargar desde: https://www.python.org/downloads/

### pip no encontrado

```powershell
python -m ensurepip --upgrade
```

### Error de permisos

Ejecutar PowerShell como Administrador

---

**¡Listo para usar!** 🎉
