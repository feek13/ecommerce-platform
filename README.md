# E-Commerce Platform 电商平台

毕业设计项目 - 完整功能的电商网站系统

## 项目概述

基于 Amazon 购物网站风格的电商平台，包含用户、商家、管理员三种角色，支持商品展示、购物车、订单管理、评价系统和实时聊天等功能。

## 技术栈

- **前端框架**: Next.js 15 (App Router)
- **开发语言**: TypeScript
- **样式方案**: Tailwind CSS v4
- **后端服务**: Supabase (PostgreSQL + Auth + Realtime)
- **状态管理**: React Context API

## 核心功能

### 1. 用户系统
- 邮箱密码注册登录
- 三种角色：普通用户、商家、管理员
- 用户资料管理
- 地址管理

### 2. 商家系统
- 商家申请和审核
- 商品管理（发布、编辑、删除）
- 订单管理
- 售后聊天

### 3. 商品系统
- 商品列表展示
- 商品详情页
- 分类筛选
- 搜索功能
- 商品评价

### 4. 购物功能
- 购物车管理
- 商品收藏
- 订单创建
- 支付模拟
- 订单跟踪

### 5. 实时聊天
- 买家与商家实时沟通
- 基于 Supabase Realtime

### 6. 管理员功能
- 商家审核
- 商品管理
- 用户管理

## 快速开始

### 前置要求

- Node.js 18.x 或更高版本
- npm 或 yarn
- Supabase 账号

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local`：

```bash
cp .env.example .env.local
```

在 `.env.local` 中填入你的 Supabase 配置：

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. 创建数据库

在 Supabase 项目中运行以下 SQL 文件：

1. `supabase/migrations/001_initial_schema.sql` - 创建表结构
2. `supabase/migrations/002_rls_policies.sql` - 配置 RLS 策略

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看项目。

### 5. 创建初始数据

#### 创建管理员账户

在 Supabase SQL Editor 中执行：

```sql
-- 首先在 Supabase Auth 中手动创建一个用户账号
-- 然后将该用户的 role 设置为 admin
UPDATE profiles
SET role = 'admin'
WHERE email = 'your-admin-email@example.com';
```

#### 创建商品分类

```sql
INSERT INTO categories (name, slug, description) VALUES
('电子产品', 'electronics', '手机、电脑、相机等电子产品'),
('服装鞋包', 'fashion', '时尚服装和配饰'),
('家居生活', 'home', '家具、家纺、厨具等'),
('图书音像', 'books', '图书、音乐、影视作品'),
('运动户外', 'sports', '运动器材和户外装备');
```

## 项目结构

```
ecommerce-platform/
├── app/                      # Next.js App Router
│   ├── (auth)/              # 认证页面组
│   ├── (shop)/              # 购物页面组
│   ├── (seller)/            # 商家页面组
│   ├── (admin)/             # 管理员页面组
│   ├── api/                 # API 路由
│   └── providers/           # Context Providers
├── components/              # React 组件
│   ├── layout/             # 布局组件
│   ├── product/            # 商品相关组件
│   ├── cart/               # 购物车组件
│   └── ...
├── lib/                     # 工具库
│   ├── supabase.ts         # Supabase 客户端
│   └── utils.ts            # 工具函数
├── types/                   # TypeScript 类型定义
├── hooks/                   # 自定义 Hooks
├── supabase/migrations/    # 数据库迁移文件
└── public/                  # 静态资源
```

## 开发指南

### 数据库设计

项目包含以下核心数据表：

- `profiles` - 用户资料
- `categories` - 商品分类
- `products` - 商品信息
- `cart_items` - 购物车
- `orders` - 订单
- `reviews` - 评价
- `conversations` - 聊天会话
- `messages` - 聊天消息

详细的表结构和关系请查看 `supabase/migrations/` 目录。

### 认证流程

项目使用 Supabase Auth 进行用户认证，通过 `AuthProvider` 管理认证状态：

```tsx
import { useAuth } from '@/hooks/useAuth'

function MyComponent() {
  const { user, profile, loading } = useAuth()
  // ...
}
```

### 购物车管理

使用 `CartProvider` 管理购物车状态：

```tsx
import { useCart } from '@/hooks/useCart'

function ProductCard() {
  const { addItem } = useCart()
  // ...
}
```

## 部署

### Vercel 部署（推荐）

1. 将项目推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 点击部署

### 手动部署

```bash
npm run build
npm run start
```

## 开发路线图

- [x] 项目初始化和基础架构
- [ ] 用户认证和资料管理
- [ ] 商品展示和搜索
- [ ] 购物车和订单系统
- [ ] 评价系统
- [ ] 实时聊天
- [ ] 商家功能面板
- [ ] 管理员功能
- [ ] 性能优化

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

## 联系方式

如有问题，请通过以下方式联系：

- Email: your-email@example.com
- GitHub Issues: [项目 Issues 页面]

---

**注意**：这是一个毕业设计项目，仅用于学习和演示目的。
