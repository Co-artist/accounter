<template>
  <div class="privacy-page">
    <!-- 内容区域 -->
    <div class="content-wrapper">
      <!-- 顶部导航栏 -->
      <header class="privacy-header">
        <h1 class="header-title">{{ t('隐私设置') }}</h1>
        <button class="back-btn" @click="handleBack">
          <span class="back-icon">←</span>
        </button>
      </header>

      <!-- 数据管理 -->
      <div class="privacy-section">
        <h2 class="section-title">{{ t('数据管理') }}</h2>
        <div class="privacy-list">
          <div class="privacy-item" @click="handleDataAction('export')">
            <div class="privacy-icon">📤</div>
            <div class="privacy-content">
              <span class="privacy-title">{{ t('导出数据') }}</span>
              <span class="privacy-desc">{{ t('将您的记账数据导出为文件') }}</span>
            </div>
            <div class="privacy-arrow">→</div>
          </div>
          <div class="privacy-item" @click="handleDataAction('backup')">
            <div class="privacy-icon">💾</div>
            <div class="privacy-content">
              <span class="privacy-title">{{ t('备份数据') }}</span>
              <span class="privacy-desc">{{ t('备份您的记账数据') }}</span>
            </div>
            <div class="privacy-arrow">→</div>
          </div>
          <div class="privacy-item danger" @click="handleDataAction('clear')">
            <div class="privacy-icon">🗑️</div>
            <div class="privacy-content">
              <span class="privacy-title">{{ t('清除数据') }}</span>
              <span class="privacy-desc">{{ t('清除所有记账数据，此操作不可恢复') }}</span>
            </div>
            <div class="privacy-arrow">→</div>
          </div>
        </div>
      </div>

      <!-- 隐私选项 -->
      <div class="privacy-section">
        <h2 class="section-title">{{ t('隐私选项') }}</h2>
        <div class="privacy-list">
          <div class="privacy-item">
            <div class="privacy-icon" :class="{ active: privacySettings.anonymize }">👤</div>
            <div class="privacy-content">
              <span class="privacy-title">{{ t('匿名化设置') }}</span>
              <span class="privacy-desc">{{ t('控制您的数据是否匿名化') }}</span>
            </div>
            <div class="privacy-control">
              <div class="toggle-switch" @click="togglePrivacySetting('anonymize')" :class="{ active: privacySettings.anonymize }">
                <div class="toggle-slider"></div>
              </div>
            </div>
          </div>
          <div class="privacy-item">
            <div class="privacy-icon" :class="{ active: privacySettings.dataSharing }">🔗</div>
            <div class="privacy-content">
              <span class="privacy-title">{{ t('数据共享') }}</span>
              <span class="privacy-desc">{{ t('允许与第三方共享您的数据') }}</span>
            </div>
            <div class="privacy-control">
              <div class="toggle-switch" @click="togglePrivacySetting('dataSharing')" :class="{ active: privacySettings.dataSharing }">
                <div class="toggle-slider"></div>
              </div>
            </div>
          </div>
          <div class="privacy-item" @click="handleDataAction('privacyPolicy')">
            <div class="privacy-icon">📄</div>
            <div class="privacy-content">
              <span class="privacy-title">{{ t('隐私政策') }}</span>
              <span class="privacy-desc">{{ t('查看我们的隐私政策') }}</span>
            </div>
            <div class="privacy-arrow">→</div>
          </div>
        </div>
      </div>

      <!-- 安全选项 -->
      <div class="privacy-section">
        <h2 class="section-title">{{ t('安全选项') }}</h2>
        <div class="privacy-list">
          <div class="privacy-item">
            <div class="privacy-icon" :class="{ active: privacySettings.passwordProtection }">🔒</div>
            <div class="privacy-content">
              <span class="privacy-title">{{ t('密码保护') }}</span>
              <span class="privacy-desc">{{ t('为应用设置访问密码') }}</span>
            </div>
            <div class="privacy-control">
              <div class="toggle-switch" @click="togglePrivacySetting('passwordProtection')" :class="{ active: privacySettings.passwordProtection }">
                <div class="toggle-slider"></div>
              </div>
            </div>
          </div>
          <div class="privacy-item">
            <div class="privacy-icon" :class="{ active: privacySettings.biometricAuth }">👆</div>
            <div class="privacy-content">
              <span class="privacy-title">{{ t('生物识别认证') }}</span>
              <span class="privacy-desc">{{ t('使用指纹或面部识别解锁应用') }}</span>
            </div>
            <div class="privacy-control">
              <div class="toggle-switch" @click="togglePrivacySetting('biometricAuth')" :disabled="!privacySettings.passwordProtection" :class="{ active: privacySettings.biometricAuth }">
                <div class="toggle-slider"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 广告与通知 -->
      <div class="privacy-section">
        <h2 class="section-title">{{ t('广告与通知') }}</h2>
        <div class="privacy-list">
          <div class="privacy-item">
            <div class="privacy-icon" :class="{ active: privacySettings.personalizedAds }">📢</div>
            <div class="privacy-content">
              <span class="privacy-title">{{ t('个性化广告') }}</span>
              <span class="privacy-desc">{{ t('根据您的使用情况显示相关广告') }}</span>
            </div>
            <div class="privacy-control">
              <div class="toggle-switch" @click="togglePrivacySetting('personalizedAds')" :class="{ active: privacySettings.personalizedAds }">
                <div class="toggle-slider"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 导出格式选择弹窗 -->
    <div class="form-overlay" v-if="showExportFormat" @click="closeExportFormat"></div>
    <div class="export-format-popup" v-if="showExportFormat">
      <div class="form-header">
        <h3>{{ t('选择导出格式') }}</h3>
        <button class="form-close" @click="closeExportFormat">✕</button>
      </div>
      <div class="form-content">
        <div class="format-options">
          <div 
            v-for="format in exportFormats" 
            :key="format.value"
            class="format-option"
            :class="{ active: selectedExportFormat === format.value }"
            @click="selectedExportFormat = format.value"
          >
            <div class="format-radio">{{ selectedExportFormat === format.value ? '✓' : '○' }}</div>
            <div class="format-label">{{ format.label }}</div>
          </div>
        </div>
      </div>
      <div class="form-footer">
        <button class="form-btn cancel" @click="closeExportFormat">{{ t('取消') }}</button>
        <button class="form-btn submit" @click="confirmExport">{{ t('确认导出') }}</button>
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

    <!-- 底部导航 -->
    <div class="bottom-nav-wrapper">
      <BottomNavigation 
        active-item="profile"
        @navigate="handleNavigate"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import BottomNavigation from '../components/BottomNavigation.vue'
import ConfirmModal from '../components/ConfirmModal.vue'

// 获取路由实例
const router = useRouter()

// 注入翻译函数
const t = inject('t')

// 隐私设置状态
const privacySettings = ref({
  anonymize: false,
  dataSharing: false,
  passwordProtection: false,
  biometricAuth: false,
  personalizedAds: true
})

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

// 导出格式选择弹窗状态
const showExportFormat = ref(false)
const selectedExportFormat = ref('csv') // 默认导出为CSV格式
const exportFormats = [
  { value: 'csv', label: t('CSV格式（适合表格应用）') },
  { value: 'json', label: t('JSON格式（适合备份）') }
]

// 返回上一页
const handleBack = () => {
  router.back()
}

// 处理数据操作
const handleDataAction = (action) => {
  switch (action) {
    case 'export':
      // 显示导出格式选择弹窗
      showExportFormat.value = true
      break
    case 'backup':
      handleBackup()
      break
    case 'clear':
      handleClearData()
      break
    case 'privacyPolicy':
      router.push('/privacy-policy')
      break
    default:
      break
  }
}

// 关闭导出格式选择弹窗
const closeExportFormat = () => {
  showExportFormat.value = false
}

// 确认导出
const confirmExport = () => {
  // 获取数据
  const allData = {
    transactions: JSON.parse(localStorage.getItem('transactions') || '[]'),
    categories: JSON.parse(localStorage.getItem('categories') || '[]'),
    budgets: JSON.parse(localStorage.getItem('budgets') || '[]'),
    settings: JSON.parse(localStorage.getItem('settings') || '{}')
  }
  
  if (selectedExportFormat.value === 'csv') {
    exportToCSV(allData)
  } else {
    exportToJSON(allData)
  }
  
  closeExportFormat()
}

// 导出为JSON
const exportToJSON = (data) => {
  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `accounting-data-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 导出为CSV
const exportToCSV = (data) => {
  // 转换交易数据为CSV
  const transactionsCSV = convertTransactionsToCSV(data.transactions)
  const blob = new Blob([transactionsCSV], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `accounting-transactions-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 转换交易数据为CSV格式
const convertTransactionsToCSV = (transactions) => {
  if (transactions.length === 0) return ''
  
  // CSV表头
  const headers = ['日期', '类型', '分类', '金额', '备注']
  const csvContent = []
  csvContent.push(headers.join(','))
  
  // 转换每条交易数据
  transactions.forEach(transaction => {
    const row = [
      transaction.date,
      transaction.type === 'income' ? t('收入') : t('支出'),
      transaction.category,
      transaction.amount,
      transaction.note || ''
    ]
    // 处理包含逗号的字段
    const formattedRow = row.map(field => {
      if (typeof field === 'string' && field.includes(',')) {
        return `"${field}"`
      }
      return field
    })
    csvContent.push(formattedRow.join(','))
  })
  
  return csvContent.join('\n')
}

// 备份数据
const handleBackup = () => {
  try {
    // 获取所有数据
    const allData = {
      transactions: JSON.parse(localStorage.getItem('transactions') || '[]'),
      categories: JSON.parse(localStorage.getItem('categories') || '[]'),
      budgets: JSON.parse(localStorage.getItem('budgets') || '[]'),
      settings: JSON.parse(localStorage.getItem('settings') || '{}')
    }
    
    // 生成备份文件名
    const backupKey = `backup_${new Date().toISOString().replace(/[:.]/g, '-')}`
    
    // 保存到localStorage
    localStorage.setItem(backupKey, JSON.stringify(allData))
    
    alert(t('备份成功'))
  } catch (error) {
    console.error('备份失败:', error)
    alert(t('备份失败'))
  }
}

// 清除数据
const handleClearData = () => {
  showConfirmModal(
    t('提示'),
    t('确定要清除所有数据吗？此操作不可恢复。'),
    () => {
      try {
        // 清除所有相关数据
        localStorage.removeItem('transactions')
        localStorage.removeItem('categories')
        localStorage.removeItem('budgets')
        localStorage.removeItem('settings')
        
        // 清除所有备份
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('backup_')) {
            localStorage.removeItem(key)
          }
        })
        
        alert(t('数据已清除'))
      } catch (error) {
        console.error('清除数据失败:', error)
        alert(t('清除数据失败'))
      }
    }
  )
}

// 切换隐私设置
const togglePrivacySetting = (settingName) => {
  // 如果是生物识别认证，需要先检查密码保护是否开启
  if (settingName === 'biometricAuth' && !privacySettings.value.passwordProtection) {
    alert(t('请先开启密码保护'))
    return
  }
  
  privacySettings.value[settingName] = !privacySettings.value[settingName]
  console.log(`${settingName} 设置已${privacySettings.value[settingName] ? '开启' : '关闭'}`)
  
  // 保存设置到本地存储
  localStorage.setItem('privacySettings', JSON.stringify(privacySettings.value))
}

// 处理导航事件
const handleNavigate = (itemId) => {
  if (itemId === 'add') {
    console.log('点击了记账按钮')
  } else {
    router.push({
      path: itemId === 'home' ? '/' : `/${itemId}`
    })
  }
}

// 从本地存储加载设置
const loadSettings = () => {
  const savedSettings = localStorage.getItem('privacySettings')
  if (savedSettings) {
    privacySettings.value = JSON.parse(savedSettings)
  }
}

// 组件挂载时加载设置
loadSettings()
</script>

<style scoped>
.privacy-page {
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

.privacy-page {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 顶部导航栏 */
.privacy-header {
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

/* 隐私设置区块 */
.privacy-section {
  background-color: var(--background-secondary);
  margin: 12px;
  border-radius: 16px;
  padding: 16px;
  box-shadow: var(--shadow-sm);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 16px 0;
}

/* 隐私设置列表 */
.privacy-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 隐私设置项 */
.privacy-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: var(--background-primary);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.privacy-item:hover {
  background-color: var(--border-color);
  transform: translateX(4px);
}

.privacy-item.danger:hover {
  background-color: rgba(244, 67, 54, 0.1);
}

/* 隐私图标 */
.privacy-icon {
  font-size: 20px;
  margin-right: 12px;
  color: var(--primary-color);
  transition: color 0.3s ease;
}

/* 激活状态的隐私图标 */
.privacy-icon.active {
  color: var(--primary-color);
}

/* 隐私内容 */
.privacy-content {
  flex: 1;
}

.privacy-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
  display: block;
  margin-bottom: 4px;
}

.privacy-desc {
  font-size: 12px;
  color: var(--text-tertiary);
  display: block;
}

/* 隐私箭头 */
.privacy-arrow {
  font-size: 16px;
  color: var(--text-tertiary);
}

/* 隐私控制 */
.privacy-control {
  margin-left: 12px;
}

/* 切换开关样式 */
.toggle-switch {
  width: 44px;
  height: 24px;
  background-color: #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  border: none;
  outline: none;
}

.toggle-switch::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-switch:active::after {
  width: 24px;
}

.toggle-switch.active {
  background-color: #4caf50;
}

.toggle-switch.active::after {
  left: 22px;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.4);
}

.toggle-switch:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #e0e0e0;
}

.toggle-switch:disabled::after {
  opacity: 0.5;
}

/* 移除内部滑块元素的样式，因为我们现在使用伪元素实现滑块 */
.toggle-slider {
  display: none;
}

/* 底部导航固定在内容底部 */
.bottom-nav-wrapper {
  position: sticky;
  bottom: 0;
  z-index: 100;
  flex-shrink: 0;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .privacy-header {
    padding: 12px 16px;
  }
  
  .header-title {
    font-size: 18px;
  }
  
  .back-btn {
    min-width: 40px;
    min-height: 40px;
    font-size: 18px;
  }
  
  .privacy-section {
    margin: 8px;
    padding: 12px;
  }
  
  .section-title {
    font-size: 15px;
  }
  
  .privacy-item {
    padding: 14px;
  }
  
  .privacy-title {
    font-size: 14px;
  }
  
  .privacy-desc {
    font-size: 11px;
  }
}
</style>