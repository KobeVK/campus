const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { query, transaction } = require('../config/database');

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

    req.teacherId = decoded.id;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Validation for creating/updating students
const validateStudent = [
  body('full_name').trim().isLength({ min: 2, max: 200 }).withMessage('Full name must be 2-200 characters'),
  body('student_id').optional().trim().isLength({ max: 50 }).withMessage('Student ID too long'),
  body('date_of_birth').optional().isISO8601().withMessage('Invalid date format'),
  body('address').optional().trim().isLength({ max: 500 }).withMessage('Address too long'),
  body('phone').optional().trim().matches(/^[\d\-\+\(\)\s]+$/).withMessage('Invalid phone format'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('parent_name').optional().trim().isLength({ max: 200 }).withMessage('Parent name too long'),
  body('parent_phone').optional().trim().matches(/^[\d\-\+\(\)\s]+$/).withMessage('Invalid parent phone format'),
  body('parent_email').optional().isEmail().withMessage('Invalid parent email format'),
  body('emergency_contact').optional().trim().isLength({ max: 200 }).withMessage('Emergency contact name too long'),
  body('emergency_phone').optional().trim().matches(/^[\d\-\+\(\)\s]+$/).withMessage('Invalid emergency phone format'),
  body('siblings').optional().trim().isLength({ max: 500 }).withMessage('Siblings info too long'),
  body('medical_notes').optional().trim().isLength({ max: 1000 }).withMessage('Medical notes too long'),
  body('class_id').optional().isUUID().withMessage('Invalid class ID format')
];

// Create new student
router.post('/', authenticateTeacher, validateStudent, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const {
      full_name,
      student_id,
      date_of_birth,
      address,
      phone,
      email,
      parent_name,
      parent_phone,
      parent_email,
      emergency_contact,
      emergency_phone,
      siblings,
      medical_notes,
      class_id
    } = req.body;

    // If class_id is provided, verify it belongs to the teacher
    if (class_id) {
      const classCheck = await query(
        'SELECT id FROM classes WHERE id = $1 AND teacher_id = $2 AND is_active = TRUE',
        [class_id, req.teacherId]
      );

      if (classCheck.rows.length === 0) {
        return res.status(400).json({ error: 'Invalid class selected' });
      }
    }

    // Check if student_id already exists (if provided)
    if (student_id) {
      const existingStudent = await query(
        'SELECT id FROM students WHERE student_id = $1 AND is_active = TRUE',
        [student_id]
      );

      if (existingStudent.rows.length > 0) {
        return res.status(400).json({ error: 'Student ID already exists' });
      }
    }

    const insertQuery = `
      INSERT INTO students (
        class_id, student_id, full_name, date_of_birth, address, phone, email,
        parent_name, parent_phone, parent_email, emergency_contact, emergency_phone,
        siblings, medical_notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;

    const values = [
      class_id || null,
      student_id || null,
      full_name,
      date_of_birth || null,
      address || null,
      phone || null,
      email || null,
      parent_name || null,
      parent_phone || null,
      parent_email || null,
      emergency_contact || null,
      emergency_phone || null,
      siblings || null,
      medical_notes || null
    ];

    const result = await query(insertQuery, values);
    
    res.status(201).json({
      message: 'Student created successfully',
      student: result.rows[0]
    });

  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
});

// Get all students for teacher's classes
router.get('/', authenticateTeacher, async (req, res) => {
  try {
    const { class_id, search } = req.query;
    
    let studentsQuery = `
      SELECT s.*, c.class_name, c.profession
      FROM students s
      LEFT JOIN classes c ON s.class_id = c.id
      WHERE (c.teacher_id = $1 OR s.class_id IS NULL) AND s.is_active = TRUE
    `;
    
    const queryParams = [req.teacherId];
    let paramCount = 2;

    // Filter by class if specified
    if (class_id) {
      studentsQuery += ` AND s.class_id = $${paramCount}`;
      queryParams.push(class_id);
      paramCount++;
    }

    // Search functionality
    if (search) {
      studentsQuery += ` AND (s.full_name ILIKE $${paramCount} OR s.student_id ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
      paramCount++;
    }

    studentsQuery += ` ORDER BY s.full_name ASC`;

    const result = await query(studentsQuery, queryParams);
    res.json(result.rows);

  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Failed to get students' });
  }
});

// Get single student by ID
router.get('/:id', authenticateTeacher, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT s.*, c.class_name, c.profession
      FROM students s
      LEFT JOIN classes c ON s.class_id = c.id
      WHERE s.id = $1 AND (c.teacher_id = $2 OR s.class_id IS NULL) AND s.is_active = TRUE
    `, [id, req.teacherId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ error: 'Failed to get student' });
  }
});

// Update student
router.put('/:id', authenticateTeacher, validateStudent, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { id } = req.params;
    const {
      full_name,
      student_id,
      date_of_birth,
      address,
      phone,
      email,
      parent_name,
      parent_phone,
      parent_email,
      emergency_contact,
      emergency_phone,
      siblings,
      medical_notes,
      class_id
    } = req.body;

    // Verify student exists and belongs to teacher's classes
    const studentCheck = await query(`
      SELECT s.id FROM students s
      LEFT JOIN classes c ON s.class_id = c.id
      WHERE s.id = $1 AND (c.teacher_id = $2 OR s.class_id IS NULL) AND s.is_active = TRUE
    `, [id, req.teacherId]);

    if (studentCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // If class_id is provided, verify it belongs to the teacher
    if (class_id) {
      const classCheck = await query(
        'SELECT id FROM classes WHERE id = $1 AND teacher_id = $2 AND is_active = TRUE',
        [class_id, req.teacherId]
      );

      if (classCheck.rows.length === 0) {
        return res.status(400).json({ error: 'Invalid class selected' });
      }
    }

    // Check if student_id already exists for another student
    if (student_id) {
      const existingStudent = await query(
        'SELECT id FROM students WHERE student_id = $1 AND id != $2 AND is_active = TRUE',
        [student_id, id]
      );

      if (existingStudent.rows.length > 0) {
        return res.status(400).json({ error: 'Student ID already exists' });
      }
    }

    const updateQuery = `
      UPDATE students SET
        class_id = $1,
        student_id = $2,
        full_name = $3,
        date_of_birth = $4,
        address = $5,
        phone = $6,
        email = $7,
        parent_name = $8,
        parent_phone = $9,
        parent_email = $10,
        emergency_contact = $11,
        emergency_phone = $12,
        siblings = $13,
        medical_notes = $14,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $15
      RETURNING *
    `;

    const values = [
      class_id || null,
      student_id || null,
      full_name,
      date_of_birth || null,
      address || null,
      phone || null,
      email || null,
      parent_name || null,
      parent_phone || null,
      parent_email || null,
      emergency_contact || null,
      emergency_phone || null,
      siblings || null,
      medical_notes || null,
      id
    ];

    const result = await query(updateQuery, values);

    res.json({
      message: 'Student updated successfully',
      student: result.rows[0]
    });

  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// Delete (deactivate) student
router.delete('/:id', authenticateTeacher, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify student exists and belongs to teacher's classes
    const studentCheck = await query(`
      SELECT s.id FROM students s
      LEFT JOIN classes c ON s.class_id = c.id
      WHERE s.id = $1 AND (c.teacher_id = $2 OR s.class_id IS NULL) AND s.is_active = TRUE
    `, [id, req.teacherId]);

    if (studentCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Use transaction to deactivate student and related login
    await transaction(async (client) => {
      // Deactivate student
      await client.query(
        'UPDATE students SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [id]
      );

      // Deactivate student login if exists
      await client.query(
        'UPDATE student_logins SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE student_id = $1',
        [id]
      );
    });

    res.json({ message: 'Student deleted successfully' });

  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

// Create student login credentials
router.post('/:id/login', authenticateTeacher, [
  body('username').trim().isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters'),
  body('password').optional().isLength({ min: 4 }).withMessage('Password must be at least 4 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { id } = req.params;
    const { username, password = 'student1234' } = req.body;

    // Verify student exists and belongs to teacher's classes
    const studentCheck = await query(`
      SELECT s.id FROM students s
      LEFT JOIN classes c ON s.class_id = c.id
      WHERE s.id = $1 AND (c.teacher_id = $2 OR s.class_id IS NULL) AND s.is_active = TRUE
    `, [id, req.teacherId]);

    if (studentCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Check if username already exists
    const existingLogin = await query(
      'SELECT id FROM student_logins WHERE username = $1',
      [username]
    );

    if (existingLogin.rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create student login
    const insertQuery = `
      INSERT INTO student_logins (student_id, username, password_hash, must_change_password)
      VALUES ($1, $2, $3, TRUE)
      RETURNING id, username, must_change_password, created_at
    `;

    const result = await query(insertQuery, [id, username, passwordHash]);

    res.status(201).json({
      message: 'Student login created successfully',
      login: result.rows[0]
    });

  } catch (error) {
    console.error('Create student login error:', error);
    res.status(500).json({ error: 'Failed to create student login' });
  }
});

// Assign student to different class
router.put('/:id/assign-class', authenticateTeacher, [
  body('class_id').isUUID().withMessage('Valid class ID required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { id } = req.params;
    const { class_id } = req.body;

    // Verify both student and class belong to teacher
    const verifyQuery = `
      SELECT 
        s.id as student_id,
        c.id as class_id
      FROM students s
      CROSS JOIN classes c
      WHERE s.id = $1 AND c.id = $2 
        AND c.teacher_id = $3 
        AND s.is_active = TRUE 
        AND c.is_active = TRUE
    `;

    const verifyResult = await query(verifyQuery, [id, class_id, req.teacherId]);

    if (verifyResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid student or class' });
    }

    // Update student's class assignment
    const updateResult = await query(
      'UPDATE students SET class_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [class_id, id]
    );

    res.json({
      message: 'Student assigned to class successfully',
      student: updateResult.rows[0]
    });

  } catch (error) {
    console.error('Assign student to class error:', error);
    res.status(500).json({ error: 'Failed to assign student to class' });
  }
});

module.exports = router;