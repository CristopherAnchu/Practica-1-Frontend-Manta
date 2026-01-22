Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "Instalando dependencias para TODO el sistema..." -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

$root = Get-Location

# Función helper para instalar npm
function Install-Npm {
    param([string]$path)
    if (Test-Path $path) {
        Write-Host "`nProcesando $path..." -ForegroundColor Yellow
        Push-Location $path
        if (Test-Path "package.json") {
            Write-Host "   Instalando paquetes npm..."
            npm install
            if ($LASTEXITCODE -ne 0) { Write-Host "   Error instalando dependencias en $path" -ForegroundColor Red }
            else { Write-Host "   Dependencias instaladas." -ForegroundColor Green }
        } else {
            Write-Host "   No se encontro package.json en $path" -ForegroundColor DarkGray
        }
        Pop-Location
    } else {
        Write-Host "`nCarpeta '$path' no encontrada." -ForegroundColor Red
    }
}

# Función helper para Python
function Install-Python {
    param([string]$path)
    if (Test-Path $path) {
        Write-Host "`nProcesando $path..." -ForegroundColor Yellow
        Push-Location $path
        if (Test-Path "requirements.txt") {
            Write-Host "   Instalando requerimientos Python..."
            pip install -r requirements.txt
            if ($LASTEXITCODE -ne 0) { Write-Host "   Error instalando requerimientos en $path" -ForegroundColor Red }
            else { Write-Host "   Requerimientos instalados." -ForegroundColor Green }
        } else {
            Write-Host "   No se encontro requirements.txt en $path" -ForegroundColor DarkGray
        }
        Pop-Location
    } else {
        Write-Host "`nCarpeta '$path' no encontrada." -ForegroundColor Red
    }
}

# 1. Root (para scripts compartidos si los hay)
Write-Host "`n[1/8] Verificando dependencias en raiz..." -ForegroundColor Cyan
if (Test-Path "package.json") {
    Write-Host "   Instalando dependencias raiz..."
    npm install
}

# 2. Servicios Node.js (Backend & Frontend)
Write-Host "`n--- Servicios Node.js/NestJS/Angular ---" -ForegroundColor Cyan
Install-Npm "auth-service"
Install-Npm "payment-service"
Install-Npm "graphql"
Install-Npm "webhook-service"
Install-Npm "gym-uleam"

# 3. Servicios Python
Write-Host "`n--- Servicios Python ---" -ForegroundColor Cyan
Install-Python "websocket-server"
Install-Python "ai-orchestrator"

# 4. Servicios Go
Write-Host "`n--- Servicios Go ---" -ForegroundColor Cyan
if (Test-Path "RestGolang") {
    Write-Host "`nProcesando RestGolang..." -ForegroundColor Yellow
    Push-Location "RestGolang"
    Write-Host "   Ejecutando go mod download..."
    go mod download
    if ($LASTEXITCODE -ne 0) { Write-Host "   Error en go mod download" -ForegroundColor Red }
    else { Write-Host "   Modulos Go descargados." -ForegroundColor Green }
    Pop-Location
} else {
    Write-Host "`nCarpeta 'RestGolang' no encontrada." -ForegroundColor Red
}

Write-Host "`n=================================================" -ForegroundColor Green
Write-Host "Proceso de instalacion finalizado." -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
