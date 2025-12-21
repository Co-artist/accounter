<template>
  <div class="auth-page">
    <!-- 页面头部 -->
    <div class="auth-header">
      <h1 class="auth-title">登录</h1>
    </div>
    
    <!-- 注册成功提示 -->
    <div v-if="showSuccess" class="success-toast">
      ✅ 注册成功，请登录
    </div>
    
    <!-- 登录表单 -->
    <div class="auth-form">
      <!-- 用户名输入 -->
      <div class="form-group">
        <label class="form-label">用户名</label>
        <input 
          type="text" 
          class="form-input" 
          v-model="form.username" 
          placeholder="请输入用户名"
          autofocus
        >
        <div v-if="errors.username" class="error-message">
          {{ errors.username }}
        </div>
      </div>
      
      <!-- 密码输入 -->
      <div class="form-group">
        <label class="form-label">密码</label>
        <input 
          type="password" 
          class="form-input" 
          v-model="form.password" 
          placeholder="请输入密码"
        >
        <div v-if="errors.password" class="error-message">
          {{ errors.password }}
        </div>
      </div>
      
      <!-- 记住我选项 -->
      <div class="form-group remember-me">
        <label class="remember-me-label">
          <input 
            type="checkbox" 
            v-model="rememberMe"
          >
          <span>记住我</span>
        </label>
      </div>
      
      <!-- 登录按钮 -->
      <button 
        class="form-btn submit" 
        @click="handleLogin"
        :disabled="!isFormValid || isLoading"
      >
        {{ isLoading ? '登录中...' : '登录' }}
      </button>
      
      <!-- 注册链接 -->
      <div class="auth-link">
        还没有账号？ <router-link to="/register">立即注册</router-link>
      </div>
    </div>
    
    <!-- 品牌信息 -->
    <div class="auth-footer">
      <div class="app-icon">💰</div>
      <div class="app-name">记账助手</div>
      <div class="app-version">v1.0.0</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axiosInstance from '../utils/axios'

// 注入翻译函数
const t = inject('t')
const router = useRouter()

// 表单数据
const form = ref({
  username: '',
  password: ''
})

// 错误信息
const errors = ref({
  username: '',
  password: ''
})

// 加载状态
const isLoading = ref(false)

// 注册成功提示
const showSuccess = ref(false)

// 记住我状态
const rememberMe = ref(false)

// 检查URL参数，显示注册成功提示，并实现自动登录
onMounted(() => {
  // 检查是否已有token，如果有，直接跳转到首页
  const token = localStorage.getItem('token')
  if (token) {
    // 已登录，跳转到首页
    router.push('/')
    return
  }
  
  // 恢复记住我状态
  const savedRememberMe = localStorage.getItem('rememberMe')
  if (savedRememberMe) {
    rememberMe.value = savedRememberMe === 'true'
  }
  
  // 检查注册成功参数
  const params = new URLSearchParams(window.location.search)
  if (params.get('registered')) {
    showSuccess.value = true
    // 3秒后自动隐藏提示
    setTimeout(() => {
      showSuccess.value = false
    }, 3000)
  }
})

// 计算属性：表单是否有效
const isFormValid = computed(() => {
  return form.value.username.trim() && form.value.password
})

// 表单验证
const validateForm = () => {
  const newErrors = {
    username: '',
    password: ''
  }
  
  // 用户名验证
  if (!form.value.username.trim()) {
    newErrors.username = t('请输入用户名') || '请输入用户名'
  }
  
  // 密码验证
  if (!form.value.password) {
    newErrors.password = t('请输入密码') || '请输入密码'
  }
  
  errors.value = newErrors
  return !Object.values(newErrors).some(error => error)
}

// 登录处理
const handleLogin = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  
  try {
    // 使用axios调用登录API
    const response = await axiosInstance.post('/auth/login', {
      username: form.value.username,
      password: form.value.password
    })
    
    // 保存token - 注意：axios拦截器已经将响应处理为数据部分，所以直接使用response.token
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response))
    localStorage.setItem('rememberMe', rememberMe.value)
    
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
</script>

<style scoped>
.auth-page {
  width: 100%;
  height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
}

.auth-header {
  margin-bottom: 32px;
  text-align: center;
}

.auth-title {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.auth-form {
  background: white;
  border-radius: 20px;
  padding: 32px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.3s ease;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 14px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.2s ease;
  outline: none;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-btn {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 16px;
}

.form-btn.submit {
  background: #667eea;
  color: white;
}

.form-btn.submit:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.form-btn.submit:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

/* 记住我样式 */
.remember-me {
  margin-bottom: 24px;
}

.remember-me-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #666;
}

.remember-me-label input[type="checkbox"] {
  margin-right: 8px;
  cursor: pointer;
}

.error-message {
  color: #f44336;
  font-size: 12px;
  margin-top: 4px;
  margin-left: 4px;
}

.auth-link {
  text-align: center;
  font-size: 14px;
  color: #666;
}

.auth-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.auth-link a:hover {
  text-decoration: underline;
}

/* 成功提示样式 */
.success-toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(76, 175, 80, 0.9);
  color: white;
  padding: 12px 24px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    transform: translateX(-50%) translateY(-100px);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
}

.auth-footer {
  margin-top: 48px;
  text-align: center;
  color: #999;
}

.app-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.app-name {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #667eea;
}

.app-version {
  font-size: 12px;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>