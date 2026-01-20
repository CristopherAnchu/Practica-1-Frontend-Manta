# 🔐 Auth Service - UNIFIT

Microservicio independiente de autenticación centralizada con JWT, refresh tokens y validación local.

## 📋 Características

- ✅ Autenticación con JWT (access + refresh tokens)
- ✅ Validación local de tokens (sin consultar Auth Service en cada request)
- ✅ Base de datos propia (PostgreSQL)
- ✅ Blacklist de tokens revocados (Redis)
- ✅ Rate limiting en endpoints de autenticación
- ✅ Hash seguro de contraseñas (bcrypt)
- ✅ Refresh token rotation
- ✅ Endpoints protegidos y públicos

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────┐
│         Auth Service (NestJS)           │
│              Puerto 3001                │
├─────────────────────────────────────────┤
│  Endpoints:                             │
│  • POST /auth/register                  │
│  • POST /auth/login                     │
│  • POST /auth/logout                    │
│  • POST /auth/refresh                   │
│  • GET  /auth/me                        │
│  • GET  /auth/validate (interno)        │
├─────────────────────────────────────────┤
│  Componentes:                           │
│  • JWT Strategy (Passport)              │
│  • Refresh Strategy                     │
│  • Rate Limiting (Throttler)            │
│  • Token Blacklist (Redis)              │
└─────────────────────────────────────────┘
         ↓                    ↓
   PostgreSQL              Redis
   (Usuarios,           (Blacklist)
    Tokens)
```

## 🚀 Instalación

```bash
cd auth-service
npm install
```

## ⚙️ Configuración

1. Copiar `.env.example` a `.env`
2. Configurar variables de entorno
3. Asegurarse de que PostgreSQL y Redis estén corriendo

## 🎯 Ejecución

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

El servicio estará disponible en: **http://localhost:3001**

## 📡 Endpoints

### POST /auth/register
Registra un nuevo usuario.

**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "Password123!",
  "nombre": "Juan Pérez",
  "tipo": "USUARIO_FINAL"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "usuario@example.com",
    "nombre": "Juan Pérez",
    "tipo": "USUARIO_FINAL",
    "rol": "USUARIO"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### POST /auth/login
Inicia sesión y obtiene tokens.

**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "usuario@example.com",
    "nombre": "Juan Pérez"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### POST /auth/refresh
Renueva el access token usando el refresh token.

**Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### POST /auth/logout
Invalida el refresh token actual.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

### GET /auth/me
Obtiene información del usuario autenticado.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:**
```json
{
  "id": "uuid",
  "email": "usuario@example.com",
  "nombre": "Juan Pérez",
  "tipo": "USUARIO_FINAL",
  "rol": "USUARIO"
}
```

### GET /auth/validate (Interno)
Valida un token y retorna los datos del usuario. Usado por otros microservicios.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:**
```json
{
  "valid": true,
  "user": {
    "id": "uuid",
    "email": "usuario@example.com",
    "rol": "USUARIO"
  }
}
```

## 🔒 Validación Local de Tokens

Los demás servicios NO necesitan llamar al Auth Service en cada request. Pueden validar tokens localmente:

1. Verificar la firma JWT usando la clave pública
2. Verificar que no haya expirado
3. (Opcional) Verificar contra blacklist en Redis

## 🛡️ Seguridad

- **Bcrypt** para hash de contraseñas (10 rounds)
- **Rate Limiting**: 10 intentos por minuto en login/register
- **Token Blacklist**: Tokens revocados se almacenan en Redis
- **Refresh Token Rotation**: Se genera nuevo refresh token en cada renovación
- **CORS**: Configurado solo para frontend autorizado

## 📊 Base de Datos

### Tabla: users
```sql
- id (UUID, PK)
- email (VARCHAR, UNIQUE)
- password (VARCHAR, hashed)
- nombre (VARCHAR)
- tipo (ENUM: ADMINISTRADOR, USUARIO_FINAL)
- rol (ENUM: ADMINISTRADOR, USUARIO)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Tabla: refresh_tokens
```sql
- id (UUID, PK)
- token (TEXT)
- user_id (UUID, FK)
- expires_at (TIMESTAMP)
- created_at (TIMESTAMP)
- revoked (BOOLEAN)
```

## 🔄 Flujo de Autenticación

```
1. Usuario → POST /auth/login
2. Auth Service → Valida credenciales
3. Auth Service → Genera access token (15min) + refresh token (7 días)
4. Auth Service → Guarda refresh token en BD
5. Auth Service → Retorna ambos tokens
6. Cliente → Guarda tokens
7. Cliente → Usa access token en requests (Header: Authorization: Bearer <token>)
8. Otros Servicios → Validan token localmente (verifican firma + expiración)
9. Access token expira → Cliente → POST /auth/refresh
10. Auth Service → Valida refresh token → Genera nuevos tokens
```

## 🚫 Antipatrón Evitado

❌ **NO HACER**: Llamar al Auth Service en cada request
```
Frontend → API Gateway → Auth Service (validar token)
                       → Business Service
```

✅ **HACER**: Validación local de tokens
```
Frontend → API Gateway → Validar JWT localmente
                       → Business Service
```

## 📚 Referencias

- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OAuth 2.0 Token Refresh](https://oauth.net/2/grant-types/refresh-token/)
- [NestJS JWT](https://docs.nestjs.com/security/authentication)
