# 🏋️ UniFit - Sistema de Gestión de Gimnasio

Sistema completo de gestión para gimnasios universitarios con backend GraphQL y frontend Angular.

---

## 🚀 Inicio Rápido

### Backend GraphQL
```powershell
cd graphql
npm install
npm run start:dev
```
**URL:** http://localhost:4000/graphql

### Frontend Angular
```powershell
cd gym-uleam
npm install
ng serve
```
**URL:** http://localhost:4200  
**Dashboard GraphQL:** http://localhost:4200/dashboard-graphql

---

## 📦 Tecnologías

**Backend:** NestJS 10 • Apollo Server • TypeORM • SQLite • GraphQL  
**Frontend:** Angular 20 • Apollo Client • Bootstrap 5 • TypeScript

---

## 🗂️ Estructura

```
UNIFIT/
├── graphql/              # Backend NestJS + GraphQL
│   ├── src/
│   │   ├── entities/     # Usuario, Rol, Rutina, Reserva
│   │   ├── services/     # Lógica de negocio
│   │   ├── resolvers/    # GraphQL resolvers
│   │   └── modules/      # Módulos NestJS
│   └── gym.db           # Base de datos SQLite
│
└── gym-uleam/           # Frontend Angular
    ├── src/app/
    │   ├── graphql/      # Queries y tipos GraphQL
    │   ├── services/     # graphql.service.ts
    │   └── pages/        # dashboard-graphql/
    └── package.json
```

---

## 📊 Características

### Backend GraphQL
- 4 entidades (Usuario, Rol, Rutina, Reserva)
- 20+ queries y 10+ mutations
- 8 tipos de reportes complejos
- Seed data automático (30 usuarios, 10 rutinas, 30 reservas)
- GraphQL Playground habilitado

### Frontend Angular
- Integración con Apollo Client
- Dashboard con estadísticas en tiempo real
- Componentes standalone
- Servicios tipados
- Diseño responsive

---

## 📝 Queries GraphQL

### Obtener Usuarios
```graphql
query {
  usuarios { id, nombre, correo }
}
```

### Dashboard Completo
```graphql
query {
  estadisticas: estadisticasReservas {
    totalReservas
    porcentajeAsistencia
  }
  topRutinas: rutinasPopulares(limite: 5) {
    nombreRutina
    totalReservas
  }
}
```

### Crear Reserva
```graphql
mutation {
  crearReserva(input: {
    usuarioId: 1
    rutinaId: 1
    fechaReserva: "2025-06-15"
    horaInicio: "08:00"
    horaFin: "09:00"
  }) {
    id
    estado
  }
}
```

---

## 🎯 Dashboard

El dashboard muestra:
- **Estadísticas generales:** Total reservas, % asistencia, calificación promedio
- **Top 5 rutinas populares:** Con ocupación y ratings
- **Top 5 usuarios activos:** Con estadísticas de asistencia
- **Reporte de ocupación:** Disponibilidad en tiempo real

---

## 🔧 Comandos

### Desarrollo
```powershell
# Backend
cd graphql && npm run start:dev

# Frontend
cd gym-uleam && ng serve
```

### Build Producción
```powershell
# Backend
cd graphql && npm run build

# Frontend
cd gym-uleam && ng build
```

---

## 🗄️ Base de Datos

**Tipo:** SQLite • **Archivo:** `graphql/gym.db`

**Tablas:** usuario (30) • rol (3) • rutina (10) • reserva (30)

**Resetear:**
```powershell
cd graphql
Remove-Item gym.db
npm run start:dev
```

---

## 📚 Documentación

- `GRAPHQL-INTEGRATION.md` - Guía completa de integración
- `COMANDOS-RAPIDOS.md` - Referencia rápida
- `FLUJO-DE-DATOS.md` - Arquitectura y diagramas
- `graphql/` - Documentación backend (6 archivos)

---

## ⚠️ Solución de Problemas

**Backend no conecta:** `cd graphql && npm install && npm run start:dev`  
**CORS error:** Ya configurado en `main.ts`  
**No hay datos:** Seed data automático al iniciar

---

## 🔐 Puertos

| Servicio | Puerto | URL |
|----------|--------|-----|
| Backend GraphQL | 4000 | http://localhost:4000/graphql |
| Frontend Angular | 4200 | http://localhost:4200 |
| Dashboard | 4200 | http://localhost:4200/dashboard-graphql |

---

---

## 👥 Componentes Adicionales

### Servicio REST

**Ubicación:** `UNIFIT/rest/`  
**Propósito:** API REST para operaciones CRUD básicas  
**Documentación:** Ver `rest/README.md`

### Servicio WebSocket (Python)

**Ubicación:** `UNIFIT/websocket-server/`  
**Propósito:** Comunicación en tiempo real con Socket.IO  
**Puerto:** 5000  
**Tecnología:** Python + Socket.IO + Aiohttp

**Iniciar servidor:**
```powershell
cd websocket-server
pip install -r requirements.txt
python server.py
```

**Dashboard en tiempo real:**
http://localhost:4200/dashboard-realtime

**Documentación completa:** `WEBSOCKET-INTEGRATION.md`

---

**¡Sistema completo y listo para usar!** 🚀

**Última actualización:** 16 de noviembre de 2025 • **Versión:** 1.0.0
