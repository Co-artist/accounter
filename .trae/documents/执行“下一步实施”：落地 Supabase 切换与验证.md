## 操作目标
- 应用数据库建表脚本、配置后端环境、安装依赖并跑连通性测试。
- 启动后端并完成认证与反馈接口的手工验证。
- 执行一次性数据迁移脚本并进行数据一致性校验。

## 步骤 1：在 Supabase 执行建表与索引
- 打开 Supabase Dashboard → SQL → 新建查询，粘贴 `backend/supabase/migrations.sql` 全部内容 → Run。
- 验证：
  - 运行 `select * from users limit 1;`、`select * from feedback limit 1;` 确认表存在；
  - 运行 `select count(*) from users;` 等检查行数（预计为 0 或已有数据）。

## 步骤 2：配置后端环境变量
- 在 `backend/.env` 写入：
```
SUPABASE_URL=<your-supabase-url>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRES_IN=7d
PORT=5001
```
- 注意：使用 service role key 仅在后端，切勿暴露到前端。

## 步骤 3：安装依赖并运行连通性测试
- 在 PowerShell（cwd：`c:\Users\zzh66\Desktop\acconuter\backend`）执行：
```
npm install
npm run test
```
- 预期输出：`Supabase connectivity ok`。

## 步骤 4：启动后端与手工 API 验证
- 启动后端：
```
npm run dev
```
- 使用 PowerShell 验证认证与反馈接口：
```
# 注册
$registerBody = @{ username = 'demo_user'; password = 'Passw0rd!' } | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:5001/api/auth/register -Method Post -Body $registerBody -ContentType 'application/json'

# 登录
$loginBody = @{ username = 'demo_user'; password = 'Passw0rd!' } | ConvertTo-Json
$loginRes = Invoke-RestMethod -Uri http://localhost:5001/api/auth/login -Method Post -Body $loginBody -ContentType 'application/json'
$token = $loginRes.token

# 提交反馈
$fbBody = @{ type = 'bug'; content = '示例反馈'; contact = 'demo@example.com' } | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:5001/api/feedback -Method Post -Body $fbBody -ContentType 'application/json' -Headers @{ Authorization = "Bearer $token" }

# 查询当前用户反馈
Invoke-RestMethod -Uri http://localhost:5001/api/feedback/user -Headers @{ Authorization = "Bearer $token" }
```
- 预期：注册返回 `_id/username/token`；登录返回 token；反馈提交返回 201 与记录；查询返回包含刚提交的反馈。

## 步骤 5：数据迁移与校验
- 准备 Mongo 导出 JSON 到 `backend/migration_data/`：
  - `users.json`、`transactions.json`、`categories.json`、`budgets.json`、`feedback.json`
- 执行迁移脚本（PowerShell，cwd：`backend`）：
```
node ./scripts/migrate_from_mongo_to_supabase.mjs
```
- 校验：
  - Supabase SQL：`select count(*) from users;`、`select count(*) from transactions;` 等比对预期。
  - API 抽样：登录迁移后的用户，拉取 `/api/feedback/user` 验证数据可读。

## 步骤 6：前端联调（可选）
- 在项目根执行：
```
npm install
npm run dev
```
- 用刚刚注册的账号登录，验证路由守卫、拦截器与页面流程正常（分类/预算使用仍基于前端 store）。

## 风险与回滚
- 如发现认证或数据读写异常：
  - 检查 `.env` 中 `SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY` 是否正确；
  - 使用 SQL 检查表结构是否已创建；
  - 保留旧 Mongo 代码分支，必要时暂时回切至 Mongo（通过环境变量与路由开关）。

## 完成标识
- 连通性测试通过、手工 API 验证成功、迁移脚本执行成功且数据量对齐。