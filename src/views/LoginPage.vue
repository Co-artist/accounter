<template>
  <div class="auth-page">
    <!-- 动态背景容器 -->
    <div class="background-animation">
      <div class="bubble b1"></div>
      <div class="bubble b2"></div>
      <div class="bubble b3"></div>
      <div class="bubble b4"></div>
      <div class="bubble b5"></div>
    </div>

    <!-- 页面头部 -->
    <div class="auth-header">
      <h1 class="auth-title">登录</h1>
    </div>
    
    <!-- 注册成功提示 -->
    <div v-if="showSuccess" class="success-toast">
      ✅ 注册成功，请登录
    </div>
    
    <!-- 登录表单 -->
    <form class="auth-form" @submit.prevent="handleLogin">
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
          @focus="isPasswordFocused = true"
          @blur="isPasswordFocused = false"
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
        type="submit"
        class="form-btn submit" 
        :disabled="!isFormValid || isLoading"
      >
        {{ isLoading ? '登录中...' : '登录' }}
      </button>
      
      <!-- 注册链接 -->
      <div class="auth-link">
        还没有账号？ <router-link to="/register">立即注册</router-link>
      </div>
    </form>
    
    <!-- 品牌信息 -->
    <div class="auth-footer">
      <div class="app-icon">
        <InteractiveLogo :isClosingEyes="isPasswordFocused" />
      </div>
      <div class="app-name">猫头鹰记账</div>
      <div class="app-version">v1.0.0</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axiosInstance from '../utils/axios'
import InteractiveLogo from '../components/InteractiveLogo.vue'

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

// 密码框焦点状态
const isPasswordFocused = ref(false)

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
  /* 动态渐变背景 */
  background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 50%, #ffe082 100%);
  background-size: 200% 200%;
  animation: gradientFlow 10s ease infinite;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

@keyframes gradientFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 漂浮气泡动画 */
.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}

.bubble {
  position: absolute;
  bottom: -100px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
  animation: floatUp linear infinite;
}

.b1 { width: 80px; height: 80px; left: 10%; animation-duration: 8s; animation-delay: 0s; }
.b2 { width: 40px; height: 40px; left: 30%; animation-duration: 6s; animation-delay: 2s; background: rgba(255, 255, 255, 0.3); }
.b3 { width: 120px; height: 120px; left: 70%; animation-duration: 12s; animation-delay: 1s; }
.b4 { width: 60px; height: 60px; left: 50%; animation-duration: 9s; animation-delay: 4s; background: rgba(255, 255, 255, 0.25); }
.b5 { width: 30px; height: 30px; left: 85%; animation-duration: 7s; animation-delay: 3s; }

@keyframes floatUp {
  0% { transform: translateY(0) rotate(0deg); opacity: 0; }
  10% { opacity: 0.6; }
  90% { opacity: 0.4; }
  100% { transform: translateY(-120vh) rotate(360deg); opacity: 0; }
}

.auth-header {
  margin-bottom: 32px;
  text-align: center;
  position: relative;
  z-index: 1;
}

.auth-title {
  font-size: 32px;
  font-weight: 700;
  color: #5d4037; /* 深棕色，对比黄色背景 */
  margin: 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.auth-form {
  background: rgba(255, 255, 255, 0.92); /* 略微透明，增加质感 */
  backdrop-filter: blur(10px); /* 毛玻璃效果 */
  border-radius: 24px;
  padding: 40px 32px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.05);
  animation: slideUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  position: relative;
  z-index: 1;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #5d4037;
  margin-bottom: 8px;
  margin-left: 4px;
}

.form-input {
  width: 100%;
  padding: 16px;
  border: 2px solid transparent;
  background: #f7f7f7;
  border-radius: 14px;
  font-size: 16px;
  transition: all 0.3s ease;
  outline: none;
  box-sizing: border-box;
  color: #333;
}

.form-input:focus {
  background: #fff;
  border-color: #ffca28; /* 聚焦高亮色 */
  box-shadow: 0 4px 12px rgba(255, 202, 40, 0.15);
  transform: translateY(-1px);
}

.form-btn {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 16px;
}

.form-btn.submit {
  background: linear-gradient(135deg, #ffca28 0%, #ffb300 100%);
  color: #5d4037;
  box-shadow: 0 8px 20px rgba(255, 179, 0, 0.25);
}

.form-btn.submit:hover:not(:disabled) {
  background: linear-gradient(135deg, #ffd54f 0%, #ffca28 100%);
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(255, 179, 0, 0.35);
}

.form-btn.submit:disabled {
  background: #e0e0e0;
  color: #999;
  cursor: not-allowed;
  opacity: 0.8;
  box-shadow: none;
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
  user-select: none;
}

.remember-me-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  margin-right: 8px;
  cursor: pointer;
  accent-color: #ffca28;
}

.error-message {
  color: #d32f2f;
  font-size: 12px;
  margin-top: 6px;
  margin-left: 4px;
  font-weight: 500;
}

.auth-link {
  text-align: center;
  font-size: 14px;
  color: #757575;
}

.auth-link a {
  color: #ffb300;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.auth-link a:hover {
  color: #ff8f00;
  text-decoration: underline;
}

/* 成功提示样式 */
.success-toast {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(76, 175, 80, 0.95);
  color: white;
  padding: 12px 32px;
  border-radius: 30px;
  font-size: 15px;
  font-weight: 600;
  z-index: 1000;
  box-shadow: 0 8px 20px rgba(76, 175, 80, 0.3);
  animation: slideDown 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
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
  color: #8d6e63;
  position: relative;
  z-index: 1;
}

.app-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 48px;
  margin-bottom: 8px;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
}

.app-name {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
  color: #5d4037;
}

.app-version {
  font-size: 12px;
  opacity: 0.8;
}

@keyframes slideUp {
  from {
    transform: translateY(40px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
