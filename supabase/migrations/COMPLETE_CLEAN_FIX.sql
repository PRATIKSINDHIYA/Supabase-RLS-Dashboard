-- COMPLETE CLEAN FIX - Run this single script in Supabase SQL Editor
-- This will delete all existing policies and create clean ones

-- ===========================================
-- STEP 1: DROP ALL EXISTING POLICIES
-- ===========================================

-- Drop all students table policies
DROP POLICY IF EXISTS "Students can view own data" ON students;
DROP POLICY IF EXISTS "Teachers can view all students" ON students;
DROP POLICY IF EXISTS "Teachers can insert students" ON students;
DROP POLICY IF EXISTS "Teachers can update students" ON students;
DROP POLICY IF EXISTS "Teachers can update student marks" ON students;
DROP POLICY IF EXISTS "Teachers can delete students" ON students;
DROP POLICY IF EXISTS "Students can insert own data" ON students;

-- Drop all teachers table policies
DROP POLICY IF EXISTS "Teachers can view all teachers" ON teachers;
DROP POLICY IF EXISTS "Teachers can insert own data" ON teachers;

-- Drop all user_roles table policies
DROP POLICY IF EXISTS "Users can view own role" ON user_roles;
DROP POLICY IF EXISTS "Users can insert own role" ON user_roles;
DROP POLICY IF EXISTS "Teachers can view all user roles" ON user_roles;
DROP POLICY IF EXISTS "Teachers can insert user roles" ON user_roles;
DROP POLICY IF EXISTS "Teachers can update user roles" ON user_roles;

-- ===========================================
-- STEP 2: CREATE CLEAN POLICIES
-- ===========================================

-- STUDENTS TABLE POLICIES
-- Students can only view their own data
CREATE POLICY "Students can view own data" ON students
    FOR SELECT USING (
        user_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() AND role = 'student'
        )
    );

-- Students can insert their own data (for registration)
CREATE POLICY "Students can insert own data" ON students
    FOR INSERT WITH CHECK (
        user_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() AND role = 'student'
        )
    );

-- Teachers can view all students
CREATE POLICY "Teachers can view all students" ON students
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() AND role = 'teacher'
        )
    );

-- Teachers can insert students
CREATE POLICY "Teachers can insert students" ON students
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() AND role = 'teacher'
        )
    );

-- Teachers can update students
CREATE POLICY "Teachers can update students" ON students
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() AND role = 'teacher'
        )
    );

-- Teachers can delete students
CREATE POLICY "Teachers can delete students" ON students
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() AND role = 'teacher'
        )
    );

-- TEACHERS TABLE POLICIES
-- Teachers can view all teachers
CREATE POLICY "Teachers can view all teachers" ON teachers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() AND role = 'teacher'
        )
    );

-- Teachers can insert their own data
CREATE POLICY "Teachers can insert own data" ON teachers
    FOR INSERT WITH CHECK (
        user_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() AND role = 'teacher'
        )
    );

-- USER_ROLES TABLE POLICIES (NO INFINITE RECURSION)
-- Users can view their own role
CREATE POLICY "Users can view own role" ON user_roles
    FOR SELECT USING (user_id = auth.uid());

-- Users can insert their own role (for registration)
CREATE POLICY "Users can insert own role" ON user_roles
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- ===========================================
-- STEP 3: VERIFY POLICIES
-- ===========================================

-- Check all policies were created successfully
SELECT 
    schemaname, 
    tablename, 
    policyname,
    cmd
FROM pg_policies 
WHERE tablename IN ('students', 'teachers', 'user_roles')
ORDER BY tablename, policyname;

-- Check RLS is enabled
SELECT 
    schemaname, 
    tablename, 
    rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('students', 'teachers', 'user_roles');