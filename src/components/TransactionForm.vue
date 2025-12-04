<template>
  <div class="transaction-form-overlay" v-if="visible" @click.self="close">
    <div class="transaction-form">
      <!-- 表单头部 -->
      <div class="form-header">
        <h3 class="form-title">{{ formTitle }}</h3>
        <button class="form-close" @click="close">✕</button>
      </div>
      
      <!-- 表单内容 -->
      <div class="form-content">
        <!-- 金额输入 -->
        <div class="form-group">
          <label class="form-label">金额</label>
          <div class="amount-input">
            <span class="currency-symbol">¥</span>
            <input 
              type="number" 
              class="form-input amount" 
              v-model.number="form.amount" 
              placeholder="0.00" 
              step="0.01"
              min="0"
              autofocus
            >
          </div>
          <div v-if="!isFormValid && form.amount <= 0" class="error-message">
            请输入有效的金额
          </div>
        </div>
        
        <!-- 常用金额快捷按钮 -->
        <div class="quick-amounts" v-if="form.amount <= 0">
          <button 
            v-for="amount in quickAmounts" 
            :key="amount"
            class="quick-amount-btn"
            @click="form.amount = amount"
          >
            ¥{{ amount }}
          </button>
        </div>
        
        <!-- 分类选择 -->
        <div class="form-group">
          <label class="form-label">分类</label>
          <div class="category-grid">
            <button 
              v-for="category in categories" 
              :key="category"
              class="category-btn"
              :class="{ active: form.category === category }"
              @click="form.category = category"
            >
              <span class="category-icon">{{ getCategoryIcon(category) }}</span>
              <span class="category-name">{{ category }}</span>
            </button>
          </div>
        </div>
        
        <!-- 日期选择 -->
        <div class="form-group">
          <label class="form-label">日期</label>
          <input 
            type="date" 
            class="form-input" 
            v-model="form.date"
            :max="maxDate"
          >
        </div>
        
        <!-- 备注输入 -->
        <div class="form-group">
          <label class="form-label">备注（可选）</label>
          <input 
            type="text" 
            class="form-input" 
            v-model="form.note" 
            placeholder="添加备注"
            maxlength="50"
          >
          <span class="char-count">{{ form.note.length }}/50</span>
        </div>
      </div>
      
      <!-- 表单底部 -->
      <div class="form-footer">
        <button class="form-btn cancel" @click="close">取消</button>
        <button class="form-btn submit" @click="submit" :disabled="!isFormValid">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  formType: {
    type: String,
    default: 'expense',
    validator: (value) => ['income', 'expense'].includes(value)
  },
  editTransaction: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['close', 'submit'])

// 表单数据
const form = ref({
  amount: 0,
  category: '',
  date: new Date().toISOString().split('T')[0],
  note: ''
})

// 最大日期（今天）
const maxDate = ref(new Date().toISOString().split('T')[0])

// 常用金额选项
const quickAmounts = [10, 20, 50, 100, 200, 500]

// 分类选项
const categories = computed(() => {
  return props.formType === 'income' 
    ? ['工资', '奖金', '投资', '兼职收入', '理财收益', '礼金红包', '退款收入', '其他副业', '其他收入']
    : ['餐饮', '交通', '购物', '娱乐', '房租', '水电费', '医疗', '教育', '服饰美容', '旅游出行', '社交聚会', '数码配件', '家居用品', '宠物支出', '运动健身', '学习培训', '其他支出']
})

// 表单标题
const formTitle = computed(() => {
  if (props.editTransaction) {
    return props.formType === 'income' ? '编辑收入' : '编辑支出'
  }
  return props.formType === 'income' ? '添加收入' : '添加支出'
})

// 监听formType变化，重置分类
watch(() => props.formType, (newType) => {
  if (!props.editTransaction) {
    form.value.category = newType === 'income' ? '工资' : '餐饮'
  }
}, { immediate: true })

// 监听visible变化，重置表单
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    if (props.editTransaction) {
      // 编辑模式：填充表单数据
      form.value = {
        amount: props.editTransaction.amount,
        category: props.editTransaction.category,
        date: props.editTransaction.date,
        note: props.editTransaction.note || ''
      }
    } else {
      // 添加模式：重置表单
      resetForm()
    }
  }
})

// 监听editTransaction变化，更新表单数据
watch(() => props.editTransaction, (newTransaction) => {
  if (newTransaction && props.visible) {
    form.value = {
      amount: newTransaction.amount,
      category: newTransaction.category,
      date: newTransaction.date,
      note: newTransaction.note || ''
    }
  }
})

// 重置表单
const resetForm = () => {
  form.value = {
    amount: 0,
    category: props.formType === 'income' ? '工资' : '餐饮',
    date: new Date().toISOString().split('T')[0],
    note: ''
  }
}

// 表单验证
const isFormValid = computed(() => {
  return form.value.amount > 0 && form.value.category
})

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

// 提交表单
const submit = () => {
  if (isFormValid.value) {
    emit('submit', {
      ...form.value,
      type: props.formType,
      id: props.editTransaction ? props.editTransaction.id : Date.now().toString()
    })
    close()
  }
}

// 关闭表单
const close = () => {
  emit('close')
}
</script>

<style scoped>
.transaction-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.transaction-form {
  background: white;
  border-radius: 20px 20px 0 0;
  width: 100%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

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

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.form-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.form-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.form-close:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #333;
}

.form-content {
  padding: 20px;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.2s ease;
  outline: none;
}

.form-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* 金额输入特殊样式 */
.amount-input {
  display: flex;
  align-items: center;
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 0 12px;
  transition: all 0.2s ease;
}

.amount-input:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.currency-symbol {
  font-size: 24px;
  font-weight: 600;
  color: #666;
  margin-right: 8px;
}

.form-input.amount {
  background: transparent;
  border: none !important;
  font-size: 24px;
  font-weight: 600;
  padding: 16px 0;
  flex: 1;
  outline: none !important;
  box-shadow: none !important;
  /* 隐藏数字输入框的上下箭头 */
  -moz-appearance: textfield;
  appearance: textfield;
}

/* 确保获得焦点时也不显示边框和阴影 */
.form-input.amount:focus {
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

/* 针对Webkit浏览器（Chrome, Safari）隐藏箭头 */
.form-input.amount::-webkit-inner-spin-button,
.form-input.amount::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* 分类网格 */
.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.category-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 8px;
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.category-btn:hover {
  background: #f0f0f0;
  transform: translateY(-1px);
}

.category-btn.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.category-icon {
  font-size: 24px;
}

.category-name {
  font-size: 12px;
  font-weight: 500;
}

/* 字符计数 */
.char-count {
  display: block;
  text-align: right;
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

/* 表单底部 */
.form-footer {
  display: flex;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid #f0f0f0;
  background: white;
}

.form-btn {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.form-btn.cancel {
  background: #f5f5f5;
  color: #666;
}

.form-btn.cancel:hover {
  background: #e0e0e0;
}

.form-btn.submit {
  background: #667eea;
  color: white;
}

.form-btn.submit:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-1px);
}

.form-btn.submit:active:not(:disabled) {
  transform: translateY(0);
}

.form-btn.submit:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

/* 错误提示样式 */
.error-message {
  color: #f44336;
  font-size: 12px;
  margin-top: 4px;
  margin-left: 4px;
}

/* 常用金额快捷按钮样式 */
.quick-amounts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 16px 0 24px 0;
}

.quick-amount-btn {
  padding: 8px 16px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #333;
}

.quick-amount-btn:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
  transform: translateY(-1px);
}
</style>