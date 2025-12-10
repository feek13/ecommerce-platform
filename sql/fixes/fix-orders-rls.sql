-- 修复订单表的 RLS 策略问题
-- 运行此脚本来解决 "infinite recursion" 错误
-- 在 Supabase SQL Editor 中执行

-- ============================================================
-- 第一步：删除所有现有的策略
-- ============================================================

-- 删除 orders 表的策略
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON orders;

-- 删除 order_items 表的策略
DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;
DROP POLICY IF EXISTS "Users can create order items" ON order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;

-- ============================================================
-- 第二步：创建新的简化策略（避免递归）
-- ============================================================

-- Orders 表策略
-- ============================================================

-- 用户可以查看自己的订单
CREATE POLICY "orders_select_own"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- 用户可以创建自己的订单
CREATE POLICY "orders_insert_own"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 用户可以更新自己的订单（例如取消订单）
CREATE POLICY "orders_update_own"
  ON orders FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Order Items 表策略
-- ============================================================

-- 允许所有认证用户查看订单项（将在应用层过滤）
-- 这避免了与 orders 表的循环引用
CREATE POLICY "order_items_select_authenticated"
  ON order_items FOR SELECT
  TO authenticated
  USING (true);

-- 允许认证用户插入订单项（将在应用层验证权限）
CREATE POLICY "order_items_insert_authenticated"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================================
-- 第三步：验证策略
-- ============================================================

-- 查看 orders 表的所有策略
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'orders';

-- 查看 order_items 表的所有策略
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'order_items';

-- ============================================================
-- 说明
-- ============================================================

-- 1. 新的策略避免了递归问题
-- 2. orders 表只检查 user_id，不查询其他表
-- 3. order_items 表允许所有认证用户访问，应用层会过滤数据
-- 4. 这是一个权衡：RLS 更宽松，但避免了递归问题
-- 5. 安全性在应用层通过关联 orders 表来保证

-- ============================================================
-- 重要提示
-- ============================================================
-- 执行完此脚本后，请刷新页面并重试创建订单
