Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "Instalando dependencias para todos los servicios..." -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

$root = Get-Location

# 1. GraphQL Service (NestJS)
Write-Host "`n[1/5] Instalando dependencias para GraphQL Service..." -ForegroundColor Yellow
if (Test-Path "graphql") {
    Push-Location "graphql"
    npm install
    if ($LASTEXITCODE -ne 0) { Write-Host "Error instalando dependencias en graphql" -ForegroundColor Red }
    Pop-Location
} else {
    Write-Host "Carpeta 'graphql' no encontrada." -ForegroundColor Red
}

# 2. Frontend (Angular)
Write-Host "`n[2/5] Instalando dependencias para Frontend (Gym Uleam)..." -ForegroundColor Yellow
if (Test-Path "gym-uleam") {
    Push-Location "gym-uleam"
    npm install
    if ($LASTEXITCODE -ne 0) { Write-Host "Error instalando dependencias en gym-uleam" -ForegroundColor Red }
    Pop-Location
} else {
    Write-Host "Carpeta 'gym-uleam' no encontrada." -ForegroundColor Red
}

# 3. Rest NestJS Service
Write-Host "`n[3/5] Instalando dependencias para Rest NestJS..." -ForegroundColor Yellow
if (Test-Path "rest-nestjs") {
    Push-Location "rest-nestjs"
    npm install
    if ($LASTEXITCODE -ne 0) { Write-Host "Error instalando dependencias en rest-nestjs" -ForegroundColor Red }
    Pop-Location
} else {
    Write-Host "Carpeta 'rest-nestjs' no encontrada." -ForegroundColor Red
}

# 4. Rest Golang Service
Write-Host "`n[4/5] Instalando dependencias para Rest Golang..." -ForegroundColor Yellow
if (Test-Path "RestGolang") {
    Push-Location "RestGolang"
    Write-Host "Ejecutando go mod download..."
    go mod download
    if ($LASTEXITCODE -ne 0) { Write-Host "Error descargando módulos en RestGolang" -ForegroundColor Red }
    Pop-Location
} else {
    Write-Host "Carpeta 'RestGolang' no encontrada." -ForegroundColor Red
}

# 5. WebSocket Server (Python)
Write-Host "`n[5/5] Instalando dependencias para WebSocket Server (Python)..." -ForegroundColor Yellow
if (Test-Path "websocket-server") {
    Push-Location "websocket-server"
    if (Test-Path "requirements.txt") {
        Write-Host "Instalando requerimientos con pip..."
        pip install -r requirements.txt
        if ($LASTEXITCODE -ne 0) { Write-Host "Error instalando requerimientos en websocket-server" -ForegroundColor Red }
    } else {
        Write-Host "Archivo requirements.txt no encontrado." -ForegroundColor Red
    }
    Pop-Location
} else {
    Write-Host "Carpeta 'websocket-server' no encontrada." -ForegroundColor Red
}

Write-Host "`n=================================================" -ForegroundColor Green
Write-Host "Proceso completado." -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
