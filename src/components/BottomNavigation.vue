<template>
  <div class="bottom-navigation-container">
    <div class="bottom-navigation">
      <!-- 左侧两个导航项 -->
      <div class="nav-group left">
        <router-link
          v-for="item in leftNavItems" 
          :key="item.id"
          :to="getRoutePath(item.id)"
          class="nav-item"
          :class="{ active: isActive(item.id) }"
          @click="handleClick(item.id); $emit('navigate', item.id)"
        >
          <div class="nav-icon-wrapper">
            <!-- 假设这里使用 SVG 组件或字体图标，这里暂时用 emoji 代替，后续可替换为 SVG -->
            <span class="nav-icon" :class="{ 'bounce': isActive(item.id) }">{{ item.icon }}</span>
          </div>
          <span class="nav-label">{{ t(item.label) }}</span>
        </router-link>
      </div>

      <!-- 中间 C 位猫头鹰 Logo (悬浮记账按钮) -->
      <div class="center-action" @click="handleCenterClick">
        <div class="owl-logo-wrapper" :class="{ 'breathing': !isMenuOpen, 'clicked': isMenuOpen }">
          <img 
            src="/src/assets/owl-logo.svg" 
            alt="Record" 
            class="owl-logo" 
          />
        </div>
        <!-- 记账菜单弹出的逻辑可在此扩展 -->
      </div>

      <!-- 右侧两个导航项 -->
      <div class="nav-group right">
        <router-link
          v-for="item in rightNavItems" 
          :key="item.id"
          :to="getRoutePath(item.id)"
          class="nav-item"
          :class="{ active: isActive(item.id) }"
          @click="handleClick(item.id); $emit('navigate', item.id)"
        >
          <div class="nav-icon-wrapper">
            <span class="nav-icon" :class="{ 'bounce': isActive(item.id) }">{{ item.icon }}</span>
          </div>
          <span class="nav-label">{{ t(item.label) }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { inject, ref } from 'vue'
import { setNavLeft, setNavRight } from '../utils/navDirection'

// 注入翻译函数
const t = inject('t', (key) => key)

// Props
const props = defineProps({
  activeItem: {
    type: String,
    default: 'home'
  }
})

// Emits
const emit = defineEmits(['navigate'])

// 状态
const isMenuOpen = ref(false)

// 获取当前路由
const route = useRoute()
const router = useRouter()

// 导航项配置 (暂时保持 emoji，实际项目中建议换成 SVG path 以支持 stroke/fill 切换)
const leftNavItems = [
  { id: 'home', icon: '🏠', label: '首页' },
  { id: 'statistics', icon: '📊', label: '统计' }
]

const rightNavItems = [
  { id: 'category', icon: '📋', label: '分类' },
  { id: 'profile', icon: '🦉', label: '我的' }
]

// 获取路由路径
const getRoutePath = (itemId) => {
  const routeMap = {
    home: '/',
    statistics: '/statistics',
    category: '/category',
    profile: '/profile'
  }
  return routeMap[itemId] || '/'  
}

// 判断当前路由是否激活
const isActive = (itemId) => {
  if (itemId === 'home') {
    return route.path === '/'
  }
  return route.path.includes(itemId)
}

// 处理点击导航时的方向设置
const tabs = ['home', 'statistics', 'category', 'profile']
const getIndex = (id) => tabs.indexOf(id)
const getCurrentId = () => {
  if (route.path === '/') return 'home'
  for (const id of tabs) {
    if (id !== 'home' && route.path.includes(id)) return id
  }
  return 'home'
}

const handleClick = (itemId) => {
  const from = getCurrentId()
  const to = itemId
  const fi = getIndex(from)
  const ti = getIndex(to)
  if (fi >= 0 && ti >= 0) {
    if (ti > fi) setNavLeft()
    else if (ti < fi) setNavRight()
  }
}

// 处理中间按钮点击
const handleCenterClick = () => {
  isMenuOpen.value = !isMenuOpen.value
  // 这里可以触发一个路由跳转到记账页，或者弹出一个模态框
  // 暂时假设跳转到记账页（如果有的话），或者复用首页的逻辑
  // 目前项目里记账功能好像是在首页？或者是一个弹窗？
  // 假设有一个 '/record' 或者触发父组件事件
  emit('center-click')
}
</script>

<style scoped>
/* 容器：负责底部悬浮定位 */
.bottom-navigation-container {
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  z-index: 100;
  display: flex;
  justify-content: center;
  /* 适配底部安全区：如果悬浮在底部，建议 bottom 加上 safe-area */
  bottom: calc(20px + env(safe-area-inset-bottom));
}

/* 导航栏主体：胶囊样式 */
.bottom-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 500px; /* 限制最大宽度，平板上更好看 */
  height: 64px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 32px; /* 大圆角胶囊 */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 0 16px;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

/* 暗色模式适配 */
:global([data-theme="dark"]) .bottom-navigation {
  background: rgba(30, 30, 46, 0.9);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.nav-group {
  display: flex;
  flex: 1;
  justify-content: space-around;
  align-items: center;
}

.nav-group.left {
  margin-right: 40px; /* 给中间 Logo 留位 */
}

.nav-group.right {
  margin-left: 40px;
}

/* 中间 C 位悬浮按钮 */
.center-action {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 102;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.owl-logo-wrapper {
  width: 64px;
  height: 64px;
  background: var(--bg-card, #fff);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(255, 213, 79, 0.4); /* 品牌色阴影 */
  border: 4px solid var(--bg-body, #f5f5f5); /* 与背景融合的边框，制造镂空感 */
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
  margin-top: -30px; /* 向上突出一半 */
}

:global([data-theme="dark"]) .owl-logo-wrapper {
  background: var(--bg-card, #24283b);
  border-color: var(--bg-body, #1a1b26);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

/* 呼吸动效 */
.owl-logo-wrapper.breathing {
  animation: breathe 3s infinite ease-in-out;
}

@keyframes breathe {
  0%, 100% { transform: scale(1); box-shadow: 0 8px 20px rgba(255, 213, 79, 0.4); }
  50% { transform: scale(1.05); box-shadow: 0 12px 30px rgba(255, 213, 79, 0.6); }
}

.owl-logo-wrapper:active {
  transform: scale(0.9);
}

.owl-logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

/* 导航项 */
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  text-decoration: none;
  color: var(--text-secondary, #999);
  transition: all 0.3s ease;
  position: relative;
  min-width: 48px;
}

.nav-item.active {
  color: var(--primary-color, #FFD54F);
}

.nav-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
}

.nav-icon {
  font-size: 24px;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: block;
}

/* 选中时的弹跳动画 */
.nav-item.active .nav-icon {
  transform: translateY(-2px) scale(1.1);
}

.nav-label {
  font-size: 10px;
  font-weight: 500;
  opacity: 0.8;
  transition: all 0.2s;
}

.nav-item.active .nav-label {
  opacity: 1;
  font-weight: 600;
}

/* 选中指示点（可选） */
.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: -6px;
  width: 4px;
  height: 4px;
  background: var(--primary-color, #FFD54F);
  border-radius: 50%;
  opacity: 1;
}
</style>
