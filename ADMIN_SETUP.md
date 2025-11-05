# 🔧 管理员后台快速设置指南

## ❌ 问题：无法访问管理员后台

如果你访问 http://localhost:3001/admin 时被重定向到首页，说明你的账号还不是管理员角色。

---

## ✅ 解决方案

### 方法 1：设置现有账号为管理员

**第一步：登录你的账号**

访问 http://localhost:3001/login 并登录你的账号。

**第二步：在 Supabase 中执行 SQL**

1. 打开 Supabase Dashboard
2. 选择你的项目
3. 点击左侧菜单的 `SQL Editor`
4. 执行以下 SQL（将邮箱替换成你的）：

```sql
-- 设置为管理员
UPDATE profiles
SET role = 'admin'
WHERE email = 'admin@gmail.com';  -- 替换成你的邮箱

-- 验证是否成功
SELECT email, role FROM profiles WHERE email = 'admin@gmail.com';
```

**第三步：刷新页面**

1. 回到浏览器
2. 访问 http://localhost:3001/admin
3. 如果还不行，尝试退出登录再重新登录

---

### 方法 2：直接在数据库创建管理员账号

**在 Supabase SQL Editor 中执行：**

```sql
-- 查看所有用户及其角色
SELECT
  email,
  full_name,
  role,
  created_at
FROM profiles
ORDER BY created_at DESC;

-- 找到你的账号，然后更新角色
UPDATE profiles
SET role = 'admin'
WHERE id = 'your-user-id';  -- 从上面查询结果中复制 ID

-- 或者直接通过邮箱更新
UPDATE profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

---

## 🔍 调试步骤

### 1. 检查账号是否存在

```sql
SELECT * FROM profiles WHERE email = 'your-email@example.com';
```

如果没有返回结果，说明：
- 你还没注册账号
- 邮箱地址不对

### 2. 检查当前角色

```sql
SELECT email, role FROM profiles;
```

可能的角色值：
- `user` - 普通用户（默认）
- `seller` - 商家
- `admin` - 管理员

### 3. 检查浏览器控制台

打开浏览器控制台（F12），访问 `/admin`，查看输出：

- `Admin: No user, redirecting to login` → 你没登录
- `Admin: User role is user not admin` → 角色不是 admin
- `Admin: Access granted` → 权限正确！

---

## 📊 完整设置流程

```bash
# 1. 注册账号
访问: http://localhost:3001/signup
填写: admin@gmail.com / Admin123 / 管理员

# 2. 在 Supabase 设置角色
UPDATE profiles
SET role = 'admin'
WHERE email = 'admin@gmail.com';

# 3. 登录账号
访问: http://localhost:3001/login
输入: admin@gmail.com / Admin123

# 4. 访问管理员后台
访问: http://localhost:3001/admin
```

---

## ⚡ 一键设置脚本

如果你想快速创建一个测试管理员账号，可以在 Supabase SQL Editor 中执行：

```sql
-- 注意：这会创建一个没有密码的账号，需要你手动在网站上注册

-- 1. 先在网站注册账号：admin@gmail.com

-- 2. 然后执行这个命令设置为管理员
UPDATE profiles
SET
  role = 'admin',
  full_name = 'Super Admin'
WHERE email = 'admin@gmail.com';

-- 3. 验证
SELECT
  email,
  full_name,
  role,
  created_at
FROM profiles
WHERE email = 'admin@gmail.com';
```

---

## 🎯 访问后台后可以做什么

成功进入管理员后台后，你可以：

### 1. 数据概览 (`/admin`)
- 查看总用户数
- 查看商家数量
- 查看商品总数
- 查看订单总数
- 查看待审核申请数

### 2. 商家申请审批 (`/admin/applications`)
- 查看所有商家申请
- 查看申请详情（店铺信息、联系方式等）
- 通过或拒绝申请
- 通过后自动将用户升级为商家

### 3. 其他管理功能（待实现）
- 用户管理
- 商品管理
- 订单管理

---

## 🚨 常见错误

### 错误 1：页面一直加载（白屏）

**原因**：Profile 表还没有数据

**解决**：
```sql
-- 检查 profiles 表
SELECT * FROM profiles;

-- 如果为空，确保触发器已创建
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    'user'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 错误 2：弹出"没有管理员权限"

**原因**：Role 不是 'admin'

**解决**：
```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

### 错误 3：被重定向到登录页

**原因**：你没登录

**解决**：先访问 http://localhost:3001/login 登录

---

## 📝 快速检查清单

- [ ] 已在网站注册账号
- [ ] 已在 Supabase 执行 UPDATE profiles SQL
- [ ] 已刷新浏览器
- [ ] 已确认 profiles 表中 role = 'admin'
- [ ] 浏览器控制台没有错误

---

## 💡 提示

1. **邮箱大小写**：SQL 查询区分大小写，确保邮箱完全匹配
2. **刷新缓存**：修改角色后，尝试硬刷新（Ctrl+Shift+R 或 Cmd+Shift+R）
3. **重新登录**：如果还不行，退出登录再重新登录
4. **检查 RLS**：确保 profiles 表的 RLS 策略正确设置

---

## 🎉 成功！

如果你看到管理员后台的数据概览页面，恭喜！你已经成功设置管理员账号！

现在你可以：
- 审批商家申请
- 查看平台数据
- 管理用户和商品

开始管理你的电商平台吧！🚀
