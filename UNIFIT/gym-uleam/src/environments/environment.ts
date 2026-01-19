// Configuración de entorno para desarrollo
export const environment = {
  production: false,
  
  // API REST (Golang) - Puerto 3000
  apiUrl: 'http://localhost:3000',
  
  // API GraphQL (NestJS) - Puerto 4000
  graphqlUrl: 'http://localhost:4000/graphql',
  
  // WebSocket Server (Python) - Puerto 8080
  websocketUrl: 'http://localhost:8080',
  
  // NUEVOS SERVICIOS - Segundo Parcial
  authServiceUrl: 'http://localhost:3001/auth',
  paymentServiceUrl: 'http://localhost:3002',
  aiOrchestratorUrl: 'http://localhost:3003',
  
  // Configuración de servicios
  endpoints: {
    rest: {
      // Autenticación
      login: '/login',
      
      // Usuarios
      users: '/users',
      
      // Reservas
      reservas: '/reservas',
      
      // Rutinas
      rutinas: '/rutinas',
      
      // Equipos
      equipos: '/equipos',
      
      // Incidencias
      incidencias: '/incidencias',
      
      // Asistencias
      asistencias: '/asistencias'
    },
    
    websocket: {
      rooms: {
        dashboard: 'dashboard',
        reservas: 'reservas',
        rutinas: 'rutinas',
        usuarios: 'usuarios',
        notifications: 'notifications'
      }
    }
  }
};
