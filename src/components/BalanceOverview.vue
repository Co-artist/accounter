<template>
  <div class="balance-overview">
    <div class="balance-header">
      <h2 class="balance-title">我的余额</h2>
      <span class="balance-date">{{ currentDate }}</span>
    </div>
    
    <div class="balance-amount" v-memo="[totalBalance]">
      ¥{{ totalBalance.toFixed(2) }}
    </div>
    
    <div class="balance-stats" v-memo="[totalIncome, totalExpense]">
      <div class="stat-item income">
        <span class="stat-label">收入</span>
        <span class="stat-amount">+¥{{ totalIncome.toFixed(2) }}</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item expense">
        <span class="stat-label">支出</span>
        <span class="stat-amount">-¥{{ totalExpense.toFixed(2) }}</span>
      </div>
    </div>
    
    <div class="quick-actions">
      <button class="action-btn income" @click="$emit('add-income')">
        <span class="action-icon">+</span>
        <span class="action-text">记收入</span>
      </button>
      <button class="action-btn expense" @click="$emit('add-expense')">
        <span class="action-icon">-</span>
        <span class="action-text">记支出</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

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
.balance-overview {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 0 0 20px 20px;
}

.balance-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.balance-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.balance-date {
  font-size: 14px;
  opacity: 0.9;
}

.balance-amount {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 20px;
  letter-spacing: -0.5px;
}

.balance-stats {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 24px;
  padding: 0 10px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 4px;
}

.stat-amount {
  font-size: 20px;
  font-weight: 600;
}

.stat-divider {
  width: 1px;
  height: 30px;
  background: rgba(255, 255, 255, 0.3);
}

.quick-actions {
  display: flex;
  gap: 16px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
}

.action-btn.income {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.action-btn.expense {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.action-btn:active {
  transform: translateY(0);
}

.action-icon {
  font-size: 20px;
  font-weight: bold;
}

.action-text {
  font-size: 15px;
}
</style>