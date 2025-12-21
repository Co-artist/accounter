<template>
  <div class="bottom-navigation">
    <template v-for="item in navItems" :key="item.id">
      <!-- 普通导航项使用router-link -->
      <router-link
        v-if="item.id !== 'add'"
        :to="getRoutePath(item.id)"
        class="nav-item"
        :class="{ active: isActive(item.id) }"
        @click="$emit('navigate', item.id)"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-label">{{ t(item.label) }}</span>
      </router-link>
      
      <!-- 中间记账按钮使用button -->
      <button
        v-else
        class="nav-item"
        @click="$emit('navigate', item.id)"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-label">{{ t(item.label) }}</span>
      </button>
    </template>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { inject } from 'vue'

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

// 获取当前路由
const route = useRoute()

// 导航项配置
const navItems = [
  { id: 'home', icon: '🏠', label: '首页' },
  { id: 'statistics', icon: '📊', label: '统计' },
  { id: 'add', icon: '➕', label: '记账' },
  { id: 'category', icon: '📋', label: '分类' },
  { id: 'profile', icon: '🦉', label: '我的' } // 使用猫头鹰图标
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
</script>

<style scoped>
.bottom-navigation {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 60px;
  background: var(--background-secondary);
  border-top: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  width: 100%;
  border-radius: 0 0 36px 36px; /* 与手机屏幕底部圆角保持一致 */
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: none;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  max-width: 80px;
  text-decoration: none;
  color: inherit;
}

.nav-item:hover {
  background: rgba(102, 126, 234, 0.05);
}

.nav-item.active {
  color: var(--primary-color);
}

.nav-icon {
  font-size: 22px;
  transition: all 0.2s ease;
}

.nav-item.active .nav-icon {
  transform: scale(1.1);
}

.nav-label {
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.nav-item.active .nav-label {
  font-weight: 600;
}

/* 中间加号按钮特殊样式 */
.nav-item:nth-child(3) {
  position: relative;
}

.nav-item:nth-child(3) .nav-icon {
  font-size: 28px;
  background: var(--primary-color);
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
  position: absolute;
  top: -20px;
}

.nav-item:nth-child(3) .nav-label {
  margin-top: 32px;
}

.nav-item:nth-child(3):hover .nav-icon {
  background: var(--primary-color);
  opacity: 0.9;
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.nav-item:nth-child(3).active .nav-icon {
  background: var(--primary-color);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}
</style>