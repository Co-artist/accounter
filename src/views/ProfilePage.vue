<template>
  <div class="profile-page">
    <!-- 内容区域 -->
    <div class="content-wrapper">
      <!-- 顶部用户信息区 -->
      <div class="user-info-section">
        <div class="user-avatar-wrapper">
          <div class="user-avatar" @click="handleAvatarClick">
            <span class="avatar-icon">{{ user.avatar }}</span>
            <div class="avatar-edit">
              <span class="edit-icon">✏️</span>
            </div>
          </div>
        </div>
        <div class="user-details">
          <h1 class="user-name">{{ user.name }}</h1>
          <p class="user-stats">{{ userStats.transactions }}{{ t('笔交易') }} · {{ userStats.categories }}{{ t('个分类') }}</p>
        </div>
      </div>

      <!-- 统计卡片区 -->
      <div class="stats-section">
        <div class="stat-card">
          <div class="stat-icon income">💰</div>
          <div class="stat-content">
            <p class="stat-label">{{ t('本月收入') }}</p>
            <h3 class="stat-value income">¥{{ userStats.monthlyIncome.toFixed(2) }}</h3>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon expense">💸</div>
          <div class="stat-content">
            <p class="stat-label">{{ t('本月支出') }}</p>
            <h3 class="stat-value expense">¥{{ userStats.monthlyExpense.toFixed(2) }}</h3>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon balance">📊</div>
          <div class="stat-content">
            <p class="stat-label">{{ t('账户余额') }}</p>
            <h3 class="stat-value balance">¥{{ userStats.totalBalance.toFixed(2) }}</h3>
          </div>
        </div>
      </div>

      <!-- 功能菜单区 -->
      <div class="menu-section">
        <h2 class="section-title">{{ t('功能菜单') }}</h2>
        <div class="menu-list">
          <div class="menu-item" @click="handleMenuClick('transactions')">
            <div class="menu-icon">📋</div>
            <div class="menu-content">
              <span class="menu-title">{{ t('记账记录') }}</span>
              <span class="menu-desc">{{ t('查看和管理所有交易') }}</span>
            </div>
            <div class="menu-arrow">→</div>
          </div>
          <div class="menu-item" @click="handleMenuClick('budget')">
            <div class="menu-icon">📊</div>
            <div class="menu-content">
              <span class="menu-title">{{ t('预算设置') }}</span>
              <span class="menu-desc">{{ t('设置和管理预算') }}</span>
            </div>
            <div class="menu-arrow">→</div>
          </div>
          <div class="menu-item" @click="handleMenuClick('tags')">
            <div class="menu-icon">🏷️</div>
            <div class="menu-content">
              <span class="menu-title">{{ t('标签管理') }}</span>
              <span class="menu-desc">{{ t('管理交易标签') }}</span>
            </div>
            <div class="menu-arrow">→</div>
          </div>
        </div>
      </div>

      <!-- 设置选项区 -->
      <div class="settings-section">
        <h2 class="section-title">{{ t('设置') }}</h2>
        <div class="settings-list">
          <div class="setting-item">
            <div class="setting-icon">🎨</div>
            <div class="setting-content">
              <span class="setting-title">{{ t('主题设置') }}</span>
              <span class="setting-desc">{{ t('切换应用主题') }}</span>
            </div>
            <div class="setting-control">
              <select v-model="settings.theme" class="setting-select" @change="handleThemeChange(settings.theme)">
                <option value="light">{{ t('亮色') }}</option>
                <option value="dark">{{ t('暗色') }}</option>
                <option value="blue">{{ t('蓝色') }}</option>
                <option value="green">{{ t('绿色') }}</option>
                <option value="purple">{{ t('紫色') }}</option>
                <option value="orange">{{ t('橙色') }}</option>
                <option value="owl">{{ t('猫头鹰') }}</option>
                <option value="auto">{{ t('自动') }}</option>
              </select>
            </div>
          </div>
          <div class="setting-item">
            <div class="setting-icon">🌐</div>
            <div class="setting-content">
              <span class="setting-title">{{ t('语言设置') }}</span>
              <span class="setting-desc">{{ t('选择应用语言') }}</span>
            </div>
            <div class="setting-control">
              <select v-model="settings.language" class="setting-select" @change="handleLanguageChange(settings.language)">
                <option value="zh-CN">{{ t('中文') }}</option>
                <option value="en-US">{{ t('English') }}</option>
              </select>
            </div>
          </div>
          <div class="setting-item">
            <div class="setting-icon">🔔</div>
            <div class="setting-content">
              <span class="setting-title">{{ t('通知设置') }}</span>
              <span class="setting-desc">{{ t('开启或关闭通知') }}</span>
            </div>
            <div class="setting-control">
              <div class="toggle-switch" @click="toggleSwitch('notifications')" :class="{ active: settings.notifications }">
                <div class="toggle-slider"></div>
              </div>
            </div>
          </div>
          <div class="setting-item" @click="handleMenuClick('privacy')">
            <div class="setting-icon">🔒</div>
            <div class="setting-content">
              <span class="setting-title">{{ t('隐私设置') }}</span>
              <span class="setting-desc">{{ t('管理隐私选项') }}</span>
            </div>
            <div class="setting-arrow">→</div>
          </div>
          <!-- 数据管理功能 -->
          <div class="setting-item" @click="handleMenuClick('data')">
            <div class="setting-icon">💾</div>
            <div class="setting-content">
              <span class="setting-title">{{ t('数据管理') }}</span>
              <span class="setting-desc">{{ t('备份和恢复数据') }}</span>
            </div>
            <div class="setting-arrow">→</div>
          </div>
        </div>
      </div>

      <!-- 关于信息区 -->
      <div class="about-section">
        <h2 class="section-title">{{ t('关于') }}</h2>
        <div class="about-list">
          <div class="about-item">
            <span class="about-label">{{ t('版本号') }}</span>
            <span class="about-value">{{ appInfo.version }}</span>
          </div>
          <div class="about-item">
            <span class="about-label">{{ t('开发者') }}</span>
            <span class="about-value">{{ t('ZI.Han') }}</span>
          </div>
          <div class="about-item" @click="handleAboutClick('terms')">
            <span class="about-label">{{ t('用户协议') }}</span>
            <span class="about-arrow">→</span>
          </div>
          <div class="about-item" @click="handleAboutClick('privacy')">
            <span class="about-label">{{ t('隐私政策') }}</span>
            <span class="about-arrow">→</span>
          </div>
          <div class="about-item" @click="handleAboutClick('feedback')">
            <span class="about-label">{{ t('反馈建议') }}</span>
            <span class="about-arrow">→</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 底部导航 -->
    <div class="bottom-nav-wrapper">
      <BottomNavigation 
        active-item="profile"
        @navigate="handleNavigate"
      />
    </div>
    
    <!-- 数据管理弹窗 -->
    <div class="modal-overlay" v-if="showDataModal" @click="closeDataModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>数据管理</h3>
          <button class="modal-close" @click="closeDataModal">×</button>
        </div>
        
        <div class="modal-body">
          <!-- 备份功能 -->
          <div class="data-management-section">
            <h4>备份数据</h4>
            <button class="data-btn backup-btn" @click="backupData">
              <span class="btn-icon">💾</span>
              立即备份
            </button>
            <p class="section-desc">将当前数据备份到本地，防止数据丢失</p>
          </div>
          
          <!-- 恢复功能 -->
          <div class="data-management-section">
            <h4>恢复数据</h4>
            <div v-if="backupHistory.length === 0" class="no-backup-message">
              暂无备份数据
            </div>
            <div v-else class="backup-list">
              <div class="backup-item" v-for="backup in backupHistory" :key="backup.id">
                <div class="backup-info">
                  <div class="backup-time">{{ backup.description }}</div>
                </div>
                <div class="backup-actions">
                  <button class="action-btn restore-btn" @click="restoreData(backup.id)">
                    恢复
                  </button>
                  <button class="action-btn delete-btn" @click="deleteBackup(backup.id)">
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 导出功能 -->
          <div class="data-management-section">
            <h4>导出数据</h4>
            <div class="export-format-selector">
              <span>导出格式：</span>
              <select v-model="exportFormat" class="export-format">
                <option value="csv">CSV</option>
                <option value="json">JSON</option>
              </select>
            </div>
            <div class="export-options">
              <button class="export-option-btn" @click="exportData('transactions')">
                <span class="btn-icon">📋</span>
                导出交易记录
              </button>
              <button class="export-option-btn" @click="exportData('categories')">
                <span class="btn-icon">🏷️</span>
                导出分类数据
              </button>
              <button class="export-option-btn" @click="exportData('budgets')">
                <span class="btn-icon">📊</span>
                导出预算数据
              </button>
              <button class="export-option-btn all-export-btn" @click="exportData('all')">
                <span class="btn-icon">📦</span>
                导出所有数据
              </button>
            </div>
            <p class="section-desc">将数据导出到本地，支持CSV和JSON格式</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 个人中心页面组件
import { ref, inject, computed } from 'vue'
import { useRouter } from 'vue-router'
import BottomNavigation from '../components/BottomNavigation.vue'
import { exportTransactions, exportCategories, exportBudgets, exportAllData } from '../utils/exportUtils'

// 获取路由实例
const router = useRouter()

// 注入store
const store = inject('store')

// 用户基本信息
const user = ref({
  avatar: '🦉',
  name: '用户',
  email: ''
})

// 从localStorage获取实际登录用户信息
const loadUserInfo = () => {
  try {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      // 只使用用户名，不显示邮箱
      user.value.name = userData.username || userData.name || '用户'
      user.value.avatar = userData.avatar || '👤'
    }
  } catch (error) {
    console.error('加载用户信息失败:', error)
  }
}

// 初始化时加载用户信息
loadUserInfo()

// 计算用户统计数据
const userStats = computed(() => {
  return {
    monthlyIncome: store.stats.getMonthlyIncome(),
    monthlyExpense: store.stats.getMonthlyExpense(),
    totalBalance: store.stats.getTotalIncome() - store.stats.getTotalExpense(),
    transactions: store.stats.getTransactionCount(),
    categories: store.state.categories.length
  }
})

// 注入全局状态
const theme = inject('theme')
const language = inject('language')
const updateTheme = inject('updateTheme')
const updateLanguage = inject('updateLanguage')
const t = inject('t')

// 本地设置数据，与全局状态同步
const settings = ref({
  theme: theme.value,
  language: language.value,
  notifications: true
})

// 应用信息
const appInfo = ref({
  version: '1.0.0'
})

// 数据管理弹窗
const showDataModal = ref(false)

// 备份历史
const backupHistory = ref([])

// 加载备份历史
const loadBackupHistory = () => {
  const backups = localStorage.getItem('backupHistory')
  if (backups) {
    backupHistory.value = JSON.parse(backups)
  } else {
    backupHistory.value = []
  }
}

// 备份数据
const backupData = () => {
  try {
    // 获取当前时间
    const backupTime = new Date().toISOString()
    
    // 备份数据
    const backupData = {
      transactions: store.state.transactions,
      categories: store.state.categories,
      budgets: store.state.budgets,
      backupTime
    }
    
    // 保存备份
    const backupKey = `backup_${Date.now()}`
    localStorage.setItem(backupKey, JSON.stringify(backupData))
    
    // 更新备份历史
    backupHistory.value.push({
      id: backupKey,
      time: backupTime,
      description: `备份于 ${new Date(backupTime).toLocaleString()}`
    })
    
    // 保存备份历史
    localStorage.setItem('backupHistory', JSON.stringify(backupHistory.value))
    
    // 显示成功提示
    alert('数据备份成功')
  } catch (error) {
    console.error('备份数据失败:', error)
    alert('备份数据失败，请稍后重试')
  }
}

// 恢复数据
const restoreData = (backupId) => {
  try {
    // 获取备份数据
    const backupData = JSON.parse(localStorage.getItem(backupId))
    
    if (backupData) {
      // 恢复数据
      store.state.transactions = backupData.transactions
      store.state.categories = backupData.categories
      store.state.budgets = backupData.budgets
      
      // 保存到localStorage
      store.saveToStorage('transactions', store.state.transactions)
      store.saveToStorage('categories', store.state.categories)
      store.saveToStorage('budgets', store.state.budgets)
      
      // 发布数据更新
      store.publish('transactions', store.state.transactions)
      store.publish('categories', store.state.categories)
      store.publish('budgets', store.state.budgets)
      
      // 更新分类使用情况
      store.updateCategoryUsage()
      
      // 显示成功提示
      alert('数据恢复成功')
      
      // 关闭弹窗
      showDataModal.value = false
    }
  } catch (error) {
    console.error('恢复数据失败:', error)
    alert('恢复数据失败，请稍后重试')
  }
}

// 删除备份
const deleteBackup = (backupId) => {
  try {
    // 删除备份数据
    localStorage.removeItem(backupId)
    
    // 更新备份历史
    backupHistory.value = backupHistory.value.filter(backup => backup.id !== backupId)
    
    // 保存备份历史
    localStorage.setItem('backupHistory', JSON.stringify(backupHistory.value))
    
    // 显示成功提示
    alert('备份删除成功')
  } catch (error) {
    console.error('删除备份失败:', error)
    alert('删除备份失败，请稍后重试')
  }
}

// 关闭数据管理弹窗
const closeDataModal = () => {
  showDataModal.value = false
}

// 初始化加载备份历史
loadBackupHistory()

// 数据导出功能
const exportFormat = ref('csv') // 导出格式，默认CSV
const showExportModal = ref(false)

// 导出数据
const exportData = (exportType) => {
  try {
    const data = {
      transactions: store.state.transactions,
      categories: store.state.categories,
      budgets: store.state.budgets
    }
    
    switch (exportType) {
      case 'transactions':
        exportTransactions(data.transactions, exportFormat.value)
        break
      case 'categories':
        exportCategories(data.categories, exportFormat.value)
        break
      case 'budgets':
        exportBudgets(data.budgets, exportFormat.value)
        break
      case 'all':
        exportAllData(data, exportFormat.value)
        break
      default:
        break
    }
    
    // 关闭弹窗
    showExportModal.value = false
    
    // 显示成功提示
    alert('数据导出成功')
  } catch (error) {
    console.error('导出数据失败:', error)
    alert('导出数据失败，请稍后重试')
  }
}

// 处理导航事件
const handleNavigate = (itemId) => {
  // 如果点击的是中间的记账按钮，可以在这里添加相应的处理逻辑
  if (itemId === 'add') {
    console.log('点击了记账按钮')
    // 可以跳转到记账页面或显示记账表单
  }
}

// 处理菜单点击
const handleMenuClick = (menuId) => {
  console.log('点击了菜单:', menuId)
  // 根据菜单ID执行相应的操作
  switch (menuId) {
    case 'transactions':
      // 跳转到交易记录页面
      router.push('/')
      break
    case 'budget':
      // 跳转到预算设置页面
      router.push('/budget')
      break
    case 'tags':
      // 跳转到标签管理页面
      router.push('/category')
      break
    case 'privacy':
      // 跳转到隐私设置页面
      router.push('/privacy')
      break
    case 'data':
      // 显示数据管理弹窗
      showDataModal.value = true
      break
    default:
      break
  }
}

// 处理关于项点击
const handleAboutClick = (aboutId) => {
  console.log('点击了关于项:', aboutId)
  // 根据ID执行相应的操作
  switch (aboutId) {
    case 'developer':
      console.log('开发者信息')
      break
    case 'terms':
      // 跳转到用户协议页面
      router.push('/user-agreement')
      break
    case 'privacy':
      // 跳转到隐私政策页面
      router.push('/privacy-policy')
      break
    case 'feedback':
      // 跳转到反馈建议页面
      router.push('/feedback')
      break
    default:
      break
  }
}

// 处理头像点击
const handleAvatarClick = () => {
  console.log('点击了头像')
  // 可以弹出头像选择或更换界面
}

// 切换开关状态
const toggleSwitch = (settingName) => {
  settings.value[settingName] = !settings.value[settingName]
  console.log(`${settingName} 设置已${settings.value[settingName] ? '开启' : '关闭'}`)
}

// 监听主题变化
const handleThemeChange = (newTheme) => {
  updateTheme(newTheme)
  settings.value.theme = newTheme
}

// 监听语言变化
const handleLanguageChange = (newLanguage) => {
  updateLanguage(newLanguage)
  settings.value.language = newLanguage
}
</script>

<style scoped>
.profile-page {
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
  padding: 0;
  padding-bottom: 60px; /* 为底部导航预留空间 */
}

/* 隐藏滚动条 */
.content-wrapper::-webkit-scrollbar {
  display: none;
}

.profile-page {
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

/* 顶部用户信息区 */
.user-info-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 32px 20px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.user-avatar-wrapper {
  margin-bottom: 16px;
}

.user-avatar {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
  background-color: rgba(255, 255, 255, 0.3);
}

.avatar-icon {
  font-size: 40px;
}

.avatar-edit {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 24px;
  height: 24px;
  background-color: #667eea;
  border: 2px solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.edit-icon {
  font-size: 12px;
}

.user-details {
  text-align: center;
}

.user-name {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: white;
}

.user-email {
  font-size: 14px;
  opacity: 0.9;
  margin: 0 0 8px 0;
  color: white;
}

.user-stats {
  font-size: 12px;
  opacity: 0.8;
  margin: 0;
  color: white;
}

/* 统计卡片区 */
.stats-section {
  display: flex;
  justify-content: space-around;
  padding: 20px 12px;
  background-color: var(--background-secondary);
  margin: -16px 12px 12px;
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
  z-index: 1;
}

.stat-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 12px 8px;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.stat-card:hover {
  background-color: #f5f5f5;
}

.stat-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.stat-icon.income {
  color: var(--success-color);
}

.stat-icon.expense {
  color: var(--error-color);
}

.stat-icon.balance {
  color: var(--info-color);
}

.stat-content {
  text-align: center;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin: 0 0 4px 0;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.stat-value.income {
  color: var(--success-color);
}

.stat-value.expense {
  color: var(--error-color);
}

.stat-value.balance {
  color: var(--info-color);
}

/* 功能菜单区 */
.menu-section {
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

.menu-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: var(--background-primary);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background-color: var(--border-color);
  transform: translateX(4px);
}

.menu-icon {
  font-size: 20px;
  margin-right: 12px;
  color: var(--primary-color);
}

.menu-content {
  flex: 1;
}

.menu-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
  display: block;
  margin-bottom: 4px;
}

.menu-desc {
  font-size: 12px;
  color: var(--text-tertiary);
  display: block;
}

.menu-arrow {
  font-size: 16px;
  color: var(--text-tertiary);
}

/* 设置选项区 */
.settings-section {
  background-color: var(--background-secondary);
  margin: 12px;
  border-radius: 16px;
  padding: 16px;
  box-shadow: var(--shadow-sm);
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: var(--background-primary);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.setting-item:hover {
  background-color: var(--border-color);
}

.setting-icon {
  font-size: 20px;
  margin-right: 12px;
  color: var(--primary-color);
}

.setting-content {
  flex: 1;
}

.setting-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
  display: block;
  margin-bottom: 4px;
}

.setting-desc {
  font-size: 12px;
  color: var(--text-tertiary);
  display: block;
}

.setting-control {
  display: flex;
  align-items: center;
}

.setting-select {
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--background-secondary);
  font-size: 14px;
  color: var(--text-primary);
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
}

.setting-select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
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

/* 移除内部滑块元素的样式，因为我们现在使用伪元素实现滑块 */
.toggle-slider {
  display: none;
}

.setting-arrow {
  font-size: 16px;
  color: var(--text-tertiary);
}

/* 关于信息区 */
.about-section {
  background-color: var(--background-secondary);
  margin: 12px;
  border-radius: 16px;
  padding: 16px;
  box-shadow: var(--shadow-sm);
}

.about-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.about-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: var(--background-primary);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.about-item:hover {
  background-color: var(--border-color);
}

.about-label {
  font-size: 15px;
  color: var(--text-primary);
  font-weight: 500;
}

.about-value {
  font-size: 15px;
  color: var(--primary-color);
  font-weight: 500;
}

.about-arrow {
  font-size: 16px;
  color: var(--text-tertiary);
}

/* 响应式设计 */
@media (max-width: 480px) {
  .user-info-section {
    padding: 24px 16px 20px;
  }
  
  .user-avatar {
    width: 70px;
    height: 70px;
  }
  
  .avatar-icon {
    font-size: 36px;
  }
  
  .user-name {
    font-size: 20px;
  }
  
  .stats-section {
    padding: 16px 8px;
    margin: -12px 8px 8px;
  }
  
  .stat-card {
    padding: 10px 6px;
  }
  
  .stat-value {
    font-size: 16px;
  }
  
  .menu-section,
  .settings-section,
  .about-section {
    margin: 8px;
    padding: 12px;
  }
  
  .menu-item,
  .setting-item,
  .about-item {
    padding: 14px;
  }
  
  .menu-title,
  .setting-title,
  .about-label {
    font-size: 14px;
  }
}

/* 数据管理弹窗样式 */
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
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background-color: white;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  transition: color 0.2s ease;
}

.modal-close:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
}

.data-management-section {
  margin-bottom: 24px;
}

.data-management-section h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.data-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 8px;
}

.backup-btn {
  background-color: #667eea;
  color: white;
}

.backup-btn:hover {
  background-color: #5568d3;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-icon {
  font-size: 20px;
}

.section-desc {
  margin: 0;
  font-size: 12px;
  color: #666;
  line-height: 1.5;
}

.no-backup-message {
  text-align: center;
  padding: 20px;
  color: #999;
  background-color: #f5f5f5;
  border-radius: 12px;
  margin: 0;
}

.backup-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.backup-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.backup-item:hover {
  background-color: #e0e0e0;
  transform: translateX(4px);
}

.backup-info {
  flex: 1;
}

.backup-time {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.backup-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.restore-btn {
  background-color: #4caf50;
  color: white;
}

.restore-btn:hover {
  background-color: #45a049;
}

.delete-btn {
  background-color: #f44336;
  color: white;
}

.delete-btn:hover {
  background-color: #e53935;
}

/* 导出功能样式 */
.export-format-selector {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-size: 14px;
}

.export-format {
  margin-left: 8px;
  padding: 6px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s ease;
}

.export-format:focus {
  border-color: #667eea;
}

.export-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 8px;
}

.export-option-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.export-option-btn:hover {
  background-color: #f5f5f5;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.export-option-btn .btn-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.all-export-btn {
  grid-column: span 2;
  background-color: #667eea;
  color: white;
  border-color: #667eea;
}

.all-export-btn:hover {
  background-color: #5568d3;
  color: white;
  border-color: #5568d3;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
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
