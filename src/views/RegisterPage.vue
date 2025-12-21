<template>
  <div class="auth-page">
    <!-- 页面头部 -->
    <div class="auth-header">
      <h1 class="auth-title">注册</h1>
    </div>
    
    <!-- 注册表单 -->
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
          placeholder="请输入密码（至少6位）"
        >
        <div v-if="errors.password" class="error-message">
          {{ errors.password }}
        </div>
      </div>
      
      <!-- 确认密码输入 -->
      <div class="form-group">
        <label class="form-label">确认密码</label>
        <input 
          type="password" 
          class="form-input" 
          v-model="form.confirmPassword" 
          placeholder="请再次输入密码"
        >
        <div v-if="errors.confirmPassword" class="error-message">
          {{ errors.confirmPassword }}
        </div>
      </div>
      
      <!-- 注册按钮 -->
      <button 
        class="form-btn submit" 
        @click="handleRegister"
        :disabled="!isFormValid || isLoading"
      >
        {{ isLoading ? '注册中...' : '注册' }}
      </button>
      
      <!-- 登录链接 -->
      <div class="auth-link">
        已有账号？ <router-link to="/login">立即登录</router-link>
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
import { ref, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import axiosInstance from '../utils/axios'

// 注入翻译函数
const t = inject('t')
const router = useRouter()

// 表单数据
const form = ref({
  username: '',
  password: '',
  confirmPassword: ''
})

// 错误信息
const errors = ref({
  username: '',
  password: '',
  confirmPassword: ''
})

// 加载状态
const isLoading = ref(false)

// 计算属性：表单是否有效
const isFormValid = computed(() => {
  return form.value.username.trim() && 
         form.value.password.length >= 6 && 
         form.value.password === form.value.confirmPassword
})

// 表单验证
const validateForm = () => {
  const newErrors = {
    username: '',
    password: '',
    confirmPassword: ''
  }
  
  // 用户名验证
  if (!form.value.username.trim()) {
    newErrors.username = t('请输入用户名') || '请输入用户名'
  }
  
  // 密码验证
  if (!form.value.password) {
    newErrors.password = t('请输入密码') || '请输入密码'
  } else if (form.value.password.length < 6) {
    newErrors.password = t('密码至少6位') || '密码至少6位'
  }
  
  // 确认密码验证
  if (form.value.password && form.value.confirmPassword !== form.value.password) {
    newErrors.confirmPassword = t('两次密码输入不一致') || '两次密码输入不一致'
  }
  
  errors.value = newErrors
  return !Object.values(newErrors).some(error => error)
}

// 注册处理
const handleRegister = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  
  try {
    // 使用axios调用注册API
    await axiosInstance.post('/auth/register', {
      username: form.value.username,
      password: form.value.password
    })
    
    // 注册成功，跳转到登录页面
    router.push('/login?registered=true')
  } catch (error) {
    console.error('注册失败:', error)
    if (error.response?.data?.message?.includes('Username already exists')) {
      errors.value.username = '该用户名已被使用'
    } else if (error.response?.data?.message) {
      errors.value.username = error.response.data.message
    } else {
      errors.value.username = '注册失败，请稍后重试'
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