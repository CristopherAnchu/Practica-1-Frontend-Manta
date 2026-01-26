# 🔑 CÓMO CAMBIAR LA API KEY DE GEMINI

## 📍 Ubicación del Archivo

**Archivo a editar:**
```
UNIFIT/ai-orchestrator/.env
```

---

## ✏️ Pasos para Cambiar la API Key

### 1️⃣ Abre el archivo `.env`

Ruta completa:
```
C:\Users\User\Documents\HTML\Aplicaciones Serv Web\REPOSITORIO\Practica-1-Frontend-Manta\UNIFIT\ai-orchestrator\.env
```

### 2️⃣ Busca esta línea:

```bash
GEMINI_API_KEY=AIzaSyBQ5QmN4FbuhN2kbQ8IPpjjYJgSIUBev0A
```

### 3️⃣ Reemplaza con tu nueva API Key:

```bash
GEMINI_API_KEY=TU_NUEVA_API_KEY_AQUI
```

### 4️⃣ Guarda el archivo (Ctrl + S)

### 5️⃣ Reinicia el servicio AI Orchestrator

**Opción A: Cerrar la ventana de PowerShell del AI Orchestrator y volver a ejecutar:**
```powershell
cd ai-orchestrator
python main.py
```

**Opción B: Reiniciar todo el sistema:**
```powershell
.\start-all-extended.ps1
```

---

## 🆕 Cómo Obtener una Nueva API Key de Gemini

1. **Visita:** https://aistudio.google.com/app/apikey

2. **Inicia sesión** con tu cuenta de Google

3. **Click en "Create API Key"**

4. **Copia la API Key** generada

5. **Pégala** en el archivo `.env` (paso 3 arriba)

---

## 🔄 Cambiar entre Providers

Si prefieres usar **Mock** (sin IA) o **OpenAI** en lugar de Gemini:

### Para usar Mock (gratis, sin IA):
```bash
LLM_PROVIDER=mock
```

### Para usar Gemini (IA real):
```bash
LLM_PROVIDER=gemini
GEMINI_API_KEY=tu_api_key_aqui
```

### Para usar OpenAI (IA real):
```bash
LLM_PROVIDER=openai
OPENAI_API_KEY=tu_api_key_de_openai_aqui
```

---

## ⚠️ Señales de que tu API Key no funciona:

- ❌ Error: "API key invalid"
- ❌ Error: "quota exceeded" 
- ❌ Error: "billing not enabled"
- ❌ El chatbot responde con "Error al procesar..."

**Solución:** Cambia la API Key siguiendo los pasos de arriba.

---

## ✅ Verificar que Funciona

Después de cambiar la API key, prueba:

```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:3003/chat" `
  -Body (@{message="Hola, ¿cómo estás?"; userId="test"} | ConvertTo-Json) `
  -ContentType "application/json"
```

Si funciona, verás una respuesta inteligente de Gemini ✅
