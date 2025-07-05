# 🚀 Guía de Despliegue en Render

## ¿Por qué Render?
- **Más fácil** que DigitalOcean
- **Despliegue automático** desde GitHub
- **Plan gratuito** disponible
- **HTTPS automático**
- **Logs en tiempo real**

## 📋 Pasos para Desplegar

### 1. **Preparar el Repositorio**
```bash
# Verificar que todo esté listo
npm run build:prod

# Hacer commit de los cambios
git add .
git commit -m "Configurar para despliegue en Render"
git push origin main
```

### 2. **Crear Servicio en Render**

1. **Ir a Render**: https://render.com
2. **Crear cuenta** o iniciar sesión
3. **New → Static Site** (para React apps)
4. **Conectar repositorio** de GitHub
5. **Configurar el servicio**:

#### Configuración Básica:
- **Name**: `gestion-academica-frontend`
- **Branch**: `main`
- **Root Directory**: (dejar vacío)
- **Build Command**: `npm run build:prod`
- **Publish Directory**: `dist`

#### Variables de Entorno:
```env
VITE_API_URL=https://tu-backend-app.onrender.com/api
VITE_APP_NAME=Gestión Académica
VITE_APP_VERSION=1.0.0
VITE_DEV_MODE=false
VITE_ENABLE_DEVTOOLS=false
```

### 3. **Configurar el Backend (si no lo has hecho)**
⚠️ **IMPORTANTE**: Tu backend .NET debe estar desplegado primero en Render

#### Para el Backend:
1. **New → Web Service**
2. **Docker** o **Native Environment**
3. Configurar las variables de entorno del backend

### 4. **Actualizar URLs**
Una vez que tengas las URLs de Render:

1. **Frontend URL**: `https://tu-frontend-app.onrender.com`
2. **Backend URL**: `https://tu-backend-app.onrender.com`

Actualizar en las variables de entorno de Render.

## 🔧 Configuración Automática

### render.yaml (Opcional)
Si prefieres configuración como código, puedes usar el archivo `render.yaml` incluido.

### Scripts Específicos para Render
- `npm run build:render` - Build completo para Render
- `npm run start` - Comando de inicio para Render

## 🎯 Ventajas de Render vs DigitalOcean

| Característica | Render | DigitalOcean |
|---|---|---|
| **Facilidad** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Plan Gratuito** | ✅ | ❌ |
| **Auto Deploy** | ✅ | ✅ |
| **HTTPS Automático** | ✅ | ✅ |
| **Configuración** | Mínima | Más compleja |
| **Precio** | Desde $0 | Desde $5/mes |

## 🚨 Checklist Pre-Despliegue

- [ ] Backend desplegado en Render
- [ ] Variables de entorno configuradas
- [ ] Build local exitoso
- [ ] CORS configurado en el backend
- [ ] URLs actualizadas

## 🛠 Troubleshooting

### Build Fails
```bash
# Probar build localmente
npm run build:prod

# Si falla, revisar errores y corregir
npm run type-check
npm run lint
```

### Variables de Entorno No Funcionan
- Asegúrate de que tengan prefijo `VITE_`
- Reinicia el deployment después de cambios
- Verifica el nombre exacto de las variables

### Error de CORS
Configurar en tu backend .NET:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("https://tu-frontend-app.onrender.com")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});
```

## 🌐 URLs Finales

### Desarrollo
- Frontend: http://localhost:3000
- Backend: https://localhost:7219

### Producción
- Frontend: https://tu-frontend-app.onrender.com
- Backend: https://tu-backend-app.onrender.com

¡Tu proyecto está listo para Render! 🎉
