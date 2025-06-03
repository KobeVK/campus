const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { query, dbUtils } = require('../config/database');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';

// Validation middleware
const validateLogin = [
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('password').isLength({ min: 4 }).withMessage('Password must be at least 4 characters'),
];

const validateTeacherRegistration = [
  body('username').trim().isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('first_name').trim().isLength({ min: 2, max: 100 }).withMessage('First name must be 2-100 characters'),
  body('last_name').trim().isLength({ min: 2, max: 100 }).withMessage('Last name must be 2-100 characters'),
  body('phone').optional().trim().matches(/^[\d\-\+\(\)\s]+$/).withMessage('Invalid phone format'),
];

const validatePasswordChange = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
];

// Middleware to verify admin/teacher authentication for teacher registration
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.userType !== 'teacher') { // For now, teachers can create other teachers
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.adminId = decoded.id;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Helper function to generate JWT token
const generateToken = (user, userType) => {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username,
      userType: userType, // 'teacher' or 'student'
      mustChangePassword: user.must_change_password 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
};

// Teacher Registration (Admin only)
router.post('/teacher/register', authenticateAdmin, validateTeacherRegistration, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { username, email, password, first_name, last_name, phone } = req.body;

    // Check if username already exists
    const existingUsername = await dbUtils.getUserByField('teachers', 'username', username);
    if (existingUsername) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Check if email already exists
    const existingEmail = await dbUtils.getUserByField('teachers', 'email', email);
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert new teacher
    const insertQuery = `
      INSERT INTO teachers (
        username, email, password_hash, first_name, last_name, phone, must_change_password, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, username, email, first_name, last_name, phone, created_at, is_active
    `;

    const values = [
      username,
      email,
      passwordHash,
      first_name,
      last_name,
      phone || null,
      true, // must_change_password
      true  // is_active
    ];

    const result = await query(insertQuery, values);
    
    res.status(201).json({
      message: 'Teacher created successfully',
      teacher: result.rows[0]
    });

  } catch (error) {
    console.error('Teacher registration error:', error);
    
    // Handle specific database errors
    if (error.code === '23505') { // Unique constraint violation
      if (error.constraint.includes('username')) {
        return res.status(400).json({ error: 'Username already exists' });
      } else if (error.constraint.includes('email')) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }
    
    res.status(500).json({ error: 'Failed to create teacher' });
  }
});

// Get all teachers (Admin only)
router.get('/teachers', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50, search = '' } = req.query;
    const offset = (page - 1) * limit;

    let teachersQuery = `
      SELECT id, username, email, first_name, last_name, phone, created_at, updated_at, is_active
      FROM teachers 
      WHERE is_active = TRUE
    `;
    
    const queryParams = [];
    let paramCount = 1;

    // Add search functionality
    if (search) {
      teachersQuery += ` AND (
        first_name ILIKE $${paramCount} OR 
        last_name ILIKE $${paramCount} OR 
        email ILIKE $${paramCount} OR 
        username ILIKE $${paramCount}
      )`;
      queryParams.push(`%${search}%`);
      paramCount++;
    }

    teachersQuery += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    queryParams.push(limit, offset);

    const result = await query(teachersQuery, queryParams);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM teachers WHERE is_active = TRUE';
    const countParams = [];
    
    if (search) {
      countQuery += ` AND (
        first_name ILIKE $1 OR 
        last_name ILIKE $1 OR 
        email ILIKE $1 OR 
        username ILIKE $1
      )`;
      countParams.push(`%${search}%`);
    }

    const countResult = await query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count);

    res.json({
      teachers: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: (page * limit) < totalCount,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get teachers error:', error);
    res.status(500).json({ error: 'Failed to get teachers' });
  }
});

// Update teacher (Admin only)
router.put('/teachers/:id', authenticateAdmin, [
  body('first_name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('First name must be 2-100 characters'),
  body('last_name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Last name must be 2-100 characters'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('phone').optional().trim().matches(/^[\d\-\+\(\)\s]+$/).withMessage('Invalid phone format'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { id } = req.params;
    const { first_name, last_name, email, phone } = req.body;

    // Check if teacher exists
    const existingTeacher = await dbUtils.getUserByField('teachers', 'id', id);
    if (!existingTeacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    // Check if email is already taken by another teacher
    if (email && email !== existingTeacher.email) {
      const emailExists = await query(
        'SELECT id FROM teachers WHERE email = $1 AND id != $2 AND is_active = TRUE',
        [email, id]
      );
      if (emailExists.rows.length > 0) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }

    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (first_name) {
      updateFields.push(`first_name = $${paramCount++}`);
      values.push(first_name);
    }
    if (last_name) {
      updateFields.push(`last_name = $${paramCount++}`);
      values.push(last_name);
    }
    if (email) {
      updateFields.push(`email = $${paramCount++}`);
      values.push(email);
    }
    if (phone !== undefined) {
      updateFields.push(`phone = $${paramCount++}`);
      values.push(phone);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const updateQuery = `
      UPDATE teachers 
      SET ${updateFields.join(', ')} 
      WHERE id = $${paramCount} AND is_active = TRUE
      RETURNING id, username, email, first_name, last_name, phone, created_at, updated_at, is_active
    `;

    const result = await query(updateQuery, values);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    res.json({
      message: 'Teacher updated successfully',
      teacher: result.rows[0]
    });

  } catch (error) {
    console.error('Update teacher error:', error);
    res.status(500).json({ error: 'Failed to update teacher' });
  }
});

// Delete teacher (Admin only) - Soft delete
router.delete('/teachers/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if teacher exists
    const existingTeacher = await dbUtils.getUserByField('teachers', 'id', id);
    if (!existingTeacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    // Soft delete - set is_active to false
    const result = await query(
      'UPDATE teachers SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND is_active = TRUE',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    res.json({ message: 'Teacher deleted successfully' });

  } catch (error) {
    console.error('Delete teacher error:', error);
    res.status(500).json({ error: 'Failed to delete teacher' });
  }
});

// Teacher Login
router.post('/teacher/login', validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { username, password } = req.body;

    // Get teacher from database
    const teacher = await dbUtils.getUserByField('teachers', 'username', username);
    if (!teacher) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, teacher.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(teacher, 'teacher');

    // Remove sensitive information
    const { password_hash, ...teacherData } = teacher;

    res.json({
      message: 'Login successful',
      token,
      user: teacherData,
      userType: 'teacher',
      mustChangePassword: teacher.must_change_password
    });

  } catch (error) {
    console.error('Teacher login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Student Login
router.post('/student/login', validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { username, password } = req.body;

    // Get student login credentials
    const result = await query(`
      SELECT sl.*, s.full_name, s.class_id, c.class_name 
      FROM student_logins sl
      JOIN students s ON sl.student_id = s.id
      LEFT JOIN classes c ON s.class_id = c.id
      WHERE sl.username = $1 AND sl.is_active = TRUE AND s.is_active = TRUE
    `, [username]);

    const studentLogin = result.rows[0];
    if (!studentLogin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, studentLogin.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await query('UPDATE student_logins SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [studentLogin.id]);

    // Generate JWT token
    const token = generateToken(studentLogin, 'student');

    // Remove sensitive information
    const { password_hash, ...studentData } = studentLogin;

    res.json({
      message: 'Login successful',
      token,
      user: studentData,
      userType: 'student',
      mustChangePassword: studentLogin.must_change_password
    });

  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Change Password (for both teachers and students)
router.post('/change-password', validatePasswordChange, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    const { currentPassword, newPassword } = req.body;

    let user, table;
    if (decoded.userType === 'teacher') {
      user = await dbUtils.getUserByField('teachers', 'id', decoded.id);
      table = 'teachers';
    } else if (decoded.userType === 'student') {
      user = await dbUtils.getUserByField('student_logins', 'id', decoded.id);
      table = 'student_logins';
    } else {
      return res.status(400).json({ error: 'Invalid user type' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isValidCurrentPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValidCurrentPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password in database
    const success = await dbUtils.updatePassword(table, user.id, newPasswordHash);
    if (!success) {
      return res.status(500).json({ error: 'Failed to update password' });
    }

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Verify Token
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get fresh user data
    let user;
    if (decoded.userType === 'teacher') {
      user = await dbUtils.getUserByField('teachers', 'id', decoded.id);
    } else if (decoded.userType === 'student') {
      const result = await query(`
        SELECT sl.*, s.full_name, s.class_id, c.class_name 
        FROM student_logins sl
        JOIN students s ON sl.student_id = s.id
        LEFT JOIN classes c ON s.class_id = c.id
        WHERE sl.id = $1 AND sl.is_active = TRUE
      `, [decoded.id]);
      user = result.rows[0];
    }

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Remove sensitive information
    const { password_hash, ...userData } = user;

    res.json({
      valid: true,
      user: userData,
      userType: decoded.userType,
      mustChangePassword: user.must_change_password
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    console.error('Token verification error:', error);
    res.status(500).json({ error: 'Token verification failed' });
  }
});

module.exports = router;