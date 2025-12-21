# OTA 更新发布与回滚手册
## 适用场景
- 已安装 APP 无需重新下载 APK 即可在启动时拉取最新前端资源
- 更新范围仅限前端（HTML/CSS/JS）；任何原生改动仍需发版

## 一次性准备
- 确认已集成 `@capgo/capacitor-updater` 并在 `capacitor.config.ts` 配置：
  - `plugins.CapacitorUpdater.autoUpdate = true`
  - `plugins.CapacitorUpdater.url = https://api.example.com/updates/check`（替换为你的接口）
- 准备静态托管（CDN/对象存储）用于保存每次构建的 Zip 包
- 准备“更新检查”接口（HTTPS）：返回最新版本及下载地址

## 更新检查接口返回格式（建议）
```
{
  "version": "1.0.3",
  "url": "https://cdn.example.com/releases/dist-1.0.3.zip",
  "checksum": "sha256:...",           // 可选，下载后校验完整性
  "note": "修复滑动卡顿，优化动画"    // 可选，客户端弹窗展示
}
```

## 每次发布流程
- 在 Android Studio 真机/模拟器完成功能验证
- 运行 `npm run build`，生成 `dist/`
- 将 `dist/` 压缩为 Zip（例如 `dist-1.0.3.zip`）
- 上传 Zip 到 CDN/对象存储并记录 HTTPS 下载链接
- 更新检查接口：将 `version` 与 `url` 指向新的包（可填写 `note`）
- 用户端：下一次启动 APP 请求接口→下载→应用；通常重启后生效

## 回滚流程
- 将检查接口的 `version` 与 `url` 指回上一版本包
- 用户端：下一次启动 APP 将恢复到旧版本

## 验证清单
- 旧版本启动 → 发布新包 → 重启 APP → 前端版本与内容更新
- 弱网/离线：已下载后可离线使用；失败时保持旧版本
- 安全：接口为 HTTPS；（可选）校验 `checksum`

## 常见问题
- 白屏/加载失败：下载地址不可达或 Zip 包损坏；检查 CDN 权限与返回格式
- 版本错乱：确保 `version` 唯一且语义递增；客户端可记录已应用版本
- 原生改动：OTA 不覆盖原生部分，需正常发版

