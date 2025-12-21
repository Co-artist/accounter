<template>
  <div class="balance-container">
    <!-- 资产卡片（树洞/信封概念） -->
    <div class="balance-card">
      <div class="card-header">
        <div class="card-title">
          <span class="title-icon">🦉</span>
          <span class="title-text">{{ t('我的小金库') }}</span>
        </div>
        <span class="card-date">{{ currentDate }}</span>
      </div>
      
      <div class="card-body">
        <div class="balance-section">
          <span class="label">{{ t('净资产') }}</span>
          <div class="amount" v-memo="[totalBalance]">
            <span class="currency">¥</span>
            <span class="value">{{ totalBalance.toFixed(2) }}</span>
          </div>
        </div>
        
        <div class="stats-row">
          <div class="stat-item income">
            <span class="stat-label">{{ t('本月收入') }}</span>
            <span class="stat-val">+{{ totalIncome.toFixed(2) }}</span>
          </div>
          <div class="stat-item expense">
            <span class="stat-label">{{ t('本月支出') }}</span>
            <span class="stat-val">-{{ totalExpense.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- 装饰性纹理 -->
      <div class="card-texture"></div>
    </div>
    
    <!-- 快速操作区 (胶囊按钮组) -->
    <div class="quick-actions">
      <button class="action-capsule income" @click="$emit('add-income')">
        <span class="capsule-icon">💰</span>
        <span class="capsule-text">{{ t('入账') }}</span>
      </button>
      <button class="action-capsule expense" @click="$emit('add-expense')">
        <span class="capsule-icon">💸</span>
        <span class="capsule-text">{{ t('花销') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'

// 注入翻译函数
const t = inject('t')

// Props
const props = defineProps({
  transactions: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['add-income', 'add-expense'])

// 计算属性
const totalIncome = computed(() => {
  return props.transactions
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0)
})

const totalExpense = computed(() => {
  return props.transactions
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0)
})

const totalBalance = computed(() => {
  return totalIncome.value - totalExpense.value
})

// 当前日期
const currentDate = ref('')

onMounted(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  currentDate.value = `${year}-${month}-${day}`
})
</script>

<style scoped>
.balance-container {
  padding: 20px 20px 10px;
  background: transparent;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 资产卡片：拟物化与现代感的结合 */
.balance-card {
  position: relative;
  background: var(--primary-gradient, linear-gradient(135deg, #FFD54F 0%, #FFA726 100%));
  border-radius: 24px;
  padding: 24px;
  color: var(--text-on-primary, #ffffff); /* 适配不同主题的文字颜色 */
  box-shadow: 0 10px 30px rgba(255, 167, 38, 0.3), 0 4px 10px rgba(0,0,0,0.05);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* 暗色模式适配 */
:global([data-theme="dark"]) .balance-card {
  background: linear-gradient(135deg, #24283b 0%, #1a1b26 100%);
  color: #FFD54F;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 213, 79, 0.1);
}

.balance-card:active {
  transform: scale(0.98);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  opacity: 0.9;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
}

.title-icon {
  font-size: 20px;
}

.card-date {
  font-size: 13px;
  font-family: monospace;
  opacity: 0.9;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.balance-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-size: 14px;
  opacity: 0.8;
}

.amount {
  font-size: 40px;
  font-weight: 800;
  display: flex;
  align-items: baseline;
  line-height: 1;
}

.currency {
  font-size: 24px;
  margin-right: 4px;
  font-weight: 600;
}

.stats-row {
  display: flex;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 16px;
  backdrop-filter: blur(5px);
}

:global([data-theme="dark"]) .stats-row {
  background: rgba(0, 0, 0, 0.2);
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-item.expense {
  align-items: flex-end;
}

.stat-label {
  font-size: 12px;
  opacity: 0.8;
}

.stat-val {
  font-size: 16px;
  font-weight: 600;
  font-family: monospace;
}

/* 装饰纹理 */
.card-texture {
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);
  transform: rotate(45deg);
  pointer-events: none;
}

/* 快速操作区 */
.quick-actions {
  display: flex;
  gap: 16px;
}

.action-capsule {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--bg-card, #fff);
  color: var(--text-primary, #333);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

:global([data-theme="dark"]) .action-capsule {
  background: var(--bg-card, #24283b);
  color: var(--text-primary, #fff);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.action-capsule.income {
  color: var(--income-color, #4caf50);
}

.action-capsule.expense {
  color: var(--expense-color, #f44336);
}

.action-capsule:active {
  transform: scale(0.96);
  background: var(--bg-body, #f5f5f5);
}

.capsule-icon {
  font-size: 20px;
}
</style>
