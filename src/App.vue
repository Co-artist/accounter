<template>
  <PhoneShell :class="theme">
    <router-view />
    <ErrorMessage
      v-if="errorMessage.show"
      :type="errorMessage.type"
      :title="errorMessage.title"
      :message="errorMessage.message"
      :auto-close="errorMessage.autoClose"
      @close="clearError"
    />
  </PhoneShell>
</template>

<script setup>
import { ref, provide, onMounted, watch, computed, onErrorCaptured } from 'vue'
import PhoneShell from './components/PhoneShell.vue'
import ErrorMessage from './components/ErrorMessage.vue'
import { messages } from './i18n'
import store from './store'

// 主题状态管理
const theme = ref('light')

// 语言状态管理
const language = ref('zh-CN')

// 错误信息管理
const errorMessage = ref({
  show: false,
  type: 'error',
  title: '',
  message: '',
  autoClose: true
})

// 设置错误信息
const setError = (error) => {
  if (typeof error === 'string') {
    errorMessage.value = {
      show: true,
      type: 'error',
      title: '错误',
      message: error,
      autoClose: true
    }
  } else {
    errorMessage.value = {
      show: true,
      type: error.type || 'error',
      title: error.title || '错误',
      message: error.message || '发生未知错误',
      autoClose: error.autoClose !== false
    }
  }
  
  // 记录错误日志
  console.error('应用错误:', error.message || error)
}

// 清除错误信息
const clearError = () => {
  errorMessage.value.show = false
}

// 全局错误捕获
onErrorCaptured((error, instance, info) => {
  console.error('全局错误捕获:', error, info)
  setError({
    type: 'error',
    title: '应用错误',
    message: error.message || '发生未知错误',
    autoClose: true
  })
  return false // 阻止错误继续传播
})

// 从localStorage加载设置
const loadSettings = () => {
  const savedTheme = localStorage.getItem('app-theme')
  const savedLanguage = localStorage.getItem('app-language')
  
  if (savedTheme) {
    theme.value = savedTheme
  } else {
    // 默认使用亮色主题
    theme.value = 'light'
  }
  
  if (savedLanguage) {
    language.value = savedLanguage
  }
}

// 保存设置到localStorage
const saveSettings = () => {
  localStorage.setItem('app-theme', theme.value)
  localStorage.setItem('app-language', language.value)
}

// 监听系统主题变化
const watchSystemTheme = () => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  
  const handleChange = () => {
    if (theme.value === 'auto') {
      const prefersDark = mediaQuery.matches
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
    }
  }
  
  mediaQuery.addEventListener('change', handleChange)
  return () => {
    mediaQuery.removeEventListener('change', handleChange)
  }
}

// 更新主题
const updateTheme = (newTheme) => {
  theme.value = newTheme
  
  if (newTheme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
  } else {
    document.documentElement.setAttribute('data-theme', newTheme)
  }
  
  saveSettings()
}

// 更新语言
const updateLanguage = (newLanguage) => {
  language.value = newLanguage
  saveSettings()
}

// 当前语言的翻译消息
const currentMessages = computed(() => {
  return messages[language.value] || messages['zh-CN']
})

// 翻译函数
const t = (key, params = {}) => {
  let message = currentMessages.value[key] || key
  
  // 替换占位符
  for (const [name, value] of Object.entries(params)) {
    message = message.replace(new RegExp(`\{${name}\}`, 'g'), value)
  }
  
  return message
}

// 提供全局状态
provide('theme', theme)
provide('language', language)
provide('updateTheme', updateTheme)
provide('updateLanguage', updateLanguage)
provide('t', t)
// 提供数据存储
provide('store', store)

// 初始化
onMounted(() => {
  loadSettings()
  updateTheme(theme.value)
  watchSystemTheme()
})

// 监听设置变化
watch([theme, language], () => {
  saveSettings()
})
</script>

<style>
/* 全局样式重置和基础设置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  padding: 20px;
  transition: background-color 0.3s ease;
}

#app {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 主题变量 */
:root {
  /* 默认亮色主题 */
  --background-primary: #f5f5f5;
  --background-secondary: #ffffff;
  --text-primary: #333333;
  --text-secondary: #666666;
  --text-tertiary: #999999;
  --border-color: #e0e0e0;
  --primary-color: #667eea;
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --income-color: #4caf50;
  --expense-color: #f44336;
  --balance-color: #2196f3;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.12);
}

/* 暗色主题 */
[data-theme="dark"] {
  --background-primary: #121212;
  --background-secondary: #1e1e1e;
  --text-primary: #ffffff;
  --text-secondary: #b0b0b0;
  --text-tertiary: #707070;
  --border-color: #333333;
  --primary-color: #8b94e9;
  --primary-gradient: linear-gradient(135deg, #8b94e9 0%, #a58ac8 100%);
  --income-color: #66bb6a;
  --expense-color: #ef5350;
  --balance-color: #42a5f5;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
}

/* 蓝色主题 */
[data-theme="blue"] {
  --background-primary: #f0f4f8;
  --background-secondary: #ffffff;
  --text-primary: #1a365d;
  --text-secondary: #4a5568;
  --text-tertiary: #718096;
  --border-color: #e2e8f0;
  --primary-color: #3182ce;
  --primary-gradient: linear-gradient(135deg, #3182ce 0%, #2b6cb0 100%);
  --income-color: #38a169;
  --expense-color: #e53e3e;
  --balance-color: #4299e1;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.12);
}

/* 绿色主题 */
[data-theme="green"] {
  --background-primary: #f0fdf4;
  --background-secondary: #ffffff;
  --text-primary: #166534;
  --text-secondary: #3f6212;
  --text-tertiary: #65a30d;
  --border-color: #dcfce7;
  --primary-color: #10b981;
  --primary-gradient: linear-gradient(135deg, #10b981 0%, #059669 100%);
  --income-color: #22c55e;
  --expense-color: #ef4444;
  --balance-color: #14b8a6;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.12);
}

/* 紫色主题 */
[data-theme="purple"] {
  --background-primary: #faf5ff;
  --background-secondary: #ffffff;
  --text-primary: #581c87;
  --text-secondary: #7e22ce;
  --text-tertiary: #9333ea;
  --border-color: #f3e8ff;
  --primary-color: #8b5cf6;
  --primary-gradient: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  --income-color: #22c55e;
  --expense-color: #ef4444;
  --balance-color: #8b5cf6;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.12);
}

/* 橙色主题 */
[data-theme="orange"] {
  --background-primary: #fff7ed;
  --background-secondary: #ffffff;
  --text-primary: #9a3412;
  --text-secondary: #d97706;
  --text-tertiary: #f59e0b;
  --border-color: #ffedd5;
  --primary-color: #f97316;
  --primary-gradient: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  --income-color: #22c55e;
  --expense-color: #ef4444;
  --balance-color: #f59e0b;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.12);
}

/* 猫头鹰主题 */
[data-theme="owl"] {
  /* 背景色：使用深蓝色渐变，确保按钮对比度 */
  --background-primary: #1a1a2e;
  --background-secondary: #16213e;
  --background-tertiary: #0f3460;
  
  /* 文本色：确保高对比度 */
  --text-primary: #ffffff;
  --text-secondary: #b8c2cc;
  --text-tertiary: #6c757d;
  
  /* 主色调：使用醒目的黄色，确保按钮突出 */
  --primary-color: #ffd700;
  --primary-gradient: linear-gradient(135deg, #ffd700 0%, #ffa726 100%);
  --primary-hover: #ffc107;
  --primary-active: #ffb300;
  
  /* 功能色：确保功能明确 */
  --income-color: #4caf50;
  --expense-color: #f44336;
  --balance-color: #2196f3;
  
  /* 边框和阴影：增强层次感 */
  --border-color: #2d3748;
  --border-light: #4a5568;
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.4);
}

/* 暗色主题下的body样式 */
[data-theme="dark"] body {
  background-color: #121212;
  color: #ffffff;
}

/* 猫头鹰主题下的body样式 */
[data-theme="owl"] body {
  background-color: #1a1a2e;
  color: #ffffff;
}
</style>