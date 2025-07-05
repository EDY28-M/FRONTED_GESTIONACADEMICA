# 🚀 Guía de Despliegue - DigitalOcean

## Pasos para Desplegar en DigitalOcean App Platform

### 1. Preparar el Código
El proyecto ya está configurado para producción. Solo necesitas:

```bash
# Verificar que tengas las variables de entorno correctas
cat .env

# Hacer commit de los cambios
git add .
git commit -m "Configurar para despliegue en DigitalOcean"
git push origin main
```

### 2. Crear App en DigitalOcean

1. **Ir a App Platform**: https://cloud.digitalocean.com/apps
2. **Create App** → **GitHub**
3. **Autorizar DigitalOcean** en GitHub
4. **Seleccionar el repositorio** de tu frontend
5. **Configurar el servicio**:
   - **Branch**: `main`
   - **Source Directory**: `/`
   - **Build Command**: `npm run build:prod`
   - **Run Command**: `npm run preview`
   - **Output Directory**: `dist`

### 3. Variables de Entorno en DigitalOcean

Agregar en la sección **Environment Variables**:

```env
VITE_API_URL=https://tu-backend-app.ondigitalocean.app/api
VITE_APP_NAME=Gestión Académica
VITE_APP_VERSION=1.0.0
VITE_DEV_MODE=false
VITE_ENABLE_DEVTOOLS=false
```

### 4. Configurar el Backend URL

⚠️ **IMPORTANTE**: Reemplaza `tu-backend-app` con la URL real de tu backend:

1. Ve a tu backend desplegado en DigitalOcean
2. Copia la URL (ej: `https://backend-abc123.ondigitalocean.app`)
3. Actualiza `VITE_API_URL` en las variables de entorno

### 5. Deploy

1. **Review** la configuración
2. **Create Resources**
3. Esperar el deployment (5-10 minutos)
4. Tu app estará disponible en: `https://tu-app-name.ondigitalocean.app`

## 🔧 Configuración Local vs Producción

### Desarrollo Local
- Usa `.env.local` (ignorado por git)
- API URL: `https://localhost:7219/api`
- Logs habilitados

### Producción
- Usa `.env` (incluido en git)
- API URL: Tu backend en DigitalOcean
- Logs deshabilitados
- Optimizaciones de build

## 📋 Checklist Pre-Despliegue

- [ ] Backend desplegado y funcionando
- [ ] Variables de entorno configuradas
- [ ] URLs actualizadas en `.env`
- [ ] Código commitado y pusheado
- [ ] CORS configurado en el backend
- [ ] Build local exitoso (`npm run build:prod`)

## 🌐 URLs Importantes

### Desarrollo
- Frontend: http://localhost:3000
- Backend: https://localhost:7219

### Producción
- Frontend: https://tu-frontend-app.ondigitalocean.app
- Backend: https://tu-backend-app.ondigitalocean.app

## 🛠 Troubleshooting

### Error de CORS
Si ves errores de CORS, asegúrate de que tu backend .NET tenga configurado:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("https://tu-frontend-app.ondigitalocean.app")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});
```

### Build Fails
- Verificar que todas las dependencias estén en `package.json`
- Ejecutar `npm run build:prod` localmente
- Revisar los logs de DigitalOcean

### Variables de Entorno No Funcionan
- Verificar que tengan el prefijo `VITE_`
- Reiniciar el deployment después de cambios
- Usar exactamente los nombres especificados
