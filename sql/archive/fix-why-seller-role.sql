-- 修复 why@gmail.com 的商家角色
-- 将该用户的 role 从 'user' 更新为 'seller'

UPDATE profiles
SET role = 'seller', updated_at = NOW()
WHERE email = 'why@gmail.com';

-- 验证更新结果
SELECT id, email, role, full_name
FROM profiles
WHERE email = 'why@gmail.com';
