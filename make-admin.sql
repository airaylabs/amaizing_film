-- ============================================================
-- MAKE USER ADMIN
-- Run this in Supabase SQL Editor
-- ============================================================

-- First, find your user ID from auth.users
-- SELECT id, email FROM auth.users;

-- Then insert/update the role (replace YOUR_USER_ID with actual UUID)
-- Example: INSERT INTO user_roles (user_id, role) VALUES ('your-uuid-here', 'admin');

-- Or use this to make the first user an admin:
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin' 
FROM auth.users 
WHERE email = 'airay.eko@gmail.com'  -- Change this to your email
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Verify
SELECT ur.*, au.email 
FROM user_roles ur 
JOIN auth.users au ON ur.user_id = au.id;
