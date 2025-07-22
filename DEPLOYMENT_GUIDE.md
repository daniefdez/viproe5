# 🚀 GUÍA COMPLETA DE DEPLOYMENT - VISIONAI PRO

## 🎯 OVERVIEW

VisionAI Pro es una aplicación de análisis de imágenes con IA que combina:
- **Frontend React/TypeScript** con Vite
- **Backend Node.js/Express** con seguridad militar
- **Base de datos PostgreSQL** con Redis
- **Nginx** como reverse proxy
- **Docker** para containerización

## 🔧 SETUP RÁPIDO (5 MINUTOS)

### 1. Prerrequisitos
```bash
# Instalar Docker y Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Verificar instalación
docker --version
docker-compose --version
```

### 2. Configuración de Variables
```bash
# Clonar el proyecto
git clone <tu-repositorio>
cd visionai-pro

# Configurar backend
cp backend/.env.example backend/.env

# Editar con tus valores reales
nano backend/.env
```

### 3. Variables Críticas
```bash
# backend/.env
GEMINI_API_KEY=tu_clave_real_de_google_ai_studio
JWT_SECRET=$(openssl rand -base64 32)
ENCRYPTION_KEY=$(openssl rand -hex 32)
DB_PASSWORD=$(openssl rand -base64 16)
REDIS_PASSWORD=$(openssl rand -base64 16)
CORS_ORIGINS=https://tu-dominio.com
```

### 4. Deploy Inmediato
```bash
# Desarrollo
docker-compose up -d

# Producción
docker-compose -f docker-compose.prod.yml up -d
```

## 🌐 DEPLOYMENT EN CLOUD

### Opción A: VPS (Recomendado)

#### 1. Crear Servidor
- **DigitalOcean**: Droplet Ubuntu 22.04, 4GB RAM ($40/mes)
- **Linode**: Nanode 4GB ($36/mes)
- **Vultr**: Regular Performance 4GB ($32/mes)

#### 2. Configurar Servidor
```bash
# Conectar por SSH
ssh root@tu-servidor-ip

# Actualizar sistema
apt update && apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

#### 3. Deploy en Servidor
```bash
# Clonar proyecto
git clone <tu-repositorio>
cd visionai-pro

# Configurar variables
cp backend/.env.example backend/.env
nano backend/.env

# Levantar aplicación
docker-compose -f docker-compose.prod.yml up -d

# Verificar que funciona
curl http://localhost/health
```

#### 4. Configurar Dominio y SSL
```bash
# Configurar DNS del dominio apuntando a la IP del servidor

# Instalar Certbot
apt install certbot python3-certbot-nginx -y

# Obtener certificado SSL
certbot --nginx -d tu-dominio.com

# Verificar renovación automática
certbot renew --dry-run
```

### Opción B: Servicios Managed

#### Vercel (Frontend) + Railway (Backend)
```bash
# Frontend en Vercel
npm install -g vercel
vercel --prod

# Backend en Railway
npm install -g @railway/cli
railway login
railway init
railway up
```

#### Netlify (Frontend) + Render (Backend)
```bash
# Frontend: Conectar repositorio en Netlify
# Backend: Conectar repositorio en Render
```

## 🔒 CONFIGURACIÓN DE SEGURIDAD

### 1. Firewall
```bash
# Configurar UFW
ufw enable
ufw allow 22     # SSH
ufw allow 80     # HTTP
ufw allow 443    # HTTPS
ufw deny 3001    # Backend directo
ufw deny 5432    # PostgreSQL
ufw deny 6379    # Redis
```

### 2. SSL/TLS
```bash
# Let's Encrypt automático
./scripts/setup-ssl.sh tu-dominio.com

# O manual con Certbot
certbot --nginx -d tu-dominio.com -d www.tu-dominio.com
```

### 3. Backup Automático
```bash
# Configurar backup diario
chmod +x scripts/backup.sh
crontab -e

# Añadir línea:
0 2 * * * /path/to/visionai-pro/scripts/backup.sh
```

## 📊 MONITOREO Y LOGS

### Logs en Tiempo Real
```bash
# Todos los servicios
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo errores de seguridad
docker-compose logs -f backend | grep "SECURITY"
```

### Métricas de Sistema
```bash
# Uso de recursos
docker stats

# Espacio en disco
df -h

# Memoria y CPU
htop
```

### Health Checks
```bash
# Verificar servicios
curl https://tu-dominio.com/health
curl https://tu-dominio.com/api/health

# Estadísticas de seguridad
curl https://tu-dominio.com/api/security/stats
```

## 🚨 TROUBLESHOOTING

### Problemas Comunes

#### Backend no inicia
```bash
# Ver logs detallados
docker-compose logs backend

# Verificar variables de entorno
docker-compose exec backend env | grep GEMINI

# Reiniciar servicio
docker-compose restart backend
```

#### Base de datos no conecta
```bash
# Verificar PostgreSQL
docker-compose exec postgres psql -U visionai_user -d visionai_pro

# Ver logs de DB
docker-compose logs postgres
```

#### SSL no funciona
```bash
# Verificar certificados
certbot certificates

# Renovar manualmente
certbot renew

# Ver logs de Nginx
docker-compose logs nginx
```

#### Rate limiting muy agresivo
```bash
# Ajustar en backend/.env
RATE_LIMIT_MAX_REQUESTS=100
API_RATE_LIMIT_MAX=50

# Reiniciar
docker-compose restart backend
```

## 📈 ESCALABILIDAD

### Load Balancer
```yaml
# docker-compose.scale.yml
version: '3.8'
services:
  backend:
    deploy:
      replicas: 3
    
  nginx:
    volumes:
      - ./nginx/load-balancer.conf:/etc/nginx/nginx.conf
```

### Database Clustering
```yaml
# Configuración master-slave
postgres-master:
  image: postgres:15
  environment:
    POSTGRES_REPLICATION_MODE: master
    
postgres-slave:
  image: postgres:15
  environment:
    POSTGRES_REPLICATION_MODE: slave
    POSTGRES_MASTER_SERVICE: postgres-master
```

## 💰 COSTOS ESTIMADOS

### Servidor VPS
- **Básico**: $20-30/mes (2GB RAM)
- **Recomendado**: $40-50/mes (4GB RAM)
- **Alto tráfico**: $80-100/mes (8GB RAM)

### Servicios Adicionales
- **Dominio**: $10-15/año
- **SSL**: Gratis (Let's Encrypt)
- **Backup Storage**: $5-10/mes
- **Monitoreo**: $0-20/mes (opcional)

### Total: $35-120/mes

## 🎯 CHECKLIST DE DEPLOYMENT

### Pre-Deploy
- [ ] Dominio comprado y configurado
- [ ] Servidor VPS creado
- [ ] Variables de entorno configuradas
- [ ] Clave API de Gemini obtenida
- [ ] Repositorio Git configurado

### Deploy
- [ ] Docker y Docker Compose instalados
- [ ] Aplicación desplegada con docker-compose
- [ ] SSL configurado con Let's Encrypt
- [ ] Firewall configurado
- [ ] Backup automático configurado

### Post-Deploy
- [ ] Health checks funcionando
- [ ] Logs monitoreados
- [ ] Performance optimizada
- [ ] Seguridad verificada
- [ ] Documentación actualizada

## 🎉 ¡LISTO PARA ROCK AND ROLL!

Con esta guía tienes todo lo necesario para desplegar VisionAI Pro en producción:

- ✅ **Aplicación funcionando** en minutos
- ✅ **Seguridad de nivel enterprise**
- ✅ **Escalabilidad** para millones de usuarios
- ✅ **Monitoreo** completo
- ✅ **Backup** automático
- ✅ **SSL** configurado

**¡Tu aplicación está lista para competir con startups de $100M+! 🚀**