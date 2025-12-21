好的，我将为您执行热更新（Code Push）的配置。

我们将采用 **Self-Hosted (自托管)** 模式，利用您现有的 Render 后端来提供更新检查服务。

### 计划步骤

#### 1. 前端配置 (APP 端)
1.  **安装插件**：安装 `@capgo/capacitor-updater` 并同步到 Android 项目。
2.  **修改配置**：更新 `capacitor.config.ts`，开启自动更新，并指向后端的检查接口 `https://owl-account-backend.onrender.com/api/updates/check`。

#### 2. 后端配置 (服务器端)
1.  **创建更新路由**：在后端 `routes` 文件夹中新建 `updateRoutes.js`。
2.  **实现检查逻辑**：创建一个简单的接口，返回硬编码的最新版本号和下载地址（后续您可以手动修改这个文件来发布新版本）。
3.  **注册路由**：在 `server.js` 中注册 `/api/updates` 路由。

#### 3. 验证与说明
配置完成后，我会为您解释如何手动发布一个新的热更新包（Zip文件），以便您在未来需要更新界面时使用。

注意：由于我们是在修改本地代码，后端的更改（添加路由）需要您之后再次推送到 GitHub 才能在 Render 上生效。

准备就绪，请确认执行。