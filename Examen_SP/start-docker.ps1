# Script de inicio para Windows PowerShell

Write-Host "Iniciando servicios de Docker para Examen 2P..." -ForegroundColor Cyan

# Verificar si Docker esta instalado
try {
    docker --version | Out-Null
} catch {
    Write-Host "Docker no esta instalado. Por favor instala Docker Desktop primero." -ForegroundColor Red
    exit 1
}

Write-Host "Levantando contenedores..." -ForegroundColor Yellow
docker-compose up -d

Write-Host ""
Write-Host "Esperando a que los servicios esten listos..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "Servicios iniciados correctamente!" -ForegroundColor Green
Write-Host ""
Write-Host "Estado de los contenedores:" -ForegroundColor Cyan
docker-compose ps

Write-Host ""
Write-Host "URLs de Acceso:" -ForegroundColor Cyan
Write-Host "   - PostgreSQL: localhost:5433" -ForegroundColor White
Write-Host "   - RabbitMQ: http://localhost:15672 (admin/admin)" -ForegroundColor White
Write-Host "   - n8n: http://localhost:5678" -ForegroundColor White
Write-Host ""
Write-Host "Siguiente paso:" -ForegroundColor Yellow
Write-Host "   cd exam2p-servicio-auditoria; npm install; npm run start:dev" -ForegroundColor White

