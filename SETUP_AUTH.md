# 认证设置指南

## 🔐 Supabase 邮箱验证配置

如果注册时遇到 "Email address is invalid" 错误，需要在 Supabase 中调整邮箱验证设置。

## 解决方案 1：禁用邮箱确认（推荐用于开发）

### 步骤：

1. 打开 Supabase Dashboard
2. 选择你的项目
3. 点击左侧菜单 **Authentication** → **Providers**
4. 找到 **Email** 部分
5. 关闭 **Confirm email** 选项
6. 点击 **Save** 保存

**截图位置**：
```
Authentication → Providers → Email
[ ] Confirm email  ← 取消这个勾选
```

完成后，用户注册后可以直接登录，不需要邮箱验证。

---

## 解决方案 2：使用真实邮箱地址

Supabase 对邮箱格式有严格验证。建议使用：

### ✅ 推荐的邮箱格式：
- `test123@gmail.com`
- `demo@example.com`
- `user@outlook.com`
- `testuser@yahoo.com`

### ❌ 避免使用：
- `123@gmail.com` （太简单）
- `a@b.com` （太短）
- `test@test` （无效域名）

---

## 解决方案 3：配置自定义 SMTP（生产环境）

如果要在生产环境中使用邮箱验证：

### 步骤：

1. 打开 Supabase Dashboard
2. 进入 **Project Settings** → **Auth**
3. 找到 **SMTP Settings**
4. 配置你的 SMTP 服务器：
   - **Sender email**: 发件邮箱
   - **Sender name**: 发件人名称
   - **Host**: SMTP 服务器地址
   - **Port**: 端口号（通常 587）
   - **Username**: SMTP 用户名
   - **Password**: SMTP 密码

### 常用 SMTP 服务：

#### Gmail
- Host: `smtp.gmail.com`
- Port: `587`
- 需要创建应用专用密码

#### SendGrid
- Host: `smtp.sendgrid.net`
- Port: `587`
- 免费额度：100 封/天

#### Mailgun
- Host: `smtp.mailgun.org`
- Port: `587`
- 免费额度：100 封/天

---

## 🚀 快速测试步骤

### 方法 1：使用开发模式（最简单）

1. 在 Supabase Dashboard 关闭邮箱确认
2. 使用任意邮箱注册，如 `test@example.com`
3. 直接登录使用

### 方法 2：使用真实邮箱

1. 使用你的真实 Gmail 或其他邮箱注册
2. 查收验证邮件
3. 点击验证链接
4. 登录使用

---

## 📝 当前项目配置

### 邮箱验证流程：
1. 用户填写注册表单
2. Supabase 验证邮箱格式
3. 如果启用了邮箱确认：
   - 发送验证邮件
   - 用户需要点击邮件中的链接
   - 验证后才能登录
4. 如果禁用了邮箱确认：
   - 注册后直接创建账号
   - 可以立即登录

### 当前设置检查：

```sql
-- 在 Supabase SQL Editor 中执行，查看认证配置
SELECT * FROM auth.config;
```

---

## 🔍 常见问题

### Q1: 注册时提示"Email address is invalid"
**A:** 这是因为 Supabase 认为邮箱格式不符合要求。解决方法：
- 使用更真实的邮箱地址（如 test123@gmail.com）
- 或在 Supabase Dashboard 中调整验证设置

### Q2: 注册成功但无法登录
**A:** 可能是因为启用了邮箱确认。解决方法：
- 检查邮箱收件箱（包括垃圾邮件）
- 点击验证链接
- 或在 Supabase Dashboard 中关闭邮箱确认

### Q3: 没有收到验证邮件
**A:** 可能的原因：
- 邮件被识别为垃圾邮件
- Supabase 免费版邮件发送有限制
- SMTP 配置错误

**解决方法：**
- 检查垃圾邮件文件夹
- 在 Supabase Dashboard 中关闭邮箱确认（开发环境）
- 配置自定义 SMTP 服务（生产环境）

### Q4: 如何重置密码？
**A:** 忘记密码功能需要邮件服务。如果是开发环境：
- 方法 1：在 Supabase Dashboard 的 Authentication → Users 中手动删除用户，重新注册
- 方法 2：直接在数据库中更新密码哈希（不推荐）

---

## ✅ 推荐配置（开发环境）

为了便于开发和测试，推荐以下配置：

1. **关闭邮箱确认**（Authentication → Providers → Email）
2. **使用简单的测试邮箱**（test@example.com, demo@test.com）
3. **在 SQL 中直接设置用户角色**：

```sql
-- 注册后，将账号设置为卖家
UPDATE profiles
SET role = 'seller'
WHERE email = 'test@example.com';
```

---

## 📞 需要帮助？

如果仍然遇到问题：
1. 检查 Supabase Dashboard 的 Logs 查看详细错误
2. 查看浏览器控制台的错误信息
3. 确认 `.env.local` 文件中的 Supabase 配置正确

---

**建议**：开发时关闭邮箱确认，生产环境再启用并配置 SMTP。
