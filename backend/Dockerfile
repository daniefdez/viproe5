# 🐳 DOCKERFILE ROCK AND ROLL PARA BACKEND

FROM node:18-alpine AS builder

# Instalar dependencias del sistema
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    vips-dev

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production && npm cache clean --force

# Etapa de producción
FROM node:18-alpine AS production

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S visionai -u 1001

# Instalar dependencias runtime
RUN apk add --no-cache vips

WORKDIR /app

# Copiar node_modules desde builder
COPY --from=builder --chown=visionai:nodejs /app/node_modules ./node_modules

# Copiar código fuente
COPY --chown=visionai:nodejs . .

# Crear directorio de logs
RUN mkdir -p logs && chown visionai:nodejs logs

# Cambiar a usuario no-root
USER visionai

# Exponer puerto
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Comando de inicio
CMD ["node", "server.js"]