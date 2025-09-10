-- COMPLETE FIX - Run this entire script
-- This will set up everything properly

-- ===========================================
-- STEP 1: CLEAN EVERYTHING
-- ===========================================

-- Drop all tables first
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- ===========================================
-- STEP 2: CREATE TABLES
-- ===========================================

-- Create students table
CREATE TABLE students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    marks INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create teachers table
CREATE TABLE teachers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('student', 'teacher')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_teachers_user_id ON teachers(user_id);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role);

-- Create function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- STEP 3: CREATE RLS POLICIES
-- ===========================================

-- STUDENTS TABLE POLICIES
CREATE POLICY "Students can view own data" ON students
    FOR SELECT USING (
        user_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() AND role = 'student'
        )
    );

CREATE POLICY "Students can insert own data" ON students
    FOR INSERT WITH CHECK (
        user_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() AND role = 'student'
        )
    );

CREATE POLICY "Teachers can view all students" ON students
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() AND role = 'teacher'
        )
    );

CREATE POLICY "Teachers can insert students" ON students
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() AND role = 'teacher'
        )
    );

CREATE POLICY "Teachers can update students" ON students
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() AND role = 'teacher'
        )
    );

CREATE POLICY "Teachers can delete students" ON students
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() AND role = 'teacher'
        )
    );

-- TEACHERS TABLE POLICIES
CREATE POLICY "Teachers can view all teachers" ON teachers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() AND role = 'teacher'
        )
    );

CREATE POLICY "Teachers can insert own data" ON teachers
    FOR INSERT WITH CHECK (
        user_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() AND role = 'teacher'
        )
    );

-- USER_ROLES TABLE POLICIES
CREATE POLICY "Users can view own role" ON user_roles
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own role" ON user_roles
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- ===========================================
-- STEP 4: SET UP TEST DATA
-- ===========================================

-- Set up teacher account (pratiksindhiya3@gmail.com)
INSERT INTO user_roles (user_id, role) 
SELECT id, 'teacher' FROM auth.users WHERE email = 'pratiksindhiya3@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'teacher';

INSERT INTO teachers (user_id, name) 
SELECT id, 'Pratik Sindhiya' FROM auth.users WHERE email = 'pratiksindhiya3@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET name = 'Pratik Sindhiya';

-- Set up student account (pratiksindhiya103@gmail.com)
INSERT INTO user_roles (user_id, role) 
SELECT id, 'student' FROM auth.users WHERE email = 'pratiksindhiya103@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'student';

INSERT INTO students (user_id, name, subject, marks) 
SELECT id, 'Piyush', 'Mathematics', 85 FROM auth.users WHERE email = 'pratiksindhiya103@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET name = 'Piyush', subject = 'Mathematics', marks = 85;

-- Create additional test students
INSERT INTO students (user_id, name, subject, marks) VALUES
((SELECT id FROM auth.users WHERE email = 'pratiksindhiya3@gmail.com'), 'John Doe', 'Mathematics', 85),
((SELECT id FROM auth.users WHERE email = 'pratiksindhiya3@gmail.com'), 'Jane Smith', 'Science', 92),
((SELECT id FROM auth.users WHERE email = 'pratiksindhiya3@gmail.com'), 'Bob Johnson', 'English', 78),
((SELECT id FROM auth.users WHERE email = 'pratiksindhiya3@gmail.com'), 'Alice Brown', 'History', 88);

-- ===========================================
-- STEP 5: VERIFY EVERYTHING
-- ===========================================

-- Check tables
SELECT 'Tables:' as info, table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('students', 'teachers', 'user_roles');

-- Check teacher account
SELECT 'Teacher:' as info, ur.role, t.name, u.email
FROM user_roles ur
LEFT JOIN teachers t ON ur.user_id = t.user_id
LEFT JOIN auth.users u ON ur.user_id = u.id
WHERE u.email = 'pratiksindhiya3@gmail.com';

-- Check student account
SELECT 'Student:' as info, ur.role, s.name, s.subject, s.marks, u.email
FROM user_roles ur
LEFT JOIN students s ON ur.user_id = s.user_id
LEFT JOIN auth.users u ON ur.user_id = u.id
WHERE u.email = 'pratiksindhiya103@gmail.com';

-- Check all students
SELECT 'All Students:' as info, s.name, s.subject, s.marks, u.email
FROM students s
JOIN auth.users u ON s.user_id = u.id;

-- Check policies
SELECT 'Policies:' as info, COUNT(*) as total FROM pg_policies 
WHERE tablename IN ('students', 'teachers', 'user_roles');