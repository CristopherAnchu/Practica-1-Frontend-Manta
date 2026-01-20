"""
LLM Adapter - Patrón Strategy
Permite intercambiar proveedores de IA sin modificar la lógica
"""

from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
import os
import json


class LLMAdapter(ABC):
    """Interface abstracta para proveedores de LLM"""
    
    @abstractmethod
    async def process_message(
        self, 
        message: str,
        user_id: Optional[str] = None,
        conversation_id: Optional[str] = None,
        tools: Optional[List[Dict]] = None
    ) -> Dict[str, Any]:
        """Procesa un mensaje y retorna la respuesta"""
        pass


class GeminiAdapter(LLMAdapter):
    """Adapter para Google Gemini"""
    
    def __init__(self):
        import google.generativeai as genai
        api_key = os.getenv("GEMINI_API_KEY")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')
        print("✅ Gemini Adapter inicializado")
    
    async def process_message(
        self, 
        message: str,
        user_id: Optional[str] = None,
        conversation_id: Optional[str] = None,
        tools: Optional[List[Dict]] = None
    ) -> Dict[str, Any]:
        
        # Crear prompt con contexto de herramientas
        system_prompt = self._build_system_prompt(tools)
        full_prompt = f"{system_prompt}\n\nUsuario: {message}\n\nAsistente:"
        
        try:
            response = self.model.generate_content(full_prompt)
            response_text = response.text
            
            # Detectar si el modelo quiere usar herramientas
            tools_used = self._extract_tool_calls(response_text, tools)
            
            # Si hay herramientas, ejecutarlas
            if tools_used:
                from mcp_server import MCPServer
                mcp = MCPServer()
                
                tool_results = []
                for tool_call in tools_used:
                    result = await mcp.execute_tool(
                        tool_call["name"],
                        tool_call["params"]
                    )
                    tool_results.append(result)
                
                # Generar respuesta final con resultados
                final_prompt = f"{full_prompt}\n\nResultados de herramientas: {json.dumps(tool_results, ensure_ascii=False)}\n\nRespuesta final:"
                final_response = self.model.generate_content(final_prompt)
                response_text = final_response.text
            
            return {
                "text": response_text,
                "tools_used": [t["name"] for t in tools_used],
                "conversation_id": conversation_id or "new"
            }
            
        except Exception as e:
            return {
                "text": f"Error al procesar mensaje: {str(e)}",
                "tools_used": [],
                "conversation_id": conversation_id
            }
    
    def _build_system_prompt(self, tools: Optional[List[Dict]]) -> str:
        prompt = """Eres un asistente virtual del gimnasio UNIFIT. Puedes ayudar con:
- Consultar y crear reservas
- Buscar información de usuarios
- Crear rutinas de ejercicio
- Generar reportes y estadísticas
- Procesar pagos"""
        
        if tools:
            prompt += "\n\nHerramientas disponibles:\n"
            for tool in tools:
                prompt += f"- {tool['name']}: {tool['description']}\n"
                prompt += f"  Parámetros: {json.dumps(tool['parameters'])}\n"
            
            prompt += "\nPara usar una herramienta, indica claramente cuál quieres usar y con qué parámetros."
        
        return prompt
    
    def _extract_tool_calls(self, text: str, tools: Optional[List[Dict]]) -> List[Dict]:
        """Extrae llamadas a herramientas del texto del modelo"""
        # Implementación simplificada - en producción usar function calling de Gemini
        tool_calls = []
        
        if not tools:
            return tool_calls
        
        # Buscar menciones de herramientas
        for tool in tools:
            if tool['name'].lower() in text.lower():
                # Extraer parámetros (lógica simplificada)
                tool_calls.append({
                    "name": tool['name'],
                    "params": {}  # En producción, extraer parámetros del texto
                })
        
        return tool_calls


class OpenAIAdapter(LLMAdapter):
    """Adapter para OpenAI GPT"""
    
    def __init__(self):
        from openai import OpenAI
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        print("✅ OpenAI Adapter inicializado")
    
    async def process_message(
        self, 
        message: str,
        user_id: Optional[str] = None,
        conversation_id: Optional[str] = None,
        tools: Optional[List[Dict]] = None
    ) -> Dict[str, Any]:
        
        messages = [
            {"role": "system", "content": "Eres un asistente virtual del gimnasio UNIFIT."},
            {"role": "user", "content": message}
        ]
        
        # Convertir tools a formato de OpenAI
        openai_tools = self._convert_tools_to_openai_format(tools) if tools else None
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                tools=openai_tools,
                tool_choice="auto" if openai_tools else None
            )
            
            response_message = response.choices[0].message
            tools_used = []
            
            # Ejecutar tool calls si existen
            if response_message.tool_calls:
                from mcp_server import MCPServer
                mcp = MCPServer()
                
                for tool_call in response_message.tool_calls:
                    function_name = tool_call.function.name
                    function_args = json.loads(tool_call.function.arguments)
                    
                    await mcp.execute_tool(function_name, function_args)
                    tools_used.append(function_name)
            
            return {
                "text": response_message.content or "Procesado con herramientas",
                "tools_used": tools_used,
                "conversation_id": conversation_id or "new"
            }
            
        except Exception as e:
            return {
                "text": f"Error: {str(e)}",
                "tools_used": [],
                "conversation_id": conversation_id
            }
    
    def _convert_tools_to_openai_format(self, tools: List[Dict]) -> List[Dict]:
        """Convierte tools MCP a formato OpenAI"""
        openai_tools = []
        for tool in tools:
            openai_tools.append({
                "type": "function",
                "function": {
                    "name": tool["name"],
                    "description": tool["description"],
                    "parameters": tool["parameters"]
                }
            })
        return openai_tools


class MockLLMAdapter(LLMAdapter):
    """Mock Adapter para desarrollo sin API keys"""
    
    def __init__(self):
        print("✅ Mock LLM Adapter inicializado (desarrollo)")
    
    async def process_message(
        self, 
        message: str,
        user_id: Optional[str] = None,
        conversation_id: Optional[str] = None,
        tools: Optional[List[Dict]] = None
    ) -> Dict[str, Any]:
        
        # Respuestas mock según keywords
        if "reserva" in message.lower():
            return {
                "text": "He encontrado 3 reservas activas para hoy. ¿Quieres ver los detalles?",
                "tools_used": ["buscar_reservas"],
                "conversation_id": "mock_conv_1"
            }
        elif "usuario" in message.lower():
            return {
                "text": "El usuario Juan Pérez tiene 5 reservas este mes y está activo.",
                "tools_used": ["obtener_usuario"],
                "conversation_id": "mock_conv_1"
            }
        elif "rutina" in message.lower():
            return {
                "text": "He creado una rutina de 30 minutos para principiantes con 5 ejercicios.",
                "tools_used": ["crear_rutina"],
                "conversation_id": "mock_conv_1"
            }
        else:
            return {
                "text": f"Hola, soy el asistente de UNIFIT. Me preguntaste: '{message}'. ¿En qué puedo ayudarte?",
                "tools_used": [],
                "conversation_id": "mock_conv_1"
            }


class LLMAdapterFactory:
    """Factory para crear adapters según configuración"""
    
    @staticmethod
    def create(provider: str) -> LLMAdapter:
        providers = {
            "gemini": GeminiAdapter,
            "openai": OpenAIAdapter,
            "mock": MockLLMAdapter
        }
        
        adapter_class = providers.get(provider.lower(), MockLLMAdapter)
        return adapter_class()
