const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const teacherRoutes = require('./routes/teachers');
const studentRoutes = require('./routes/students');
const classRoutes = require('./routes/classes');

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting - EXCLUDE health checks
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000,
  message: 'Too many requests from this IP, please try again later.',
  skip: (req) => {
    // Skip rate limiting for health checks and probes
    return req.path === '/health' || 
           req.get('User-Agent')?.includes('kube-probe') ||
           req.get('User-Agent')?.includes('GoogleHC');
  }
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiting AFTER health check
app.use(limiter);

// Health check endpoint (before rate limiting)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'School Management API',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/classes', classRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ 
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(500).json({ 
      error: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString()
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 School Management Server running on port ${PORT}`);
  console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`💾 Database: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
});
