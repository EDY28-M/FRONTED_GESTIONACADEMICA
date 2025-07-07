# Configuración HTTPS para Backend en Google Cloud

## El problema
Tu frontend está en HTTPS (Render.com) pero tu backend está en HTTP (Google Cloud).
Los navegadores bloquean las peticiones HTTP desde páginas HTTPS (Mixed Content).

## Solución Recomendada: Configurar HTTPS en Google Cloud

### Opción 1: Usar Google Cloud Load Balancer con SSL

1. **Crear un Load Balancer HTTPS**:
   ```bash
   # Crear certificado SSL
   gcloud compute ssl-certificates create backend-ssl-cert \
     --domains=tu-dominio.com
   
   # Crear Load Balancer
   gcloud compute url-maps create backend-lb \
     --default-backend-service=your-backend-service
   
   # Crear proxy HTTPS
   gcloud compute target-https-proxies create backend-https-proxy \
     --url-map=backend-lb \
     --ssl-certificates=backend-ssl-cert
   ```

2. **Configurar forwarding rule**:
   ```bash
   gcloud compute forwarding-rules create backend-https-rule \
     --global \
     --target-https-proxy=backend-https-proxy \
     --ports=443
   ```

### Opción 2: Usar Cloud Run (Recomendado)

Si tu backend está en contenedores, Cloud Run automáticamente proporciona HTTPS:

```bash
# Desplegar en Cloud Run
gcloud run deploy gestion-academica-backend \
  --image=gcr.io/tu-proyecto/backend-image \
  --platform=managed \
  --region=us-central1 \
  --allow-unauthenticated
```

### Opción 3: Usar App Engine

App Engine automáticamente proporciona HTTPS:

```yaml
# app.yaml
runtime: aspnetcore
env: standard

automatic_scaling:
  min_instances: 0
  max_instances: 10
```

## URLs después de HTTPS

Una vez configurado HTTPS, tus URLs serían:
- Backend: `https://tu-dominio.com/api`
- Swagger: `https://tu-dominio.com/swagger`

## Verificar configuración HTTPS

```bash
# Verificar que el certificado SSL está funcionando
curl -I https://tu-dominio.com/api/health

# Verificar endpoints
curl https://tu-dominio.com/api/cursos
curl https://tu-dominio.com/api/docentes
```

## Actualizar configuración del frontend

Una vez que tengas HTTPS funcionando, actualiza los archivos .env:

```bash
# .env.production
VITE_API_URL=https://tu-dominio.com/api
VITE_BACKEND_HTTPS=https://tu-dominio.com
VITE_SWAGGER_URL=https://tu-dominio.com/swagger
```
