## 前置确认
- 打开 `capacitor.config.ts`，保持：
  - `plugins.CapacitorUpdater.autoUpdate = true`
  - `plugins.CapacitorUpdater.url` 指向你的“更新检查”接口（HTTPS）
- 电脑与手机网络正常；手机上当前安装的是生产版/开发版均可（原生不改动时）。

## 构建与打包（在 Windows PowerShell）
- 在项目根目录执行：
  - `npm run build`
  - `New-Item -ItemType Directory -Force -Path .\release`
  - `Compress-Archive -Path .\dist\* -DestinationPath .\release\dist-1.0.3.zip`
- 产物：`release/dist-1.0.3.zip`

## 上传与获得下载地址
- 将 `release/dist-1.0.3.zip` 上传到你的 CDN/对象存储（S3/OSS/Cloudflare R2/GitHub Releases 等）
- 记录 HTTPS 下载地址，例如：`https://cdn.example.com/app/dist-1.0.3.zip`

## 更新检查接口（服务端）
- 接口返回如下 JSON（示例）：
```
{
  "version": "1.0.3",
  "url": "https://cdn.example.com/app/dist-1.0.3.zip",
  "checksum": "sha256:...",        
  "note": "修复滑动卡顿，优化动画"
}
```
- 若你使用 Express，可用最简路由：
```
import express from 'express'
const app = express()
app.get('/api/updates/check', (req, res) => {
  res.json({
    version: '1.0.3',
    url: 'https://cdn.example.com/app/dist-1.0.3.zip',
    checksum: 'sha256:...',
    note: '修复滑动卡顿，优化动画'
  })
})
app.listen(5001)
```
- 确保 `capacitor.config.ts` 的 `plugins.CapacitorUpdater.url` 指向该接口（HTTPS）。

## 验证（用户侧）
- 关闭并重新打开手机上的 APP（完全退出后再进）
- 观察是否自动拉取并应用更新；若未生效，再次完全退出 APP 重启

## 回滚
- 将检查接口的 `version/url` 指回上一版本包；用户下次启动 APP 会恢复旧版本

## 说明与建议
- OTA 仅更新前端资源（HTML/CSS/JS）；原生改动需重新发版
- 使用 HTTPS；建议返回 `checksum` 进行完整性校验
- 版本号语义化递增，并与发布记录同步，便于回滚与追踪