## 目标
1.  **动态 Logo**：将 `LoginPage` 底部的静态 SVG 图片替换为一个可交互的 Vue 组件 `InteractiveLogo.vue`。
    *   **常态**：显示睁眼的猫头鹰（复用现有 SVG 路径）。
    *   **闭眼态**：当用户在密码框输入时，猫头鹰闭上眼睛（将眼睛圆圈替换为闭合的线条）。
2.  **气泡对话框**：
    *   在猫头鹰 Logo 右上角添加一个 CSS 气泡。
    *   仅在“闭眼态”时显示，内容为“我不看我不看~”。
    *   添加轻微的弹跳/浮动动画，增加趣味性。

## 实施方案

1.  **创建组件 `src/components/InteractiveLogo.vue`**：
    *   将 `owl-logo.svg` 的内容内联到组件 template 中。
    *   定义 `props: { isClosingEyes: Boolean }`。
    *   使用 `v-if/v-else` 或 CSS 类切换眼睛部分的 SVG 路径：
        *   **睁眼**：`<circle>` + 瞳孔。
        *   **闭眼**：两条弧线 `<path d="..." stroke="#333" ... />`（类似 `U` 形或 `- -` 形）。
    *   在 SVG 容器内或外层添加气泡 DOM 结构：
        ```html
        <div class="speech-bubble" v-if="isClosingEyes">我不看我不看~</div>
        ```

2.  **修改 `src/views/LoginPage.vue`**：
    *   引入 `InteractiveLogo` 组件，替换底部的 `<img>` 标签。
    *   添加状态变量 `const isPasswordFocused = ref(false)`。
    *   在密码输入框 `<input type="password">` 上绑定事件：
        *   `@focus="isPasswordFocused = true"`
        *   `@blur="isPasswordFocused = false"`
    *   将状态传递给 Logo 组件：`<InteractiveLogo :isClosingEyes="isPasswordFocused" />`。

3.  **样式微调**：
    *   调整气泡的定位（绝对定位到 Logo 右上角），添加三角形箭头指向猫头鹰。
    *   给气泡添加 `v-enter-active` 过渡动画（如缩放淡入）。

## 预期效果
用户点击密码框准备输入时，底部的猫头鹰 Logo 会立刻闭上眼睛，并弹出一个气泡说“我不看我不看~”；离开密码框后恢复睁眼，气泡消失。这比全屏的大动效更轻量且有趣。