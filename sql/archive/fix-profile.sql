-- ================================================
-- 修复 Profile 问题
-- ================================================

-- 步骤 1：检查当前用户是否有 profile
SELECT * FROM auth.users WHERE email = 'admin@gmail.com';

-- 步骤 2：手动创建 profile（如果不存在）
-- 注意：将下面的 user_id 替换成上面查询结果中的 id
INSERT INTO profiles (id, email, full_name, role, created_at)
VALUES (
  '84299a7a-2bae-479a-b5dc-74e0a02e2398',  -- 替换成你的 user id
  'admin@gmail.com',
  'Admin',
  'admin',
  NOW()
)
ON CONFLICT (id) DO UPDATE
SET role = 'admin';

-- 步骤 3：验证
SELECT id, email, full_name, role FROM profiles WHERE email = 'admin@gmail.com';

-- ================================================
-- 设置自动创建 Profile 的触发器
-- ================================================

-- 创建触发器函数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, created_at)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    'user',
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 删除旧触发器（如果存在）
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 创建新触发器
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ================================================
-- 修复 RLS 策略
-- ================================================

-- 启用 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 删除所有现有策略
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

-- 创建新的 RLS 策略

-- 1. 用户可以查看自己的 profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- 2. 用户可以更新自己的 profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 3. 管理员可以查看所有 profiles
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- 4. 管理员可以更新所有 profiles
CREATE POLICY "Admins can update all profiles"
ON profiles FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- 5. 允许系统创建新 profiles
CREATE POLICY "Enable insert for service role"
ON profiles FOR INSERT
WITH CHECK (true);

-- ================================================
-- 最后验证
-- ================================================

-- 查看所有用户的 profiles
SELECT
  id,
  email,
  full_name,
  role,
  created_at
FROM profiles
ORDER BY created_at DESC;
