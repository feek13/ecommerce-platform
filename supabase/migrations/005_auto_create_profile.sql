-- ================================
-- 自动创建 Profile 触发器
-- ================================

-- 当用户在 auth.users 表中注册时，自动在 profiles 表中创建对应的记录

-- 创建触发器函数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- 插入新的 profile 记录
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'user'  -- 默认角色为普通用户
  )
  ON CONFLICT (id) DO NOTHING;  -- 如果已存在则忽略

  RETURN NEW;
END;
$$;

-- 创建触发器
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 提示信息
DO $$
BEGIN
  RAISE NOTICE '成功！已创建自动创建 profile 的触发器。现在用户注册后会自动创建 profile 记录。';
END $$;
