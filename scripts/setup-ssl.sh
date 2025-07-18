#!/bin/bash

# 🔐 SSL SETUP SCRIPT ROCK AND ROLL

DOMAIN=$1

if [ -z "$DOMAIN" ]; then
    echo "❌ Error: Debes proporcionar un dominio"
    echo "Uso: ./setup-ssl.sh tu-dominio.com"
    exit 1
fi

echo "🔐 Configurando SSL para $DOMAIN..."

# Instalar certbot
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

# Configurar renovación automática
sudo crontab -l | { cat; echo "0 12 * * * /usr/bin/certbot renew --quiet"; } | sudo crontab -

echo "✅ SSL configurado correctamente para $DOMAIN"
echo "🔄 Renovación automática configurada"