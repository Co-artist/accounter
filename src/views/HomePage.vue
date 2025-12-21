<template>
  <div class="home-page">
    <!-- 内容区域 -->
    <div class="content-wrapper" ref="swipeEl">
      <!-- 余额概览 -->
      <BalanceOverview 
        :transactions="transactions"
        @add-income="showIncomeForm"
        @add-expense="showExpenseForm"
      />
      
      <!-- 交易列表 -->
      <TransactionList 
        :transactions="transactions"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>
    
    <!-- 底部导航 -->
    <div class="bottom-nav-wrapper">
      <BottomNavigation 
        active-item="home"
        @navigate="handleNavigate"
      />
    </div>
    
    <!-- 记账表单 -->
    <TransactionForm 
      :visible="formVisible"
      :form-type="formType"
      :edit-transaction="editTransaction"
      @close="closeForm"
      @submit="handleSubmit"
    />
    
    <!-- 成功提示 -->
    <div 
      class="success-toast" 
      :class="{ show: successVisible }"
    >
      ✅ {{ t('交易添加成功') }}
    </div>
    
    <!-- 收入/支出选择弹窗 -->
    <div class="type-select-modal" v-if="showTypeSelect">
      <div class="modal-content">
        <button class="modal-close" @click="closeTypeSelect">✕</button>
        <h3 class="modal-title">{{ t('选择记账类型') }}</h3>
        <div class="modal-options">
          <button class="option-btn income" @click="selectIncome">
            <span class="option-icon">💰</span>
            <span class="option-text">{{ t('收入') }}</span>
          </button>
          <button class="option-btn expense" @click="selectExpense">
            <span class="option-icon">💸</span>
            <span class="option-text">{{ t('支出') }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'HomePage' })
import { ref, onMounted, watch, inject, computed, onActivated, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { attachSwipeNavigation } from '../utils/swipeNavigation'
import BalanceOverview from '../components/BalanceOverview.vue'
import TransactionList from '../components/TransactionList.vue'
import BottomNavigation from '../components/BottomNavigation.vue'
import TransactionForm from '../components/TransactionForm.vue'

// 注入store
const store = inject('store')
const t = inject('t')
const router = useRouter()
const swipeEl = ref(null)

// 交易数据 - 从store获取
const transactions = computed(() => store.state.transactions)

// 表单状态
const formVisible = ref(false)
const formType = ref('expense')
const successVisible = ref(false)
const editTransaction = ref(null) // 当前正在编辑的交易
const showTypeSelect = ref(false) // 收入/支出选择弹窗显示状态

// 显示收入表单
const showIncomeForm = () => {
  editTransaction.value = null
  formType.value = 'income'
  formVisible.value = true
}

// 显示支出表单
const showExpenseForm = () => {
  editTransaction.value = null
  formType.value = 'expense'
  formVisible.value = true
}

// 关闭表单
const closeForm = () => {
  formVisible.value = false
  editTransaction.value = null
}

// 显示成功提示
const showSuccess = () => {
  successVisible.value = true
  setTimeout(() => {
    successVisible.value = false
  }, 2000)
}

// 提交表单（添加或编辑）
const handleSubmit = (transactionData) => {
  if (editTransaction.value) {
    // 编辑现有交易
    store.transactions.update(transactionData.id, transactionData)
  } else {
    // 添加新交易
    store.transactions.add(transactionData)
  }
  showSuccess()
  closeForm()
}

// 处理编辑交易
const handleEdit = (transaction) => {
  editTransaction.value = transaction
  formType.value = transaction.type
  formVisible.value = true
}

// 处理删除交易
const handleDelete = (id) => {
  store.transactions.delete(id)
  showSuccess()
}

// 显示收入/支出选择弹窗
const showTypeSelectModal = () => {
  showTypeSelect.value = true
}

// 关闭收入/支出选择弹窗
const closeTypeSelect = () => {
  showTypeSelect.value = false
}

// 选择收入
const selectIncome = () => {
  showIncomeForm()
  closeTypeSelect()
}

// 选择支出
const selectExpense = () => {
  showExpenseForm()
  closeTypeSelect()
}

// 处理导航
const handleNavigate = (itemId) => {
  // 这里可以添加页面导航逻辑
  console.log('Navigate to:', itemId)
  
  // 如果点击的是中间的记账按钮
  if (itemId === 'add') {
    // 显示收入/支出选择弹窗
    showTypeSelectModal()
  }
}

onMounted(async () => {
  await nextTick()
  requestAnimationFrame(() => {
    attachSwipeNavigation(swipeEl.value, 'home', router)
  })
})

onActivated(() => {})
</script>

<style scoped>
.home-page {
  width: 100%;
  height: 100%;
  background: var(--bg-body, #f5f5f5);
  display: flex;
  flex-direction: column;
  position: relative;
}

/* 内容区域，允许垂直滚动 */
.content-wrapper {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-top: 40px; /* 适配手机顶部 */
  padding-bottom: 60px; /* 为底部导航预留空间 */
}

/* 隐藏滚动条 */
.content-wrapper::-webkit-scrollbar {
  display: none;
}

/* 底部导航固定在内容底部 */
.bottom-nav-wrapper {
  position: sticky;
  bottom: 0;
  z-index: 100;
  flex-shrink: 0;
}

.home-page {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 成功提示样式 */
.success-toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%) translateY(-100px);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px 24px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  z-index: 1000;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.success-toast.show {
  transform: translateX(-50%) translateY(0);
}

/* 收入/支出选择弹窗样式 */
.type-select-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1500;
  animation: fadeIn 0.2s ease;
}

.modal-content {
  background: var(--bg-card, #fff);
  padding: 32px 24px;
  border-radius: 20px;
  width: 90%;
  max-width: 360px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  position: relative;
  animation: slideUp 0.3s ease;
  color: var(--text-primary, #333);
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-secondary, #999);
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;
  z-index: 10;
}

.modal-close:active {
  background: rgba(0, 0, 0, 0.1);
  color: var(--text-primary, #333);
  transform: scale(0.9);
}

.modal-title {
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary, #333);
  margin: 0 0 32px 0;
}

.modal-options {
  display: flex;
  gap: 24px;
}

.option-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px;
  border: none;
  border-radius: 16px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.option-btn.income {
  background: linear-gradient(135deg, #4caf50, #45a049);
  color: white;
}

.option-btn.expense {
  background: linear-gradient(135deg, #f44336, #da190b);
  color: white;
}

.option-btn:active {
  transform: scale(0.95);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.option-icon {
  font-size: 40px;
}

.option-text {
  font-size: 20px;
  font-weight: 600;
}

/* 动画效果 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
