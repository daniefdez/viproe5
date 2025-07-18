const { pool } = require('../config/database');
const logger = require('../utils/logger');

// 👤 SERVICIO DE USUARIOS ROCK AND ROLL
const createUser = async (userData) => {
  const { email, password, name, ip } = userData;
  
  const query = `
    INSERT INTO users (email, password, name, registration_ip, created_at)
    VALUES ($1, $2, $3, $4, NOW())
    RETURNING id, email, name, created_at
  `;
  
  const result = await pool.query(query, [email, password, name, ip]);
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

const findUserById = async (id) => {
  const query = 'SELECT id, email, name, created_at FROM users WHERE id = $1 AND is_active = true';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

const updateUserLastLogin = async (userId, ip) => {
  const query = 'UPDATE users SET last_login = NOW() WHERE id = $1';
  await pool.query(query, [userId]);
  
  // Log login activity
  await logUserActivity(userId, 'login', { ip });
};

const logUserActivity = async (userId, activityType, details = {}) => {
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
};

const getUserStats = async (userId) => {
  const queries = {
    totalAnalyses: 'SELECT COUNT(*) FROM image_analyses WHERE user_id = $1',
    totalActivity: 'SELECT COUNT(*) FROM user_activity WHERE user_id = $1',
    lastLogin: 'SELECT last_login FROM users WHERE id = $1'
  };

  const results = await Promise.all([
    pool.query(queries.totalAnalyses, [userId]),
    pool.query(queries.totalActivity, [userId]),
    pool.query(queries.lastLogin, [userId])
  ]);

  return {
    totalAnalyses: parseInt(results[0].rows[0].count),
    totalActivity: parseInt(results[1].rows[0].count),
    lastLogin: results[2].rows[0].last_login
  };
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserLastLogin,
  logUserActivity,
  getUserStats
};