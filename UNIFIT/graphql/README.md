# Servicio GraphQL - UniFit

## 📋 Descripción

Servicio GraphQL para el sistema UniFit que proporciona **reportes y consultas complejas** sobre usuarios, reservas, rutinas y roles del gimnasio universitario.

Este servicio forma parte de una arquitectura distribuida que incluye servicios REST, WebSockets y un frontend interactivo.

## 🏗️ Arquitectura

- **Framework**: NestJS + Apollo Server
- **Lenguaje**: TypeScript
- **Base de Datos**: SQLite con TypeORM
- **GraphQL**: Schema-first approach con decoradores
- **Patrón**: Code-first GraphQL con tipos TypeScript

### Estructura del Proyecto

```
graphql/
├── src/
│   ├── entities/           # Entidades TypeORM con decoradores GraphQL
│   │   ├── usuario.entity.ts
│   │   ├── rol.entity.ts
│   │   ├── rutina.entity.ts
│   │   └── reserva.entity.ts
│   ├── dto/                # Input Types y Object Types para GraphQL
│   │   ├── usuario.input.ts
│   │   ├── rol.input.ts
│   │   ├── rutina.input.ts
│   │   ├── reserva.input.ts
│   │   └── reportes.types.ts
│   ├── services/           # Lógica de negocio y acceso a datos
│   │   ├── usuario.service.ts
│   │   ├── rol.service.ts
│   │   ├── rutina.service.ts
│   │   └── reserva.service.ts
│   ├── resolvers/          # Resolvers GraphQL (Queries y Mutations)
│   │   ├── usuario.resolver.ts
│   │   ├── rol.resolver.ts
│   │   ├── rutina.resolver.ts
│   │   └── reserva.resolver.ts
│   ├── modules/            # Módulos NestJS
│   │   ├── usuario.module.ts
│   │   ├── rol.module.ts
│   │   ├── rutina.module.ts
│   │   └── reserva.module.ts
│   ├── app.module.ts       # Módulo principal
│   ├── main.ts             # Punto de entrada
│   └── data-source.ts      # Configuración TypeORM
├── package.json
├── tsconfig.json
├── nest-cli.json
└── README.md
```

## 🚀 Instalación y Ejecución

### Prerrequisitos

- Node.js >= 18.x
- npm o yarn

### Instalación

```bash
cd UNIFIT/graphql
npm install
```

### Ejecución en Desarrollo

```bash
npm run start:dev
```

El servidor estará disponible en:
- **GraphQL Endpoint**: http://localhost:4000/graphql
- **Apollo Playground**: http://localhost:4000/graphql

### Ejecución en Producción

```bash
npm run build
npm run start:prod
```

## 📊 Schema GraphQL

### Queries Principales

#### Usuarios

```graphql
# Obtener todos los usuarios con filtros
query {
  usuarios(filter: { tipo: "estudiante", activo: true }) {
    id
    nombre
    correo
    tipo
    rol {
      nombre
    }
  }
}

# Obtener un usuario específico
query {
  usuario(id: 1) {
    id
    nombre
    correo
    reservas {
      id
      fecha
      estado
    }
  }
}

# Usuarios más activos
query {
  usuariosActivos(limite: 10) {
    usuarioId
    nombreUsuario
    totalReservas
    reservasCompletadas
    porcentajeAsistencia
  }
}

# Resumen completo de un usuario
query {
  resumenUsuario(usuarioId: 1) {
    nombre
    totalReservas
    reservasProximas
    reservasCompletadas
    calificacionPromedio
    ultimaReserva
  }
}
```

#### Rutinas

```graphql
# Obtener todas las rutinas
query {
  rutinas(filter: { activa: true, nivel: "intermedio" }) {
    id
    nombre
    descripcion
    cupoMaximo
    instructor
    nivel
    calificacionPromedio
  }
}

# Rutinas más populares
query {
  rutinasPopulares(limite: 5) {
    rutinaId
    nombreRutina
    totalReservas
    ocupacionPromedio
    calificacionPromedio
  }
}
```

#### Reservas

```graphql
# Obtener reservas con filtros
query {
  reservas(filter: { 
    estado: "activa", 
    fechaInicio: "2025-01-01", 
    fechaFin: "2025-12-31" 
  }) {
    id
    fecha
    estado
    usuario {
      nombre
    }
    rutina {
      nombre
    }
  }
}

# Estadísticas de reservas
query {
  estadisticasReservas(
    fechaInicio: "2025-01-01", 
    fechaFin: "2025-12-31"
  ) {
    totalReservas
    reservasActivas
    reservasCanceladas
    reservasFinalizadas
    porcentajeAsistencia
    calificacionPromedio
  }
}

# Tendencias de reservas por día
query {
  tendenciasReservas(
    fechaInicio: "2025-01-01", 
    fechaFin: "2025-01-31"
  ) {
    fecha
    totalReservas
    reservasCreadas
    reservasCanceladas
    reservasCompletadas
  }
}

# Reporte de ocupación
query {
  reporteOcupacion(fecha: "2025-11-16") {
    rutinaId
    nombreRutina
    fecha
    reservasActivas
    cupoMaximo
    porcentajeOcupacion
    cuposDisponibles
  }
}
```

#### Roles

```graphql
query {
  roles {
    id
    nombre
    descripcion
    permisos
    usuarios {
      nombre
    }
  }
}
```

### Mutations Principales

#### Crear Entidades

```graphql
# Crear usuario
mutation {
  crearUsuario(input: {
    nombre: "Juan Pérez"
    correo: "juan@unifit.com"
    tipo: "estudiante"
    telefono: "0987654321"
    cedula: "1234567890"
    rolId: 1
  }) {
    id
    nombre
    correo
  }
}

# Crear rutina
mutation {
  crearRutina(input: {
    nombre: "Yoga Matutino"
    descripcion: "Sesión de yoga para principiantes"
    cupoMaximo: 20
    duracionMinutos: 60
    instructor: "María García"
    nivel: "principiante"
  }) {
    id
    nombre
  }
}

# Crear reserva
mutation {
  crearReserva(input: {
    fecha: "2025-11-20T10:00:00"
    usuarioId: 1
    rutinaId: 1
    observaciones: "Primera clase"
  }) {
    id
    fecha
    estado
  }
}

# Crear rol
mutation {
  crearRol(input: {
    nombre: "Estudiante"
    descripcion: "Usuario estudiante regular"
    permisos: ["ver_rutinas", "crear_reservas"]
  }) {
    id
    nombre
  }
}
```

#### Actualizar Entidades

```graphql
# Actualizar reserva
mutation {
  actualizarReserva(id: 1, input: {
    estado: "finalizada"
    asistio: true
    calificacion: 5
  }) {
    id
    estado
    calificacion
  }
}

# Actualizar calificación de rutina
mutation {
  actualizarCalificacionRutina(id: 1) {
    id
    nombre
    calificacionPromedio
  }
}
```

#### Eliminar Entidades

```graphql
mutation {
  eliminarReserva(id: 1)
}

mutation {
  eliminarUsuario(id: 1)
}
```

## 🔍 Reportes y Consultas Complejas

El servicio GraphQL se especializa en proporcionar reportes avanzados:

### 1. Estadísticas de Reservas
- Total de reservas por período
- Porcentaje de asistencia
- Calificación promedio del sistema
- Distribución por estados

### 2. Análisis de Ocupación
- Ocupación en tiempo real por rutina
- Cupos disponibles
- Porcentajes de ocupación
- Predicción de demanda

### 3. Usuarios Activos
- Ranking de usuarios por actividad
- Porcentaje de asistencia individual
- Historial de reservas
- Resúmenes personalizados

### 4. Rutinas Populares
- Ranking por número de reservas
- Calificaciones promedio
- Análisis de capacidad
- Tendencias de uso

### 5. Tendencias Temporales
- Evolución de reservas por día
- Patrones de cancelación
- Horarios más demandados

## 🛠️ Tecnologías Utilizadas

- **NestJS**: Framework progresivo de Node.js
- **Apollo Server**: Servidor GraphQL
- **TypeORM**: ORM para TypeScript
- **GraphQL**: Lenguaje de consulta
- **SQLite**: Base de datos ligera
- **Class Validator**: Validación de inputs
- **Class Transformer**: Transformación de objetos

## 📚 Referencias Arquitectónicas

### GraphQL
- [GraphQL Official Documentation](https://graphql.org/learn/)
- [Apollo Server Documentation](https://www.apollographql.com/docs/apollo-server/)
- [NestJS GraphQL](https://docs.nestjs.com/graphql/quick-start)

### TypeORM
- [TypeORM Documentation](https://typeorm.io/)
- [TypeORM Relations Guide](https://typeorm.io/relations)

### Patrones de Diseño
- **Code-First GraphQL**: Definir esquema usando TypeScript decoradores
- **Repository Pattern**: Abstracción de acceso a datos
- **Service Layer**: Lógica de negocio separada
- **Dependency Injection**: Inyección de dependencias con NestJS

## 🔐 Validaciones

El servicio incluye validaciones automáticas:
- Email válido para usuarios
- Rangos de calificación (1-5)
- Capacidad mínima de rutinas
- Estados válidos de reservas
- Fechas coherentes

## 🚦 Manejo de Errores

Errores estandarizados:
- `NotFoundException`: Entidad no encontrada
- `ConflictException`: Conflicto de unicidad
- Validación de inputs con mensajes descriptivos
- Errores GraphQL con códigos específicos

## 📈 Mejoras Futuras

- [ ] Implementar paginación en queries grandes
- [ ] Agregar subscriptions para actualizaciones en tiempo real
- [ ] Implementar cache con DataLoader
- [ ] Agregar autenticación y autorización con JWT
- [ ] Implementar rate limiting
- [ ] Agregar más reportes estadísticos
- [ ] Implementar migraciones de base de datos
- [ ] Agregar tests unitarios y e2e
- [ ] Documentación interactiva mejorada
- [ ] Optimización de queries N+1

## 👥 Equipo de Desarrollo

Proyecto desarrollado como parte de la asignatura de Desarrollo de Software.

**Grupo**: [Nombre del Grupo]
**Integrante TypeScript**: [Nombre]

## 📝 Licencia

MIT License - Proyecto Académico UniFit 2025
