<template>
  <div class="budget-page">
    <!-- 内容区域 -->
    <div class="content-wrapper">
      <!-- 顶部导航栏 -->
      <header class="budget-header">
        <h1 class="header-title">{{ t('预算设置') }}</h1>
        <button class="back-btn" @click="handleBack">
          <span class="back-icon">←</span>
        </button>
      </header>

      <!-- 预算概览卡片 -->
      <div class="budget-overview">
        <div class="overview-card">
          <div class="overview-left">
            <h3>{{ t('总预算') }}</h3>
            <p class="overview-amount">¥{{ totalBudget.toFixed(2) }}</p>
          </div>
          <div class="overview-right">
            <div class="usage-bar">
              <div class="usage-fill" :style="{ width: `${usagePercentage}%` }"></div>
            </div>
            <p class="usage-text">{{ usedAmount }}/{{ totalBudget }} ({{ usagePercentage }}%)</p>
          </div>
        </div>
        <button class="reset-all-btn" @click="resetAllBudgets">
          {{ t('重置所有预算') }}
        </button>
      </div>

      <!-- 预算列表 -->
      <div class="budget-list">
        <h2 class="list-title">{{ t('分类预算') }}</h2>
        
        <div class="budgets">
          <div 
            v-for="budget in budgets" 
            :key="budget.id"
            class="budget-item"
            :class="budget.type"
          >
            <div class="budget-info">
              <div class="category-icon">{{ budget.icon }}</div>
              <div class="budget-details">
                <h3 class="category-name">{{ budget.category }}</h3>
                <p class="budget-amount">¥{{ budget.amount.toFixed(2) }}</p>
              </div>
            </div>
            <div class="budget-progress">
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: `${budget.usagePercentage}%` }"
                  :class="{ warning: budget.usagePercentage > 80, danger: budget.usagePercentage > 100 }"
                ></div>
              </div>
              <span class="progress-text">{{ budget.usagePercentage }}%</span>
            </div>
            <div class="budget-actions">
              <button class="action-btn view" @click="viewBudgetDetail(budget)">
                👁️
              </button>
              <button class="action-btn edit" @click="editBudget(budget)">
                ✏️
              </button>
              <button class="action-btn reset" @click="resetBudget(budget)">
                🔄
              </button>
              <button class="action-btn delete" @click="deleteBudget(budget.id)">
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 添加预算按钮 -->
      <div class="add-budget-container">
        <button class="add-budget-btn" @click="showAddBudgetForm">
          <span class="add-icon">➕</span>
          {{ t('添加预算') }}
        </button>
      </div>
    </div>
    
    <!-- 底部导航 -->
    <div class="bottom-nav-wrapper">
      <BottomNavigation 
        active-item="budget"
        @navigate="handleNavigate"
      />
    </div>
    
    <!-- 添加/编辑预算表单 -->
    <div class="form-overlay" v-if="showForm" @click="closeForm"></div>
    <div class="budget-form" v-if="showForm">
      <div class="form-header">
        <h3>{{ editingBudget ? t('编辑预算') : t('添加预算') }}</h3>
        <button class="form-close" @click="closeForm">✕</button>
      </div>
      <div class="form-content">
        <!-- 分类选择 -->
        <div class="form-group">
          <label class="form-label">{{ t('分类') }}</label>
          <select v-model="form.category" class="form-select">
            <option value="">{{ t('请选择分类') }}</option>
            <option v-for="category in categories" :key="category.id" :value="category.name">
              {{ category.name }}
            </option>
          </select>
        </div>
        
        <!-- 预算金额 -->
        <div class="form-group">
          <label class="form-label">{{ t('预算金额') }}</label>
          <div class="amount-input">
            <span class="currency-symbol">¥</span>
            <input 
              type="number" 
              class="form-input amount" 
              v-model.number="form.amount" 
              placeholder="0.00" 
              step="0.01"
              min="0"
            >
          </div>
        </div>
        
        <!-- 预算周期 -->
        <div class="form-group">
          <label class="form-label">{{ t('预算周期') }}</label>
          <div class="period-selector">
            <button 
              v-for="period in periods" 
              :key="period.value"
              class="period-btn"
              :class="{ active: form.period === period.value }"
              @click="form.period = period.value"
            >
              {{ period.label }}
            </button>
          </div>
        </div>
      </div>
      <div class="form-footer">
        <button class="form-btn cancel" @click="closeForm">{{ t('取消') }}</button>
        <button class="form-btn submit" @click="saveBudget" :disabled="!isFormValid">{{ t('保存') }}</button>
      </div>
    </div>
    
    <!-- 预算详情弹窗 -->
    <div class="form-overlay" v-if="showDetail" @click="closeDetail"></div>
    <div class="budget-detail" v-if="showDetail">
      <div class="form-header">
        <h3>{{ t('预算详情') }} - {{ selectedBudget?.category }}</h3>
        <button class="form-close" @click="closeDetail">✕</button>
      </div>
      <div class="detail-content">
        <div class="detail-summary">
          <div class="summary-item">
            <span class="summary-label">{{ t('总预算') }}:</span>
            <span class="summary-value">¥{{ selectedBudget?.amount.toFixed(2) }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">{{ t('已使用') }}:</span>
            <span class="summary-value">¥{{ selectedBudget?.used.toFixed(2) }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">{{ t('剩余预算') }}:</span>
            <span class="summary-value">¥{{ (selectedBudget?.amount - selectedBudget?.used || 0).toFixed(2) }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">{{ t('使用比例') }}:</span>
            <span class="summary-value">{{ selectedBudget?.usagePercentage }}%</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">{{ t('预算周期') }}:</span>
            <span class="summary-value">{{ periods.find(p => p.value === selectedBudget?.period)?.label }}</span>
          </div>
        </div>
        
        <div class="detail-transactions">
          <h4>{{ t('交易记录') }}</h4>
          <div v-if="budgetDetails.length === 0" class="no-transactions">
            {{ t('暂无交易记录') }}
          </div>
          <div 
            v-for="transaction in budgetDetails" 
            :key="transaction.id"
            class="detail-transaction-item"
          >
            <div class="transaction-info">
              <div class="transaction-date">{{ transaction.date }}</div>
              <div class="transaction-note">{{ transaction.note }}</div>
            </div>
            <div class="transaction-amount">-¥{{ transaction.amount.toFixed(2) }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 确认弹窗 -->
    <ConfirmModal
      v-model:visible="confirmModalVisible"
      :title="confirmModalTitle"
      :message="confirmModalMessage"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BottomNavigation from '../components/BottomNavigation.vue'
import ConfirmModal from '../components/ConfirmModal.vue'

// 注入翻译函数和store
const t = inject('t')
const store = inject('store')

const router = useRouter()

// 返回上一页
const handleBack = () => {
  router.back()
}

// 从store获取预算数据
const budgets = computed(() => store.state.budgets)

// 从store获取分类数据
const categories = computed(() => store.state.categories)

// 计算每个分类的已使用金额，根据预算周期
const calculateUsedAmount = (category, period) => {
  const now = new Date()
  let startDate = ''
  
  // 根据不同周期计算开始日期
  switch (period) {
    case 'weekly':
      // 计算本周一的日期
      const dayOfWeek = now.getDay() || 7 // 将周日(0)转换为7
      const diff = now.getDate() - dayOfWeek + 1
      const monday = new Date(now.setDate(diff))
      startDate = monday.toISOString().split('T')[0] // YYYY-MM-DD
      break
    case 'monthly':
      startDate = now.toISOString().slice(0, 7) // YYYY-MM
      break
    case 'yearly':
      startDate = now.getFullYear() // YYYY
      break
    default:
      startDate = now.toISOString().slice(0, 7) // 默认月度
  }
  
  return store.state.transactions
    .filter(transaction => {
      const match = transaction.category === category && transaction.type === 'expense'
      // 根据不同周期匹配日期
      switch (period) {
        case 'weekly':
          return match && transaction.date >= startDate
        case 'monthly':
          return match && transaction.date.startsWith(startDate)
        case 'yearly':
          return match && transaction.date.startsWith(startDate)
        default:
          return match && transaction.date.startsWith(startDate)
      }
    })
    .reduce((sum, transaction) => sum + transaction.amount, 0)
}

// 计算所有预算的已使用金额
const calculateAllUsedAmount = () => {
  return budgets.value.reduce((sum, budget) => {
    return sum + calculateUsedAmount(budget.category, budget.period)
  }, 0)
}

// 更新预算使用情况
const updateBudgetUsage = () => {
  budgets.value.forEach(budget => {
    const used = calculateUsedAmount(budget.category, budget.period)
    budget.used = used
    budget.usagePercentage = budget.amount > 0 
      ? Math.min(Math.round((used / budget.amount) * 100), 100) 
      : 0
    
    // 检查是否超支
    if (used > budget.amount && !budget.overspent) {
      budget.overspent = true
      // 触发超支提醒
      showOverspentAlert(budget)
    } else if (used <= budget.amount && budget.overspent) {
      budget.overspent = false
    }
  })
}

// 超支提醒
const showOverspentAlert = (budget) => {
  // 这里可以添加更复杂的提醒逻辑，比如通知、震动等
  alert(`${t('预算超支提醒')}: ${budget.category} ${t('已超支')}! ${t('已使用')} ¥${budget.used.toFixed(2)}, ${t('预算')} ¥${budget.amount.toFixed(2)}`)
}

// 监听数据变化，更新预算使用情况
onMounted(() => {
  updateBudgetUsage()
  
  // 订阅交易数据变化
  store.subscribe('transactions', () => {
    updateBudgetUsage()
  })
  
  // 订阅分类数据变化
  store.subscribe('categories', () => {
    updateBudgetUsage()
  })
  
  // 订阅预算数据变化
  store.subscribe('budgets', () => {
    updateBudgetUsage()
  })
})

// 预算周期选项
const periods = ref([
  { value: 'weekly', label: t('每周') },
  { value: 'monthly', label: t('每月') },
  { value: 'yearly', label: t('每年') }
])

// 计算总预算和使用情况
const totalBudget = computed(() => {
  return budgets.value.reduce((sum, budget) => sum + budget.amount, 0)
})

const usedAmount = computed(() => {
  return budgets.value.reduce((sum, budget) => sum + budget.used, 0)
})

const usagePercentage = computed(() => {
  if (totalBudget.value === 0) return 0
  return Math.min(Math.round((usedAmount.value / totalBudget.value) * 100), 100)
})

// 表单状态
const showForm = ref(false)
const editingBudget = ref(null)
const form = ref({
  category: '',
  amount: 0,
  period: 'monthly'
})

// 详情弹窗状态
const showDetail = ref(false)
const selectedBudget = ref(null)
const budgetDetails = ref([])

// 确认弹窗状态
const confirmModalVisible = ref(false)
const confirmModalTitle = ref('')
const confirmModalMessage = ref('')
const confirmAction = ref(null)

// 显示确认弹窗
const showConfirmModal = (title, message, action) => {
  confirmModalTitle.value = title
  confirmModalMessage.value = message
  confirmAction.value = action
  confirmModalVisible.value = true
}

// 确认操作
const handleConfirm = () => {
  if (confirmAction.value) {
    confirmAction.value()
  }
  confirmModalVisible.value = false
  confirmAction.value = null
}

// 取消操作
const handleCancel = () => {
  confirmModalVisible.value = false
  confirmAction.value = null
}

// 查看预算详情
const viewBudgetDetail = (budget) => {
  selectedBudget.value = budget
  // 获取该分类在当前周期的所有交易
  const now = new Date()
  let startDate = ''
  
  // 根据预算周期计算开始日期
  switch (budget.period) {
    case 'weekly':
      const dayOfWeek = now.getDay() || 7
      const diff = now.getDate() - dayOfWeek + 1
      const monday = new Date(now.setDate(diff))
      startDate = monday.toISOString().split('T')[0]
      break
    case 'monthly':
      startDate = now.toISOString().slice(0, 7)
      break
    case 'yearly':
      startDate = now.getFullYear()
      break
    default:
      startDate = now.toISOString().slice(0, 7)
  }
  
  // 筛选交易
  budgetDetails.value = store.state.transactions
    .filter(transaction => {
      const match = transaction.category === budget.category && transaction.type === 'expense'
      switch (budget.period) {
        case 'weekly':
          return match && transaction.date >= startDate
        case 'monthly':
          return match && transaction.date.startsWith(startDate)
        case 'yearly':
          return match && transaction.date.startsWith(startDate)
        default:
          return match && transaction.date.startsWith(startDate)
      }
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))
  
  showDetail.value = true
}

// 关闭详情弹窗
const closeDetail = () => {
  showDetail.value = false
  selectedBudget.value = null
  budgetDetails.value = []
}

// 表单验证
const isFormValid = computed(() => {
  return form.value.category && form.value.amount > 0
})

// 显示添加预算表单
const showAddBudgetForm = () => {
  editingBudget.value = null
  resetForm()
  showForm.value = true
}

// 编辑预算
const editBudget = (budget) => {
  editingBudget.value = budget
  form.value = {
    category: budget.category,
    amount: budget.amount,
    period: budget.period
  }
  showForm.value = true
}

// 删除预算
const deleteBudget = (id) => {
  showConfirmModal(
    t('确认删除'),
    t('确定要删除这个预算吗？'),
    () => {
      store.budgets.delete(id)
      updateBudgetUsage()
    }
  )
}

// 保存预算
const saveBudget = () => {
  if (isFormValid.value) {
    const budgetData = {
      id: editingBudget.value?.id || Date.now().toString(),
      category: form.value.category,
      icon: getCategoryIcon(form.value.category),
      amount: form.value.amount,
      used: 0,
      usagePercentage: 0,
      period: form.value.period,
      type: 'expense'
    }
    
    if (editingBudget.value) {
      // 更新现有预算
      store.budgets.update(budgetData.id, budgetData)
    } else {
      // 添加新预算
      store.budgets.add(budgetData)
    }
    updateBudgetUsage()
    closeForm()
  }
}

// 关闭表单
const closeForm = () => {
  showForm.value = false
  editingBudget.value = null
  resetForm()
}

// 重置表单
const resetForm = () => {
  form.value = {
    category: '',
    amount: 0,
    period: 'monthly'
  }
}

// 重置单个预算
const resetBudget = (budget) => {
  showConfirmModal(
    t('提示'),
    t('确定要重置该预算的使用情况吗？'),
    () => {
      // 创建新的预算对象，避免直接修改原始数据
      const updatedBudget = {
        ...budget,
        used: 0,
        usagePercentage: 0,
        overspent: false
      }
      // 保存到store
      store.budgets.update(budget.id, updatedBudget)
      updateBudgetUsage()
    }
  )
}

// 重置所有预算
const resetAllBudgets = () => {
  showConfirmModal(
    t('提示'),
    t('确定要重置所有预算的使用情况吗？'),
    () => {
      budgets.value.forEach(budget => {
        // 创建新的预算对象，避免直接修改原始数据
        const updatedBudget = {
          ...budget,
          used: 0,
          usagePercentage: 0,
          overspent: false
        }
        store.budgets.update(budget.id, updatedBudget)
      })
      updateBudgetUsage()
    }
  )
}

// 获取分类图标
const getCategoryIcon = (categoryName) => {
  const category = categories.value.find(cat => cat.name === categoryName)
  return category ? category.icon : '📝'
}

// 处理导航
const handleNavigate = (itemId) => {
  // 导航处理逻辑
}

// 初始化数据
onMounted(() => {
  // 可以在这里从store加载数据
})
</script>

<style scoped>
.budget-page {
  width: 100%;
  height: 100%;
  background-color: var(--background-primary);
  display: flex;
  flex-direction: column;
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

.budget-page {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 底部导航固定在内容底部 */
.bottom-nav-wrapper {
  position: sticky;
  bottom: 0;
  z-index: 100;
  flex-shrink: 0;
}

/* 顶部导航栏 */
.budget-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  background-color: var(--background-secondary);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  position: relative;
}

.header-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.back-btn {
  position: absolute;
  left: 16px;
  background: none;
  border: none;
  font-size: 20px;
  color: var(--text-primary);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn:hover {
  background-color: var(--border-color);
}

/* 预算概览卡片 */
.budget-overview {
  padding: 16px;
}

.overview-card {
  background-color: var(--background-secondary);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.overview-left h3 {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0 0 8px 0;
}

.overview-amount {
  font-size: 32px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.overview-right {
  flex: 1;
  margin-left: 20px;
}

.usage-bar {
  height: 8px;
  background-color: var(--border-color);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.usage-fill {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #8bc34a);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.usage-text {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  text-align: right;
}

/* 预算列表 */
.budget-list {
  padding: 16px;
}

.list-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 16px 0;
}

.budgets {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.budget-item {
  background-color: var(--background-secondary);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.budget-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.category-icon {
  font-size: 24px;
}

.budget-details h3 {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0 0 4px 0;
}

.budget-details .budget-amount {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.budget-progress {
  flex: 1;
  margin: 0 16px;
}

.progress-bar {
  height: 6px;
  background-color: var(--border-color);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 4px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #8bc34a);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-fill.warning {
  background: linear-gradient(90deg, #ff9800, #ffc107);
}

.progress-fill.danger {
  background: linear-gradient(90deg, #f44336, #ef5350);
}

.progress-text {
  font-size: 12px;
  color: var(--text-tertiary);
  margin: 0;
  text-align: right;
}

.budget-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  opacity: 1; /* 始终清晰可见，适合移动端 */
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background-color: rgba(0, 0, 0, 0.1);
  transform: scale(1.1);
}

.action-btn:active {
  transform: scale(0.95); /* 点击时的反馈效果 */
  background-color: rgba(0, 0, 0, 0.2);
}

/* 重置所有预算按钮 */
.reset-all-btn {
  margin-top: 12px;
  width: 100%;
  padding: 12px;
  background-color: var(--background-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-all-btn:hover {
  background-color: var(--border-color);
  transform: translateY(-1px);
}

/* 添加预算按钮 */
.add-budget-container {
  padding: 16px;
}

.add-budget-btn {
  width: 100%;
  padding: 14px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.add-budget-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.add-icon {
  font-size: 20px;
}

/* 查看详情按钮样式 */
.action-btn.view:hover {
  background-color: rgba(33, 150, 243, 0.1);
  color: #2196f3;
}

/* 重置预算按钮样式 */
.action-btn.reset:hover {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

/* 编辑预算按钮样式 */
.action-btn.edit:hover {
  background-color: rgba(255, 152, 0, 0.1);
  color: #ff9800;
}

/* 删除预算按钮样式 */
.action-btn.delete:hover {
  background-color: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

/* 预算详情弹窗 */
.budget-detail {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--background-secondary);
  border-radius: 20px 20px 0 0;
  padding: 20px;
  z-index: 1001;
  animation: slideUp 0.3s ease;
  max-height: 80vh;
  overflow-y: auto;
  max-width: 100%;
  box-sizing: border-box;
}

.detail-content {
  margin-bottom: 20px;
}

.detail-summary {
  background-color: var(--background-primary);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
}

.summary-item:last-child {
  border-bottom: none;
}

.summary-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.summary-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.detail-transactions h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.no-transactions {
  text-align: center;
  color: var(--text-tertiary);
  padding: 20px;
  font-style: italic;
}

.detail-transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
}

.detail-transaction-item:last-child {
  border-bottom: none;
}

.transaction-info {
  flex: 1;
}

.transaction-date {
  font-size: 12px;
  color: var(--text-tertiary);
  margin-bottom: 4px;
}

.transaction-note {
  font-size: 14px;
  color: var(--text-primary);
}

.transaction-amount {
  font-size: 16px;
  font-weight: 600;
  color: var(--danger-color, #f44336);
}

/* 表单样式 */
.form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.budget-form {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--background-secondary);
  border-radius: 20px 20px 0 0;
  padding: 20px;
  z-index: 1001;
  animation: slideUp 0.3s ease;
  max-height: 80vh;
  overflow-y: auto;
  max-width: 100%;
  box-sizing: border-box;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.form-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.form-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-tertiary);
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.form-close:hover {
  background-color: rgba(0, 0, 0, 0.1);
  color: var(--text-primary);
}

.form-content {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.form-input, .form-select {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-size: 16px;
  color: var(--text-primary);
  background-color: var(--background-primary);
  transition: all 0.2s ease;
  outline: none;
}

.form-input:focus, .form-select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* 金额输入特殊样式 */
.amount-input {
  display: flex;
  align-items: center;
  background-color: var(--background-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 0 12px;
  transition: all 0.2s ease;
  position: relative;
}

.amount-input:focus-within {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.currency-symbol {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-right: 8px;
}

.form-input.amount {
  background: transparent;
  border: none !important;
  font-size: 20px;
  font-weight: 600;
  padding: 12px 0;
  flex: 1;
  outline: none !important;
  box-shadow: none !important;
  /* 隐藏数字输入框的上下箭头 */
  -moz-appearance: textfield;
  appearance: textfield;
}

/* 针对Webkit浏览器（Chrome, Safari）隐藏箭头 */
.form-input.amount::-webkit-inner-spin-button,
.form-input.amount::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* 确保输入框没有额外的样式继承 */
.form-input.amount:focus {
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
}

/* 预算周期选择 */
.period-selector {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.period-btn {
  flex: 1;
  min-width: 80px;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--background-primary);
  color: var(--text-secondary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.period-btn.active {
  border-color: var(--primary-color);
  background-color: var(--primary-color);
  color: white;
}

.form-footer {
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.form-btn {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.form-btn.cancel {
  background-color: var(--background-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.form-btn.cancel:active {
  background-color: var(--background-tertiary);
  transform: scale(0.95);
}

.form-btn.submit {
  background-color: var(--primary-color);
  color: var(--background-primary);
}

.form-btn.submit:hover:not(:disabled) {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.form-btn.submit:active:not(:disabled) {
  background-color: var(--primary-active);
  transform: scale(0.95);
  box-shadow: var(--shadow-sm);
}

.form-btn.submit:disabled {
  background-color: var(--border-color);
  color: var(--text-tertiary);
  cursor: not-allowed;
  opacity: 0.6;
}

/* 动画效果 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 480px) {
  .overview-card {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .overview-right {
    margin-left: 0;
    margin-top: 16px;
    width: 100%;
  }
  
  .budget-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .budget-progress {
    margin: 0;
    width: 100%;
  }
  
  .budget-actions {
    align-self: flex-end;
  }
}
</style>
