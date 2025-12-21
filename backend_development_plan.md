# 后端开发计划

## 1. 项目概述

基于前端需求，我们需要开发一个完整的后端服务，支持记账应用的所有功能。后端将使用Node.js、Express、MongoDB和JWT实现。

## 2. 技术栈

- **服务器框架**: Node.js + Express
- **数据库**: MongoDB
- **ORM**: Mongoose
- **认证**: JWT (JSON Web Tokens)
- **API设计**: RESTful
- **跨域**: CORS
- **日志**: Winston
- **验证**: Joi

## 3. 项目结构

```
backend/
├── config/                 # 配置文件
│   ├── db.js              # 数据库配置
│   ├── jwt.js             # JWT配置
│   └── server.js          # 服务器配置
├── controllers/           # 控制器
│   ├── authController.js  # 认证控制器
│   ├── transactionController.js  # 交易控制器
│   ├── categoryController.js     # 分类控制器
│   ├── budgetController.js       # 预算控制器
│   └── statController.js         # 统计控制器
├── middleware/            # 中间件
│   ├── authMiddleware.js  # 认证中间件
│   ├── errorMiddleware.js # 错误处理中间件
│   └── validationMiddleware.js   # 验证中间件
├── models/                # 数据模型
│   ├── User.js            # 用户模型
│   ├── Transaction.js     # 交易模型
│   ├── Category.js        # 分类模型
│   └── Budget.js          # 预算模型
├── routes/                # 路由
│   ├── authRoutes.js      # 认证路由
│   ├── transactionRoutes.js      # 交易路由
│   ├── categoryRoutes.js         # 分类路由
│   ├── budgetRoutes.js           # 预算路由
│   └── statRoutes.js             # 统计路由
├── services/              # 服务层
│   ├── authService.js     # 认证服务
│   ├── transactionService.js     # 交易服务
│   ├── categoryService.js        # 分类服务
│   ├── budgetService.js          # 预算服务
│   └── statService.js            # 统计服务
├── utils/                 # 工具函数
│   ├── errorHandler.js    # 错误处理
│   ├── logger.js          # 日志工具
│   └── responseFormatter.js      # 响应格式化
├── .env.example           # 环境变量示例
├── .gitignore             # Git忽略文件
├── package.json           # 项目依赖
├── server.js              # 服务器入口
└── README.md              # 项目说明
```

## 4. 数据库模型设计

### 4.1 User Model

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 密码加密中间件
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 密码验证方法
UserSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
```

### 4.2 Transaction Model

```javascript
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense']
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  note: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
```

### 4.3 Category Model

```javascript
const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense']
  },
  color: {
    type: String,
    required: true
  },
  usageCount: {
    type: Number,
    default: 0
  },
  amountRatio: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Category', CategorySchema);
```

### 4.4 Budget Model

```javascript
const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  used: {
    type: Number,
    default: 0
  },
  usagePercentage: {
    type: Number,
    default: 0
  },
  period: {
    type: String,
    required: true,
    enum: ['monthly']
  },
  type: {
    type: String,
    required: true,
    enum: ['expense']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Budget', BudgetSchema);
```

## 5. API设计

### 5.1 认证API

| 方法 | 路由 | 功能 | 认证 |
|------|------|------|------|
| POST | /api/auth/register | 用户注册 | 否 |
| POST | /api/auth/login | 用户登录 | 否 |
| GET | /api/auth/me | 获取当前用户 | 是 |

### 5.2 交易API

| 方法 | 路由 | 功能 | 认证 |
|------|------|------|------|
| GET | /api/transactions | 获取所有交易 | 是 |
| POST | /api/transactions | 添加交易 | 是 |
| PUT | /api/transactions/:id | 更新交易 | 是 |
| DELETE | /api/transactions/:id | 删除交易 | 是 |
| GET | /api/transactions/statistics | 获取交易统计 | 是 |

### 5.3 分类API

| 方法 | 路由 | 功能 | 认证 |
|------|------|------|------|
| GET | /api/categories | 获取所有分类 | 是 |
| POST | /api/categories | 添加分类 | 是 |
| PUT | /api/categories/:id | 更新分类 | 是 |
| DELETE | /api/categories/:id | 删除分类 | 是 |
| GET | /api/categories/:type | 获取指定类型分类 | 是 |

### 5.4 预算API

| 方法 | 路由 | 功能 | 认证 |
|------|------|------|------|
| GET | /api/budgets | 获取所有预算 | 是 |
| POST | /api/budgets | 添加预算 | 是 |
| PUT | /api/budgets/:id | 更新预算 | 是 |
| DELETE | /api/budgets/:id | 删除预算 | 是 |
| GET | /api/budgets/category/:category | 获取指定分类预算 | 是 |

### 5.5 统计API

| 方法 | 路由 | 功能 | 认证 |
|------|------|------|------|
| GET | /api/stats/total | 获取总收入、总支出、结余 | 是 |
| GET | /api/stats/monthly | 获取本月收入和支出 | 是 |
| GET | /api/stats/category | 获取分类统计 | 是 |

## 6. 开发步骤

### 6.1 项目初始化

1. 创建项目目录
2. 初始化npm
3. 安装依赖
4. 创建基本配置文件

### 6.2 数据库配置

1. 配置MongoDB连接
2. 创建数据模型
3. 实现模型关联

### 6.3 认证系统

1. 实现用户注册
2. 实现用户登录
3. 实现JWT认证中间件
4. 实现获取当前用户信息

### 6.4 核心功能实现

1. 实现交易管理API
2. 实现分类管理API
3. 实现预算管理API
4. 实现统计API

### 6.5 错误处理和日志

1. 实现全局错误处理
2. 实现请求日志
3. 实现错误日志

### 6.6 测试

1. 单元测试
2. 集成测试
3. API测试

### 6.7 部署

1. 配置环境变量
2. 优化性能
3. 部署到服务器

## 7. 依赖清单

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "joi": "^17.11.0",
    "winston": "^3.11.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.7.0",
    "supertest": "^6.3.3"
  }
}
```

## 8. 开发规范

1. **代码风格**: 使用ESLint和Prettier保持代码风格一致
2. **API设计**: 遵循RESTful设计原则
3. **错误处理**: 统一的错误格式和状态码
4. **安全性**: 密码加密、JWT认证、防止SQL注入
5. **文档**: 完善的API文档
6. **测试**: 高测试覆盖率

## 9. 预期成果

1. 完整的后端服务，支持前端所有功能
2. 安全可靠的认证系统
3. 高性能的API接口
4. 完善的错误处理和日志
5. 易于维护和扩展的代码结构

## 10. 时间估算

| 阶段 | 时间 |
|------|------|
| 项目初始化 | 1天 |
| 数据库配置 | 1天 |
| 认证系统 | 2天 |
| 交易管理API | 2天 |
| 分类管理API | 1天 |
| 预算管理API | 1天 |
| 统计API | 1天 |
| 错误处理和日志 | 1天 |
| 测试 | 2天 |
| 部署 | 1天 |
| **总计** | **13天** |

---

以上是基于前端需求制定的后端开发计划，我们将按照这个计划逐步实现后端服务。