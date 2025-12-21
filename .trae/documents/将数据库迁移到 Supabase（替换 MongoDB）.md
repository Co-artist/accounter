## 迁移目标
- 将后端数据层从 MongoDB/Mongoose 切换为 Supabase Postgres，保持现有 API 路径与响应结构不变。
- 阶段一保留现有 JWT 认证逻辑与前端交互；阶段二可选接入 Supabase Auth 做统一身份与 RLS。

## 选型与架构
- 继续使用 `Express` 作为 API 层，持久化改为 Supabase。
- 在后端新增 Supabase 客户端模块，通过 `service_role key` 访问数据库（仅后端使用）。
- 认证方案：
  - 方案 A（默认）：沿用当前自建 JWT（`backend/services/authService.js`），用户信息存储在 Supabase 的 `users` 表；`authMiddleware` 改为通过 Supabase 查询用户。
  - 方案 B（可选）：切换到 Supabase Auth（前端登录直接走 Supabase），服务端基于其 JWT 校验并使用 RLS；需要较大改造与前后端联动。

## 表结构设计（Supabase Postgres）
- users：`id uuid pk`、`username text unique`、`password_hash text`、`created_at timestamptz default now()`、`legacy_mongo_id text null`。
- transactions：`id uuid pk`、`user_id uuid fk users(id)`、`type text check in ('income','expense')`、`amount numeric(12,2)`、`category text`、`date date`、`note text`、`created_at timestamptz`。
- categories：`id uuid pk`、`user_id uuid fk`、`name text`、`icon text`、`type text`、`color text`、`usage_count int`、`amount_ratio int`。
- budgets：`id uuid pk`、`user_id uuid fk`、`category text`、`icon text`、`amount numeric(12,2)`、`used numeric(12,2)`、`usage_percentage int`、`period text`、`type text`。
- feedback：`id uuid pk`、`user_id uuid fk`、`type text`、`content text`、`contact text`、`created_at timestamptz default now()`。
- 备注：为减少改动，`category` 先保留为文本；后续可演进为 `category_id fk`。

## 代码改造点
- 新增：`backend/config/supabase.js`（导出 Supabase 客户端）。
- 替换数据访问：移除 Mongoose 的 Model 读写，改为 Supabase 查询：
  - `backend/services/authService.js`：
    - `registerUser` → 插入 `users`（bcrypt 生成 `password_hash`），返回 `{ _id: uuid, username, token }`。
    - `loginUser` → 查询 `users` by `username`，比较 `password_hash`，生成 JWT。
    - `getCurrentUser` → 按 `uuid` 查询 `users` 并返回不含密码字段。
  - `backend/controllers/feedbackController.js`：全部 CRUD 改为对 `feedback` 表的插入/查询；保留文件备份逻辑。
  - `backend/middleware/authMiddleware.js`：`jwt.verify` 后用 Supabase 读取用户并注入 `req.user`。
- 连接层：
  - 停用 `backend/config/db.js` 的 `mongoose.connect` 与相关模型定义；逐步移除 `backend/database/models/*` 的引用。
- 保持现有路由与响应结构：`backend/server.js`、`routes/*.js`、`controllers/*.js` 不改变路径与字段命名（除 `_id` 从 ObjectId 变为 uuid）。

## 环境变量与安全
- 新增后端环境变量：`SUPABASE_URL`、`SUPABASE_SERVICE_ROLE_KEY`；仅后端使用，不暴露到前端。
- 保留：`JWT_SECRET`、`JWT_EXPIRES_IN`。
- 更新 `backend/.env.example` 并在 `.gitignore` 确保密钥不被提交。

## 数据迁移方案
- 导出 MongoDB 数据为 JSON（users/transactions/categories/budgets/feedback）。
- 编写一次性迁移脚本（Node）：
  - `users`：生成新 `uuid`，保留 `legacy_mongo_id`，迁移 `username`、`password_hash`（从旧 `password`）。
  - 其他表：通过 `legacy_mongo_id → uuid` 映射填充 `user_id`，保留原有业务字段；金额转为 `numeric`；日期规范为 `YYYY-MM-DD`。
- 迁移前对生产库做快照备份；迁移后校验行数与抽样数据一致性。

## 接口兼容性
- 前端通过 `axios` 调用后端，不需改动；确保返回字段名与形态一致。
- `_id` 类型从 ObjectId 变为 `uuid`，若前端仅使用字符串，不影响渲染；如存在依赖 ObjectId 形态，统一改造为字符串处理。

## 测试与验证
- 单元/集成：为 `authService` 与 `feedbackController` 加最小集成测试（模拟 Supabase client）。
- 手工验证：
  - `POST /api/auth/register`、`POST /api/auth/login`、`GET /api/auth/me`。
  - `POST /api/feedback`、`GET /api/feedback/user`、`GET /api/feedback`。
  - 跨用户数据隔离与错误码一致性。
- 性能与并发：抽样进行分页与批量写入测试，观察 Supabase 限速与响应时延。

## 风险与回滚
- 风险：
  - ID 体系切换（ObjectId → uuid）带来的潜在依赖；
  - 金额/日期类型变更的精度与格式；
  - RLS 与 service role 的权限边界配置错误。
- 回滚：保留旧 Mongo 连接与模型代码分支；如出现问题，切换环境变量与依赖回退至 MongoDB。

## 下一步实施（确认后）
1. 在 Supabase 创建表与索引、唯一约束。
2. 添加 `supabase.js` 客户端与环境变量。
3. 重构 `authService`、`authMiddleware`、`feedbackController` 的数据访问。
4. 编写并执行一次性迁移脚本；对照校验。
5. 补充最小测试与日志，上线并观察。