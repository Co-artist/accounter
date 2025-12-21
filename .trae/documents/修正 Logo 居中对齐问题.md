## 问题定位
用户反馈“位置好像有点歪了”，可能是指：
1.  **Logo 自身偏离中心**：`InteractiveLogo` 组件可能没有在父容器中水平居中。
2.  **气泡导致的偏移**：由于气泡是绝对定位在 Logo 右上角的，如果 Logo 容器宽度自适应，气泡的出现可能会撑开容器或导致视觉重心偏移。
3.  **内部对齐问题**：`auth-footer` 中的 flex 布局可能没有正确对齐项目。

检查 `LoginPage.vue` 的样式：
```css
.auth-footer {
  margin-top: 48px;
  text-align: center;
  /* ... */
}
.app-icon {
  font-size: 48px;
  margin-bottom: 8px;
  /* ... */
}
```
`InteractiveLogo` 组件自身样式：
```css
.interactive-logo {
  position: relative;
  width: 64px;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
}
```
结合用户截图（虽然我看不见，但通常这类问题是 flex 对齐或 margin 造成的）。如果 `.app-icon` 是块级元素且没有 flex 居中，它可能默认靠左或受 text-align 影响。但 `text-align: center` 应该对 inline-block 或 text 有效。`.app-icon` 里的组件是 div，默认是 block。

## 修复方案
1.  **强制居中**：给 `.app-icon` 添加 `display: flex; justify-content: center;`，确保内部的 Logo 组件水平居中。
2.  **检查组件尺寸**：确认 `InteractiveLogo` 的 `width/height` 不会因为气泡而改变。
3.  **微调 Logo 内部**：如果 Logo 里的 SVG 本身有偏移，需要在组件内调整。但目前看 SVG `viewBox` 是居中的。

最稳妥的方式是加强父容器的对齐约束。

## 实施步骤
修改 `src/views/LoginPage.vue` 中的样式：
```css
.app-icon {
  display: flex;          /* 新增 */
  justify-content: center; /* 新增 */
  align-items: center;     /* 新增 */
  font-size: 48px;
  margin-bottom: 8px;
  /* filter: ... 保留 */
}
```

## 预期效果
Logo 将严格水平居中显示，不再受外部布局影响偏移。