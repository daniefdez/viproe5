const { Pool } = require('pg');
const logger = require('../utils/logger');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// 🗄️ ESQUEMA DE BASE DE DATOS
const createTables = async () => {
  const client = await pool.connect();
  
  try {
    // Tabla de usuarios
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        registration_ip INET,
        email_verified BOOLEAN DEFAULT false
      )
    `);

    // Tabla de actividad de usuarios
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_activity (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        activity_type VARCHAR(50) NOT NULL,
        details JSONB,
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de análisis
    await client.query(`
      CREATE TABLE IF NOT EXISTS image_analyses (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        file_hash VARCHAR(64) NOT NULL,
        file_size INTEGER,
        mime_type VARCHAR(50),
        analysis_result JSONB,
        processing_time_ms INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de rate limiting
    await client.query(`
      CREATE TABLE IF NOT EXISTS rate_limits (
        id SERIAL PRIMARY KEY,
        identifier VARCHAR(255) NOT NULL,
        hits INTEGER DEFAULT 1,
        reset_time TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(identifier)
      )
    `);

    // Índices para performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(created_at);
      CREATE INDEX IF NOT EXISTS idx_image_analyses_user_id ON image_analyses(user_id);
      CREATE INDEX IF NOT EXISTS idx_image_analyses_file_hash ON image_analyses(file_hash);
      CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON rate_limits(identifier);
    `);

    logger.info('✅ Tablas de base de datos creadas/verificadas');

  } catch (error) {
    logger.error('💥 Error creando tablas:', error);
    throw error;
  } finally {
    client.release();
  }
};

const setupDatabase = async () => {
  try {
    await createTables();
    logger.info('🗄️ Base de datos configurada correctamente');
  } catch (error) {
    logger.error('💥 Error configurando base de datos:', error);
    throw error;
  }
};

module.exports = {
  pool,
  setupDatabase
};