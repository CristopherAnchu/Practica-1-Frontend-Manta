# 🤖 AI Orchestrator - UNIFIT

Microservicio de Inteligencia Artificial con MCP (Model Context Protocol) y procesamiento multimodal.

## 📋 Características

- ✅ Chatbot conversacional con IA
- ✅ Patrón Strategy para proveedores LLM (Gemini, OpenAI, Mock)
- ✅ MCP Server con 5 herramientas de negocio
- ✅ Procesamiento multimodal: Texto, Imágenes, PDFs
- ✅ OCR para extracción de texto de imágenes
- ✅ Integración con servicios REST, GraphQL y Payment

## 🏗️ Arquitectura - Patrón Strategy

```
┌──────────────────────────────────────────┐
│       AI Orchestrator (FastAPI)          │
├──────────────────────────────────────────┤
│                                          │
│  ┌────────────────────────────────┐     │
│  │  LLMAdapter (Interface)        │     │
│  └────────────────────────────────┘     │
│         ▲          ▲         ▲          │
│         │          │         │          │
│    ┌────┴───┐ ┌───┴────┐ ┌──┴─────┐   │
│    │ Gemini │ │OpenAI  │ │  Mock  │   │
│    │Adapter │ │Adapter │ │Adapter │   │
│    └────────┘ └────────┘ └────────┘   │
│                                          │
│  ┌────────────────────────────────┐     │
│  │      MCP Server (Tools)        │     │
│  └────────────────────────────────┘     │
│         │                                │
│    ┌────┴──────────────────────┐       │
│    │ • buscar_reservas          │       │
│    │ • obtener_usuario          │       │
│    │ • crear_reserva            │       │
│    │ • crear_rutina             │       │
│    │ • estadisticas_gimnasio    │       │
│    └────────────────────────────┘       │
└──────────────────────────────────────────┘
            ↓       ↓        ↓
       REST API  GraphQL  Payment
```

## 🚀 Instalación

```bash
cd ai-orchestrator
pip install -r requirements.txt
```

### Configurar Tesseract (para OCR)

**Windows:**
1. Descargar Tesseract: https://github.com/UB-Mannheim/tesseract/wiki
2. Instalar en `C:\Program Files\Tesseract-OCR`
3. Agregar a PATH

**Linux:**
```bash
sudo apt-get install tesseract-ocr
sudo apt-get install tesseract-ocr-spa
```

## ⚙️ Configuración

```bash
cp .env.example .env
# Editar .env con tu API key de Gemini/OpenAI
```

## 🎯 Ejecución

```bash
python main.py
```

El servicio estará en: **http://localhost:3003**

## 📡 Endpoints

### POST /chat
Chat con texto simple

```json
{
  "message": "¿Cuántas reservas tengo hoy?",
  "userId": "user_123",
  "conversationId": "conv_456"
}
```

**Response:**
```json
{
  "response": "Tienes 3 reservas activas para hoy.",
  "toolsUsed": ["buscar_reservas"],
  "conversationId": "conv_456"
}
```

### POST /chat/multimodal
Chat con archivos adjuntos (imagen/PDF)

```
Form Data:
- message: "¿Qué dice este documento?"
- userId: "user_123"
- file: [imagen.jpg o documento.pdf]
```

**Response:**
```json
{
  "response": "El documento es una factura de pago por $50...",
  "toolsUsed": [],
  "fileProcessed": true
}
```

### GET /tools
Lista todas las herramientas MCP

```json
{
  "tools": [
    {
      "name": "buscar_reservas",
      "description": "Busca y lista reservas...",
      "parameters": {...}
    },
    ...
  ]
}
```

### POST /tools/{tool_name}
Ejecuta una herramienta directamente

```json
POST /tools/buscar_reservas
{
  "userId": "user_123",
  "estado": "activa"
}
```

## 🛠️ MCP Tools (Herramientas)

### 1. buscar_reservas (Consulta)
Busca reservas con filtros opcionales

**Parámetros:**
- userId (opcional)
- fecha (opcional)
- estado (opcional)

**Ejemplo:**
```
"Muéstrame mis reservas de esta semana"
→ Ejecuta: buscar_reservas(userId="123", fecha="2026-01-11")
```

### 2. obtener_usuario (Consulta)
Obtiene información de un usuario

**Parámetros:**
- userId o email

**Ejemplo:**
```
"¿Cuántas reservas tiene Juan Pérez?"
→ Ejecuta: obtener_usuario(email="juan@example.com")
```

### 3. crear_reserva (Acción)
Crea una nueva reserva

**Parámetros:**
- userId (requerido)
- fecha (requerido)
- hora (requerido)
- actividad (opcional)

**Ejemplo:**
```
"Quiero reservar para mañana a las 10am"
→ Ejecuta: crear_reserva(userId="123", fecha="2026-01-12", hora="10:00")
```

### 4. crear_rutina (Acción)
Crea una rutina personalizada

**Parámetros:**
- userId (requerido)
- nombre (requerido)
- descripcion (requerido)
- ejercicios (opcional)
- dificultad (opcional)

**Ejemplo:**
```
"Créame una rutina para principiantes"
→ Ejecuta: crear_rutina(userId="123", nombre="Rutina Principiante", ...)
```

### 5. estadisticas_gimnasio (Reporte)
Genera estadísticas del gimnasio

**Parámetros:**
- periodo (opcional: hoy, semana, mes)
- incluir_graficos (opcional)

**Ejemplo:**
```
"Dame las estadísticas del mes"
→ Ejecuta: estadisticas_gimnasio(periodo="mes")
```

## 🎨 Capacidades Multimodales

### Imágenes (OCR)
```
Subir imagen de identificación
→ Extrae: nombre, número, fecha de nacimiento
→ Registra usuario automáticamente
```

### PDFs
```
Subir factura.pdf
→ Extrae: monto, fecha, concepto
→ Procesa pago automáticamente
```

### Ejemplos de uso:

**1. Procesar identificación:**
```
POST /chat/multimodal
message: "Registra este nuevo cliente"
file: cedula.jpg

→ OCR extrae datos
→ IA crea usuario con los datos
```

**2. Analizar factura:**
```
POST /chat/multimodal
message: "Procesa este pago"
file: factura.pdf

→ PDF extrae monto
→ IA valida y registra pago
```

## 🔄 Flujo de Conversación

```
1. Usuario → "Quiero hacer una reserva para mañana"
2. AI Orchestrator → Analiza intención
3. AI Orchestrator → Identifica herramienta: crear_reserva
4. MCP Server → Ejecuta crear_reserva(...)
5. MCP Server → Llama a REST API POST /reservas
6. AI Orchestrator → Genera respuesta: "Reserva creada exitosamente"
7. Usuario ← Recibe confirmación
```

## 🔌 Integración con Otros Servicios

El AI Orchestrator se conecta a:
- **REST API (Golang)** - CRUD de entidades
- **GraphQL (NestJS)** - Consultas complejas
- **Payment Service** - Procesamiento de pagos

## 🧪 Desarrollo sin API Keys

Usar `MockLLMAdapter`:
```env
LLM_PROVIDER=mock
```

Retorna respuestas predefinidas sin necesidad de API keys.

## 📊 Base de Datos

Usa la misma PostgreSQL que otros servicios para:
- Historial de conversaciones (opcional)
- Logs de herramientas ejecutadas
- Métricas de uso

## 📚 Referencias

- [MCP Protocol](https://modelcontextprotocol.io/)
- [Strategy Pattern](https://refactoring.guru/design-patterns/strategy)
- [Google Gemini API](https://ai.google.dev/)
- [OpenAI Function Calling](https://platform.openai.com/docs/guides/function-calling)
