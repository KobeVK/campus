const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

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

// Validation for creating/updating schools
const validateSchool = [
  body('name').trim().isLength({ min: 2, max: 200 }).withMessage('School name must be 2-200 characters'),
  body('address').optional().trim().isLength({ max: 500 }).withMessage('Address too long'),
  body('phone').optional().trim().matches(/^[\d\-\+\(\)\s]+$/).withMessage('Invalid phone format'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('website').optional().isURL().withMessage('Invalid website URL')
];

// Get all schools
router.get('/', authenticateTeacher, async (req, res) => {
  try {
    const result = await query(`
      SELECT * FROM schools 
      WHERE is_active = TRUE 
      ORDER BY created_at DESC
    `);
    res.json({ schools: result.rows });
  } catch (err) {
    console.error('Get schools error:', err);
    res.status(500).json({ error: 'Failed to fetch schools' });
  }
});

// Get single school by ID
router.get('/:id', authenticateTeacher, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM schools WHERE id = $1 AND is_active = TRUE', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'School not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get school error:', err);
    res.status(500).json({ error: 'Failed to fetch school' });
  }
});

// Add a new school
router.post('/', authenticateTeacher, validateSchool, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { name, address, phone, email, website } = req.body;
    
    const result = await query(`
      INSERT INTO schools (name, address, phone, email, website) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `, [name, address || null, phone || null, email || null, website || null]);
    
    res.status(201).json({ 
      message: 'School created successfully',
      school: result.rows[0] 
    });
  } catch (err) {
    console.error('Create school error:', err);
    res.status(500).json({ error: 'Failed to add school' });
  }
});

// Update school
router.put('/:id', authenticateTeacher, validateSchool, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { id } = req.params;
    const { name, address, phone, email, website } = req.body;
    
    const result = await query(`
      UPDATE schools 
      SET name = $1, address = $2, phone = $3, email = $4, website = $5, updated_at = CURRENT_TIMESTAMP
      WHERE id = $6 AND is_active = TRUE
      RETURNING *
    `, [name, address, phone, email, website, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'School not found' });
    }
    
    res.json({ 
      message: 'School updated successfully',
      school: result.rows[0] 
    });
  } catch (err) {
    console.error('Update school error:', err);
    res.status(500).json({ error: 'Failed to update school' });
  }
});

// Delete (deactivate) school
router.delete('/:id', authenticateTeacher, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query(`
      UPDATE schools 
      SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 AND is_active = TRUE
    `, [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'School not found' });
    }
    
    res.json({ message: 'School deleted successfully' });
  } catch (err) {
    console.error('Delete school error:', err);
    res.status(500).json({ error: 'Failed to delete school' });
  }
});

module.exports = router;