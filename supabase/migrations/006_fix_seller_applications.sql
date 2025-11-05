-- ================================
-- 修复 seller_applications 表字段
-- ================================

-- 1. 添加缺失的字段
ALTER TABLE seller_applications
ADD COLUMN IF NOT EXISTS business_description TEXT,
ADD COLUMN IF NOT EXISTS contact_address TEXT,
ADD COLUMN IF NOT EXISTS id_card TEXT;

-- 2. 修改 business_type 为可选
ALTER TABLE seller_applications
ALTER COLUMN business_type DROP NOT NULL;

-- 3. 修改 contact_person 为可选
ALTER TABLE seller_applications
ALTER COLUMN contact_person DROP NOT NULL;

-- 4. 删除 UNIQUE 约束（允许用户多次申请）
ALTER TABLE seller_applications
DROP CONSTRAINT IF EXISTS seller_applications_user_id_key;

-- 5. 添加索引
CREATE INDEX IF NOT EXISTS idx_seller_applications_user ON seller_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_seller_applications_status ON seller_applications(status);
CREATE INDEX IF NOT EXISTS idx_seller_applications_created ON seller_applications(created_at DESC);
