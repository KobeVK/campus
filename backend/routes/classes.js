const express = require('express');
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

// Validation for creating/updating classes
const validateClass = [
  body('class_name').trim().isLength({ min: 2, max: 100 }).withMessage('Class name must be 2-100 characters'),
  body('school_name').trim().isLength({ min: 2, max: 200 }).withMessage('School name must be 2-200 characters'),
  body('school_id').optional().isUUID().withMessage('Invalid school ID format'),
  body('profession').trim().isIn(['מתמטיקה', 'אנגלית', 'פיזיקה', 'כימיה', 'ביולוגיה', 'היסטוריה', 'גאוגרפיה', 'ספרות', 'תנ"ך', 'אמנות', 'מוסיקה', 'חינוך גשמי', 'מדעי המחשב']).withMessage('Invalid profession'),
  body('grade_level').optional().trim().isLength({ max: 20 }).withMessage('Grade level too long'),
  body('academic_year').optional().trim().matches(/^\d{4}$/).withMessage('Academic year must be 4 digits'),
  body('max_students').optional().isInt({ min: 1, max: 50 }).withMessage('Max students must be between 1-50'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description too long')
];

// Create new class
router.post('/', authenticateTeacher, validateClass, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const {
      class_name,
      school_name,
      school_id,
      profession,
      grade_level,
      academic_year = '2025',
      max_students = 30,
      description
    } = req.body;

    const insertQuery = `
      INSERT INTO classes (
        teacher_id, class_name, school_name, school_id, profession, 
        grade_level, academic_year, max_students, description
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      req.teacherId,
      class_name,
      school_name,
      school_id || null,
      profession,
      grade_level,
      academic_year,
      max_students,
      description
    ];

    const result = await query(insertQuery, values);
    
    res.status(201).json({
      message: 'Class created successfully',
      class: result.rows[0]
    });

  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({ error: 'Failed to create class' });
  }
});

// Get all classes for the authenticated teacher
router.get('/', authenticateTeacher, async (req, res) => {
  try {
    const result = await query(`
      SELECT c.*, s.name as school_full_name, COUNT(st.id) as student_count
      FROM classes c
      LEFT JOIN schools s ON c.school_id = s.id
      LEFT JOIN students st ON c.id = st.class_id AND st.is_active = TRUE
      WHERE c.teacher_id = $1 AND c.is_active = TRUE
      GROUP BY c.id, s.name
      ORDER BY c.created_at DESC
    `, [req.teacherId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ error: 'Failed to get classes' });
  }
});

// Get single class by ID
router.get('/:id', authenticateTeacher, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT c.*, COUNT(s.id) as student_count
      FROM classes c
      LEFT JOIN students s ON c.id = s.class_id AND s.is_active = TRUE
      WHERE c.id = $1 AND c.teacher_id = $2 AND c.is_active = TRUE
      GROUP BY c.id
    `, [id, req.teacherId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Class not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get class error:', error);
    res.status(500).json({ error: 'Failed to get class' });
  }
});

// Update class
router.put('/:id', authenticateTeacher, validateClass, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { id } = req.params;
    const {
      class_name,
      school_name,
      school_id,
      profession,
      grade_level,
      academic_year,
      max_students,
      description
    } = req.body;

    // Verify class belongs to teacher
    const classCheck = await query(
      'SELECT id FROM classes WHERE id = $1 AND teacher_id = $2 AND is_active = TRUE',
      [id, req.teacherId]
    );

    if (classCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Class not found' });
    }

    const updateQuery = `
      UPDATE classes SET
        class_name = $1,
        school_name = $2,
        school_id = $3,
        profession = $4,
        grade_level = $5,
        academic_year = $6,
        max_students = $7,
        description = $8,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $9 AND teacher_id = $10
      RETURNING *
    `;

    const values = [
      class_name,
      school_name,
      school_id || null,
      profession,
      grade_level,
      academic_year,
      max_students,
      description,
      id,
      req.teacherId
    ];

    const result = await query(updateQuery, values);

    res.json({
      message: 'Class updated successfully',
      class: result.rows[0]
    });

  } catch (error) {
    console.error('Update class error:', error);
    res.status(500).json({ error: 'Failed to update class' });
  }
});

// Delete (deactivate) class
router.delete('/:id', authenticateTeacher, async (req, res) => {
  try {
    const { id } = req.params;

    // Use transaction to deactivate class and its students
    const result = await transaction(async (client) => {
      // Verify class belongs to teacher
      const classCheck = await client.query(
        'SELECT id FROM classes WHERE id = $1 AND teacher_id = $2 AND is_active = TRUE',
        [id, req.teacherId]
      );

      if (classCheck.rows.length === 0) {
        throw new Error('Class not found');
      }

      // Deactivate class
      await client.query(
        'UPDATE classes SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [id]
      );

      // Optionally deactivate students in this class or move them to unassigned
      await client.query(
        'UPDATE students SET class_id = NULL, updated_at = CURRENT_TIMESTAMP WHERE class_id = $1',
        [id]
      );

      return true;
    });

    res.json({ message: 'Class deleted successfully' });

  } catch (error) {
    console.error('Delete class error:', error);
    if (error.message === 'Class not found') {
      return res.status(404).json({ error: 'Class not found' });
    }
    res.status(500).json({ error: 'Failed to delete class' });
  }
});

// Get students in a specific class
router.get('/:id/students', authenticateTeacher, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify class belongs to teacher
    const classCheck = await query(
      'SELECT id FROM classes WHERE id = $1 AND teacher_id = $2 AND is_active = TRUE',
      [id, req.teacherId]
    );

    if (classCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Class not found' });
    }

    const result = await query(`
      SELECT s.*
      FROM students s
      WHERE s.class_id = $1 AND s.is_active = TRUE
      ORDER BY s.full_name ASC
    `, [id]);

    res.json(result.rows);

  } catch (error) {
    console.error('Get class students error:', error);
    res.status(500).json({ error: 'Failed to get class students' });
  }
});

// Get available professions list
router.get('/meta/professions', (req, res) => {
  const professions = [
    'מתמטיקה',
    'אנגלית', 
    'פיזיקה',
    'כימיה',
    'ביולוגיה',
    'היסטוריה',
    'גאוגרפיה',
    'ספרות',
    'תנ"ך',
    'אמנות',
    'מוסיקה',
    'חינוך גשמי',
    'מדעי המחשב'
  ];

  res.json(professions);
});

module.exports = router;