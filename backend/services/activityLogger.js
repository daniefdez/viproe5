const { pool } = require('../config/database');
const logger = require('../utils/logger');

// 📊 ACTIVITY LOGGER ROCK AND ROLL
const logUserActivity = async (userId, activityType, details = {}) => {
  try {
    const query = `
      INSERT INTO user_activity (user_id, activity_type, details, ip_address, user_agent, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
    `;
    
    await pool.query(query, [
      userId,
      activityType,
      JSON.stringify(details),
      details.ip || null,
      details.userAgent || null
    ]);

    logger.info(`📊 Actividad registrada: ${activityType} para usuario ${userId}`);
  } catch (error) {
    logger.error('💥 Error registrando actividad:', error);
  }
};

const logImageAnalysis = async (userId, fileHash, analysisResult, processingTime) => {
  try {
    const query = `
      INSERT INTO image_analyses (user_id, file_hash, analysis_result, processing_time_ms, created_at)
      VALUES ($1, $2, $3, $4, NOW())
    `;
    
    await pool.query(query, [
      userId,
      fileHash,
      JSON.stringify(analysisResult),
      processingTime
    ]);

    logger.info(`🔍 Análisis guardado: ${fileHash} para usuario ${userId}`);
  } catch (error) {
    logger.error('💥 Error guardando análisis:', error);
  }
};

const getRecentActivity = async (userId, limit = 10) => {
  try {
    const query = `
      SELECT activity_type, details, created_at
      FROM user_activity
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `;
    
    const result = await pool.query(query, [userId, limit]);
    return result.rows;
  } catch (error) {
    logger.error('💥 Error obteniendo actividad:', error);
    return [];
  }
};

const getSuspiciousActivity = async (timeWindow = '1 hour') => {
  try {
    const query = `
      SELECT 
        ip_address,
        COUNT(*) as request_count,
        array_agg(DISTINCT activity_type) as activities
      FROM user_activity
      WHERE created_at > NOW() - INTERVAL '${timeWindow}'
      GROUP BY ip_address
      HAVING COUNT(*) > 50
      ORDER BY request_count DESC
    `;
    
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    logger.error('💥 Error obteniendo actividad sospechosa:', error);
    return [];
  }
};

module.exports = {
  logUserActivity,
  logImageAnalysis,
  getRecentActivity,
  getSuspiciousActivity
};