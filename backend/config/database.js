const { Pool } = require('pg');

// Database configuration
const dbConfig = {
  user: process.env.DB_USER || 'school_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'school_management',
  password: process.env.DB_PASSWORD || 'school_password_2025',
  port: process.env.DB_PORT || 5432,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close clients after 30 seconds of inactivity
  connectionTimeoutMillis: 2000, // Return an error if connection takes longer than 2 seconds
};

// Create connection pool
const pool = new Pool(dbConfig);

// Test database connection
pool.on('connect', (client) => {
  console.log('🗄️  Connected to PostgreSQL database');
});

pool.on('error', (err, client) => {
  console.error('🚨 Unexpected error on idle client', err);
  process.exit(-1);
});

// Helper function to execute queries
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('📊 Query executed', { text: text.substring(0, 50) + '...', duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('🚨 Database query error:', error);
    throw error;
  }
};

// Helper function to get a client from the pool (for transactions)
const getClient = async () => {
  return await pool.connect();
};

// Helper function to execute transactions
const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Database utility functions
const dbUtils = {
  // Check if user exists
  async userExists(table, field, value) {
    const result = await query(
      `SELECT EXISTS(SELECT 1 FROM ${table} WHERE ${field} = $1)`,
      [value]
    );
    return result.rows[0].exists;
  },

  // Get user by field
  async getUserByField(table, field, value) {
    const result = await query(
      `SELECT * FROM ${table} WHERE ${field} = $1 AND is_active = TRUE`,
      [value]
    );
    return result.rows[0] || null;
  },

  // Update user password
  async updatePassword(table, userId, passwordHash) {
    const result = await query(
      `UPDATE ${table} SET password_hash = $1, must_change_password = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [passwordHash, userId]
    );
    return result.rowCount > 0;
  },

  // Get classes by teacher ID
  async getClassesByTeacher(teacherId) {
    const result = await query(
      `SELECT * FROM classes WHERE teacher_id = $1 AND is_active = TRUE ORDER BY created_at DESC`,
      [teacherId]
    );
    return result.rows;
  },

  // Get students by class ID
  async getStudentsByClass(classId) {
    const result = await query(
      `SELECT * FROM students WHERE class_id = $1 AND is_active = TRUE ORDER BY full_name ASC`,
      [classId]
    );
    return result.rows;
  }
};

module.exports = {
  pool,
  query,
  getClient,
  transaction,
  dbUtils
};