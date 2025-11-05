# 项目启动指南

## 步骤 1: 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com)
2. 创建新项目
3. 等待项目初始化完成

## 步骤 2: 获取 API 密钥

在 Supabase 项目设置中找到以下信息：

1. 访问：`Project Settings` → `API`
2. 复制以下值：
   - Project URL (如: `https://xxx.supabase.co`)
   - anon/public key (以 `eyJ` 开头的长字符串)
   - service_role key (可选，用于管理员操作)

## 步骤 3: 配置环境变量

1. 复制环境变量模板：
   ```bash
   cd /Users/hxt/vibecode/ecommerce-platform
   cp .env.example .env.local
   ```

2. 编辑 `.env.local`，填入 Supabase 信息：
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## 步骤 4: 创建数据库

在 Supabase SQL Editor 中依次执行：

### 4.1 创建表结构
```bash
# 在 Supabase Dashboard → SQL Editor 中
# 复制并执行: supabase/migrations/001_initial_schema.sql
```

### 4.2 配置 RLS 策略
```bash
# 复制并执行: supabase/migrations/002_rls_policies.sql
```

### 4.3 启用 Realtime（用于聊天功能）
在 Supabase Dashboard → Database → Publications → supabase_realtime：
- 添加 `messages` 表
- 添加 `conversations` 表

## 步骤 5: 创建初始数据

### 5.1 创建商品分类
```sql
INSERT INTO categories (name, slug, description) VALUES
('电子产品', 'electronics', '手机、电脑、相机等电子产品'),
('服装鞋包', 'fashion', '时尚服装和配饰'),
('家居生活', 'home', '家具、家纺、厨具等'),
('图书音像', 'books', '图书、音乐、影视作品'),
('运动户外', 'sports', '运动器材和户外装备');
```

### 5.2 注册测试账号

1. 启动开发服务器：
   ```bash
   npm run dev
   ```

2. 访问 http://localhost:3000
3. 注册一个账号
4. 在 Supabase Auth → Users 中找到该用户

### 5.3 设置管理员
```sql
-- 将你的账号设置为管理员
UPDATE profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

### 5.4 创建商家申请（可选）
```sql
-- 插入一个已批准的商家申请
INSERT INTO seller_applications (
  user_id,
  business_name,
  business_type,
  contact_person,
  contact_phone,
  status
) VALUES (
  'your-user-id',  -- 从 profiles 表获取
  '测试商店',
  '个人',
  '张三',
  '13800138000',
  'approved'
);

-- 将用户角色更新为商家
UPDATE profiles
SET role = 'seller'
WHERE id = 'your-user-id';
```

## 步骤 6: 启动项目

```bash
npm run dev
```

访问 http://localhost:3000

## 故障排除

### 构建错误：缺少环境变量
- 确保 `.env.local` 文件存在
- 检查环境变量格式是否正确
- 重启开发服务器

### 数据库连接失败
- 检查 Supabase 项目是否正常运行
- 验证 API 密钥是否正确
- 检查网络连接

### 认证问题
- 确保 Auth 功能已启用
- 检查 Email Auth Provider 是否配置
- 在 Supabase → Authentication → Settings 中启用 Email 认证

### 实时聊天不工作
- 在 Supabase Dashboard → Database → Replication 中
- 确保 `messages` 和 `conversations` 表已添加到 Publication

## 测试账号建议

创建以下测试账号：

1. **管理员账号**: admin@test.com (role='admin')
2. **商家账号**: seller@test.com (role='seller')
3. **普通用户**: user@test.com (role='user')

## 下一步

项目已完成基础架构搭建，包括：

✅ Next.js 15 项目初始化
✅ Supabase 客户端配置
✅ 数据库 Schema 设计
✅ RLS 安全策略
✅ AuthProvider 认证管理
✅ CartProvider 购物车管理
✅ TypeScript 类型定义
✅ 项目文档

接下来需要开发的功能模块：

1. **认证页面** - 登录/注册界面
2. **商品展示** - 首页商品列表
3. **商品详情** - 单个商品页面
4. **购物车** - 购物车界面
5. **订单系统** - 创建和管理订单
6. **评价系统** - 商品评价
7. **实时聊天** - 买家卖家沟通
8. **商家面板** - 商品和订单管理
9. **管理员面板** - 系统管理

参考 README.md 和 CLAUDE.md 了解更多细节。
