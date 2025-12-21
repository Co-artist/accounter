<template>
  <div class="transaction-list">
    <div class="list-header">
      <h3 class="list-title">{{ t('最近交易') }}</h3>
      <button class="list-more" v-if="transactions.length > displayedCount" @click="toggleShowAll">
        {{ showAll ? t('收起') : t('查看更多') }}
      </button>
    </div>
    
    <div v-if="transactions.length === 0" class="empty-state">
      <div class="empty-icon">📋</div>
      <p class="empty-text">{{ t('还没有交易记录') }}</p>
      <p class="empty-hint">{{ t('点击下方按钮开始记账吧') }}</p>
    </div>
    
    <div v-else class="transactions">
      <div 
        v-for="transaction in displayedTransactions" 
        :key="transaction.id"
        class="transaction-item"
        :class="transaction.type"
        v-memo="[transaction.id, transaction.amount, transaction.date]"
      >
        <div class="transaction-left">
          <div class="transaction-category">
            <span class="category-icon">{{ getCategoryIcon(transaction.category) }}</span>
            <span class="category-name">{{ transaction.category }}</span>
          </div>
          <div class="transaction-meta">
            <span class="transaction-date">{{ formatDate(transaction.date) }}</span>
            <span v-if="transaction.note" class="transaction-note">{{ transaction.note }}</span>
          </div>
        </div>
        <div class="transaction-right">
          <div class="transaction-actions">
            <button 
              class="action-btn edit" 
              @click="$emit('edit', transaction)"
              :title="t('编辑')"
            >
              ✏️
            </button>
            <button 
              class="action-btn delete" 
              @click="openDeleteModal(transaction.id)"
              :title="t('删除')"
            >
              🗑️
            </button>
          </div>
          <span class="transaction-amount">
            {{ transaction.type === 'income' ? '+' : '-' }}¥{{ transaction.amount.toFixed(2) }}
          </span>
        </div>
      </div>
      
      <!-- 查看更多/收起按钮 -->
      <button 
        class="view-more-btn" 
        v-if="transactions.length > displayedCount"
        @click="toggleShowAll"
      >
        {{ showAll ? t('收起') : t('查看全部 {count} 条记录', { count: transactions.length }) }}
      </button>
    </div>
    
    <!-- 删除确认对话框 -->
    <div class="delete-modal" v-if="deleteModalVisible">
      <div class="delete-modal-content">
        <h4>{{ t('确认删除') }}</h4>
        <p>{{ t('确定要删除这条交易记录吗？') }}</p>
        <div class="delete-modal-actions">
          <button class="modal-btn cancel" @click="cancelDelete">{{ t('取消') }}</button>
          <button class="modal-btn confirm" @click="confirmDelete">{{ t('确定删除') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'

// Props
const props = defineProps({
  transactions: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['edit', 'delete'])

// 注入翻译函数
const t = inject('t')

// 显示控制
const showAll = ref(false)
const displayedCount = 5 // 默认显示5条

// 删除确认对话框
const deleteModalVisible = ref(false)
const currentDeleteId = ref(null)

// 按日期排序的交易列表
const sortedTransactions = computed(() => {
  return [...props.transactions].sort((a, b) => {
    // 首先按日期降序排序
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    if (dateA !== dateB) {
      return dateB - dateA
    }
    // 日期相同时，按ID（创建时间戳）降序排序
    // 将ID转换为数字进行比较（处理默认ID为"1"的情况和时间戳ID）
    return Number(b.id) - Number(a.id)
  })
})

// 显示的交易列表
const displayedTransactions = computed(() => {
  if (showAll.value) {
    return sortedTransactions.value
  }
  return sortedTransactions.value.slice(0, displayedCount)
})

// 切换显示全部/收起
const toggleShowAll = () => {
  showAll.value = !showAll.value
}

// 打开删除确认对话框
const openDeleteModal = (id) => {
  currentDeleteId.value = id
  deleteModalVisible.value = true
}

// 取消删除
const cancelDelete = () => {
  deleteModalVisible.value = false
  currentDeleteId.value = null
}

// 确认删除
const confirmDelete = () => {
  emit('delete', currentDeleteId.value)
  deleteModalVisible.value = false
  currentDeleteId.value = null
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) {
    return '昨天'
  } else if (diffDays === 2) {
    return '前天'
  } else if (diffDays < 7) {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return days[date.getDay()]
  } else {
    return `${date.getMonth() + 1}/${date.getDate()}`
  }
}

// 获取分类图标
const getCategoryIcon = (category) => {
  const icons = {
    // 收入分类图标
    '工资': '💰',
    '奖金': '🎁',
    '投资': '📈',
    '兼职收入': '💼',
    '理财收益': '📊',
    '礼金红包': '🧧',
    '退款收入': '↩️',
    '其他副业': '🌟',
    '其他收入': '💸',
    
    // 支出分类图标
    '餐饮': '🍴',
    '交通': '🚗',
    '购物': '🛒',
    '娱乐': '🎮',
    '房租': '🏠',
    '水电费': '💡',
    '医疗': '🏥',
    '教育': '📚',
    '服饰美容': '👗',
    '旅游出行': '✈️',
    '社交聚会': '🎉',
    '数码配件': '📱',
    '家居用品': '🏠',
    '宠物支出': '🐶',
    '运动健身': '🏃',
    '学习培训': '📝',
    '其他支出': '💳'
  }
  return icons[category] || '📝'
}
</script>

<style scoped>
.transaction-list {
  padding: 16px;
  background: #f5f5f5;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.list-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.list-more {
  background: none;
  border: none;
  color: #667eea;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.list-more:active {
  background: rgba(102, 126, 234, 0.1);
  transform: scale(0.95);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: #999;
  background: white;
  border-radius: 12px;
  margin: 0 -16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  margin-bottom: 8px;
  color: #666;
}

.empty-hint {
  font-size: 14px;
  color: #999;
}

.transactions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px;
  background: white;
  border-radius: 12px;
  transition: all 0.2s ease;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.transaction-item:active {
  background: #f0f0f0;
  transform: scale(0.98);
}

.transaction-item.income {
  border-left: 4px solid #4caf50;
}

.transaction-item.expense {
  border-left: 4px solid #f44336;
}

.transaction-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.transaction-category {
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-icon {
  font-size: 20px;
}

.category-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.transaction-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #999;
}

.transaction-note {
  background: rgba(0, 0, 0, 0.05);
  padding: 2px 8px;
  border-radius: 10px;
}

.transaction-right {
  display: flex;
  align-items: center;
}

.transaction-amount {
  font-size: 18px;
  font-weight: 600;
}

.transaction-item.income .transaction-amount {
  color: #4caf50;
}

.transaction-item.expense .transaction-amount {
  color: #f44336;
}

/* 查看更多按钮样式 */
.view-more-btn {
  width: 100%;
  padding: 12px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #667eea;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.view-more-btn:active {
  background: #e0e0e0;
  transform: scale(0.98);
}

/* 交易操作按钮样式 */
.transaction-actions {
  display: flex;
  gap: 8px;
  margin-right: 12px;
  opacity: 1; /* 始终可见，适合移动端 */
  transition: opacity 0.2s ease;
}

.action-btn {
  background: none;
  border: none;
  padding: 8px; /* 增大点击区域 */
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-size: 16px;
  min-width: 36px; /* 确保足够的点击区域 */
  min-height: 36px;
}

.action-btn:active {
  background: rgba(0, 0, 0, 0.1);
  transform: scale(0.9);
}

.action-btn.edit:active {
  background: rgba(255, 215, 0, 0.2);
}

.action-btn.delete:active {
  background: rgba(255, 0, 0, 0.1);
}

/* 删除确认对话框样式 */
.delete-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: fadeIn 0.2s ease;
}

.delete-modal-content {
  background: white;
  padding: 24px;
  border-radius: 16px;
  width: 90%;
  max-width: 320px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.3s ease;
}

.delete-modal-content h4 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.delete-modal-content p {
  margin: 0 0 24px 0;
  font-size: 14px;
  color: #666;
  text-align: center;
}

.delete-modal-actions {
  display: flex;
  gap: 12px;
}

.modal-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
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
  background: #f44336;
  color: white;
}

.modal-btn.confirm:active {
  background: #d32f2f;
  transform: scale(0.95);
}

/* 动画效果 */
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