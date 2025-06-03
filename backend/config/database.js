const { Pool } = require('pg');
require('dotenv').config();

// Database configuration
const dbConfig = {
  user: process.env.DB_USER || 'campus_admin',
  host: process.env.NODE_ENV === 'production' 
    ? 'rds-campus2.czkduehwi9ml.eu-central-1.rds.amazonaws.com'  // Direct RDS in production
    : '127.0.0.1',  // StrongDM tunnel for local development
  database: process.env.DB_NAME || 'campus',
  password: process.env.DB_PASSWORD || 'school_password_2025',
  port: process.env.NODE_ENV === 'production' 
    ? 5432  // Direct RDS port
    : (process.env.DB_PORT || 10403),  // StrongDM port for local
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false }  // SSL for RDS
    : false,  // No SSL for local tunnel
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
};

console.log(`🔧 Database config for ${process.env.NODE_ENV || 'development'}:`);
console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`);
console.log(`   Database: ${dbConfig.database}`);
console.log(`   SSL: ${dbConfig.ssl ? 'enabled' : 'disabled'}`);

// Create connection pool
const pool = new Pool(dbConfig);

// Test connection on startup
pool.on('connect', () => {
  console.log('📊 Database connected successfully');
});

pool.on('error', (err) => {
  console.error('💥 Database connection error:', err);
});

// Query function with logging
const query = async (text, params = []) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('📊 Query executed', { 
      text: text.substring(0, 100) + (text.length > 100 ? '...' : ''), 
      duration, 
      rows: result.rowCount 
    });
    return result;
  } catch (error) {
    console.error('💥 Query error:', error);
    console.error('💥 Query text:', text);
    console.error('💥 Query params:', params);
    throw error;
  }
};

// Database utility functions
const dbUtils = {
  // Get user by field (generic function)
  getUserByField: async (table, field, value) => {
    try {
      console.log(`🔍 Looking up user in ${table} where ${field} = ${value}`);
      const result = await query(
        `SELECT * FROM ${table} WHERE ${field} = $1 AND is_active = TRUE`,
        [value]
      );
      
      if (result.rows.length === 0) {
        console.log(`❌ No user found in ${table} with ${field} = ${value}`);
        return null;
      }
      
      console.log(`✅ User found in ${table}:`, { 
        id: result.rows[0].id, 
        [field]: result.rows[0][field] 
      });
      return result.rows[0];
    } catch (error) {
      console.error(`💥 Error getting user from ${table}:`, error);
      throw error;
    }
  },

  // Update password
  updatePassword: async (table, userId, passwordHash) => {
    try {
      const result = await query(
        `UPDATE ${table} SET password_hash = $1, must_change_password = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
        [passwordHash, userId]
      );
      return result.rowCount > 0;
    } catch (error) {
      console.error('💥 Error updating password:', error);
      throw error;
    }
  },

  // Get all teachers
  getAllTeachers: async (limit = 50, offset = 0, search = '') => {
    try {
      let queryText = `
        SELECT id, username, email, first_name, last_name, phone, created_at, updated_at, is_active
        FROM teachers 
        WHERE is_active = TRUE
      `;
      
      const queryParams = [];
      let paramCount = 1;

      // Add search functionality
      if (search) {
        queryText += ` AND (
          first_name ILIKE $${paramCount} OR 
          last_name ILIKE $${paramCount} OR 
          email ILIKE $${paramCount} OR 
          username ILIKE $${paramCount}
        )`;
        queryParams.push(`%${search}%`);
        paramCount++;
      }

      queryText += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
      queryParams.push(limit, offset);

      const result = await query(queryText, queryParams);
      return result.rows;
    } catch (error) {
      console.error('💥 Error getting teachers:', error);
      throw error;
    }
  }
};

// Test database connection
const testConnection = async () => {
  try {
    const result = await query('SELECT NOW() as current_time');
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    return false;
  }
};

module.exports = {
  pool,
  query,
  dbUtils,
  testConnection
};