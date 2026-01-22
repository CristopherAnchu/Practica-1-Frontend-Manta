# ======================================================
# UNIFIT - Script de Inicio Automatico de Servicios
# ======================================================
# Este script inicia todos los servicios del sistema UNIFIT
# en terminales separadas de PowerShell
# ======================================================

Write-Host ''
Write-Host '=================================================' -ForegroundColor Cyan
Write-Host 'UNIFIT - Sistema de Gestion de Gimnasio' -ForegroundColor Green
Write-Host '=================================================' -ForegroundColor Cyan
Write-Host ''

# Obtener directorio actual
$rootPath = Get-Location

Write-Host "Directorio raiz: $rootPath" -ForegroundColor Yellow
Write-Host ''

# ======================================================
# 1. REST API (Golang) - Puerto 3000
# ======================================================
Write-Host 'Iniciando REST API (Golang)...' -ForegroundColor Blue
$restPath = Join-Path $rootPath 'RestGolang'

if (Test-Path $restPath) {
    Start-Process powershell -ArgumentList @(
        '-NoExit',
        '-Command',
        "cd '$restPath'; Write-Host 'REST API (Golang) - Puerto 3000' -ForegroundColor Green; go run main.go"
    )
    Write-Host '   Terminal REST API abierta' -ForegroundColor Green
} else {
    Write-Host '   No se encontro la carpeta RestGolang' -ForegroundColor Red
}

Start-Sleep -Seconds 2

# ======================================================
# 2. GraphQL API (NestJS) - Puerto 4000
# ======================================================
Write-Host 'Iniciando GraphQL API (NestJS)...' -ForegroundColor Green
$graphqlPath = Join-Path $rootPath 'graphql'

if (Test-Path $graphqlPath) {
    Start-Process powershell -ArgumentList @(
        '-NoExit',
        '-Command',
        "cd '$graphqlPath'; Write-Host 'GraphQL API (NestJS) - Puerto 4000' -ForegroundColor Green; npm run start:dev"
    )
    Write-Host '   Terminal GraphQL API abierta' -ForegroundColor Green
} else {
    Write-Host '   No se encontro la carpeta graphql' -ForegroundColor Red
}

Start-Sleep -Seconds 2

# ======================================================
# 3. WebSocket Server (Python) - Puerto 8080
# ======================================================
Write-Host 'Iniciando WebSocket Server (Python)...' -ForegroundColor Yellow
$websocketPath = Join-Path $rootPath 'websocket-server'
$venvPath = Join-Path $websocketPath 'venv\Scripts\Activate.ps1'

if (Test-Path $websocketPath) {
    if (Test-Path $venvPath) {
        Start-Process powershell -ArgumentList @(
            '-NoExit',
            '-Command',
            "cd '$websocketPath'; Write-Host 'WebSocket Server (Python) - Puerto 8080' -ForegroundColor Green; & '$venvPath'; python server.py"
        )
        Write-Host '   Terminal WebSocket Server abierta' -ForegroundColor Green
    } else {
        Write-Host '   Entorno virtual no encontrado. Intentando sin venv...' -ForegroundColor Yellow
        Start-Process powershell -ArgumentList @(
            '-NoExit',
            '-Command',
            "cd '$websocketPath'; Write-Host 'WebSocket Server (Python) - Puerto 8080' -ForegroundColor Green; python server.py"
        )
    }
} else {
    Write-Host '   No se encontro la carpeta websocket-server' -ForegroundColor Red
}

Start-Sleep -Seconds 2

# ======================================================
# 4. Webhook Service (NodeJS) - Puerto 3005
# ======================================================
Write-Host 'Iniciando Webhook Service (NodeJS)...' -ForegroundColor Magenta
$webhookPath = Join-Path $rootPath 'webhook-service'

if (Test-Path $webhookPath) {
    Start-Process powershell -ArgumentList @(
        '-NoExit',
        '-Command',
        "cd '$webhookPath'; Write-Host 'Webhook Service (NodeJS) - Puerto 3005' -ForegroundColor Green; npm start"
    )
    Write-Host '   Terminal Webhook Service abierta' -ForegroundColor Green
} else {
    Write-Host '   No se encontro la carpeta webhook-service' -ForegroundColor Red
}

Start-Sleep -Seconds 2

# ======================================================
# 5. Frontend (Angular) - Puerto 4200
# ======================================================
Write-Host 'Iniciando Frontend (Angular)...' -ForegroundColor Red
$frontendPath = Join-Path $rootPath 'gym-uleam'

if (Test-Path $frontendPath) {
    Start-Process powershell -ArgumentList @(
        '-NoExit',
        '-Command',
        "cd '$frontendPath'; Write-Host 'Frontend (Angular) - Puerto 4200' -ForegroundColor Green; ng serve --open"
    )
    Write-Host '   Terminal Frontend abierta' -ForegroundColor Green
} else {
    Write-Host '   No se encontro la carpeta gym-uleam' -ForegroundColor Red
}

# ======================================================
# Resumen
# ======================================================
Write-Host ''
Write-Host '=================================================' -ForegroundColor Cyan
Write-Host 'Todos los servicios han sido iniciados!' -ForegroundColor Green
Write-Host '=================================================' -ForegroundColor Cyan
Write-Host ''
Write-Host 'URLs de los servicios:' -ForegroundColor Yellow
Write-Host '   REST API (Golang):      http://localhost:3000' -ForegroundColor Cyan
Write-Host '   GraphQL API (NestJS):   http://localhost:4000/graphql' -ForegroundColor Cyan
Write-Host '   WebSocket Server:       http://localhost:8080' -ForegroundColor Cyan
Write-Host '   Webhook Service:        http://localhost:3005' -ForegroundColor Cyan
Write-Host '   Frontend (Angular):     http://localhost:4200' -ForegroundColor Cyan
Write-Host ''
Write-Host 'Espera aproximadamente 30-60 segundos para que todos los servicios esten listos' -ForegroundColor Yellow
Write-Host ''
Write-Host 'Verificaciones:' -ForegroundColor Yellow
Write-Host '   REST API Health:     http://localhost:3000' -ForegroundColor White
Write-Host '   GraphQL Playground:  http://localhost:4000/graphql' -ForegroundColor White
Write-Host '   WebSocket Health:    http://localhost:8080/health' -ForegroundColor White
Write-Host '   Webhook Health:      http://localhost:3005/health' -ForegroundColor White
Write-Host '   Frontend UI:         http://localhost:4200' -ForegroundColor White
Write-Host ''
Write-Host 'Presiona Ctrl+C en cada terminal para detener los servicios' -ForegroundColor Magenta
Write-Host ''
Write-Host '=================================================' -ForegroundColor Cyan
Write-Host ''

# Pausa final
Read-Host 'Presiona Enter para cerrar esta ventana'
