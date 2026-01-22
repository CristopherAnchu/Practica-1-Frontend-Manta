# UNIFIT - Script de Inicio Completo (Extensión Segundo Parcial)
# Este script inicia todos los servicios de UNIFIT incluyendo los 4 nuevos pilares

Write-Host "UNIFIT - Iniciando Sistema Completo..." -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Función para verificar si un puerto está en uso
function Test-Port {
    param([int]$Port)
    $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    return $null -ne $connection
}

# Función para iniciar servicio en nueva ventana PowerShell
function Start-LocalService {
    param(
        [string]$Name,
        [string]$Path,
        [string]$Command,
        [int]$Port
    )
    
    Write-Host "Iniciando $Name en puerto $Port..." -ForegroundColor Yellow
    
    if (Test-Port $Port) {
        Write-Host "   Puerto $Port ya está en uso. Omitiendo..." -ForegroundColor Red
        return
    }
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Path'; $Command; Write-Host 'Servicio finalizado' -ForegroundColor Red"
    Start-Sleep -Seconds 2
}

# Definir rutas base
$BASE_PATH = $PSScriptRoot

# ============================================
# 1. Infraestructura (PostgreSQL)
# ============================================
Write-Host ""
Write-Host "Paso 1: Verificando Infraestructura..." -ForegroundColor Green

# PostgreSQL ya está en Neon Cloud (no requiere inicio local)
Write-Host "   PostgreSQL: Neon Cloud (ep-blue-lab-adyjs4fj-pooler.c-2.us-east-1.aws.neon.tech)" -ForegroundColor Green

Start-Sleep -Seconds 2

# ============================================
# 2. Pilares del Segundo Parcial
# ============================================
Write-Host ""
Write-Host "Paso 2: Iniciando Pilares del Segundo Parcial..." -ForegroundColor Green

# PILAR 1: Auth Service (Puerto 3001)
Start-LocalService -Name "Auth Service (Pilar 1)" `
              -Path "$BASE_PATH\auth-service" `
              -Command "npm run start:dev" `
              -Port 3001

# PILAR 2: Payment Service (Puerto 3002)
Start-LocalService -Name "Payment Service (Pilar 2)" `
              -Path "$BASE_PATH\payment-service" `
              -Command "npm run start:dev" `
              -Port 3002

# PILAR 3: AI Orchestrator (Puerto 3003)
Start-LocalService -Name "AI Orchestrator (Pilar 3)" `
              -Path "$BASE_PATH\ai-orchestrator" `
              -Command "uvicorn main:app --reload" `
              -Port 3003

# PILAR 4: n8n (Puerto 5678)
Write-Host "Iniciando n8n (Pilar 4) [DOCKER] en puerto 5678..." -ForegroundColor Yellow
if (-not (Test-Port 5678)) {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "docker-compose up n8n; Write-Host 'n8n finalizado' -ForegroundColor Red"
    Start-Sleep -Seconds 2
}
else {
    Write-Host "   Puerto 5678 ya está en uso. Omitiendo..." -ForegroundColor Red
}

Start-Sleep -Seconds 5

# ============================================
# 3. Servicios del Primer Parcial
# ============================================
Write-Host ""
Write-Host "Paso 3: Iniciando Servicios del Primer Parcial..." -ForegroundColor Green

# REST API Golang (Puerto 3000)
Start-LocalService -Name "REST API (Golang)" `
              -Path "$BASE_PATH\RestGolang" `
              -Command "go run main.go" `
              -Port 3000

# GraphQL API NestJS (Puerto 4000)
Start-LocalService -Name "GraphQL API (NestJS)" `
              -Path "$BASE_PATH\graphql" `
              -Command "npm run start:dev" `
              -Port 4000

# WebSocket Server Python (Puerto 8080)
Start-LocalService -Name "WebSocket Server (Python)" `
              -Path "$BASE_PATH\websocket-server" `
              -Command "`$env:PORT=8080; python main.py" `
              -Port 8080

Start-Sleep -Seconds 5

# ============================================
# 4. Frontend Angular
# ============================================
Write-Host ""
Write-Host "Paso 4: Iniciando Frontend Angular..." -ForegroundColor Green

Start-LocalService -Name "Frontend Angular" `
              -Path "$BASE_PATH\gym-uleam" `
              -Command "ng serve" `
              -Port 4200

# ============================================
# Resumen
# ============================================
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "UNIFIT - Sistema Iniciado Correctamente" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "ESTADO DE LOS SERVICIOS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "PILAR 1 - Auth Service:" -ForegroundColor Magenta
Write-Host "   http://localhost:3001" -ForegroundColor White
Write-Host "   Endpoints: /auth/login, /auth/register, /auth/refresh" -ForegroundColor Gray
Write-Host ""

Write-Host "PILAR 2 - Payment Service:" -ForegroundColor Magenta
Write-Host "   http://localhost:3002" -ForegroundColor White
Write-Host "   Endpoints: /payments, /partners/register, /webhook" -ForegroundColor Gray
Write-Host ""

Write-Host "PILAR 3 - AI Orchestrator:" -ForegroundColor Magenta
Write-Host "   http://localhost:3003" -ForegroundColor White
Write-Host "   Endpoints: /chat, /chat/multimodal, /tools" -ForegroundColor Gray
Write-Host ""

Write-Host "PILAR 4 - n8n Event Bus:" -ForegroundColor Magenta
Write-Host "   http://localhost:5678" -ForegroundColor White
Write-Host "   Credenciales: admin / unifit2026" -ForegroundColor Gray
Write-Host ""

Write-Host "SERVICIOS BASE:" -ForegroundColor Cyan
Write-Host "   REST API (Golang):  http://localhost:3000" -ForegroundColor White
Write-Host "   GraphQL:            http://localhost:4000/graphql" -ForegroundColor White
Write-Host "   WebSocket:          ws://localhost:8080" -ForegroundColor White
Write-Host "   Frontend:           http://localhost:4200" -ForegroundColor White
Write-Host ""

Write-Host "DOCUMENTACIÓN:" -ForegroundColor Yellow
Write-Host "   README Principal:   .\README.md" -ForegroundColor White
Write-Host "   Auth Service:       .\auth-service\README.md" -ForegroundColor White
Write-Host "   Payment Service:    .\payment-service\README.md" -ForegroundColor White
Write-Host "   AI Orchestrator:    .\ai-orchestrator\README.md" -ForegroundColor White
Write-Host "   n8n Workflows:      .\n8n-workflows\README.md" -ForegroundColor White
Write-Host ""

Write-Host "TESTING RÁPIDO:" -ForegroundColor Yellow
Write-Host "   # Probar Auth Service" -ForegroundColor Gray
Write-Host '   Invoke-RestMethod -Method POST -Uri "http://localhost:3001/auth/register" -Body (@{email="test@unifit.com"; password="Test1234!"; nombre="Usuario Test"} | ConvertTo-Json) -ContentType "application/json"' -ForegroundColor DarkGray
Write-Host ""
Write-Host "   # Probar AI Orchestrator" -ForegroundColor Gray
Write-Host '   Invoke-RestMethod -Method POST -Uri "http://localhost:3003/chat" -Body (@{message="Hola, ¿cuántas reservas tengo?"; userId="123"} | ConvertTo-Json) -ContentType "application/json"' -ForegroundColor DarkGray
Write-Host ""

Write-Host "ALTERNATIVA DOCKER:" -ForegroundColor Yellow
Write-Host "   docker-compose up -d" -ForegroundColor White
Write-Host ""

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "💡 Presiona Ctrl+C en cada ventana para detener servicios individuales" -ForegroundColor Gray
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Mantener esta ventana abierta
Write-Host "Esta ventana mostrará el estado general. No la cierres." -ForegroundColor Yellow
Write-Host "Presiona Enter para finalizar todos los servicios..." -ForegroundColor Red
Read-Host
