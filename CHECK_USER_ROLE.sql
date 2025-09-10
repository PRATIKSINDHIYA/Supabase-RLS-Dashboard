-- Check User Role and Fix if Needed
-- Run this in Supabase SQL Editor

-- Check if you have a user role set
SELECT 
    ur.id,
    ur.user_id,
    ur.role,
    u.email
FROM user_roles ur
JOIN auth.users u ON ur.user_id = u.id
WHERE u.email = 'pratiksindhiya3@gmail.com';

-- If no role found, create one (replace with your actual user_id)
-- First, get your user_id
SELECT id, email FROM auth.users WHERE email = 'pratiksindhiya3@gmail.com';

-- Then insert the role (replace 'YOUR_USER_ID' with the actual ID from above)
-- INSERT INTO user_roles (user_id, role) VALUES ('YOUR_USER_ID', 'teacher');

-- Check if you have a teacher profile
SELECT 
    t.id,
    t.user_id,
    t.name,
    u.email
FROM teachers t
JOIN auth.users u ON t.user_id = u.id
WHERE u.email = 'pratiksindhiya3@gmail.com';

-- If no teacher profile found, create one (replace with your actual user_id)
-- INSERT INTO teachers (user_id, name) VALUES ('YOUR_USER_ID', 'Pratik Sindhiya');