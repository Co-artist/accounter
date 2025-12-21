## 连接MongoDB数据库步骤

### 1. 修改数据库连接配置文件
**文件**：`config/db.js`
**修改内容**：移除已废弃的MongoDB连接选项

```javascript
// config/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // 连接MongoDB数据库，使用环境变量中的连接字符串
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/acconuter');
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### 2. 配置环境变量
**文件**：`.env`
**修改内容**：确保MONGO_URI配置正确

```env
# .env
MONGO_URI=mongodb://localhost:27017/acconuter
```

### 3. 启动服务器测试连接
**命令**：`npm run dev`

### 4. 预期结果
- 服务器成功连接到MongoDB数据库
- 输出：`MongoDB Connected: localhost`
- 服务器正常运行在端口5000

### 5. 验证数据库连接
- 使用MongoDB Compass连接到`mongodb://localhost:27017`
- 检查是否自动创建了`acconuter`数据库

### 6. 常见问题及解决方案
- **MongoDB服务未启动**：运行`net start MongoDB`（Windows）或`sudo systemctl start mongod`（Linux）
- **端口被占用**：修改MongoDB配置文件中的端口，或关闭占用端口的进程
- **权限问题**：确保当前用户有MongoDB访问权限

通过以上步骤，您的应用程序将能够成功连接到MongoDB数据库。