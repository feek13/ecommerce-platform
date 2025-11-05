-- 修复 admin@gmail.com 的管理员角色
-- 将该用户的 role 从错误的值更新为 'admin'

UPDATE profiles
SET role = 'admin', updated_at = NOW()
WHERE email = 'admin@gmail.com';

-- 验证更新结果
SELECT id, email, role, full_name
FROM profiles
WHERE email = 'admin@gmail.com';
