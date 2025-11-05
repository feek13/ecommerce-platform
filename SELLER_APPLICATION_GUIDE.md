# 商家申请和管理系统使用指南

## 📋 系统概述

这是一个完整的商家申请和审批系统，包含以下功能：

1. **普通用户**：可以申请成为商家
2. **管理员**：审批商家申请
3. **商家**：管理商品（发布、编辑、删除）

---

## 🚀 快速开始

### 第一步：设置管理员账号

首先需要在 Supabase 中设置一个管理员账号：

```sql
-- 1. 注册一个账号（通过网站的注册页面）
-- 2. 然后在 Supabase SQL Editor 中执行以下命令，将该账号设为管理员

UPDATE profiles
SET role = 'admin'
WHERE email = 'admin@gmail.com';
```

### 第二步：确保数据库表已创建

确保 `seller_applications` 表已创建：

```sql
-- 如果表不存在，创建商家申请表
CREATE TABLE IF NOT EXISTS seller_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  business_name TEXT NOT NULL,
  business_description TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_address TEXT,
  business_license TEXT,
  id_card TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,

  CONSTRAINT unique_pending_application UNIQUE (user_id, status)
);

-- 创建索引以提高查询性能
CREATE INDEX idx_seller_applications_user_id ON seller_applications(user_id);
CREATE INDEX idx_seller_applications_status ON seller_applications(status);

-- 启用 RLS
ALTER TABLE seller_applications ENABLE ROW LEVEL SECURITY;

-- RLS 策略：用户可以查看自己的申请
CREATE POLICY "Users can view their own applications"
ON seller_applications FOR SELECT
USING (auth.uid() = user_id);

-- RLS 策略：用户可以创建自己的申请
CREATE POLICY "Users can create their own applications"
ON seller_applications FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS 策略：管理员可以查看所有申请
CREATE POLICY "Admins can view all applications"
ON seller_applications FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- RLS 策略：管理员可以更新所有申请
CREATE POLICY "Admins can update all applications"
ON seller_applications FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);
```

---

## 👤 用户角色和权限

### 1. 普通用户 (role = 'user')

**可以做什么：**
- 浏览商品
- 购买商品
- 查看个人资料
- **申请成为商家** ⭐

**如何申请成为商家：**

1. 登录账号
2. 进入 `个人中心` (http://localhost:3001/profile)
3. 在快捷操作中点击 `成为商家` 按钮
4. 填写申请表单：
   - 店铺名称 *（必填）
   - 店铺简介 *（必填）
   - 联系电话 *（必填）
   - 联系地址（选填）
   - 营业执照编号（选填）
   - 身份证号（选填）
5. 阅读并同意服务协议
6. 提交申请
7. 等待管理员审核（1-3 个工作日）

**申请状态：**
- ⏳ **待审核**：申请已提交，等待管理员审核
- ✅ **已通过**：申请通过，账号已升级为商家
- ❌ **已拒绝**：申请被拒绝，可联系客服了解原因

---

### 2. 管理员 (role = 'admin')

**可以做什么：**
- 查看平台数据统计
- **审批商家申请** ⭐
- 管理所有用户
- 管理所有商品
- 管理所有订单

**如何审批商家申请：**

1. 登录管理员账号
2. 访问 `管理员后台` (http://localhost:3001/admin)
3. 点击 `商家申请审批`
4. 查看申请列表：
   - 店铺名称
   - 申请人信息
   - 店铺简介
   - 联系方式
   - 营业执照/身份证（如有）
5. 做出决定：
   - **✓ 通过**：自动将用户角色升级为 seller
   - **✗ 拒绝**：可选填拒绝原因

**管理员后台功能：**
```
/admin                    - 数据概览（统计信息）
/admin/applications       - 商家申请审批 ⭐
/admin/users             - 用户管理（待实现）
/admin/products          - 商品管理（待实现）
/admin/orders            - 订单管理（待实现）
```

---

### 3. 商家 (role = 'seller')

**可以做什么：**
- 所有普通用户的功能
- **管理自己的商品** ⭐
- 查看订单
- 回复评论

**商家后台功能：**

访问 `商家后台` (http://localhost:3001/seller)

#### 3.1 发布商品

1. 进入商家后台
2. 点击 `商品管理` → `添加商品`
3. 填写商品信息：
   - 商品名称 *
   - 商品描述 *
   - 分类
   - 售价 *
   - 原价（显示折扣）
   - 库存 *
   - 商品图片（支持多张）
   - 上架状态（立即上架/暂不上架）
4. 点击 `发布商品`

#### 3.2 修改商品价格和名字

1. 进入商家后台
2. 点击 `商品管理`
3. 找到要修改的商品，点击 `编辑`
4. 修改以下内容：
   - ✏️ 商品名称
   - 💰 售价
   - 💵 原价
   - 📦 库存
   - 📝 描述
   - 🖼️ 图片
   - 🔄 状态（上架/下架）
5. 点击 `更新商品`

#### 3.3 删除商品

1. 进入商家后台
2. 点击 `商品管理`
3. 找到要删除的商品
4. 点击 `删除` 按钮
5. 确认删除

---

## 🔄 完整流程演示

### 场景 1：普通用户申请成为商家

```
1. 用户注册账号
   → 访问 /signup
   → 填写邮箱、密码、姓名
   → 注册成功

2. 用户申请成为商家
   → 访问 /profile
   → 点击"成为商家"
   → 填写申请表单
   → 提交申请

3. 管理员审批
   → 访问 /admin/applications
   → 查看申请详情
   → 点击"✓ 通过"
   → 用户自动升级为商家

4. 商家发布商品
   → 访问 /seller
   → 点击"添加商品"
   → 填写商品信息
   → 发布成功
```

### 场景 2：商家修改商品价格

```
1. 登录商家账号
   → 访问 /login

2. 进入商家后台
   → 访问 /seller

3. 编辑商品
   → 点击"商品管理"
   → 找到商品，点击"编辑"
   → 修改价格：¥99.99 → ¥79.99
   → 修改名称："iPhone 14" → "iPhone 14 Pro"
   → 点击"更新商品"

4. 查看更新结果
   → 返回商品列表
   → 确认价格和名称已更新
```

---

## 🎯 页面路由

| 路由 | 说明 | 权限 |
|------|------|------|
| `/` | 首页 | 所有人 |
| `/login` | 登录页面 | 未登录用户 |
| `/signup` | 注册页面 | 未登录用户 |
| `/profile` | 个人中心 | 已登录用户 |
| `/apply-seller` | 商家申请页面 | 普通用户 |
| `/seller` | 商家后台首页 | 商家/管理员 |
| `/seller/products` | 商品列表 | 商家/管理员 |
| `/seller/products/new` | 添加商品 | 商家/管理员 |
| `/seller/products/[id]/edit` | 编辑商品 | 商家/管理员 |
| `/admin` | 管理员后台首页 | 管理员 |
| `/admin/applications` | 商家申请审批 | 管理员 |

---

## 📊 数据库表结构

### seller_applications 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID | 申请用户 ID |
| business_name | TEXT | 店铺名称 |
| business_description | TEXT | 店铺简介 |
| contact_phone | TEXT | 联系电话 |
| contact_address | TEXT | 联系地址（可选） |
| business_license | TEXT | 营业执照编号（可选） |
| id_card | TEXT | 身份证号（可选） |
| status | TEXT | 状态：pending/approved/rejected |
| created_at | TIMESTAMP | 申请时间 |
| reviewed_at | TIMESTAMP | 审核时间 |

---

## 🛠️ 常见问题

### Q1: 如何设置管理员？

**A:** 在 Supabase SQL Editor 中执行：

```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

### Q2: 申请被拒绝后能否重新申请？

**A:** 可以。申请被拒绝后，用户可以修改信息后重新提交申请。

### Q3: 商家可以删除自己的账号吗？

**A:** 商家可以联系管理员处理账号相关问题。

### Q4: 商品图片如何上传？

**A:** 目前支持通过 URL 方式添加图片。建议使用：
- Unsplash (https://unsplash.com/)
- Imgur (https://imgur.com/)
- Cloudinary (https://cloudinary.com/)
- 或 Supabase Storage

### Q5: 如何批量修改商品价格？

**A:** 目前需要逐个编辑商品。批量编辑功能将在未来版本中添加。

---

## 🎨 UI 设计风格

- **配色方案**：紫色 (#9333ea) 到粉色 (#ec4899) 渐变
- **字体**：Inter (Google Fonts)
- **设计风格**：现代、简洁、卡片式布局
- **动画效果**：平滑过渡、悬浮效果
- **响应式**：支持桌面和移动设备

---

## ✅ 功能清单

- [x] 用户注册和登录
- [x] 个人资料管理
- [x] 商家申请表单
- [x] 管理员审批系统
- [x] 商家后台布局
- [x] 商品发布功能
- [x] 商品编辑功能（价格、名称、描述等）
- [x] 商品删除功能
- [x] 商品上架/下架
- [x] 角色权限控制
- [x] 申请状态追踪

---

## 🔜 待实现功能

- [ ] 用户管理页面（管理员）
- [ ] 批量商品管理
- [ ] 订单管理
- [ ] 评论回复系统
- [ ] 数据导出功能
- [ ] 邮件通知系统

---

## 📞 技术支持

如有问题，请：
1. 检查浏览器控制台错误
2. 查看 Supabase 数据库连接
3. 确认 RLS 策略已正确设置
4. 联系技术团队

---

## 🎉 总结

你现在拥有一个完整的商家申请和管理系统：

1. ✅ **普通用户** → 申请成为商家
2. ✅ **管理员** → 审批商家申请
3. ✅ **商家** → 发布和管理商品
4. ✅ **现代化 UI** → 美观易用
5. ✅ **权限控制** → 安全可靠

开始使用吧！🚀
