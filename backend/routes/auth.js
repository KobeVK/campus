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

const validatePasswordChange = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
];

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