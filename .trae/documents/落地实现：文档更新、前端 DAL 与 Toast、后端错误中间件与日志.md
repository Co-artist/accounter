## 变更范围
- 更新根目录 README，补充后端运行与 API 概览、迁移命令说明。
- 新增开发文档：`docs/API.md`（接口契约）、`docs/ENV.md`（环境变量清单）。
- 前端新增统一数据访问层（DAL）与错误提示组件；保留 localStorage，提供远端开关。
- 后端新增统一错误处理中间件并接入结构化日志。

## 文件与实现
- 文档：
  - README：添加后端启动、`.env`、API 路径、`migrate:*` 命令示例。
  - `docs/API.md`：`/api/auth` 与 `/api/feedback` 请求/响应、错误码、示例。
  - `docs/ENV.md`：后端 `SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY/JWT_*`、前端 `VITE_API_BASE_URL/VITE_USE_REMOTE`。
- 前端：
  - `src/api/client.ts`：读取 `import.meta.env.VITE_API_BASE_URL`，封装 axios 实例与拦截器。
  - `src/api/modules/auth.ts`、`feedback.ts`：封装 `login/register/me` 与 `create/getMine/getAll`。
  - `src/api/errors.ts`：统一错误消息提取与状态码映射。
  - `src/components/Toast.vue` + 事件总线：展示错误提示；在响应拦截器触发。
  - `src/store/index.js`：增加 `VITE_USE_REMOTE` 开关，优先将“反馈”模块切换为远端调用，其余保持本地。
- 后端：
  - `backend/middleware/errorHandler.js`：捕获未处理错误，返回 `{ message, code }`。
  - `backend/server.js`：挂载错误处理中间件；使用 `logger` 输出错误级日志。
  - `backend/lib/logger.js`：设置时间戳与格式化输出。

## 验证
- 后端：运行 `npm run dev`，通过 PowerShell 调用 `auth/feedback` 接口验证 200/401/4xx/5xx 行为；观察日志。
- 前端：设置 `.env` 中 `VITE_API_BASE_URL` 与 `VITE_USE_REMOTE=true`，触发错误场景（401/404/500）检查 toast 与文案；登录/反馈流程正常。
- 文档：自检 README/API/ENV 是否可按文档直接跑通。

## 交付产物
- 完整文档更新与新建。
- 前端 DAL、Toast 组件与远端开关。
- 后端错误处理与日志接入。
- 验证记录与使用说明（变更摘要）。

## 影响与风险控制
- 变更均为增量与可配置；默认保持现有行为（localStorage 与现有后端）。
- 如远端开关开启后出现错误，可回退为本地模式或关闭拦截器 toast。

请确认，我将开始实施并在完成后附上验证结果与使用说明。