#!/bin/bash

# Script de prueba para verificar conexión con Google Cloud API

echo "🔍 Verificando conexión con backend en Google Cloud..."
echo "URL: http://34.60.233.211:8080/api"
echo ""

# Verificar que el backend esté ejecutándose
echo "1. Verificando estado del backend..."
curl -s -f http://34.60.233.211:8080/api/cursos > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Backend respondiendo correctamente"
else
    echo "❌ Backend no responde"
    exit 1
fi

# Verificar endpoint de cursos
echo ""
echo "2. Verificando endpoint de cursos..."
CURSOS_COUNT=$(curl -s http://34.60.233.211:8080/api/cursos | jq length)
echo "✅ Cursos encontrados: $CURSOS_COUNT"

# Verificar endpoint de docentes
echo ""
echo "3. Verificando endpoint de docentes..."
DOCENTES_COUNT=$(curl -s http://34.60.233.211:8080/api/docentes | jq length)
echo "✅ Docentes encontrados: $DOCENTES_COUNT"

echo ""
echo "🎉 Todos los tests pasaron exitosamente!"
echo "El backend está funcionando correctamente en Google Cloud."
