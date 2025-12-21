<template>
  <div id="app-content" :class="theme">
    <SplashScreen v-if="showSplash" @finish="handleSplashFinish" />
    <OwlBackground />
    <router-view v-slot="{ Component }">
      <transition :name="transitionName">
        <keep-alive include="HomePage,StatisticsPage,CategoryPage,ProfilePage">
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
    <UpdateModal
      :visible="updateModal.visible"
      :title="t('更新说明')"
      :content="updateModal.note"
      :version="updateModal.version"
      @close="handleUpdateClose"
      @neverShow="handleUpdateNeverShow"
    />
    <ErrorMessage
      v-if="errorMessage.show"
      :type="errorMessage.type"
      :title="errorMessage.title"
      :message="errorMessage.message"
      :auto-close="errorMessage.autoClose"
      @close="clearError"
    />
  </div>
</template>

<script setup>
import { ref, provide, onMounted, watch, computed, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'
import ErrorMessage from './components/ErrorMessage.vue'
import UpdateModal from './components/UpdateModal.vue'
import axios from './utils/axios'
import OwlBackground from './components/OwlBackground.vue'
import SplashScreen from './components/SplashScreen.vue'
import { messages } from './i18n'
import store from './store'
import { navDirection } from './utils/navDirection'

// 路由实例
const router = useRouter()

// 主题状态管理
const theme = ref('light')

// 开场动画状态
const showSplash = ref(false)
const enableSplash = ref(true)

// 更新开场动画设置
const updateSplashSetting = (enabled) => {
  enableSplash.value = enabled
  localStorage.setItem('app-enable-splash', enabled)
}


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
  const savedEnableSplash = localStorage.getItem('app-enable-splash')
  
  if (savedTheme) {
    theme.value = savedTheme
  } else {
    // 默认使用亮色主题
    theme.value = 'light'
  }
  
  if (savedLanguage) {
    language.value = savedLanguage
  }

  // 加载开场动画设置
  if (savedEnableSplash !== null) {
    enableSplash.value = savedEnableSplash === 'true'
  } else {
    enableSplash.value = true // 默认开启
  }


  // 如果开启了开场动画，则显示
  if (enableSplash.value) {
    showSplash.value = true
  }
}

// 处理开场动画结束
const handleSplashFinish = () => {
  showSplash.value = false
  
  // 检查登录状态和自动登录设置
  const token = localStorage.getItem('token')
  const rememberMe = localStorage.getItem('rememberMe') === 'true'
  
  if (token && rememberMe) {
    // 已登录且开启自动登录，留在首页
    router.push('/')
  } else {
    // 未登录或未开启自动登录，跳转到登录页
    // 如果存在token但没有rememberMe，清除token
    if (token && !rememberMe) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    router.push('/login')
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
    message = message.replace(new RegExp('\\{' + name + '\\}', 'g'), value)
  }
  
  return message
}

// 切换动画名称
const transitionName = computed(() => {
  if (navDirection.value === 'left') return 'slide-left'
  if (navDirection.value === 'right') return 'slide-right'
  return 'fade'
})

// 提供全局状态
provide('theme', theme)
provide('language', language)
provide('enableSplash', enableSplash)
provide('updateTheme', updateTheme)
provide('updateLanguage', updateLanguage)
provide('updateSplashSetting', updateSplashSetting)
provide('showSplash', showSplash)
provide('t', t)
// 提供数据存储
provide('store', store)

// 初始化
onMounted(() => {
  loadSettings()
  updateTheme(theme.value)
  watchSystemTheme()
  checkUpdateNote()
  preloadTabs()
})

// 监听设置变化
watch([theme, language], () => {
  saveSettings()
})

// 更新说明弹窗状态
const updateModal = ref({
  visible: false,
  version: '',
  note: ''
})

// 检查更新说明
const checkUpdateNote = async () => {
  try {
    const resp = await axios.get('/updates/check')
    const version = resp.version || ''
    const note = resp.note || ''
    const lastSeen = localStorage.getItem('lastSeenUpdateVersion')
    if (version && version !== lastSeen) {
      updateModal.value = { visible: true, version, note }
    }
  } catch (e) {
    // 忽略网络错误
    console.warn('Update note check failed:', e?.message || e)
  }
}

// 预加载主 Tab 组件
const preloadTabs = () => {
  Promise.all([
    import('./views/HomePage.vue'),
    import('./views/StatisticsPage.vue'),
    import('./views/CategoryPage.vue'),
    import('./views/ProfilePage.vue')
  ]).catch(() => {})
}

const handleUpdateClose = () => {
  // 仅关闭，不记录（用户下次仍会看到）
  updateModal.value.visible = false
}

const handleUpdateNeverShow = () => {
  // 记录已阅读的版本，不再提示
  if (updateModal.value.version) {
    localStorage.setItem('lastSeenUpdateVersion', updateModal.value.version)
  }
  updateModal.value.visible = false
}
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
  margin: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  transition: background-color 0.3s ease;
}

/* 页面切换动画 */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active,
.fade-enter-active,
.fade-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
  will-change: transform, opacity;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0.6;
}
.slide-left-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.slide-left-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slide-left-leave-to {
  transform: translateX(-30%);
  opacity: 0;
}
.slide-right-enter-from {
  transform: translateX(-100%);
  opacity: 0.6;
}
.slide-right-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.slide-right-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slide-right-leave-to {
  transform: translateX(30%);
  opacity: 0;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

#app {
  width: 100%;
  height: 100%;
}

#app-content {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background-color: var(--background-primary);
  contain: layout paint size;
}

/* 主题变量 */
:root {
  /* 默认亮色主题 (还原为紫色) */
  --bg-body: #f5f5f5;
  --bg-card: #ffffff;
  --bg-input: #f5f5f5;
  --text-primary: #333333;
  --text-secondary: #666666;
  --text-tertiary: #999999;
  --border-color: #e0e0e0;
  
  /* 还原为紫色渐变 */
  --primary-color: #667eea;
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --text-on-primary: #ffffff; /* 适配紫色背景的白字 */
  
  --income-color: #4caf50;
  --expense-color: #f44336;
  --balance-color: #2196f3;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.12);
}

/* 暗色主题 */
[data-theme="dark"] {
  --bg-body: #121212;
  --bg-card: #1E1E1E;
  --bg-input: #2C2C2C;
  --text-primary: #ffffff;
  --text-secondary: #b0b0b0;
  --text-tertiary: #707070;
  --border-color: #333333;
  
  /* 暗色模式下也使用紫色系但更深 */
  --primary-color: #8b94e9;
  --primary-gradient: linear-gradient(135deg, #8b94e9 0%, #a58ac8 100%);
  --text-on-primary: #ffffff;
  
  --income-color: #66bb6a;
  --expense-color: #ef5350;
  --balance-color: #42a5f5;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
}

/* ...中间省略... */

/* 猫头鹰主题 (保留黄色) */
[data-theme="owl"] {
  --bg-body: #1a1a2e;
  --bg-card: #16213e;
  --bg-input: #0f3460;
  --text-primary: #ffffff;
  --text-secondary: #b8c2cc;
  --text-tertiary: #6c757d;
  --border-color: #2d3748;
  
  --primary-color: #ffd700;
  --primary-gradient: linear-gradient(135deg, #ffd700 0%, #ffa726 100%);
  --text-on-primary: #5D4037; /* 适配黄色背景的深字 */
  
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.4);
}

/* 基础样式适配 */
body {
  background-color: var(--bg-body);
  color: var(--text-primary);
}

#app-content {
  background-color: var(--bg-body);
}
</style>
