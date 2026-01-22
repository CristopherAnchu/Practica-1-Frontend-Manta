"""
AI Orchestrator - UNIFIT
Microservicio de IA con MCP (Model Context Protocol)
"""

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
from dotenv import load_dotenv

from llm_adapter import LLMAdapterFactory
from mcp_server import MCPServer
from multimodal_processor import MultimodalProcessor

load_dotenv()

app = FastAPI(
    title="UNIFIT AI Orchestrator",
    description="Asistente de IA multimodal con MCP Tools",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=eval(os.getenv("CORS_ORIGINS", '["*"]')),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializar componentes
llm_provider = os.getenv("LLM_PROVIDER", "gemini")
llm_adapter = LLMAdapterFactory.create(llm_provider)
mcp_server = MCPServer()
multimodal_processor = MultimodalProcessor()


class ChatMessage(BaseModel):
    message: str
    userId: Optional[str] = None
    conversationId: Optional[str] = None
    # Opcional: permitir especificar proveedor y apiKey por petición
    provider: Optional[str] = None
    apiKey: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    toolsUsed: List[str] = []
    conversationId: str


@app.get("/")
async def root():
    return {
        "service": "AI Orchestrator",
        "status": "running",
        "llm_provider": llm_provider,
        "available_tools": mcp_server.get_tool_names()
    }


@app.post("/chat", response_model=ChatResponse)
async def chat(message: ChatMessage):
    """
    Endpoint principal de chat con IA
    Procesa mensajes de texto y ejecuta herramientas MCP
    """
    try:
        # Si la petición incluye proveedor/apiKey, crear un adapter temporal
        adapter = llm_adapter
        if message.provider:
            adapter = LLMAdapterFactory.create(message.provider, message.apiKey)

        # Procesar mensaje con el LLM
        response = await adapter.process_message(
            message.message,
            user_id=message.userId,
            conversation_id=message.conversationId,
            tools=mcp_server.get_tools()
        )

        # Extraer herramientas usadas
        tools_used = response.get("tools_used", [])

        return ChatResponse(
            response=response["text"],
            toolsUsed=tools_used,
            conversationId=response.get("conversation_id", message.conversationId or "new")
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/chat/multimodal")
async def chat_multimodal(
    message: str = Form(...),
    userId: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    """
    Chat multimodal - Acepta texto + imagen/PDF
    """
    try:
        # Procesar archivo si existe
        file_content = None
        file_type = None

        if file:
            file_content = await file.read()
            file_type = file.content_type

            # Procesar según tipo
            if file_type.startswith('image/'):
                # OCR de imagen
                extracted_text = await multimodal_processor.process_image(file_content)
                message += f"\n\n[Texto extraído de imagen]: {extracted_text}"

            elif file_type == 'application/pdf':
                # Extraer texto de PDF
                extracted_text = await multimodal_processor.process_pdf(file_content)
                message += f"\n\n[Texto extraído de PDF]: {extracted_text}"

        # Procesar con LLM (usar adapter por defecto)
        response = await llm_adapter.process_message(
            message,
            user_id=userId,
            tools=mcp_server.get_tools()
        )

        return {
            "response": response["text"],
            "toolsUsed": response.get("tools_used", []),
            "fileProcessed": file is not None
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/tools")
async def get_tools():
    """
    Lista todas las herramientas MCP disponibles
    """
    return {
        "tools": mcp_server.get_tools_description()
    }


@app.post("/tools/{tool_name}")
async def execute_tool(tool_name: str, params: Dict[str, Any]):
    """
    Ejecuta una herramienta MCP directamente
    """
    try:
        result = await mcp_server.execute_tool(tool_name, params)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "llm_provider": llm_provider,
        "mcp_tools_count": len(mcp_server.get_tools())
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 3003))
    print(f"🤖 AI Orchestrator iniciando en puerto {port}")
    print(f"🧠 LLM Provider: {llm_provider}")
    print(f"🛠️  MCP Tools disponibles: {len(mcp_server.get_tools())}")
    
    uvicorn.run(app, host="0.0.0.0", port=port)
