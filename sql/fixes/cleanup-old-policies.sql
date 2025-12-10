-- 清理所有旧的订单相关策略
-- 在 Supabase SQL Editor 中执行此脚本

-- ============================================================
-- 删除 order_items 表的所有策略
-- ============================================================

DROP POLICY IF EXISTS "Order items viewable by order owner or seller" ON order_items;
DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;
DROP POLICY IF EXISTS "Users can create order items" ON order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;
DROP POLICY IF EXISTS "order_items_select_authenticated" ON order_items;
DROP POLICY IF EXISTS "order_items_insert_authenticated" ON order_items;

-- ============================================================
-- 删除 orders 表的所有策略
-- ============================================================

DROP POLICY IF EXISTS "Orders viewable by owner or seller" ON orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON orders;
DROP POLICY IF EXISTS "orders_select_own" ON orders;
DROP POLICY IF EXISTS "orders_insert_own" ON orders;
DROP POLICY IF EXISTS "orders_update_own" ON orders;

-- ============================================================
-- 重新创建简化的策略（无递归）
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
-- 验证最终策略
-- ============================================================

-- 显示 orders 表策略
SELECT
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'orders'
ORDER BY policyname;

-- 显示 order_items 表策略
SELECT
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'order_items'
ORDER BY policyname;

-- ============================================================
-- 预期结果
-- ============================================================
-- orders 表应该有 3 个策略：
--   1. orders_select_own (SELECT)
--   2. orders_insert_own (INSERT)
--   3. orders_update_own (UPDATE)
--
-- order_items 表应该有 2 个策略：
--   1. order_items_select_all (SELECT)
--   2. order_items_insert_all (INSERT)
-- ============================================================
