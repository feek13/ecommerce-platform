-- ================================================
-- 设置 admin@gmail.com 为管理员
-- ================================================

-- 第一步：查看当前用户信息
SELECT
  id,
  email,
  full_name,
  role,
  created_at
FROM profiles
WHERE email = 'admin@gmail.com';

-- 第二步：设置为管理员
UPDATE profiles
SET role = 'admin'
WHERE email = 'admin@gmail.com';

-- 第三步：验证是否成功
SELECT
  email,
  role,
  CASE
    WHEN role = 'admin' THEN '✅ 管理员设置成功！'
    ELSE '❌ 还不是管理员'
  END as status
FROM profiles
WHERE email = 'admin@gmail.com';

-- ================================================
-- 如果上面没有返回结果，说明账号还不存在
-- 请先在网站注册账号：admin@gmail.com
-- ================================================
