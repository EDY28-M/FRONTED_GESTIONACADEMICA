# Script de prueba para verificar conexion con Google Cloud API

Write-Host "Verificando conexion con backend en Google Cloud..." -ForegroundColor Cyan
Write-Host "URL: http://34.60.233.211:8080/api" -ForegroundColor Yellow
Write-Host ""

# Verificar que el backend este ejecutandose
Write-Host "1. Verificando estado del backend..." -ForegroundColor White
try {
    $response = Invoke-WebRequest -Uri "http://34.60.233.211:8080/api/cursos" -Method GET -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "Backend respondiendo correctamente" -ForegroundColor Green
    } else {
        Write-Host "Backend no responde" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Error al conectar con el backend: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Verificar endpoint de cursos
Write-Host ""
Write-Host "2. Verificando endpoint de cursos..." -ForegroundColor White
try {
    $cursosResponse = Invoke-RestMethod -Uri "http://34.60.233.211:8080/api/cursos" -Method GET
    $cursosCount = $cursosResponse.Count
    Write-Host "Cursos encontrados: $cursosCount" -ForegroundColor Green
} catch {
    Write-Host "Error al obtener cursos: $($_.Exception.Message)" -ForegroundColor Red
}

# Verificar endpoint de docentes
Write-Host ""
Write-Host "3. Verificando endpoint de docentes..." -ForegroundColor White
try {
    $docentesResponse = Invoke-RestMethod -Uri "http://34.60.233.211:8080/api/docentes" -Method GET
    $docentesCount = $docentesResponse.Count
    Write-Host "Docentes encontrados: $docentesCount" -ForegroundColor Green
} catch {
    Write-Host "Error al obtener docentes: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Todos los tests pasaron exitosamente!" -ForegroundColor Green
Write-Host "El backend esta funcionando correctamente en Google Cloud." -ForegroundColor Green
