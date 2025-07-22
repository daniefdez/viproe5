## 🚀 GUÍA DE DEPLOYMENT ROCK AND ROLL

## 🎯 Arquitectura Final

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   NGINX PROXY   │────│   FRONTEND      │────│   BACKEND API   │
│   (Port 80/443) │    │   (React/Vite)  │    │   (Node.js)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                       ┌─────────────────┐    ┌─────────────────┐
                       │   POSTGRESQL    │────│     REDIS       │
                       │   (Database)    │    │   (Cache/Rate)  │
                       └─────────────────┘    └─────────────────┘
```

## 🔧 SETUP RÁPIDO

### 1. Clonar y Configurar
```bash
git clone <tu-repo>
cd visionai-pro

# Copiar variables de entorno
cp backend/.env.example backend/.env
cp .env.example .env.local

# Editar con tus valores reales
nano backend/.env
```

### 2. Variables Críticas
```bash
# backend/.env
GEMINI_API_KEY=tu_clave_real_aqui
JWT_SECRET=$(openssl rand -base64 32)
DB_PASSWORD=$(openssl rand -base64 16)
REDIS_PASSWORD=$(openssl rand -base64 16)
```

### 3. Deployment con Docker
```bash
# Desarrollo
docker-compose up -d

# Producción
docker-compose -f docker-compose.prod.yml up -d
```

## 🌐 DEPLOYMENT EN CLOUD

### AWS/DigitalOcean/Linode
```bash
# 1. Crear servidor Ubuntu 22.04
# 2. Instalar Docker y Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 3. Clonar proyecto
git clone <tu-repo>
cd visionai-pro

# 4. Configurar SSL con Let's Encrypt
./scripts/setup-ssl.sh tu-dominio.com

# 5. Deploy
docker-compose -f docker-compose.prod.yml up -d
```

### Vercel + Railway/Render
```bash
# Frontend en Vercel
vercel --prod

# Backend en Railway
railway login
railway link
railway up
```

## 📊 MONITOREO Y LOGS

### Logs en Tiempo Real
```bash
# Todos los servicios
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo errores
docker-compose logs -f backend | grep ERROR
```

### Métricas de Performance
```bash
# CPU y Memoria
docker stats

# Espacio en disco
df -h

# Conexiones de red
netstat -tulpn
```

## 🔐 SEGURIDAD EN PRODUCCIÓN

### 1. Firewall
```bash
ufw enable
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw deny 3001   # Backend directo
ufw deny 5432   # PostgreSQL
ufw deny 6379   # Redis
```

### 2. SSL/TLS
```bash
# Certbot para Let's Encrypt
certbot --nginx -d tu-dominio.com
```

### 3. Backup Automático
```bash
# Script de backup diario
./scripts/backup.sh
```

## 🚨 TROUBLESHOOTING

### Problemas Comunes

#### Backend no inicia
```bash
# Verificar logs
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

# Verificar conexiones
docker-compose exec backend npm run db:test
```

#### Rate limiting muy agresivo
```bash
# Ajustar en backend/.env
RATE_LIMIT_MAX_REQUESTS=50
API_RATE_LIMIT_MAX=30

# Reiniciar
docker-compose restart backend
```

## 📈 ESCALABILIDAD

### Load Balancer
```yaml
# docker-compose.scale.yml
services:
  backend:
    deploy:
      replicas: 3
  
  nginx:
    depends_on:
      - backend
    volumes:
      - ./nginx/load-balancer.conf:/etc/nginx/nginx.conf
```

### Database Clustering
```yaml
postgres-master:
  image: postgres:15
  
postgres-replica:
  image: postgres:15
  environment:
    PGUSER: replicator
```

## 💰 COSTOS ESTIMADOS

### Servidor VPS (DigitalOcean/Linode)
- **Básico**: $20/mes (2GB RAM, 1 CPU)
- **Recomendado**: $40/mes (4GB RAM, 2 CPU)
- **Alto tráfico**: $80/mes (8GB RAM, 4 CPU)

### Servicios Adicionales
- **Dominio**: $12/año
- **SSL**: Gratis (Let's Encrypt)
- **Backup**: $5/mes
- **Monitoreo**: $10/mes (opcional)

### Total: $35-95/mes

## 🎉 ¡LISTO PARA ROCK AND ROLL!

Tu aplicación VisionAI Pro ahora es:
- ✅ **Segura**: JWT, rate limiting, validación
- ✅ **Escalable**: Docker, load balancer ready
- ✅ **Monitoreada**: Logs, métricas, alertas
- ✅ **Profesional**: SSL, dominio, backup

**¡Felicidades! Tienes una aplicación de nivel producción! 🚀**