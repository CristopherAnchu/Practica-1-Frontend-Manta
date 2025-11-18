// Configuración de entorno para producción
export const environment = {
  production: true,
  
  // API REST (Golang) - Puerto 3000
  apiUrl: 'https://your-production-domain.com',
  
  // API GraphQL (NestJS) - Puerto 4000
  graphqlUrl: 'https://your-production-domain.com/graphql',
  
  // WebSocket Server (Python) - Puerto 8080
  websocketUrl: 'https://your-production-domain.com',
  
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
