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

-- Schools table
CREATE TABLE IF NOT EXISTS schools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

-- Default admin teacher account
INSERT INTO teachers (username, email, password_hash, first_name, last_name, is_active, must_change_password)
VALUES ('admin', 'admin@school.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZGHFQW1Yy1Q9wF6r0Yy3yF6lI1eWy', 'Admin', 'User', TRUE, TRUE);
