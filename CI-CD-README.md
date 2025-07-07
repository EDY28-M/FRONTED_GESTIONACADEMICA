# CI/CD Pipeline - Gestión Académica Frontend

Este proyecto usa **GitHub Actions** para automatizar el testing, building y deployment a **Google Cloud Run**.

## 🔄 Workflows Configurados

### 1. **Deploy Pipeline** (`.github/workflows/deploy.yml`)
- **Trigger**: Push a `main` o `master`
- **Acciones**:
  - ✅ Instala dependencias
  - 🔍 Ejecuta linting
  - 🏗️ Construye la aplicación
  - 🐳 Construye imagen Docker
  - 🚀 Despliega a Cloud Run

### 2. **PR Preview** (`.github/workflows/preview.yml`)
- **Trigger**: Pull Requests
- **Acciones**:
  - ✅ Testea el código
  - 🔍 Ejecuta type checking
  - 🏗️ Construye preview
  - 💬 Comenta resultados en el PR

## 🚀 Configuración Inicial

### 1. Configurar Service Account

Ejecuta el script de configuración:

```bash
chmod +x setup-github-cicd.sh
./setup-github-cicd.sh
```

### 2. Configurar GitHub Secrets

Ve a tu repositorio en GitHub:
1. **Settings** → **Secrets and variables** → **Actions**
2. Crea un nuevo **Repository Secret**:
   - **Name**: `GCP_SA_KEY`
   - **Value**: El contenido del archivo JSON generado

### 3. Configurar Variables de Entorno (Opcional)

Puedes agregar estos secrets adicionales si quieres configuraciones específicas:

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `GCP_PROJECT_ID` | ID del proyecto GCP | `ascendant-altar-457900-v4` |
| `CLOUD_RUN_REGION` | Región de Cloud Run | `us-central1` |
| `API_URL` | URL del backend | `https://34.60.233.211/api` |

## 🔄 Proceso de Deployment

### Desarrollo Normal:
1. Crea una **branch** para tu feature: `git checkout -b feature/nueva-funcionalidad`
2. Haz tus cambios y commit: `git commit -m "feat: nueva funcionalidad"`
3. Push la branch: `git push origin feature/nueva-funcionalidad`
4. Crea un **Pull Request** → Se ejecuta el **PR Preview**
5. Merge a `main` → Se ejecuta el **Deploy automático**

### Deploy Manual:
```bash
# Trigger deploy manual
git push origin main
```

## 📊 Monitoreo

### Ver logs de deployment:
```bash
# Ver logs de Cloud Run
gcloud logs tail "resource.type=cloud_run_revision" --project=ascendant-altar-457900-v4

# Ver builds en Cloud Build
gcloud builds list --limit=10
```

### URLs de la aplicación:
- **Frontend**: https://gestion-academica-frontend-483569217524.us-central1.run.app
- **Backend**: https://34.60.233.211/api
- **Swagger**: https://34.60.233.211/swagger

## 🛠️ Comandos Útiles

```bash
# Build local
npm run build:prod

# Preview local
npm run preview

# Linting
npm run lint

# Type checking
npm run type-check

# Deploy manual (requiere gcloud configurado)
gcloud run deploy gestion-academica-frontend --image gcr.io/ascendant-altar-457900-v4/gestion-academica-frontend --region us-central1
```

## 🔧 Troubleshooting

### Error: "Service account key not found"
- Verifica que el secret `GCP_SA_KEY` esté configurado correctamente
- Regenera la key con: `./setup-github-cicd.sh`

### Error: "Permission denied"
- Verifica que el Service Account tenga los roles necesarios
- Roles requeridos: `run.admin`, `storage.admin`, `cloudbuild.builds.editor`

### Error: "Image not found"
- Verifica que Cloud Build esté habilitado
- Verifica que Container Registry esté habilitado

## 📈 Mejoras Futuras

- [ ] Tests automatizados (Jest/Vitest)
- [ ] Deploy a staging environment
- [ ] Notificaciones a Slack/Discord
- [ ] Análisis de dependencias de seguridad
- [ ] Performance monitoring
- [ ] Rollback automático en caso de errores
