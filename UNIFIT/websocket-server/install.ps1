# Script de instalación rápida para WebSocket Server

Write-Host "=" -NoNewline -ForegroundColor Cyan
Write-Host ("=" * 59) -ForegroundColor Cyan
Write-Host "  UniFit WebSocket Server - Instalación" -ForegroundColor White
Write-Host "=" -NoNewline -ForegroundColor Cyan
Write-Host ("=" * 59) -ForegroundColor Cyan
Write-Host ""

# Verificar Python
Write-Host "[1/4] Verificando Python..." -ForegroundColor Yellow
$pythonVersion = python --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  Python encontrado: $pythonVersion" -ForegroundColor Green
} else {
    Write-Host "  ERROR: Python no encontrado" -ForegroundColor Red
    Write-Host "  Por favor instala Python desde: https://www.python.org/downloads/" -ForegroundColor Red
    exit 1
}

# Verificar pip
Write-Host "[2/4] Verificando pip..." -ForegroundColor Yellow
$pipVersion = pip --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  pip encontrado: $pipVersion" -ForegroundColor Green
} else {
    Write-Host "  ERROR: pip no encontrado" -ForegroundColor Red
    exit 1
}

# Instalar dependencias
Write-Host "[3/4] Instalando dependencias..." -ForegroundColor Yellow
pip install -r requirements.txt
if ($LASTEXITCODE -eq 0) {
    Write-Host "  Dependencias instaladas correctamente" -ForegroundColor Green
} else {
    Write-Host "  ERROR: Fallo al instalar dependencias" -ForegroundColor Red
    exit 1
}

# Verificar instalación
Write-Host "[4/4] Verificando instalación..." -ForegroundColor Yellow
$packages = @("python-socketio", "aiohttp", "python-dotenv")
$allInstalled = $true

foreach ($package in $packages) {
    $installed = pip show $package 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  $package - OK" -ForegroundColor Green
    } else {
        Write-Host "  $package - FALTA" -ForegroundColor Red
        $allInstalled = $false
    }
}

Write-Host ""
if ($allInstalled) {
    Write-Host "=" -NoNewline -ForegroundColor Green
    Write-Host ("=" * 59) -ForegroundColor Green
    Write-Host "  Instalación completada exitosamente!" -ForegroundColor White
    Write-Host "=" -NoNewline -ForegroundColor Green
    Write-Host ("=" * 59) -ForegroundColor Green
    Write-Host ""
    Write-Host "Para iniciar el servidor, ejecuta:" -ForegroundColor Cyan
    Write-Host "  python server.py" -ForegroundColor White
    Write-Host ""
    Write-Host "El servidor estará disponible en:" -ForegroundColor Cyan
    Write-Host "  http://localhost:5000" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "=" -NoNewline -ForegroundColor Red
    Write-Host ("=" * 59) -ForegroundColor Red
    Write-Host "  Instalación incompleta" -ForegroundColor White
    Write-Host "=" -NoNewline -ForegroundColor Red
    Write-Host ("=" * 59) -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor revisa los errores arriba" -ForegroundColor Red
    exit 1
}
