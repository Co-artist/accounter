## 可能原因
- 当前 `capacitor.config.ts:14-18` 配置了 `server.url: 'http://10.0.2.2:3000'`（仅模拟器可达）；真机上会不可达导致白屏。
- 未运行前端开发服（HMR），或运行在错误端口；服务不可达导致白屏。
- 生产/调试模式混用：如果你要用 OTA 加载本地打包资源，`server` 应关闭，否则应用会改为在线加载。
- 构建产物未复制到安卓工程（`dist` 未 copy）或为空，导致 `android/app/src/main/assets/public/index.html` 缺失。

## 诊断
- 查看 `android/app/src/main/assets/capacitor.config.json` 是否包含 `server` 字段；如有，说明当前构建正在尝试从远程加载。
- 查看是否存在 `android/app/src/main/assets/public/index.html` 与静态资源；如缺失需重新 `build + copy`。
- 确认你是在模拟器还是真机：
  - 模拟器：`10.0.2.2` 是正确的宿主映射；需本机 `npm run dev`。
  - 真机：`10.0.2.2` 不可用；应改为你的电脑 IP（你提供的 `172.24.35.163`）。

## 解决（二选一，按目标模式）
- HMR 调试（在线加载）
  - 模拟器：保留 `server.url: 'http://10.0.2.2:3000'`；启动 `npm run dev`；用 `npx cap run android -l --external` 运行；确保日志里 Network 地址可达。
  - 真机：把 `server.url` 改为 `http://172.24.35.163:3000`；启动 `npm run dev`；运行 `npx cap run android -l --external` 或 Android Studio Debug。确保手机浏览器能打开 `http://172.24.35.163:3000`。
- OTA/本地资源（离线可用）
  - 注释或删除 `capacitor.config.ts` 的 `server` 块，让 WebView加载本地 `dist`。
  - `npm run build` → `npx cap copy android`，确保 `android/app/src/main/assets/public/` 下有 `index.html` 与资源。
  - Android Studio 运行；前端更新通过 OTA（`CapacitorUpdater.url`）在启动时拉取。

## 验证
- HMR：打开 APP 能看到页面；修改前端文件是否热刷新。
- OTA：首次启动加载旧版本地资源；更新检查返回新包后，重启 APP 是否应用新内容。

## 常见坑
- `10.0.2.2` 仅模拟器；真机需用电脑实际 IP。
- 未启动 Vite 或端口被拦截→白屏；放行 Windows 防火墙 3000 端口。
- 构建后未 copy→`assets/public/index.html` 缺失→白屏。
- 生产调试混用：在线 `server` 与 OTA 同时启用会互相干扰；生产建议关闭 `server`。

## 我将执行（在你确认后）
- 按你当前目标（HMR 或 OTA）修正 `capacitor.config.ts`。
- 如果选择 OTA：执行构建与复制，确认安卓工程资源齐全；保持 `CapacitorUpdater` 检查接口即可。
- 如果选择 HMR：对齐 `server.url` 到 `172.24.35.163:3000`（真机）或保留 `10.0.2.2`（模拟器），并启动开发服。