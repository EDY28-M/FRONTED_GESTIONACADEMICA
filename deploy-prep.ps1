# Script de preparación para despliegue en DigitalOcean (PowerShell)
Write-Host "🚀 Preparando proyecto para despliegue en DigitalOcean..." -ForegroundColor Green

# Verificar que Node.js esté instalado
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js detectado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js no está instalado. Por favor instálalo primero." -ForegroundColor Red
    exit 1
}

# Verificar que npm esté instalado
try {
    $npmVersion = npm --version
    Write-Host "✅ npm detectado: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm no está instalado. Por favor instálalo primero." -ForegroundColor Red
    exit 1
}

# Instalar dependencias
Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error instalando dependencias" -ForegroundColor Red
    exit 1
}

# Verificar TypeScript
Write-Host "🔍 Verificando tipos de TypeScript..." -ForegroundColor Yellow
npm run type-check

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Advertencia: Errores de TypeScript encontrados" -ForegroundColor Yellow
}

# Ejecutar linting
Write-Host "🧹 Ejecutando linting..." -ForegroundColor Yellow
npm run lint

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Advertencia: Errores de linting encontrados" -ForegroundColor Yellow
}

# Build de producción
Write-Host "🏗️ Construyendo para producción..." -ForegroundColor Yellow
npm run build:prod

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build exitoso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Proyecto listo para despliegue!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Próximos pasos:" -ForegroundColor Cyan
    Write-Host "1. Hacer commit y push del código:" -ForegroundColor White
    Write-Host "   git add ." -ForegroundColor Gray
    Write-Host "   git commit -m 'Preparar para despliegue en DigitalOcean'" -ForegroundColor Gray
    Write-Host "   git push origin main" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Ir a DigitalOcean App Platform y crear una nueva app" -ForegroundColor White
    Write-Host "3. Configurar las variables de entorno según DEPLOYMENT.md" -ForegroundColor White
    Write-Host "4. ¡Desplegar!" -ForegroundColor White
} else {
    Write-Host "❌ Error en el build. Revisa los errores arriba." -ForegroundColor Red
    exit 1
}
