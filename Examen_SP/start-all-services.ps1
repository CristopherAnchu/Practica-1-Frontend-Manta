#!/usr/bin/env pwsh
# Start All Microservices - Exam 2P

Write-Host "Starting all microservices..." -ForegroundColor Cyan
Write-Host ""

# Function to start a service in a new terminal
function Start-Service {
    param(
        [string]$ServiceName,
        [string]$ServicePath,
        [string]$Command
    )
    
    Write-Host "Starting $ServiceName..." -ForegroundColor Green
    $title = "--- $ServiceName ---"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ServicePath'; Write-Host '$title' -ForegroundColor Yellow; $Command"
    Start-Sleep -Seconds 2
}

# Get the current directory
$rootPath = $PSScriptRoot

# Start Audit Service
Start-Service -ServiceName "Exam2P Audit Service" `
              -ServicePath "$rootPath\audit-service" `
              -Command "npm run start:dev"

# Start API Gateway
Start-Service -ServiceName "API Gateway" `
              -ServicePath "$rootPath\api-gateway" `
              -Command "npm run start:dev"

# Start MCP Tool
Start-Service -ServiceName "MCP Tool Server" `
              -ServicePath "$rootPath\mcp-tool" `
              -Command "npm run build; npm start"

Write-Host ""
Write-Host "All microservices are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "Services:" -ForegroundColor Cyan
Write-Host "  - Exam2P Audit Service -> http://localhost:3000" -ForegroundColor White
Write-Host "  - API Gateway          -> http://localhost:3001" -ForegroundColor White
Write-Host "  - MCP Tool Server      -> http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit this window..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
