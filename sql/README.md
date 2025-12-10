# SQL Scripts

本目录包含数据库相关的 SQL 脚本，按用途分类组织。

## 目录结构

```
sql/
├── seed/           # 种子数据（商品、分类等）
├── fixes/          # 表结构修复和 RLS 策略脚本
└── archive/        # 一次性修复脚本（历史存档）
```

## 正式迁移

正式的数据库迁移脚本位于 `supabase/migrations/` 目录：

| 文件 | 用途 |
|------|------|
| `001_initial_schema.sql` | 初始表结构 |
| `002_rls_policies.sql` | RLS 安全策略 |
| `003_public_access.sql` | 公共访问策略 |
| `004_sample_data.sql` | 示例数据 |
| `005_auto_create_profile.sql` | 自动创建 profile 触发器 |
| `006_fix_seller_applications.sql` | 修复商家申请表 |

## seed/ - 种子数据

用于向数据库添加测试/示例数据的脚本。

| 文件 | 用途 |
|------|------|
| `add-categories.sql` | 添加商品分类 |
| `add-products.sql` | 初始商品数据 |
| `add-50-products.sql` | 50个商品（ARRAY格式） |
| `add-50-products-fixed.sql` | 50个商品（JSONB格式，推荐） |
| `add-more-products.sql` | 额外商品数据 |

**使用方法**：在 Supabase SQL Editor 中执行。

## fixes/ - 修复脚本

用于修复表结构、RLS 策略等问题的脚本。

| 文件 | 用途 |
|------|------|
| `database-schema-orders.sql` | 订单表完整结构 |
| `recreate-orders-tables.sql` | 重建订单表（product_id: bigint） |
| `recreate-orders-tables-fixed.sql` | 重建订单表（product_id: uuid） |
| `fix-orders-rls.sql` | 修复订单 RLS 策略 |
| `cleanup-old-policies.sql` | 清理旧 RLS 策略 |
| `fix-review-order-id-type.sql` | 修复评价表 order_id 类型 |
| `fix-reviews-rls-policy.sql` | 修复评价表 RLS 策略 |

## archive/ - 历史存档

一次性执行的修复脚本，保留作为参考。

| 文件 | 用途 |
|------|------|
| `setup-admin.sql` | 设置管理员账号 |
| `update-admin.sql` | 更新管理员角色 |
| `fix-profile.sql` | 修复 Profile 问题 |
| `fix-seller-applications.sql` | 修复商家申请表字段 |
| `fix-why-seller-role.sql` | 修复特定用户角色 |
| `fix-admin-role.sql` | 修复管理员角色 |

## 执行须知

1. **所有脚本**都应在 Supabase SQL Editor 中执行
2. **种子数据脚本**需要先有 seller 用户存在
3. **修复脚本**执行前请备份数据
4. 执行顺序：先执行 migrations，再执行 seed 数据
