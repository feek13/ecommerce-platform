-- ================================================
-- 更新现有的 admin profile
-- ================================================

-- 1. 先查看现有的 profile
SELECT * FROM profiles WHERE email = 'admin@gmail.com';

-- 2. 更新为 admin 角色
UPDATE profiles
SET role = 'admin'
WHERE email = 'admin@gmail.com';

-- 3. 验证更新结果
SELECT id, email, full_name, role, created_at
FROM profiles
WHERE email = 'admin@gmail.com';

-- ================================================
-- 修复 RLS 策略（这很重要！）
-- ================================================

-- 删除所有现有的 profiles 策略
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Enable insert for service role" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles;

-- 创建简单且有效的策略
-- 策略 1: 任何已认证用户可以查看自己的 profile
CREATE POLICY "authenticated_users_select_own"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- 策略 2: 任何已认证用户可以更新自己的 profile
CREATE POLICY "authenticated_users_update_own"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- 策略 3: Service role 可以插入（用于注册时自动创建）
CREATE POLICY "service_role_insert"
ON profiles FOR INSERT
TO service_role
WITH CHECK (true);

-- 策略 4: 认证用户可以插入自己的 profile
CREATE POLICY "authenticated_users_insert_own"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- ================================================
-- 最终验证
-- ================================================
SELECT
  id,
  email,
  full_name,
  role,
  created_at
FROM profiles
ORDER BY created_at DESC;
