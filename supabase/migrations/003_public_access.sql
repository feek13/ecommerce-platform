-- ================================
-- 允许公开访问（访客模式）
-- ================================

-- 删除原有的商品查看策略
DROP POLICY IF EXISTS "Active products are viewable by everyone" ON products;

-- 创建新的公开访问策略 - 所有人都可以查看激活的商品（不需要登录）
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (status = 'active');

-- 允许所有人查看商品分类
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
CREATE POLICY "Public can view categories"
  ON categories FOR SELECT
  USING (true);

-- 允许所有人查看商品评价
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON reviews;
CREATE POLICY "Public can view reviews"
  ON reviews FOR SELECT
  USING (true);

-- 允许所有人查看商家资料（用于商品页面显示商家信息）
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public can view profiles"
  ON profiles FOR SELECT
  USING (true);
