<template>
  <div class="modal-overlay" v-if="visible" @click.self="onCancel">
    <div class="modal-content">
      <h3 class="modal-title">{{ title || t('提示') }}</h3>
      <p class="modal-message">{{ message }}</p>
      <div class="modal-actions">
        <button class="modal-btn cancel" @click="onCancel">{{ t('取消') }}</button>
        <button class="modal-btn confirm" @click="onConfirm">{{ t('确认') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:visible', 'confirm', 'cancel'])
const t = inject('t')

const onCancel = () => {
  emit('update:visible', false)
  emit('cancel')
}

const onConfirm = () => {
  emit('update:visible', false)
  emit('confirm')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: fadeIn 0.2s ease;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 16px;
  width: 85%;
  max-width: 320px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.3s ease;
}

.modal-title {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.modal-message {
  margin: 0 0 24px 0;
  font-size: 15px;
  color: #666;
  text-align: center;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.modal-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-btn.cancel {
  background: #f5f5f5;
  color: #666;
}

.modal-btn.cancel:active {
  background: #e0e0e0;
  transform: scale(0.95);
}

.modal-btn.confirm {
  background: #667eea; /* 使用主色调，或者用 #f44336 (红色) 如果是危险操作 */
  color: white;
}

.modal-btn.confirm:active {
  background: #5a6fd6;
  transform: scale(0.95);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>