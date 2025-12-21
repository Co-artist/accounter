## 前提条件
- 已在 Supabase 执行 `backend/supabase/migrations.sql`，`public.users/transactions/categories/budgets/feedback` 表存在。
- 后端 `.env` 已配置 `SUPABASE_URL` 与密钥（推荐 `SUPABASE_SERVICE_ROLE_KEY`）。当前使用 `anon` 也可写入，未启用 RLS 时无阻碍。

## 准备导出数据
- 将 Mongo 导出的 JSON 文件放入 `backend/migration_data/` 目录：
  - `users.json`：`[{ _id, username, password }]`（password 为 bcrypt 哈希；若为明文，我将调整脚本改为哈希）
  - `transactions.json`：`[{ user: <mongo_user_id>, type, amount, category, date, note }]`
  - `categories.json`：`[{ user: <mongo_user_id>, name, icon, type, color, usageCount, amountRatio }]`
  - `budgets.json`：`[{ user: <mongo_user_id>, category, icon, amount, used, usagePercentage, period, type }]`
  - `feedback.json`：`[{ user: <mongo_user_id>, type, content, contact, createdAt }]`

## 执行迁移脚本
- 在 `backend` 目录运行：
```
node ./scripts/migrate_from_mongo_to_supabase.mjs
```
- 行为说明：
  - 为每个旧用户插入 `users`，记录 `legacy_mongo_id`，生成新 `uuid`。
  - 通过 `legacy_mongo_id → uuid` 映射填充其他表的 `user_id`。
  - 金额统一转为 `numeric`，日期规范为 `YYYY-MM-DD`。

## 数据校验（Supabase SQL）
- 统计行数：
```
select count(*) from public.users;
select count(*) from public.transactions;
select count(*) from public.categories;
select count(*) from public.budgets;
select count(*) from public.feedback;
```
- 抽样检查：
```
select * from public.users order by created_at desc limit 3;
select * from public.feedback order by created_at desc limit 3;
```

## 接口抽样验证
- 使用迁移后的某个用户：
  - 登录：`POST /api/auth/login`（若用户密码为哈希、需改为明文测试账号，我将为该用户设置新密码或调整脚本进行哈希）
  - 查询反馈：`GET /api/feedback/user`（验证数据可读）

## 若密码为明文的处理方案
- 我将更新迁移脚本逻辑：检测 `users.json` 是否存在字段 `password_is_plain`；若为真，则在迁移时对 `password` 做 bcrypt 哈希再写入 `password_hash`。
- 或者提供一次性重置密码方案：为选定用户设置临时密码并通知。

## RLS 与密钥
- 当前使用 `anon` 密钥写入成功，但建议迁移完成后切换到 `SUPABASE_SERVICE_ROLE_KEY`，以便后续启用 RLS 而不影响服务端写入。

## 风险与回滚
- 若迁移数据异常：根据 `legacy_mongo_id` 可安全删除对应数据行并重试。
- 迁移前建议备份 Supabase：导出 CSV/SQL；迁移后比对行数与抽样内容。

## 完成标识
- SQL 行数对齐、接口抽样验证成功；如启用 RLS，服务端使用 `service_role key` 写入不受限。