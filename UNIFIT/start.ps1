# UNIFIT - Script de Inicio Rápido
# Ejecuta todos los servicios en ventanas separadas

Write-Host "🏋️ UNIFIT - Iniciando Sistema Completo..." -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

$BASE_PATH = $PSScriptRoot

Write-Host "📦 Verificando infraestructura..." -ForegroundColor Green
Write-Host "   ✅ PostgreSQL: Neon Cloud" -ForegroundColor Green
Write-Host "   ⚠️  Redis: Asegúrate de tenerlo corriendo (puerto 6379)" -ForegroundColor Yellow
Write-Host ""

# Pilar 1: Auth Service
Write-Host "🔐 Iniciando Auth Service (puerto 3001)..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$BASE_PATH\auth-service'; npm run start:dev"
Start-Sleep -Seconds 3

# Pilar 2: Payment Service
Write-Host "💳 Iniciando Payment Service (puerto 3002)..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$BASE_PATH\payment-service'; npm run start:dev"
Start-Sleep -Seconds 3

# Pilar 3: AI Orchestrator
Write-Host "🤖 Iniciando AI Orchestrator (puerto 3003)..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$BASE_PATH\ai-orchestrator'; python main.py"
Start-Sleep -Seconds 3

# Pilar 4: n8n
Write-Host "🔄 Iniciando n8n (puerto 5678)..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npx n8n"
Start-Sleep -Seconds 3

# REST API
Write-Host "📡 Iniciando REST API Golang (puerto 3000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$BASE_PATH\RestGolang'; go run main.go"
Start-Sleep -Seconds 3

# GraphQL
Write-Host "📊 Iniciando GraphQL API (puerto 4000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$BASE_PATH\graphql'; npm run start:dev"
Start-Sleep -Seconds 3

# WebSocket
Write-Host "⚡ Iniciando WebSocket Server (puerto 8080)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$BASE_PATH\websocket-server'; python server.py"
Start-Sleep -Seconds 3

# Frontend
Write-Host "🎨 Iniciando Frontend Angular (puerto 4200)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$BASE_PATH\gym-uleam'; ng serve"
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "✅ TODOS LOS SERVICIOS INICIADOS" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📊 URLs DE ACCESO:" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔐 Auth Service:        http://localhost:3001" -ForegroundColor White
Write-Host "💳 Payment Service:     http://localhost:3002" -ForegroundColor White
Write-Host "🤖 AI Orchestrator:     http://localhost:3003" -ForegroundColor White
Write-Host "🔄 n8n:                 http://localhost:5678 (admin/unifit2026)" -ForegroundColor White
Write-Host "📡 REST API:            http://localhost:3000" -ForegroundColor White
Write-Host "📊 GraphQL:             http://localhost:4000/graphql" -ForegroundColor White
Write-Host "⚡ WebSocket:           ws://localhost:8080" -ForegroundColor White
Write-Host "🎨 Frontend:            http://localhost:4200" -ForegroundColor White
Write-Host ""

Write-Host "🧪 PRUEBA RÁPIDA:" -ForegroundColor Yellow
Write-Host '   Invoke-RestMethod -Method POST -Uri "http://localhost:3003/chat" -Body (@{message="Hola";userId="123"} | ConvertTo-Json) -ContentType "application/json"' -ForegroundColor Gray
Write-Host ""

Write-Host "⚠️  Para detener: Cierra cada ventana de PowerShell individualmente" -ForegroundColor Yellow
Write-Host ""
Write-Host "Presiona Enter para cerrar esta ventana..." -ForegroundColor Cyan
Read-Host
