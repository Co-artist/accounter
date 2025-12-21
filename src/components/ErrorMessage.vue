<template>
  <div class="error-message-container" v-if="show">
    <div class="error-message" :class="type">
      <div class="error-icon">{{ getIcon() }}</div>
      <div class="error-content">
        <h4 class="error-title">{{ title || getDefaultTitle() }}</h4>
        <p class="error-description">{{ message }}</p>
      </div>
      <button class="close-button" @click="close">×</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

// Props
const props = defineProps({
  // 错误类型：error, warning, info, success
  type: {
    type: String,
    default: 'error',
    validator: (value) => ['error', 'warning', 'info', 'success'].includes(value)
  },
  // 错误标题
  title: {
    type: String,
    default: ''
  },
  // 错误消息
  message: {
    type: String,
    required: true
  },
  // 是否自动关闭
  autoClose: {
    type: Boolean,
    default: true
  },
  // 自动关闭时间（毫秒）
  autoCloseTime: {
    type: Number,
    default: 5000
  },
  // 是否显示
  show: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['close'])

// 关闭错误消息
const close = () => {
  emit('close')
}

// 获取错误图标
const getIcon = () => {
  const icons = {
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    success: '✅'
  }
  return icons[props.type] || icons.error
}

// 获取默认标题
const getDefaultTitle = () => {
  const titles = {
    error: '错误',
    warning: '警告',
    info: '提示',
    success: '成功'
  }
  return titles[props.type] || titles.error
}

// 自动关闭
onMounted(() => {
  if (props.autoClose) {
    setTimeout(() => {
      close()
    }, props.autoCloseTime)
  }
})
</script>

<style scoped>
.error-message-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  animation: slideInRight 0.3s ease;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  min-width: 300px;
  max-width: 500px;
  transition: all 0.3s ease;
  background-color: white;
}

.error-message.error {
  border-left: 4px solid #f44336;
}

.error-message.warning {
  border-left: 4px solid #ff9800;
}

.error-message.info {
  border-left: 4px solid #2196f3;
}

.error-message.success {
  border-left: 4px solid #4caf50;
}

.error-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.error-content {
  flex: 1;
  min-width: 0; /* 防止内容溢出 */
}

.error-title {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.error-description {
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  word-wrap: break-word;
}

.close-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
  transition: color 0.2s ease;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.close-button:hover {
  color: #333;
}

/* 动画效果 */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 480px) {
  .error-message-container {
    left: 20px;
    right: 20px;
  }
  
  .error-message {
    min-width: auto;
    max-width: none;
  }
}
</style>