## 问题定位
用户反馈“输入密码时 Logo 没有变化”，即没有闭眼和弹出气泡。
检查 `src/views/LoginPage.vue` 的代码：
1.  **模板部分**：虽然我已将底部的 `img` 替换为 `<InteractiveLogo :isClosingEyes="isPasswordFocused" />`（在之前的计划中），但在实际执行的 `read` 结果中（`LoginPage.vue` 的 82 行），底部的 Logo 仍然是：
    ```html
    <div class="app-icon">
      <img src="../assets/owl-logo.svg" alt="Logo" width="64" height="64" />
    </div>
    ```
    这说明之前的替换操作可能没有成功应用，或者被后续的“美化”操作（删除 `OwlMascot` 那个大组件时）给覆盖/还原了。
2.  **脚本部分**：没有定义 `isPasswordFocused` 变量，也没有引入 `InteractiveLogo` 组件。
3.  **事件绑定**：密码输入框 `<input type="password">` 上没有绑定 `@focus` 和 `@blur` 事件。

## 修复方案
需要重新执行集成步骤：
1.  **引入组件**：在 `LoginPage.vue` 中导入 `InteractiveLogo.vue`。
2.  **状态管理**：添加 `const isPasswordFocused = ref(false)`。
3.  **模板替换**：将底部的 `<img ...>` 替换为 `<InteractiveLogo :isClosingEyes="isPasswordFocused" />`。
4.  **事件绑定**：在密码输入框上添加 `@focus="isPasswordFocused = true"` 和 `@blur="isPasswordFocused = false"`。

## 实施步骤
1.  修改 `src/views/LoginPage.vue`。

## 预期效果
修复后，底部的猫头鹰 Logo 将在用户点击密码框时闭眼并弹出气泡。