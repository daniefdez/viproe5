#!/bin/sh

# 🚀 NGINX START SCRIPT ROCK AND ROLL

# Replace environment variables in nginx config
envsubst '${API_URL}' < /etc/nginx/conf.d/default.conf > /tmp/default.conf
mv /tmp/default.conf /etc/nginx/conf.d/default.conf

# Start nginx
exec nginx -g 'daemon off;'