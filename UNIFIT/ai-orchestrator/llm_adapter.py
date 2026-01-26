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
    """Adapter para Google Gemini con Function Calling"""
    
    def __init__(self):
        try:
            import google.generativeai as genai
            api_key = os.getenv("GEMINI_API_KEY")
            if not api_key or api_key == "":
                print("⚠️ GEMINI_API_KEY no configurada, fallback a Mock")
                raise ValueError("No API key")
            
            genai.configure(api_key=api_key)
            # Usando gemini-2.0-flash-exp (mejor para function calling)
            self.model = genai.GenerativeModel('gemini-2.0-flash-exp')
            self.genai = genai
            print("✅ Gemini Adapter inicializado (gemini-2.0-flash-exp) con Function Calling")
        except Exception as e:
            print(f"❌ Error inicializando Gemini: {str(e)}")
            print("⚠️ Usando Mock Adapter como fallback")
            raise
    
    async def process_message(
        self, 
        message: str,
        user_id: Optional[str] = None,
        conversation_id: Optional[str] = None,
        tools: Optional[List[Dict]] = None
    ) -> Dict[str, Any]:
        
        try:
            # Convertir herramientas MCP a formato de Gemini
            gemini_tools = self._convert_tools_to_gemini_format(tools) if tools else []
            
            # Crear el modelo con las herramientas
            if gemini_tools:
                model = self.genai.GenerativeModel(
                    'gemini-2.0-flash-exp',
                    tools=gemini_tools
                )
            else:
                model = self.model
            
            # Sistema de instrucciones
            system_instruction = """Eres un asistente virtual del gimnasio UNIFIT. 
Ayudas a los usuarios con:
- Crear y consultar reservas
- Crear rutinas de ejercicio personalizadas
- Consultar información de usuarios
- Ver estadísticas del gimnasio

Cuando un usuario pida hacer algo (crear reserva, rutina, etc), USA LAS HERRAMIENTAS disponibles.
Sé amigable y usa emojis apropiados. (No le pidas informacion sencible al usuario, como la id o la contraseña, toda esa informacion deberas de obtenerla
utilizando las herramientas disponibles.)"""

            # Inyectar user_id en el contexto si está disponible
            if user_id:
                system_instruction += f"\n\nINFORMACIÓN DE CONTEXTO (Invisible para el usuario):\n- ID de Usuario Actual: {user_id}\n\nCuando uses herramientas que requieran 'userId', USA ESTE VALOR AUTOMÁTICAMENTE. NO le preguntes al usuario por su ID."

            # Generar contenido con herramientas
            chat = model.start_chat()
            response = chat.send_message(f"{system_instruction}\n\nUsuario: {message}")
            
            tools_used = []
            tool_results = []
            
            # Verificar si el modelo quiere usar herramientas
            if response.candidates[0].content.parts:
                for part in response.candidates[0].content.parts:
                    # Si hay function call
                    if hasattr(part, 'function_call') and part.function_call:
                        function_call = part.function_call
                        tool_name = function_call.name
                        tool_params = dict(function_call.args)
                        
                        print(f"🔧 Gemini quiere ejecutar: {tool_name} con {tool_params}")
                        
                        # Ejecutar la herramienta MCP
                        from mcp_server import MCPServer
                        mcp = MCPServer()
                        
                        try:
                            result = await mcp.execute_tool(tool_name, tool_params)
                            tools_used.append(tool_name)
                            tool_results.append({
                                "tool": tool_name,
                                "result": result
                            })
                            
                            # Enviar resultado de vuelta a Gemini
                            function_response = self.genai.protos.FunctionResponse(
                                name=tool_name,
                                response={"result": result}
                            )
                            
                            # Segunda llamada con los resultados
                            response = chat.send_message(
                                self.genai.protos.Content(
                                    parts=[self.genai.protos.Part(
                                        function_response=function_response
                                    )]
                                )
                            )
                        except Exception as e:
                            print(f"❌ Error ejecutando herramienta {tool_name}: {str(e)}")
            
            # Obtener texto de respuesta
            response_text = response.text if hasattr(response, 'text') else "Lo siento, no pude procesar tu solicitud."
            
            return {
                "text": response_text,
                "tools_used": tools_used,
                "conversation_id": conversation_id or "new",
                "tool_results": tool_results
            }
            
        except Exception as e:
            error_msg = str(e).lower()
            
            # Detectar si es error de cuota/API key
            if any(keyword in error_msg for keyword in ["quota", "api_key", "429", "invalid", "exhausted", "billing"]):
                print(f"⚠️ Error de API Gemini (sin créditos o API key inválida): {str(e)}")
                print("🔄 Fallback automático a Mock Adapter")
                
                # Usar Mock Adapter como fallback
                mock_adapter = MockLLMAdapter()
                return await mock_adapter.process_message(message, user_id, conversation_id, tools)
            
            return {
                "text": f"⚠️ Error al procesar con Gemini: {str(e)}. Revisa tu API key en el archivo .env",
                "tools_used": [],
                "conversation_id": conversation_id or "error"
            }
    
    def _convert_tools_to_gemini_format(self, tools: Optional[List[Dict]]) -> List:
        """Convierte herramientas MCP a formato de Gemini Function Calling"""
        if not tools:
            return []
        
        gemini_tools = []
        
        for tool in tools:
            # Construir properties manualmente para poder manejar arrays
            converted_properties = {}
            for prop_name, prop_info in tool["parameters"].get("properties", {}).items():
                prop_type = self._get_gemini_type(prop_info.get("type", "string"))
                
                # Configurar el esquema básico
                schema = self.genai.protos.Schema(
                    type=prop_type,
                    description=prop_info.get("description", "")
                )
                
                # Si es array, configurar items
                if prop_type == self.genai.protos.Type.ARRAY and "items" in prop_info:
                    items_info = prop_info["items"]
                    items_type = self._get_gemini_type(items_info.get("type", "string"))
                    schema.items = self.genai.protos.Schema(
                        type=items_type
                    )
                
                converted_properties[prop_name] = schema

            gemini_tool = self.genai.protos.FunctionDeclaration(
                name=tool["name"],
                description=tool["description"],
                parameters=self.genai.protos.Schema(
                    type=self.genai.protos.Type.OBJECT,
                    properties=converted_properties,
                    required=tool["parameters"].get("required", [])
                )
            )
            gemini_tools.append(gemini_tool)
        
        return gemini_tools
    
    def _get_gemini_type(self, json_type: str):
        """Convierte tipo JSON a tipo Gemini"""
        type_mapping = {
            "string": self.genai.protos.Type.STRING,
            "number": self.genai.protos.Type.NUMBER,
            "integer": self.genai.protos.Type.INTEGER,
            "boolean": self.genai.protos.Type.BOOLEAN,
            "array": self.genai.protos.Type.ARRAY,
            "object": self.genai.protos.Type.OBJECT
        }
        return type_mapping.get(json_type, self.genai.protos.Type.STRING)


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
        
        system_content = "Eres un asistente virtual del gimnasio UNIFIT."
        if user_id:
             system_content += f" El ID del usuario actual es: {user_id}. Úsalo en las herramientas cuando sea necesario."

        messages = [
            {"role": "system", "content": system_content},
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
        
        message_lower = message.lower()
        
        # Detectar intención de CREAR reserva
        if any(word in message_lower for word in ["agendar", "crear reserva", "reservar", "hacer reserva", "nueva reserva"]):
            # Ejecutar herramienta crear_reserva
            from mcp_server import MCPServer
            mcp = MCPServer()
            
            # Extraer fecha/hora del mensaje o usar valores por defecto
            import datetime
            tomorrow = datetime.datetime.now() + datetime.timedelta(days=1)
            
            try:
                result = await mcp.execute_tool("crear_reserva", {
                    "userId": user_id or "user_123",
                    "fecha": tomorrow.strftime("%Y-%m-%d"),
                    "hora": "10:00",
                    "actividad": "Entrenamiento General"
                })
                
                return {
                    "text": f"✅ ¡Reserva creada exitosamente! Te he agendado para {tomorrow.strftime('%d/%m/%Y')} a las 10:00 AM. Tu ID de reserva es: {result.get('reservaId', 'N/A')}",
                    "tools_used": ["crear_reserva"],
                    "conversation_id": conversation_id or "mock_conv_1",
                    "data": result
                }
            except Exception as e:
                return {
                    "text": f"⚠️ Hubo un problema al crear la reserva: {str(e)}. Por favor intenta nuevamente.",
                    "tools_used": [],
                    "conversation_id": conversation_id or "mock_conv_1"
                }
        
        # Buscar reservas existentes
        elif "mis reservas" in message_lower or "buscar reservas" in message_lower or "ver reservas" in message_lower:
            from mcp_server import MCPServer
            mcp = MCPServer()
            
            try:
                result = await mcp.execute_tool("buscar_reservas", {
                    "userId": user_id or "user_123"
                })
                
                count = len(result.get("reservas", []))
                return {
                    "text": f"📅 Tienes {count} reserva(s) activa(s). {json.dumps(result.get('reservas', []), indent=2, ensure_ascii=False)}",
                    "tools_used": ["buscar_reservas"],
                    "conversation_id": conversation_id or "mock_conv_1",
                    "data": result
                }
            except Exception as e:
                return {
                    "text": f"⚠️ Error al buscar reservas: {str(e)}",
                    "tools_used": [],
                    "conversation_id": conversation_id or "mock_conv_1"
                }
        
        # Crear rutina
        elif "rutina" in message_lower and any(word in message_lower for word in ["crear", "nueva", "hacer"]):
            from mcp_server import MCPServer
            mcp = MCPServer()
            
            try:
                result = await mcp.execute_tool("crear_rutina", {
                    "userId": user_id or "user_123",
                    "nombre": "Rutina Personalizada",
                    "descripcion": "Rutina generada por IA",
                    "ejercicios": ["Press de banca", "Sentadillas", "Peso muerto", "Dominadas"],
                    "dificultad": "intermedio"
                })
                
                return {
                    "text": f"💪 ¡Rutina creada! He generado una rutina personalizada con 4 ejercicios. ID: {result.get('rutinaId', 'N/A')}",
                    "tools_used": ["crear_rutina"],
                    "conversation_id": conversation_id or "mock_conv_1",
                    "data": result
                }
            except Exception as e:
                return {
                    "text": f"⚠️ Error al crear rutina: {str(e)}",
                    "tools_used": [],
                    "conversation_id": conversation_id or "mock_conv_1"
                }
        
        # Usuario info
        elif "usuario" in message_lower or "mi info" in message_lower or "perfil" in message_lower:
            return {
                "text": "👤 Tu perfil está activo. Tienes acceso completo al gimnasio.",
                "tools_used": ["obtener_usuario"],
                "conversation_id": conversation_id or "mock_conv_1"
            }
        
        # Estadísticas
        elif "estadistica" in message_lower or "reporte" in message_lower:
            return {
                "text": "📊 El gimnasio tiene 150 usuarios activos este mes, con 420 reservas completadas.",
                "tools_used": ["estadisticas_gimnasio"],
                "conversation_id": conversation_id or "mock_conv_1"
            }
        
        # Respuesta por defecto
        else:
            return {
                "text": f"👋 Hola, soy tu asistente de UNIFIT. Puedo ayudarte a:\n\n✅ Agendar reservas (di 'quiero agendar una reserva')\n✅ Ver tus reservas (di 'mis reservas')\n✅ Crear rutinas (di 'crear rutina')\n✅ Ver estadísticas\n\n¿Qué necesitas?",
                "tools_used": [],
                "conversation_id": conversation_id or "mock_conv_1"
            }


class LLMAdapterFactory:
    """Factory para crear adapters según configuración"""
    
    @staticmethod
    def create(provider: str, api_key: str = None) -> LLMAdapter:
        """
        Crea un adapter para el proveedor especificado.
        Si falla, hace fallback automático a MockLLMAdapter.
        """
        providers = {
            "gemini": GeminiAdapter,
            "openai": OpenAIAdapter,
            "mock": MockLLMAdapter
        }

        # Si se proporciona api_key, configurar variable de entorno
        if api_key:
            import os
            if provider.lower() == 'openai':
                os.environ['OPENAI_API_KEY'] = api_key
            elif provider.lower() == 'gemini':
                os.environ['GEMINI_API_KEY'] = api_key

        adapter_class = providers.get(provider.lower(), MockLLMAdapter)
        
        try:
            # Intentar crear el adapter solicitado
            print(f"🔄 Intentando inicializar {provider} adapter...")
            return adapter_class()
        except Exception as e:
            # Si falla, usar Mock como fallback
            print(f"❌ Error inicializando {provider}: {str(e)}")
            print("🔄 Fallback automático a Mock Adapter")
            return MockLLMAdapter()
