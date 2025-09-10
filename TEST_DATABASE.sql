-- TEST DATABASE SETUP - Run this to check everything
-- This will verify your database is set up correctly

-- Check if tables exist
SELECT 'Tables:' as info, table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('students', 'teachers', 'user_roles');

-- Check your teacher account
SELECT 'Teacher Account:' as info, ur.role, t.name, u.email
FROM user_roles ur
LEFT JOIN teachers t ON ur.user_id = t.user_id
LEFT JOIN auth.users u ON ur.user_id = u.id
WHERE u.email = 'pratiksindhiya3@gmail.com';

-- Check student account
SELECT 'Student Account:' as info, ur.role, s.name, s.subject, s.marks, u.email
FROM user_roles ur
LEFT JOIN students s ON ur.user_id = s.user_id
LEFT JOIN auth.users u ON ur.user_id = u.id
WHERE u.email = 'pratiksindhiya103@gmail.com';

-- Check all students (should be visible to teacher)
SELECT 'All Students:' as info, s.name, s.subject, s.marks, u.email
FROM students s
JOIN auth.users u ON s.user_id = u.id;

-- Check RLS policies
SELECT 'Policies:' as info, tablename, policyname, cmd FROM pg_policies 
WHERE tablename IN ('students', 'teachers', 'user_roles')
ORDER BY tablename, policyname;