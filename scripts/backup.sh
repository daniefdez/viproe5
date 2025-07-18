#!/bin/bash

# 💾 BACKUP SCRIPT ROCK AND ROLL

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="visionai_pro"

echo "💾 Iniciando backup $DATE..."

# Crear directorio de backup
mkdir -p $BACKUP_DIR

# Backup de base de datos
docker-compose exec postgres pg_dump -U visionai_user $DB_NAME > $BACKUP_DIR/db_$DATE.sql

# Backup de logs
docker-compose exec backend tar -czf - /app/logs > $BACKUP_DIR/logs_$DATE.tar.gz

# Limpiar backups antiguos (mantener últimos 7 días)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "✅ Backup completado: $DATE"
echo "📁 Archivos guardados en $BACKUP_DIR"