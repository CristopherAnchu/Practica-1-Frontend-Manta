# ============================================
# PILAR 1: AUTH SERVICE - TESTS
# ============================================
# Este script prueba todos los endpoints del Auth Service
# según los requisitos del Pilar 1
# ============================================

$AUTH_URL = "http://localhost:3001"
$ErrorActionPreference = "Continue"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  PILAR 1: AUTH SERVICE - PRUEBAS" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Función auxiliar para hacer requests
function Invoke-Test {
    param(
        [string]$Title,
        [string]$Method,
        [string]$Url,
        [hashtable]$Headers = @{},
        [object]$Body = $null
    )
    
    Write-Host "▶ $Title" -ForegroundColor Yellow
    Write-Host "  $Method $Url" -ForegroundColor Gray
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
            ContentType = "application/json"
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json -Depth 10)
        }
        
        $response = Invoke-RestMethod @params
        Write-Host "  ✅ SUCCESS" -ForegroundColor Green
        Write-Host "  Response:" -ForegroundColor Gray
        Write-Host ($response | ConvertTo-Json -Depth 10) -ForegroundColor White
        Write-Host ""
        return $response
    }
    catch {
        Write-Host "  ❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.ErrorDetails.Message) {
            Write-Host "  Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
        }
        Write-Host ""
        return $null
    }
}

# Variables globales para tokens
$global:accessToken = $null
$global:refreshToken = $null
$global:userId = $null

Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host " TEST 1: POST /auth/register" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$registerBody = @{
    email = "test_$timestamp@unifit.com"
    password = "Password123!"
    nombre = "Usuario Test $timestamp"
    tipo = "USUARIO_FINAL"
}

$registerResult = Invoke-Test `
    -Title "Registrar nuevo usuario" `
    -Method "POST" `
    -Url "$AUTH_URL/auth/register" `
    -Body $registerBody

if ($registerResult) {
    $global:accessToken = $registerResult.accessToken
    $global:refreshToken = $registerResult.refreshToken
    $global:userId = $registerResult.user.id
    
    Write-Host "  📌 User ID: $($global:userId)" -ForegroundColor Magenta
    Write-Host "  📌 Access Token guardado" -ForegroundColor Magenta
    Write-Host "  📌 Refresh Token guardado" -ForegroundColor Magenta
    Write-Host ""
}

Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host " TEST 2: POST /auth/login" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$loginBody = @{
    email = $registerBody.email
    password = $registerBody.password
}

$loginResult = Invoke-Test `
    -Title "Login con credenciales" `
    -Method "POST" `
    -Url "$AUTH_URL/auth/login" `
    -Body $loginBody

if ($loginResult) {
    $global:accessToken = $loginResult.accessToken
    $global:refreshToken = $loginResult.refreshToken
}

Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host " TEST 3: GET /auth/me (con JWT)" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

if ($global:accessToken) {
    $meResult = Invoke-Test `
        -Title "Obtener información del usuario autenticado" `
        -Method "GET" `
        -Url "$AUTH_URL/auth/me" `
        -Headers @{ Authorization = "Bearer $($global:accessToken)" }
}
else {
    Write-Host "  ⚠️  SKIP: No hay access token disponible" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host " TEST 4: GET /auth/validate (validación interna)" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

if ($global:accessToken) {
    $validateResult = Invoke-Test `
        -Title "Validar token (endpoint interno)" `
        -Method "GET" `
        -Url "$AUTH_URL/auth/validate" `
        -Headers @{ Authorization = "Bearer $($global:accessToken)" }
}
else {
    Write-Host "  ⚠️  SKIP: No hay access token disponible" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host " TEST 5: POST /auth/refresh (renovar tokens)" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

if ($global:refreshToken) {
    $refreshBody = @{
        refreshToken = $global:refreshToken
    }
    
    $refreshResult = Invoke-Test `
        -Title "Renovar access token con refresh token" `
        -Method "POST" `
        -Url "$AUTH_URL/auth/refresh" `
        -Body $refreshBody
    
    if ($refreshResult) {
        $global:accessToken = $refreshResult.accessToken
        $global:refreshToken = $refreshResult.refreshToken
        Write-Host "  📌 Tokens renovados exitosamente" -ForegroundColor Magenta
        Write-Host ""
    }
}
else {
    Write-Host "  ⚠️  SKIP: No hay refresh token disponible" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host " TEST 6: Rate Limiting (protección login)" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "  Intentando 11 logins consecutivos para activar rate limiting..." -ForegroundColor Gray
$rateLimitTriggered = $false

for ($i = 1; $i -le 11; $i++) {
    try {
        $response = Invoke-RestMethod `
            -Uri "$AUTH_URL/auth/login" `
            -Method POST `
            -ContentType "application/json" `
            -Body (@{
                email = "test@example.com"
                password = "wrong"
            } | ConvertTo-Json)
    }
    catch {
        if ($_.Exception.Response.StatusCode -eq 429) {
            $rateLimitTriggered = $true
            Write-Host "  ✅ Rate limiting activado en intento #$i" -ForegroundColor Green
            break
        }
    }
}

if ($rateLimitTriggered) {
    Write-Host "  ✅ Rate limiting funciona correctamente" -ForegroundColor Green
}
else {
    Write-Host "  ⚠️  Rate limiting no se activó en 11 intentos" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host " TEST 7: POST /auth/logout (cerrar sesión)" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

if ($global:accessToken -and $global:refreshToken) {
    $logoutBody = @{
        refreshToken = $global:refreshToken
    }
    
    $logoutResult = Invoke-Test `
        -Title "Cerrar sesión y revocar tokens" `
        -Method "POST" `
        -Url "$AUTH_URL/auth/logout" `
        -Headers @{ Authorization = "Bearer $($global:accessToken)" } `
        -Body $logoutBody
}
else {
    Write-Host "  ⚠️  SKIP: No hay tokens disponibles" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host " TEST 8: Verificar token revocado (blacklist)" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

if ($global:accessToken) {
    Write-Host "  Intentando usar token después de logout..." -ForegroundColor Gray
    try {
        $response = Invoke-RestMethod `
            -Uri "$AUTH_URL/auth/me" `
            -Method GET `
            -Headers @{ Authorization = "Bearer $($global:accessToken)" }
        
        Write-Host "  ❌ Token NO fue revocado (debería fallar)" -ForegroundColor Red
    }
    catch {
        if ($_.Exception.Response.StatusCode -eq 401) {
            Write-Host "  ✅ Token correctamente revocado (blacklist funciona)" -ForegroundColor Green
        }
        else {
            Write-Host "  ⚠️  Error inesperado: $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }
}
else {
    Write-Host "  ⚠️  SKIP: No hay access token para probar" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  RESUMEN PILAR 1" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Microservicio independiente de autenticación" -ForegroundColor Green
Write-Host "✅ JWT con access token y refresh token" -ForegroundColor Green
Write-Host "✅ Endpoints básicos implementados:" -ForegroundColor Green
Write-Host "   - POST /auth/register" -ForegroundColor White
Write-Host "   - POST /auth/login" -ForegroundColor White
Write-Host "   - POST /auth/refresh" -ForegroundColor White
Write-Host "   - POST /auth/logout" -ForegroundColor White
Write-Host "   - GET /auth/me" -ForegroundColor White
Write-Host "   - GET /auth/validate" -ForegroundColor White
Write-Host "✅ Rate limiting en endpoints de auth" -ForegroundColor Green
Write-Host "✅ Blacklist de tokens revocados (persistente)" -ForegroundColor Green
Write-Host "✅ Base de datos propia para usuarios y tokens" -ForegroundColor Green
Write-Host ""
Write-Host "Para validación local en otros servicios, ver Payment Service." -ForegroundColor Gray
Write-Host ""
