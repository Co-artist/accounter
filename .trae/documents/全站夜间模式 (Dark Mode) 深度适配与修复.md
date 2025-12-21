## 问题定位

用户反馈开启“夜间主题”后，页面中很多内容消失或变为空白。结合截图和代码分析，主要原因可能是：

1.  **CSS 变量未适配**：虽然之前在 `App.vue` 或 `style.css` 中定义了基础的暗色变量（如 `--bg-primary`），但在各个组件（`HomePage`, `StatisticsPage`, `ProfilePage`, `CategoryPage`）的具体样式中，很多背景色和文字颜色仍然硬编码为白色 (`#fff`) 或深色 (`#333`)，导致在夜间模式下，文字和背景同色（例如白底白字），或者卡片背景没有变黑。
2.  **背景色冲突**：截图显示背景依然是浅灰或白色，说明全局背景色变量未生效或被覆盖。
3.  **文字颜色**：卡片内的文字颜色未随主题反转。

## 修复方案

我将全面检查并修复所有核心页面的暗色模式适配：

1.  **全局变量检查 (`src/style.css` / `App.vue`)**：
    *   确保定义了 `[data-theme="dark"]` 选择器下的核心变量：
        *   `--bg-body`: `#121212` (深色背景)
        *   `--bg-card`: `#1E1E1E` (卡片背景)
        *   `--text-primary`: `#FFFFFF` (主文字)
        *   `--text-secondary`: `#AAAAAA` (次要文字)
        *   `--border-color`: `#333333` (边框)

2.  **组件样式适配**：
    *   **BalanceOverview.vue**：适配卡片背景渐变（夜间应为深色渐变），文字颜色适配。
    *   **HomePage.vue / StatisticsPage.vue / CategoryPage.vue / ProfilePage.vue**：
        *   将硬编码的 `background: #f5f5f5` 替换为 `background: var(--bg-body)`。
        *   将硬编码的 `background: #fff` 替换为 `background: var(--bg-card)`。
        *   将硬编码的 `color: #333` 替换为 `color: var(--text-primary)`。
        *   将硬编码的 `color: #999` 替换为 `color: var(--text-secondary)`。
        *   适配阴影颜色，夜间模式阴影应更深或减弱。

3.  **BottomNavigation.vue**：确保底部导航栏在夜间模式下背景变黑，图标颜色正确。

## 实施步骤
1.  **完善全局 CSS 变量**：在 `src/style.css` 中补充完整的 Dark Mode 变量定义。
2.  **批量替换组件样式**：逐个修改 `BalanceOverview`, `HomePage`, `StatisticsPage`, `CategoryPage`, `ProfilePage`, `BottomNavigation`，将颜色值替换为 CSS 变量。

## 预期效果
切换到夜间模式后：
*   背景变为深灰/黑色。
*   卡片变为稍亮的深灰色。
*   文字变为白色或浅灰色。
*   图表和图标颜色保持清晰可见。
*   所有内容均正常显示，无“消失”现象。