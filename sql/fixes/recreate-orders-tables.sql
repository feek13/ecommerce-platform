-- 重新创建订单表（修复字段问题）
-- 在 Supabase SQL Editor 中执行

-- ============================================================
-- 第一步：删除现有的表和策略
-- ============================================================

-- 删除 order_items 表（需要先删除，因为它依赖 orders）
DROP TABLE IF EXISTS order_items CASCADE;

-- 删除 orders 表
DROP TABLE IF EXISTS orders CASCADE;

-- ============================================================
-- 第二步：重新创建 orders 表
-- ============================================================

CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  shipping_address JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 第三步：重新创建 order_items 表
-- ============================================================

CREATE TABLE order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 第四步：创建索引
-- ============================================================

CREATE INDEX orders_user_id_idx ON orders(user_id);
CREATE INDEX orders_status_idx ON orders(status);
CREATE INDEX orders_created_at_idx ON orders(created_at DESC);
CREATE INDEX order_items_order_id_idx ON order_items(order_id);
CREATE INDEX order_items_product_id_idx ON order_items(product_id);

-- ============================================================
-- 第五步：启用 RLS
-- ============================================================

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 第六步：创建简化的 RLS 策略（无递归）
-- ============================================================

-- Orders 表策略
CREATE POLICY "orders_select_own"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "orders_insert_own"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "orders_update_own"
  ON orders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Order Items 表策略
CREATE POLICY "order_items_select_all"
  ON order_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "order_items_insert_all"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================================
-- 第七步：创建触发器（自动更新 updated_at）
-- ============================================================

CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_orders_updated_at();

-- ============================================================
-- 第八步：验证表结构
-- ============================================================

-- 显示 orders 表的列
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'orders'
ORDER BY ordinal_position;

-- 显示 order_items 表的列
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'order_items'
ORDER BY ordinal_position;

-- 显示 RLS 策略
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('orders', 'order_items')
ORDER BY tablename, policyname;

-- ============================================================
-- 预期结果
-- ============================================================
-- orders 表应该包含以下列：
--   - id (bigint)
--   - user_id (uuid)
--   - total_amount (numeric)  ← 重要！
--   - status (text)
--   - shipping_address (jsonb)
--   - created_at (timestamptz)
--   - updated_at (timestamptz)
--
-- order_items 表应该包含以下列：
--   - id (bigint)
--   - order_id (bigint)
--   - product_id (bigint)
--   - quantity (integer)
--   - price (numeric)
--   - created_at (timestamptz)
-- ============================================================
