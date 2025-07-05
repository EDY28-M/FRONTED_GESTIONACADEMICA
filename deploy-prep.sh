#!/bin/bash

# Script de preparación para despliegue en Render
echo "🚀 Preparando proyecto para despliegue en Render..."

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
    echo "🎉 Proyecto listo para despliegue en Render!"
    echo ""
    echo "Próximos pasos:"
    echo "1. Hacer commit y push del código:"
    echo "   git add ."
    echo "   git commit -m 'Configurar para despliegue en Render'"
    echo "   git push origin main"
    echo ""
    echo "2. Ir a https://render.com y crear una nueva Static Site"
    echo "3. Conectar tu repositorio de GitHub"
    echo "4. Configurar:"
    echo "   - Build Command: npm run build:prod"
    echo "   - Publish Directory: dist"
    echo "5. Configurar variables de entorno según RENDER-DEPLOYMENT.md"
    echo "6. ¡Desplegar!"
else
    echo "❌ Error en el build. Revisa los errores arriba."
    exit 1
fi
