<template>
  <div class="home-page">
    <!-- 内容区域 -->
    <div class="content-wrapper">
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
      ✅ 交易添加成功
    </div>
    
    <!-- 收入/支出选择弹窗 -->
    <div class="type-select-modal" v-if="showTypeSelect">
      <div class="modal-content">
        <button class="modal-close" @click="closeTypeSelect">✕</button>
        <h3 class="modal-title">选择记账类型</h3>
        <div class="modal-options">
          <button class="option-btn income" @click="selectIncome">
            <span class="option-icon">💰</span>
            <span class="option-text">收入</span>
          </button>
          <button class="option-btn expense" @click="selectExpense">
            <span class="option-icon">💸</span>
            <span class="option-text">支出</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import BalanceOverview from '../components/BalanceOverview.vue'
import TransactionList from '../components/TransactionList.vue'
import BottomNavigation from '../components/BottomNavigation.vue'
import TransactionForm from '../components/TransactionForm.vue'

// 从localStorage加载数据或使用默认数据
const loadTransactions = () => {
  const saved = localStorage.getItem('transactions')
  if (saved) {
    return JSON.parse(saved)
  }
  // 默认Mock数据，用于首次使用
  return [
    {
      id: '1',
      type: 'income',
      amount: 5000,
      category: '工资',
      date: new Date().toISOString().split('T')[0],
      note: '12月工资'
    },
    {
      id: '2',
      type: 'expense',
      amount: 128,
      category: '餐饮',
      date: new Date().toISOString().split('T')[0],
      note: '午餐'
    },
    {
      id: '3',
      type: 'expense',
      amount: 25.5,
      category: '交通',
      date: new Date().toISOString().split('T')[0],
      note: '地铁'
    },
    {
      id: '4',
      type: 'expense',
      amount: 199,
      category: '购物',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      note: '生活用品'
    },
    {
      id: '5',
      type: 'income',
      amount: 1000,
      category: '奖金',
      date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
      note: '月度奖金'
    }
  ]
}

// 保存数据到localStorage
const saveTransactions = (data) => {
  localStorage.setItem('transactions', JSON.stringify(data))
}

// 交易数据
const transactions = ref(loadTransactions())

// 监听交易数据变化，自动保存到localStorage
watch(transactions, (newValue) => {
  saveTransactions(newValue)
}, { deep: true })

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
    const index = transactions.value.findIndex(t => t.id === editTransaction.value.id)
    if (index !== -1) {
      transactions.value[index] = transactionData
      showSuccess()
    }
  } else {
    // 添加新交易
    transactions.value.push(transactionData)
    showSuccess()
  }
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
  const index = transactions.value.findIndex(t => t.id === id)
  if (index !== -1) {
    transactions.value.splice(index, 1)
    showSuccess()
  }
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
</script>

<style scoped>
.home-page {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* 内容区域，允许垂直滚动 */
.content-wrapper {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
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
  background: white;
  padding: 32px 24px;
  border-radius: 20px;
  width: 90%;
  max-width: 360px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  position: relative;
  animation: slideUp 0.3s ease;
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;
  z-index: 10;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #333;
}

.modal-title {
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: #333;
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

.option-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
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