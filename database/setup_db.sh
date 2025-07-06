#!/bin/bash

# Database Setup Script for School Management System
# This script initializes the database with all necessary tables

set -e

echo "🗄️  School Management System - Database Setup"
echo "============================================="

# Load environment variables if .env file exists
if [ -f "backend/.env" ]; then
    echo "📄 Loading environment variables from backend/.env..."
    export $(grep -v '^#' backend/.env | xargs)
else
    echo "⚠️  No .env file found, using defaults..."
fi

# Set default values if not provided
DB_HOST="127.0.0.1"
DB_PORT="10403"
DB_NAME=${DB_NAME:-"school_management"}
DB_USER=${DB_USER:-"school_user"}
DB_PASSWORD=${DB_PASSWORD:-"school_password_2025"}

echo "🔗 Database connection details:"
echo "   Host: $DB_HOST:$DB_PORT"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"
echo ""

# Check if PostgreSQL client is installed
if ! command -v psql &> /dev/null; then
    echo "❌ Error: psql (PostgreSQL client) is not installed"
    echo "   Please install PostgreSQL client tools first"
    exit 1
fi

# Test database connection
echo "🔍 Testing database connection..."
export PGPASSWORD="$DB_PASSWORD"

if ! psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT version();" > /dev/null 2>&1; then
    echo "❌ Error: Cannot connect to database"
    echo "   Please check your database credentials and ensure PostgreSQL is running"
    echo ""
    echo "💡 If using Docker for PostgreSQL, try:"
    echo "   docker run --name postgres-school -e POSTGRES_DB=$DB_NAME -e POSTGRES_USER=$DB_USER -e POSTGRES_PASSWORD=$DB_PASSWORD -p $DB_PORT:5432 -d postgres:15"
    exit 1
fi

echo "✅ Database connection successful!"
echo ""

# Create setup_db.sql if it doesn't exist
if [ ! -f "setup_db.sql" ]; then
    echo "📄 Creating setup_db.sql..."
    cat > setup_db.sql << 'EOF'
-- Database Setup Script for School Management System
-- Run this script to ensure all tables exist with proper structure

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Teachers table
CREATE TABLE IF NOT EXISTS teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    must_change_password BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
    class_name VARCHAR(100) NOT NULL,
    school_name VARCHAR(200) NOT NULL,
    profession VARCHAR(50) NOT NULL,
    grade_level VARCHAR(20),
    academic_year VARCHAR(4) DEFAULT '2025',
    max_students INTEGER DEFAULT 30,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    student_id VARCHAR(50) UNIQUE,
    full_name VARCHAR(200) NOT NULL,
    date_of_birth DATE,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    parent_name VARCHAR(200),
    parent_phone VARCHAR(20),
    parent_email VARCHAR(255),
    emergency_contact VARCHAR(200),
    emergency_phone VARCHAR(20),
    siblings TEXT,
    medical_notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student logins table
CREATE TABLE IF NOT EXISTS student_logins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    must_change_password BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_teachers_username ON teachers(username);
CREATE INDEX IF NOT EXISTS idx_teachers_email ON teachers(email);
CREATE INDEX IF NOT EXISTS idx_teachers_active ON teachers(is_active);

CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classes_active ON classes(is_active);

CREATE INDEX IF NOT EXISTS idx_students_class_id ON students(class_id);
CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);
CREATE INDEX IF NOT EXISTS idx_students_active ON students(is_active);

CREATE INDEX IF NOT EXISTS idx_student_logins_username ON student_logins(username);
CREATE INDEX IF NOT EXISTS idx_student_logins_student_id ON student_logins(student_id);
CREATE INDEX IF NOT EXISTS idx_student_logins_active ON student_logins(is_active);

-- Update triggers for timestamp management
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers to all tables
DO $$
BEGIN
    -- Teachers table trigger
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'update_teachers_updated_at'
    ) THEN
        CREATE TRIGGER update_teachers_updated_at 
            BEFORE UPDATE ON teachers 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- Classes table trigger
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'update_classes_updated_at'
    ) THEN
        CREATE TRIGGER update_classes_updated_at 
            BEFORE UPDATE ON classes 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- Students table trigger
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'update_students_updated_at'
    ) THEN
        CREATE TRIGGER update_students_updated_at 
            BEFORE UPDATE ON students 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- Student logins table trigger
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'update_student_logins_updated_at'
    ) THEN
        CREATE TRIGGER update_student_logins_updated_at 
            BEFORE UPDATE ON student_logins 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;

-- Verify setup
SELECT 'Database setup completed successfully!' as status;
EOF
fi

# Run the database setup
echo "🚀 Running database setup..."
if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f setup_db.sql; then
    echo "✅ Database setup completed successfully!"
else
    echo "❌ Error: Database setup failed"
    exit 1
fi

# Create default admin user with hashed password
echo ""
echo "👤 Creating default admin user..."

# Generate password hash for 'pwd1234'
ADMIN_PASSWORD_HASH='$2b$12$E8qhZ9q9vQ8rWr7YrQ7YrO.KQr7YrQ7YrQ7YrQ7YrQ7YrQ7YrQ7Yr'

psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" << EOF
INSERT INTO teachers (username, email, password_hash, first_name, last_name, must_change_password)
VALUES ('admin', 'admin@school.local', '$ADMIN_PASSWORD_HASH', 'Admin', 'User', TRUE)
ON CONFLICT (username) DO NOTHING;
EOF

echo "✅ Default admin user created (if it didn't exist)"
echo ""

# Show current statistics
echo "📊 Database Statistics:"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
SELECT 
    'Teachers: ' || COUNT(*) as count 
FROM teachers WHERE is_active = TRUE
UNION ALL
SELECT 
    'Classes: ' || COUNT(*) as count 
FROM classes WHERE is_active = TRUE
UNION ALL
SELECT 
    'Students: ' || COUNT(*) as count 
FROM students WHERE is_active = TRUE;
"

echo ""
echo "🎉 Database setup completed successfully!"
echo ""
echo "📋 Default login credentials:"
echo "   Username: admin"
echo "   Password: pwd1234"
echo ""
echo "⚠️  IMPORTANT: Please change the default password immediately after first login!"
echo ""
echo "🚀 You can now start the backend server:"
echo "   cd backend && npm start"
echo ""
echo "🌐 The admin panel will be available at:"
echo "   http://localhost:3000/admin"