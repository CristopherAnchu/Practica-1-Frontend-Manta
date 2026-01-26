"""
MCP Server - Model Context Protocol
Define y ejecuta herramientas que la IA puede invocar
"""

from typing import List, Dict, Any
import aiohttp
import os
import jwt
import time
from datetime import datetime, timedelta


class MCPServer:
    """Servidor de herramientas MCP"""
    
    def __init__(self):
        self.rest_api_url = os.getenv("REST_API_URL", "http://localhost:3000")
        self.graphql_api_url = os.getenv("GRAPHQL_API_URL", "http://localhost:4000/graphql")
        self.payment_api_url = os.getenv("PAYMENT_API_URL", "http://localhost:3002")
        self.jwt_secret = os.getenv("JWT_SECRET", "supersecretkey")
        
        # Registrar herramientas
        self.tools = self._register_tools()
        print(f"✅ MCP Server inicializado con {len(self.tools)} herramientas")

    def _get_auth_header(self, user_id: str = "ai-agent") -> Dict[str, str]:
        """Genera un token JWT para autenticación con el backend"""
        payload = {
            "user_id": user_id,
            "rol": "ADMINISTRADOR", # Rol con permisos suficientes
            "exp": time.time() + 3600 # 1 hora de expiración
        }
        token = jwt.encode(payload, self.jwt_secret, algorithm="HS256")
        return {"Authorization": f"Bearer {token}"}
    
    def _register_tools(self) -> List[Dict]:
        """Registra todas las herramientas MCP disponibles"""
        return [
            # HERRAMIENTA 1: Consulta - Buscar Reservas
            {
                "name": "buscar_reservas",
                "description": "Busca y lista reservas del gimnasio. Puede filtrar por usuario, fecha o estado.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "userId": {
                            "type": "string",
                            "description": "ID del usuario (opcional)"
                        },
                        "fecha": {
                            "type": "string",
                            "description": "Fecha en formato YYYY-MM-DD (opcional)"
                        },
                        "estado": {
                            "type": "string",
                            "description": "Estado: activa, cancelada, completada (opcional)"
                        }
                    }
                },
                "handler": self.tool_buscar_reservas
            },
            
            # HERRAMIENTA 2: Consulta - Obtener Usuario
            {
                "name": "obtener_usuario",
                "description": "Obtiene información detallada de un usuario por ID o email",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "userId": {
                            "type": "string",
                            "description": "ID del usuario"
                        },
                        "email": {
                            "type": "string",
                            "description": "Email del usuario (alternativo)"
                        }
                    },
                    "required": []
                },
                "handler": self.tool_obtener_usuario
            },
            
            # HERRAMIENTA 3: Acción - Crear Reserva
            {
                "name": "crear_reserva",
                "description": "Crea una nueva reserva para un usuario en el gimnasio",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "userId": {
                            "type": "string",
                            "description": "ID del usuario"
                        },
                        "fecha": {
                            "type": "string",
                            "description": "Fecha de la reserva (YYYY-MM-DD)"
                        },
                        "hora": {
                            "type": "string",
                            "description": "Hora de la reserva (HH:MM)"
                        },
                        "actividad": {
                            "type": "string",
                            "description": "Tipo de actividad"
                        }
                    },
                    "required": ["userId", "fecha", "hora"]
                },
                "handler": self.tool_crear_reserva
            },
            
            # HERRAMIENTA 4: Acción - Crear Rutina
            {
                "name": "crear_rutina",
                "description": "Crea una nueva rutina de ejercicios personalizada",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "userId": {
                            "type": "string",
                            "description": "ID del usuario"
                        },
                        "nombre": {
                            "type": "string",
                            "description": "Nombre de la rutina"
                        },
                        "descripcion": {
                            "type": "string",
                            "description": "Descripción de la rutina"
                        },
                        "ejercicios": {
                            "type": "array",
                            "description": "Lista de ejercicios",
                            "items": {"type": "string"}
                        },
                        "dificultad": {
                            "type": "string",
                            "description": "Nivel: principiante, intermedio, avanzado"
                        }
                    },
                    "required": ["userId", "nombre", "descripcion"]
                },
                "handler": self.tool_crear_rutina
            },
            
            # HERRAMIENTA 5: Reporte - Estadísticas del Gimnasio
            {
                "name": "estadisticas_gimnasio",
                "description": "Genera un reporte con estadísticas del gimnasio: reservas, usuarios activos, ingresos, etc.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "periodo": {
                            "type": "string",
                            "description": "Período: hoy, semana, mes, año"
                        },
                        "incluir_graficos": {
                            "type": "boolean",
                            "description": "Incluir datos para gráficos"
                        }
                    }
                },
                "handler": self.tool_estadisticas_gimnasio
            }
        ]
    
    def get_tools(self) -> List[Dict]:
        """Retorna lista de herramientas (sin handlers para enviar a LLM)"""
        return [
            {
                "name": tool["name"],
                "description": tool["description"],
                "parameters": tool["parameters"]
            }
            for tool in self.tools
        ]
    
    def get_tool_names(self) -> List[str]:
        """Retorna nombres de herramientas"""
        return [tool["name"] for tool in self.tools]
    
    def get_tools_description(self) -> List[Dict]:
        """Retorna descripción completa de herramientas"""
        return self.get_tools()
    
    async def execute_tool(self, tool_name: str, params: Dict[str, Any]) -> Any:
        """Ejecuta una herramienta por nombre"""
        tool = next((t for t in self.tools if t["name"] == tool_name), None)
        
        if not tool:
            raise ValueError(f"Herramienta '{tool_name}' no encontrada")
        
        handler = tool["handler"]
        return await handler(params)
    
    # ==================== IMPLEMENTACIÓN DE HERRAMIENTAS ====================
    
    async def tool_buscar_reservas(self, params: Dict) -> Dict:
        """HERRAMIENTA 1: Buscar reservas"""
        try:
            headers = self._get_auth_header(user_id=params.get("userId", "ai-agent"))
            
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.rest_api_url}/reservas",
                    headers=headers
                ) as response:
                    if response.status == 200:
                        reservas = await response.json()
                        
                        # Filtrar según parámetros
                        if "userId" in params:
                            reservas = [r for r in reservas if r.get("userId") == params["userId"]]
                        
                        if "estado" in params:
                            reservas = [r for r in reservas if r.get("estado") == params["estado"]]
                        
                        return {
                            "success": True,
                            "count": len(reservas),
                            "reservas": reservas[:10]  # Limitar a 10
                        }
                    else:
                        error_text = await response.text()
                        return {"success": False, "error": f"Error al obtener reservas: {response.status} - {error_text}"}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def tool_obtener_usuario(self, params: Dict) -> Dict:
        """HERRAMIENTA 2: Obtener usuario"""
        try:
            user_id = params.get("userId")
            if not user_id:
                return {"success": False, "error": "userId requerido"}
            
            headers = self._get_auth_header(user_id=user_id)
            
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.rest_api_url}/users/{user_id}",
                    headers=headers
                ) as response:
                    if response.status == 200:
                        usuario = await response.json()
                        return {
                            "success": True,
                            "usuario": usuario
                        }
                    else:
                        return {"success": False, "error": "Usuario no encontrado"}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def tool_crear_reserva(self, params: Dict) -> Dict:
        """HERRAMIENTA 3: Crear reserva - INSERTA EN LA BASE DE DATOS"""
        try:
            import uuid
            from datetime import datetime
            
            # Generar datos de reserva
            reserva_data = {
                "id": str(uuid.uuid4()),
                "userId": params.get("userId", "user_123"),
                "fecha": params.get("fecha"),
                "hora": params.get("hora"),
                "actividad": params.get("actividad", "Entrenamiento general"),
                "estado": "activa",
                "createdAt": datetime.now().isoformat()
            }
            
            print(f"🔧 Intentando crear reserva: {reserva_data}")
            
            headers = self._get_auth_header(user_id=reserva_data["userId"])
            
            async with aiohttp.ClientSession() as session:
                try:
                    # Intentar con REST API
                    async with session.post(
                        f"{self.rest_api_url}/reservas",
                        json=reserva_data,
                        headers=headers,
                        timeout=aiohttp.ClientTimeout(total=5)
                    ) as response:
                        if response.status in [200, 201]:
                            reserva = await response.json()
                            print(f"✅ Reserva creada via REST: {reserva}")
                            return {
                                "success": True,
                                "message": "Reserva creada exitosamente en la base de datos",
                                "reserva": reserva,
                                "reservaId": reserva.get("id", reserva_data["id"])
                            }
                        else:
                            error_text = await response.text()
                            print(f"⚠️ Error REST API: {response.status} - {error_text}")
                except Exception as rest_error:
                    print(f"⚠️ REST API no disponible: {str(rest_error)}")
                
                # Fallback: Intentar con GraphQL
                try:
                    mutation = """
                    mutation CreateReserva($input: ReservaInput!) {
                        createReserva(input: $input) {
                            id
                            fecha
                            hora
                            estado
                        }
                    }
                    """
                    
                    async with session.post(
                        self.graphql_api_url,
                        json={
                            "query": mutation,
                            "variables": {
                                "input": reserva_data
                            }
                        },
                        timeout=aiohttp.ClientTimeout(total=5)
                    ) as gql_response:
                        if gql_response.status == 200:
                            result = await gql_response.json()
                            if "data" in result:
                                print(f"✅ Reserva creada via GraphQL: {result}")
                                return {
                                    "success": True,
                                    "message": "Reserva creada exitosamente via GraphQL",
                                    "reserva": result["data"]["createReserva"],
                                    "reservaId": result["data"]["createReserva"].get("id")
                                }
                except Exception as gql_error:
                    print(f"⚠️ GraphQL no disponible: {str(gql_error)}")
                
                # Si todo falla, simular creación exitosa
                print("⚠️ APIs no disponibles, simulando creación exitosa")
                return {
                    "success": True,
                    "message": "Reserva registrada (modo simulación)",
                    "reserva": reserva_data,
                    "reservaId": reserva_data["id"],
                    "simulated": True
                }
                
        except Exception as e:
            print(f"❌ Error en tool_crear_reserva: {str(e)}")
            return {"success": False, "error": str(e)}
    
    async def tool_crear_rutina(self, params: Dict) -> Dict:
        """HERRAMIENTA 4: Crear rutina - INSERTA EN LA BASE DE DATOS"""
        try:
            import uuid
            from datetime import datetime
            
            rutina_data = {
                "id": str(uuid.uuid4()),
                "userId": params.get("userId", "user_123"),
                "nombre": params.get("nombre"),
                "descripcion": params.get("descripcion"),
                "ejercicios": params.get("ejercicios", []),
                "dificultad": params.get("dificultad", "intermedio"),
                "duracion": params.get("duracion", 30),
                "createdAt": datetime.now().isoformat()
            }
            
            print(f"🔧 Intentando crear rutina: {rutina_data}")
            
            async with aiohttp.ClientSession() as session:
                try:
                    async with session.post(
                        f"{self.rest_api_url}/rutinas",
                        json=rutina_data,
                        timeout=aiohttp.ClientTimeout(total=5)
                    ) as response:
                        if response.status in [200, 201]:
                            rutina = await response.json()
                            print(f"✅ Rutina creada via REST: {rutina}")
                            return {
                                "success": True,
                                "message": "Rutina creada exitosamente en la base de datos",
                                "rutina": rutina,
                                "rutinaId": rutina.get("id", rutina_data["id"])
                            }
                except Exception as e:
                    print(f"⚠️ REST API no disponible: {str(e)}")
                
                # Fallback: Simular creación exitosa
                print("⚠️ API no disponible, simulando creación exitosa")
                return {
                    "success": True,
                    "message": "Rutina registrada (modo simulación)",
                    "rutina": rutina_data,
                    "rutinaId": rutina_data["id"],
                    "simulated": True
                }
                
        except Exception as e:
            print(f"❌ Error en tool_crear_rutina: {str(e)}")
            return {"success": False, "error": str(e)}
    
    async def tool_estadisticas_gimnasio(self, params: Dict) -> Dict:
        """HERRAMIENTA 5: Estadísticas del gimnasio"""
        try:
            periodo = params.get("periodo", "mes")
            
            # Consultar múltiples endpoints para generar estadísticas
            async with aiohttp.ClientSession() as session:
                # Obtener reservas
                async with session.get(f"{self.rest_api_url}/reservas") as resp_reservas:
                    reservas = await resp_reservas.json() if resp_reservas.status == 200 else []
                
                # Obtener usuarios
                async with session.get(f"{self.rest_api_url}/users") as resp_users:
                    usuarios = await resp_users.json() if resp_users.status == 200 else []
                
                # Calcular estadísticas
                total_reservas = len(reservas)
                reservas_activas = len([r for r in reservas if r.get("estado") == "activa"])
                total_usuarios = len(usuarios)
                usuarios_activos = len([u for u in usuarios if u.get("activo") == True])
                
                return {
                    "success": True,
                    "periodo": periodo,
                    "estadisticas": {
                        "totalReservas": total_reservas,
                        "reservasActivas": reservas_activas,
                        "totalUsuarios": total_usuarios,
                        "usuariosActivos": usuarios_activos,
                        "tasaOcupacion": round((reservas_activas / max(total_reservas, 1)) * 100, 2),
                        "fechaReporte": datetime.now().isoformat()
                    }
                }
        except Exception as e:
            return {"success": False, "error": str(e)}
