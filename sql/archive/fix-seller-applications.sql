-- ================================================
-- 修复 seller_applications 表
-- ================================================

-- 第一步：查看当前表结构
\d seller_applications

-- 第二步：添加缺失的字段
ALTER TABLE seller_applications
ADD COLUMN IF NOT EXISTS business_description TEXT,
ADD COLUMN IF NOT EXISTS contact_address TEXT,
ADD COLUMN IF NOT EXISTS id_card TEXT;

-- 第三步：修改必填字段为可选
ALTER TABLE seller_applications
ALTER COLUMN business_type DROP NOT NULL,
ALTER COLUMN contact_person DROP NOT NULL;

-- 第四步：删除 UNIQUE 约束（允许用户多次申请）
ALTER TABLE seller_applications
DROP CONSTRAINT IF EXISTS seller_applications_user_id_key;

-- 第五步：添加索引
CREATE INDEX IF NOT EXISTS idx_seller_applications_user ON seller_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_seller_applications_status ON seller_applications(status);
CREATE INDEX IF NOT EXISTS idx_seller_applications_created ON seller_applications(created_at DESC);

-- 第六步：验证修改
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'seller_applications'
ORDER BY ordinal_position;

-- ================================================
-- 测试查询（以管理员身份）
-- ================================================

-- 查看所有申请
SELECT
  id,
  business_name,
  business_description,
  contact_phone,
  status,
  created_at
FROM seller_applications
ORDER BY created_at DESC;

-- ================================================
-- 完成！
-- ================================================

-- 如果以上 SQL 执行成功，刷新页面应该就不会再报错了
