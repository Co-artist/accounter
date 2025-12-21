# 使用axios进行登录注册API调用

## 一、功能概述

将登录注册页面的模拟API调用替换为使用axios进行真实的后端API调用，实现完整的登录注册功能。

## 二、实现步骤

### 1. 修改登录页面 (LoginPage.vue)

#### 1.1 导入axios实例
```javascript
import axiosInstance from '../utils/axios'
```

#### 1.2 修改登录处理函数
```javascript
const handleLogin = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  
  try {
    // 使用axios调用登录API
    const response = await axiosInstance.post('/auth/login', {
      username: form.value.username,
      password: form.value.password
    })
    
    // 保存token
    localStorage.setItem('token', response.data.token)
    
    // 跳转到首页
    router.push('/')
  } catch (error) {
    console.error('登录失败:', error)
    if (error.response?.data?.error) {
      errors.value.username = error.response.data.error
    } else {
      errors.value.username = '登录失败，请稍后重试'
    }
  } finally {
    isLoading.value = false
  }
}
```

### 2. 修改注册页面 (RegisterPage.vue)

#### 2.1 导入axios实例
```javascript
import axiosInstance from '../utils/axios'
```

#### 2.2 修改注册处理函数
```javascript
const handleRegister = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  
  try {
    // 使用axios调用注册API
    const response = await axiosInstance.post('/auth/register', {
      username: form.value.username,
      password: form.value.password
    })
    
    // 保存token
    localStorage.setItem('token', response.data.token)
    
    // 跳转到首页
    router.push('/')
  } catch (error) {
    console.error('注册失败:', error)
    if (error.response?.data?.error?.includes('用户名已存在')) {
      errors.value.username = '用户名已存在'
    } else if (error.response?.data?.error) {
      errors.value.username = error.response.data.error
    } else {
      errors.value.username = '注册失败，请稍后重试'
    }
  } finally {
    isLoading.value = false
  }
}
```

### 3. 测试功能

#### 3.1 测试登录功能
- 输入用户名和密码登录
- 测试登录成功的情况
- 测试登录失败的情况（用户名或密码错误）

#### 3.2 测试注册功能
- 输入新的用户名和密码注册
- 测试注册成功的情况
- 测试注册失败的情况（用户名已存在）

## 三、技术要点

1. **axios实例**：使用配置好的axios实例进行API调用
2. **请求拦截器**：自动添加token到请求头
3. **响应拦截器**：处理401未授权错误，自动跳转到登录页
4. **错误处理**：处理各种API错误情况，显示友好的错误信息
5. **状态管理**：使用localStorage存储token，实现登录状态持久化

## 四、预期效果

1. 登录功能：
   - 成功登录后跳转到首页
   - 失败时显示错误信息
   - 记住登录状态

2. 注册功能：
   - 成功注册后跳转到首页
   - 用户名已存在时显示错误信息
   - 密码不符合要求时显示错误信息

3. 路由保护：
   - 未登录用户自动跳转到登录页
   - 已登录用户可以访问所有页面

## 五、后续优化

1. **添加加载状态**：在API调用过程中显示加载动画
2. **完善错误处理**：处理各种网络错误和服务器错误
3. **添加表单验证**：在前端添加更严格的表单验证
4. **实现密码可见性切换**：允许用户查看输入的密码
5. **添加记住我功能**：记住用户名，方便下次登录

## 六、开发步骤

1. 修改LoginPage.vue，使用axios进行登录API调用
2. 修改RegisterPage.vue，使用axios进行注册API调用
3. 测试登录注册功能
4. 修复可能出现的问题
5. 完善错误处理和用户体验

---

通过这个计划，我们将使用axios替换之前的模拟API调用，实现真实的登录注册功能，为后续的后端开发打下基础。