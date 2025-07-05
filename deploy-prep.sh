#!/bin/bash

# Script de preparación para despliegue en DigitalOcean
echo "🚀 Preparando proyecto para despliegue en DigitalOcean..."

# Verificar que Node.js esté instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instálalo primero."
    exit 1
fi

# Verificar que npm esté instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado. Por favor instálalo primero."
    exit 1
fi

echo "✅ Node.js y npm detectados"

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Verificar TypeScript
echo "🔍 Verificando tipos de TypeScript..."
npm run type-check

# Ejecutar linting
echo "🧹 Ejecutando linting..."
npm run lint

# Build de producción
echo "🏗️ Construyendo para producción..."
npm run build:prod

if [ $? -eq 0 ]; then
    echo "✅ Build exitoso!"
    echo ""
    echo "🎉 Proyecto listo para despliegue!"
    echo ""
    echo "Próximos pasos:"
    echo "1. Hacer commit y push del código:"
    echo "   git add ."
    echo "   git commit -m 'Preparar para despliegue en DigitalOcean'"
    echo "   git push origin main"
    echo ""
    echo "2. Ir a DigitalOcean App Platform y crear una nueva app"
    echo "3. Configurar las variables de entorno según DEPLOYMENT.md"
    echo "4. ¡Desplegar!"
else
    echo "❌ Error en el build. Revisa los errores arriba."
    exit 1
fi
