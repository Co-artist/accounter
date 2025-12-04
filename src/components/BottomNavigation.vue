<template>
  <div class="bottom-navigation">
    <button 
      v-for="item in navItems" 
      :key="item.id"
      class="nav-item"
      :class="{ active: activeItem === item.id }"
      @click="$emit('navigate', item.id)"
    >
      <span class="nav-icon">{{ item.icon }}</span>
      <span class="nav-label">{{ item.label }}</span>
    </button>
  </div>
</template>

<script setup>
// Props
const props = defineProps({
  activeItem: {
    type: String,
    default: 'home'
  }
})

// Emits
const emit = defineEmits(['navigate'])

// 导航项配置
const navItems = [
  { id: 'home', icon: '🏠', label: '首页' },
  { id: 'statistics', icon: '📊', label: '统计' },
  { id: 'add', icon: '➕', label: '记账' },
  { id: 'category', icon: '📋', label: '分类' },
  { id: 'profile', icon: '👤', label: '我的' }
]
</script>

<style scoped>
.bottom-navigation {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 60px;
  background: white;
  border-top: 1px solid #f0f0f0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
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
}

.nav-item:hover {
  background: rgba(102, 126, 234, 0.05);
}

.nav-item.active {
  color: #667eea;
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
  background: #667eea;
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  position: absolute;
  top: -20px;
}

.nav-item:nth-child(3) .nav-label {
  margin-top: 32px;
}

.nav-item:nth-child(3):hover .nav-icon {
  background: #5568d3;
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.nav-item:nth-child(3).active .nav-icon {
  background: #5568d3;
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}
</style>