-- 添加缺失的商品分类

INSERT INTO categories (name, slug, description, display_order)
VALUES
  ('食品生鲜', 'food', '食品、饮料、生鲜食品', 5),
  ('美妆个护', 'beauty', '化妆品、护肤品、个人护理', 6)
ON CONFLICT (slug) DO NOTHING;

-- 查看所有分类
SELECT id, name, slug, description FROM categories ORDER BY display_order;
