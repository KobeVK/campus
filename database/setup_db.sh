#!/bin/bash

# School Database Setup Script
# Run this script to create the database structure on RDS

DB_NAME="campus"
DB_USER="campus_admin"  # Fixed typo from campus_admimn
DB_PASSWORD="school_password_2025"

# RDS connection variables
RDS_HOST="127.0.0.1"
rds_sdm_port="10403"  # Default to 5432 if not set

echo "Creating database and user..."
echo "Connecting to RDS at ${RDS_HOST}:${rds_sdm_port}"

# Connect to PostgreSQL and create database and user
psql -q -h "${RDS_HOST}" -p "${rds_sdm_port}" -U postgres -c "CREATE DATABASE ${DB_NAME};"
psql -q -h "${RDS_HOST}" -p "${rds_sdm_port}" -U postgres -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';"
psql -q -h "${RDS_HOST}" -p "${rds_sdm_port}" -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};"

echo "Creating tables..."

# Connect to the school database and create tables
psql -q -h "${RDS_HOST}" -p "${rds_sdm_port}" -U postgres -d "${DB_NAME}" << EOF

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Teachers table
CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
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
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    class_name VARCHAR(100) NOT NULL,
    school_name VARCHAR(200) NOT NULL,
    profession VARCHAR(100) NOT NULL, -- math, english, physics, etc.
    grade_level VARCHAR(20), -- כיתה א', כיתה ב', etc.
    academic_year VARCHAR(20) DEFAULT '2025',
    max_students INTEGER DEFAULT 30,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students table
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    student_id VARCHAR(50) UNIQUE, -- School student ID
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
    siblings TEXT, -- JSON or comma-separated list
    medical_notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student login credentials (separate for security)
CREATE TABLE student_logins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    must_change_password BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_teachers_username ON teachers(username);
CREATE INDEX idx_teachers_email ON teachers(email);
CREATE INDEX idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX idx_students_class_id ON students(class_id);
CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_student_logins_username ON student_logins(username);
CREATE INDEX idx_student_logins_student_id ON student_logins(student_id);

-- Grant permissions to campus_admin
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ${DB_USER};
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ${DB_USER};

-- Insert default teacher account (username: admin, password: pwd1234)
-- Password hash for 'pwd1234' using bcrypt
INSERT INTO teachers (username, email, password_hash, first_name, last_name, must_change_password) 
VALUES ('admin', 'admin@school.local', '\$2b\$10\$92IXUNpkjO0rOQ5byMi.Ye4oNEjR8j4H1.V1CvTl/d8XQ6Qd1aAsy', 'Admin', 'User', TRUE);

-- Insert a sample teacher
INSERT INTO teachers (username, email, password_hash, first_name, last_name, phone, must_change_password) 
VALUES ('sarah.cohen', 'sarah.cohen@school.local', '\$2b\$10\$92IXUNpkjO0rOQ5byMi.Ye4oNEjR8j4H1.V1CvTl/d8XQ6Qd1aAsy', 'שרה', 'כהן', '050-1234567', TRUE);

-- Insert sample classes
INSERT INTO classes (teacher_id, class_name, school_name, profession, grade_level) 
SELECT id, 'כיתה ז1', 'בית ספר הר המורה', 'מתמטיקה', 'כיתה ז' 
FROM teachers WHERE username = 'sarah.cohen';

EOF

echo "Database setup completed!"
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo "Password: $DB_PASSWORD"
echo "RDS Host: $RDS_HOST"
echo "RDS Port: $rds_sdm_port"
echo ""
echo "Default login credentials:"
echo "Username: admin"
echo "Password: pwd1234"
echo ""
echo "Sample teacher login:"
echo "Username: sarah.cohen"
echo "Password: pwd1234"