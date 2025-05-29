const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { query, dbUtils } = require('../config/database');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Middleware to verify teacher authentication
const authenticateTeacher = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.userType !== 'teacher') {
      return res.status(403).json({ error: 'Teacher access required' });
    }

    // Get teacher data
    const teacher = await dbUtils.getUserByField('teachers', 'id', decoded.id);
    if (!teacher) {
      return res.status(401).json({ error: 'Teacher not found' });
    }

    req.teacher = teacher;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Get teacher profile
router.get('/profile', authenticateTeacher, async (req, res) => {
  try {
    const { password_hash, ...teacherData } = req.teacher;
    res.json(teacherData);
  } catch (error) {
    console.error('Get teacher profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update teacher profile
router.put('/profile', authenticateTeacher, [
  body('first_name').optional().trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('last_name').optional().trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  body('phone').optional().trim().matches(/^[\d\-\+\(\)\s]+$/).withMessage('Invalid phone number format'),
  body('email').optional().isEmail().withMessage('Invalid email format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { first_name, last_name, phone, email } = req.body;
    const teacherId = req.teacher.id;

    // Check if email is already taken by another teacher
    if (email && email !== req.teacher.email) {
      const emailExists = await dbUtils.userExists('teachers', 'email', email);
      if (emailExists) {
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
    if (phone) {
      updateFields.push(`phone = $${paramCount++}`);
      values.push(phone);
    }
    if (email) {
      updateFields.push(`email = $${paramCount++}`);
      values.push(email);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(teacherId);

    const updateQuery = `
      UPDATE teachers 
      SET ${updateFields.join(', ')} 
      WHERE id = $${paramCount} 
      RETURNING id, username, email, first_name, last_name, phone, created_at, updated_at
    `;

    const result = await query(updateQuery, values);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      teacher: result.rows[0]
    });

  } catch (error) {
    console.error('Update teacher profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get teacher's classes
router.get('/classes', authenticateTeacher, async (req, res) => {
  try {
    const classes = await dbUtils.getClassesByTeacher(req.teacher.id);
    
    // Get student count for each class
    const classesWithCounts = await Promise.all(
      classes.map(async (classItem) => {
        const studentCountResult = await query(
          'SELECT COUNT(*) as student_count FROM students WHERE class_id = $1 AND is_active = TRUE',
          [classItem.id]
        );
        return {
          ...classItem,
          student_count: parseInt(studentCountResult.rows[0].student_count)
        };
      })
    );

    res.json(classesWithCounts);
  } catch (error) {
    console.error('Get teacher classes error:', error);
    res.status(500).json({ error: 'Failed to get classes' });
  }
});

// Get students in teacher's classes
router.get('/students', authenticateTeacher, async (req, res) => {
  try {
    const { class_id } = req.query;
    
    let studentsQuery;
    let queryParams;

    if (class_id) {
      // Get students from specific class (verify teacher owns the class)
      studentsQuery = `
        SELECT s.*, c.class_name, c.profession 
        FROM students s
        JOIN classes c ON s.class_id = c.id
        WHERE s.class_id = $1 AND c.teacher_id = $2 AND s.is_active = TRUE
        ORDER BY s.full_name ASC
      `;
      queryParams = [class_id, req.teacher.id];
    } else {
      // Get all students from teacher's classes
      studentsQuery = `
        SELECT s.*, c.class_name, c.profession 
        FROM students s
        JOIN classes c ON s.class_id = c.id
        WHERE c.teacher_id = $1 AND s.is_active = TRUE
        ORDER BY c.class_name ASC, s.full_name ASC
      `;
      queryParams = [req.teacher.id];
    }

    const result = await query(studentsQuery, queryParams);
    res.json(result.rows);

  } catch (error) {
    console.error('Get teacher students error:', error);
    res.status(500).json({ error: 'Failed to get students' });
  }
});

// Get dashboard statistics for teacher
router.get('/dashboard', authenticateTeacher, async (req, res) => {
  try {
    // Get total classes
    const classCountResult = await query(
      'SELECT COUNT(*) as count FROM classes WHERE teacher_id = $1 AND is_active = TRUE',
      [req.teacher.id]
    );

    // Get total students
    const studentCountResult = await query(`
      SELECT COUNT(s.*) as count 
      FROM students s
      JOIN classes c ON s.class_id = c.id
      WHERE c.teacher_id = $1 AND s.is_active = TRUE AND c.is_active = TRUE
    `, [req.teacher.id]);

    // Get recent activity (new students added in last 7 days)
    const recentStudentsResult = await query(`
      SELECT COUNT(s.*) as count 
      FROM students s
      JOIN classes c ON s.class_id = c.id
      WHERE c.teacher_id = $1 AND s.is_active = TRUE AND c.is_active = TRUE
      AND s.created_at >= NOW() - INTERVAL '7 days'
    `, [req.teacher.id]);

    const stats = {
      totalClasses: parseInt(classCountResult.rows[0].count),
      totalStudents: parseInt(studentCountResult.rows[0].count),
      recentStudents: parseInt(recentStudentsResult.rows[0].count),
      teacherName: `${req.teacher.first_name} ${req.teacher.last_name}`
    };

    res.json(stats);

  } catch (error) {
    console.error('Get teacher dashboard error:', error);
    res.status(500).json({ error: 'Failed to get dashboard data' });
  }
});

module.exports = router;