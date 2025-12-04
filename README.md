# Accounter - 记账App

## 1. 项目概述与目标

### 1.1 项目简介
Accounter是一款轻量级移动端记账应用，旨在帮助用户方便、快速地记录和管理个人财务收支情况。应用采用现代化的UI设计，提供直观的数据展示和便捷的操作体验。

### 1.2 项目目标
- 提供简洁易用的记账功能，支持快速添加收入和支出
- 实时展示财务概况，包括总余额、收入和支出统计
- 支持按分类查看交易记录，便于用户了解消费习惯
- 提供数据持久化存储，确保数据安全可靠
- 支持响应式设计，适配不同尺寸的移动设备

### 1.3 适用人群
- 个人用户：记录日常收支，管理个人财务
- 家庭用户：跟踪家庭消费，制定预算计划
- 学生群体：管理零用钱，培养理财习惯

## 2. 技术栈与环境配置

### 2.1 技术栈
| 类别 | 技术/框架 | 版本 | 用途 |
|------|-----------|------|------|
| 前端框架 | Vue | 3.5.13 | 构建用户界面 |
| 构建工具 | Vite | 6.0.5 | 项目构建与开发服务器 |
| 包管理 | npm | 8.19.2+ | 依赖管理 |
| 样式 | CSS3 | - | 组件样式设计 |
| 数据存储 | localStorage | - | 本地数据持久化 |

### 2.2 环境配置要求
- **操作系统**：Windows 10+, macOS 10.15+, Linux
- **Node.js**：v16.0.0 或更高版本
- **npm**：v8.0.0 或更高版本
- **浏览器**：Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### 2.3 安装与运行

#### 2.3.1 安装依赖
```bash
npm install
```

#### 2.3.2 启动开发服务器
```bash
npm run dev
```
开发服务器默认运行在 http://localhost:3000

#### 2.3.3 构建生产版本
```bash
npm run build
```
构建产物将输出到 `dist` 目录

#### 2.3.4 预览生产版本
```bash
npm run preview
```

## 3. 项目结构与核心模块

### 3.1 项目目录结构
```
├── public/                 # 静态资源目录
│   └── vite.svg          # Vite默认图标
├── src/                   # 源代码目录
│   ├── components/        # Vue组件
│   │   ├── BalanceOverview.vue      # 余额概览组件
│   │   ├── BottomNavigation.vue    # 底部导航组件
│   │   ├── PhoneShell.vue           # 手机外壳组件
│   │   ├── TransactionForm.vue     # 记账表单组件
│   │   └── TransactionList.vue     # 交易列表组件
│   ├── views/             # 页面视图
│   │   └── HomePage.vue            # 主页视图
│   ├── App.vue            # 根组件
│   └── main.js            # 入口文件
├── .gitignore             # Git忽略配置
├── index.html             # HTML模板
├── package.json           # 项目配置
├── README.md              # 项目说明文档
└── vite.config.js         # Vite配置
```

### 3.2 核心模块说明

#### 3.2.1 手机外壳组件 (PhoneShell.vue)
- **功能**：模拟手机外观，提供屏幕容器
- **特点**：包含摄像头、扬声器、Home键等手机元素
- **使用场景**：作为整个应用的容器，提供沉浸式体验

#### 3.2.2 余额概览组件 (BalanceOverview.vue)
- **功能**：展示用户当前总余额、总收入和总支出
- **特点**：支持快速添加收入/支出
- **交互**：点击"记收入"或"记支出"按钮触发记账表单

#### 3.2.3 交易列表组件 (TransactionList.vue)
- **功能**：展示最近的交易记录
- **特点**：支持按日期排序，显示分类图标和金额
- **交互**：支持编辑和删除交易记录

#### 3.2.4 记账表单组件 (TransactionForm.vue)
- **功能**：用于添加或编辑交易记录
- **特点**：支持金额输入、分类选择、日期选择和备注
- **验证**：包含表单验证，确保数据完整性

#### 3.2.5 底部导航组件 (BottomNavigation.vue)
- **功能**：提供应用的主要导航
- **特点**：包含首页、统计、记账、分类和我的五个导航项
- **交互**：点击导航项切换不同功能页面

### 3.3 数据结构

#### 3.3.1 交易记录 (Transaction)
```javascript
{
  id: String,           // 唯一标识符
  type: String,         // 类型：income/expense
  amount: Number,       // 金额
  category: String,     // 分类
  date: String,         // 日期 (YYYY-MM-DD)
  note: String          // 备注
}
```

## 4. 开发流程与协作规范

### 4.1 Git分支管理
- **main**：生产环境分支，用于部署正式版本
- **develop**：开发分支，集成所有功能分支
- **feature/xxx**：功能开发分支，用于开发新功能
- **bugfix/xxx**： bug修复分支，用于修复生产环境bug

### 4.2 代码提交规范
采用语义化提交信息，格式如下：
```
<type>(<scope>): <subject>

<body>

<footer>
```

#### 4.2.1 提交类型 (type)
- **feat**：新功能
- **fix**：修复bug
- **docs**：文档更新
- **style**：代码格式调整
- **refactor**：代码重构
- **test**：测试相关
- **chore**：构建过程或辅助工具的变动

#### 4.2.2 提交示例
```
feat(transaction): 添加交易分类图标

- 为收入和支出分类添加了对应的emoji图标
- 优化了分类选择的视觉效果

Close #123
```

### 4.3 代码审查流程
1. 开发者创建功能分支并完成开发
2. 提交代码并创建Pull Request (PR)
3. 至少一位团队成员进行代码审查
4. 审查通过后，将代码合并到develop分支
5. 定期从develop分支合并到main分支进行发布

### 4.4 开发规范
- 使用Vue 3 Composition API
- 组件命名采用PascalCase格式
- 变量和函数命名采用camelCase格式
- 代码缩进使用2个空格
- 每行代码不超过120个字符
- 为组件和关键函数添加注释

## 5. API接口文档

### 5.1 本地存储API

#### 5.1.1 获取所有交易记录
```javascript
// 从localStorage获取交易记录
const transactions = JSON.parse(localStorage.getItem('transactions') || '[]')
```

#### 5.1.2 保存交易记录
```javascript
// 将交易记录保存到localStorage
localStorage.setItem('transactions', JSON.stringify(transactions))
```

#### 5.1.3 添加交易记录
```javascript
// 添加新交易记录
const newTransaction = {
  id: Date.now().toString(),
  type: 'income',
  amount: 100,
  category: '工资',
  date: '2025-12-04',
  note: '12月工资'
}
transactions.push(newTransaction)
localStorage.setItem('transactions', JSON.stringify(transactions))
```

#### 5.1.4 删除交易记录
```javascript
// 删除指定id的交易记录
const updatedTransactions = transactions.filter(t => t.id !== id)
localStorage.setItem('transactions', JSON.stringify(updatedTransactions))
```

#### 5.1.5 更新交易记录
```javascript
// 更新指定id的交易记录
const index = transactions.findIndex(t => t.id === id)
if (index !== -1) {
  transactions[index] = {
    ...transactions[index],
    amount: 200,
    note: '更新后的备注'
  }
  localStorage.setItem('transactions', JSON.stringify(transactions))
}
```

## 6. 常见问题解决方案

### 6.1 安装依赖失败
**问题**：运行 `npm install` 时出现权限错误或网络错误
**解决方案**：
- 检查网络连接
- 尝试使用 `npm install --force` 强制安装
- 清理npm缓存：`npm cache clean --force`
- 以管理员身份运行终端

### 6.2 开发服务器无法启动
**问题**：运行 `npm run dev` 时端口被占用
**解决方案**：
- 检查是否有其他进程占用了3000端口
- 修改vite.config.js中的端口配置

### 6.3 代码编译错误
**问题**：运行 `npm run build` 时出现编译错误
**解决方案**：
- 检查代码中的语法错误
- 确保所有依赖版本兼容
- 检查是否有未定义的变量或函数

### 6.4 数据丢失问题
**问题**：刷新页面后交易记录丢失
**解决方案**：
- 检查localStorage是否被禁用
- 检查浏览器隐私设置
- 确保代码中正确调用了保存数据的方法

## 7. 项目进度与待办事项

### 7.1 当前项目进度
- ✅ 项目初始化与基本框架搭建
- ✅ 手机外壳组件开发
- ✅ 余额概览组件开发
- ✅ 交易列表组件开发
- ✅ 记账表单组件开发
- ✅ 底部导航组件开发
- ✅ 本地存储功能实现
- ✅ 分类图标支持
- ✅ 收入支出选择功能

### 7.2 待办事项清单

| 优先级 | 任务描述 | 负责人 | 状态 | 截止日期 |
|--------|----------|--------|------|----------|
| 高 | 实现统计图表功能 | - | 待开始 | - |
| 中 | 优化UI设计与动画效果 | - | 待开始 | - |
| 中 | 添加分类管理功能 | - | 待开始 | - |
| 中 | 实现数据导出功能 | - | 待开始 | - |
| 低 | 添加主题切换功能 | - | 待开始 | - |
| 低 | 实现数据导入功能 | - | 待开始 | - |

## 8. 联系与支持

### 8.1 项目负责人
- GitHub: [Co-artist](https://github.com/Co-artist)

### 8.2 团队成员
- 欢迎新成员加入开发

### 8.3 问题反馈
- 提交Issue: [GitHub Issues](https://github.com/Co-artist/accounter/issues)
- 提交Pull Request: [GitHub Pull Requests](https://github.com/Co-artist/accounter/pulls)

## 9. 许可证

MIT License

## 10. 更新日志

### v0.1.0 (2025-12-04)
- 项目初始化
- 实现基本记账功能
- 支持收入支出记录
- 实现交易列表展示
- 支持本地数据存储

---

**最后更新时间**：2025-12-04
**文档版本**：v0.1.0
