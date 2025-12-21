<template>
  <div class="profile-page">
    <div class="content-wrapper" ref="swipeEl">
      <!-- 头部卡片 -->
      <div class="header-card">
        <div class="user-info">
          <div class="avatar-wrapper" @click="handleAvatarClick">
            <div class="avatar-ring">
              <img 
                v-if="user.avatar && user.avatar.startsWith('owl-')" 
                :src="`/avatars/${user.avatar}.svg`" 
                class="avatar-img" 
                alt="Avatar"
              />
              <span v-else class="avatar-emoji">{{ user.avatar }}</span>
            </div>
            <div class="edit-badge">✎</div>
          </div>
          <div class="user-meta">
            <h1 class="user-name">{{ user.name }}</h1>
            <div class="user-achievements">
              <span class="badge">🏅 {{ t('记账达人') }}</span>
              <span class="badge">📅 {{ t('已坚持 {days} 天', { days: 12 }) }}</span>
            </div>
          </div>
        </div>
        
        <!-- 统计概览 -->
        <div class="stats-row">
          <div class="stat-item">
            <span class="stat-val">{{ userStats.transactions }}</span>
            <span class="stat-label">{{ t('总笔数') }}</span>
          </div>
          <div class="divider"></div>
          <div class="stat-item">
            <span class="stat-val">{{ userStats.categories }}</span>
            <span class="stat-label">{{ t('分类数') }}</span>
          </div>
          <div class="divider"></div>
          <div class="stat-item">
            <span class="stat-val">{{ userStats.days || 12 }}</span>
            <span class="stat-label">{{ t('天数') }}</span>
          </div>
        </div>
      </div>

      <!-- 功能菜单 -->
      <div class="menu-group">
        <h3 class="group-title">{{ t('数据与功能') }}</h3>
        <div class="menu-card">
          <div class="menu-item" @click="handleMenuClick('transactions')">
            <span class="icon">📋</span>
            <span class="label">{{ t('记账记录') }}</span>
            <span class="arrow">›</span>
          </div>
          <div class="menu-item" @click="handleMenuClick('budget')">
            <span class="icon">🎯</span>
            <span class="label">{{ t('预算设置') }}</span>
            <span class="arrow">›</span>
          </div>
          <div class="menu-item" @click="handleMenuClick('data')">
            <span class="icon">💾</span>
            <span class="label">{{ t('数据管理') }}</span>
            <span class="arrow">›</span>
          </div>
        </div>
      </div>

      <div class="menu-group">
        <h3 class="group-title">{{ t('偏好设置') }}</h3>
        <div class="menu-card">
          <div class="menu-item">
            <span class="icon">🎨</span>
            <span class="label">{{ t('主题模式') }}</span>
            <select v-model="settings.theme" class="setting-select" @change="handleThemeChange(settings.theme)">
              <option value="light">☀️ {{ t('日间') }}</option>
              <option value="dark">🌙 {{ t('夜间') }}</option>
              <option value="auto">🤖 {{ t('自动') }}</option>
            </select>
          </div>
          <div class="menu-item">
            <span class="icon">🌐</span>
            <span class="label">{{ t('语言') }}</span>
            <select v-model="settings.language" class="setting-select" @change="handleLanguageChange(settings.language)">
              <option value="zh-CN">中文</option>
              <option value="en-US">English</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 退出登录 -->
      <button class="logout-btn" @click="handleLogoutClick">{{ t('退出登录') }}</button>
      
      <!-- 版本信息 -->
      <p class="app-version">v{{ appInfo.version }} · Made with ❤️ by Owl</p>
    </div>

    <!-- 底部导航 -->
    <div class="bottom-nav-wrapper">
      <BottomNavigation 
        active-item="profile"
        @navigate="handleNavigate"
      />
    </div>

    <!-- 弹窗组件 (复用原有逻辑，样式已适配) -->
    <ConfirmModal
      v-model:visible="showLogoutConfirm"
      :title="t('退出登录')"
      :message="t('确定要退出登录吗？')"
      @confirm="handleLogout"
    />

    <!-- 数据管理弹窗 (保持逻辑不变，仅简化展示) -->
    <div class="modal-overlay" v-if="showDataModal" @click="closeDataModal">
      <div class="modal-card" @click.stop>
        <div class="modal-header">
          <h3>{{ t('数据管理') }}</h3>
          <button class="close-btn" @click="closeDataModal">✕</button>
        </div>
        <div class="modal-body">
          <button class="action-btn primary" @click="backupData">
            <span class="icon">☁️</span> {{ t('备份数据') }}
          </button>
          <button class="action-btn secondary" @click="exportData('all')">
            <span class="icon">📤</span> {{ t('导出数据') }}
          </button>
          <!-- 更多功能略 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'ProfilePage' })
import { ref, inject, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import BottomNavigation from '../components/BottomNavigation.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import { attachSwipeNavigation } from '../utils/swipeNavigation'
import { exportAllData } from '../utils/exportUtils'

const router = useRouter()
const store = inject('store')
const t = inject('t')
const theme = inject('theme')
const updateTheme = inject('updateTheme')
const language = inject('language')
const updateLanguage = inject('updateLanguage')
const swipeEl = ref(null)

const user = ref({ avatar: '🦉', name: '用户' })
const settings = ref({ theme: theme.value, language: language.value })
const appInfo = ref({ version: '1.0.0' })
const showLogoutConfirm = ref(false)
const showDataModal = ref(false)

const userStats = computed(() => ({
  transactions: store.stats.getTransactionCount(),
  categories: store.state.categories.length,
  days: 12 // 示例数据
}))

// 加载用户信息
const loadUserInfo = () => {
  const stored = localStorage.getItem('user')
  if (stored) {
    const data = JSON.parse(stored)
    user.value.name = data.username || '用户'
    user.value.avatar = data.avatar || '🦉'
  }
}

const handleThemeChange = (val) => {
  updateTheme(val)
  settings.value.theme = val
}

const handleLanguageChange = (val) => {
  updateLanguage(val)
  settings.value.language = val
}

const handleMenuClick = (id) => {
  if (id === 'data') showDataModal.value = true
  // 其他路由跳转逻辑
}

const handleLogoutClick = () => showLogoutConfirm.value = true
const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

const handleAvatarClick = () => {
  // 头像更换逻辑
}

const closeDataModal = () => showDataModal.value = false
const backupData = () => {
  alert(t('备份功能开发中'))
}
const exportData = () => {
  exportAllData({ 
    transactions: store.state.transactions,
    categories: store.state.categories,
    budgets: store.state.budgets 
  }, 'csv')
  alert(t('导出成功'))
}

const handleNavigate = () => {}

onMounted(async () => {
  loadUserInfo()
  await nextTick()
  attachSwipeNavigation(swipeEl.value, 'profile', router)
})
</script>

<style scoped>
.profile-page {
  width: 100%;
  height: 100%;
  background: var(--bg-body, #f5f5f5);
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  padding-bottom: 80px;
}

/* 头部卡片 */
.header-card {
  background: var(--primary-gradient, linear-gradient(135deg, #FFD54F 0%, #FFA726 100%));
  border-radius: 24px;
  padding: 24px;
  color: var(--text-on-primary, #ffffff);
  box-shadow: 0 8px 24px rgba(255, 167, 38, 0.25);
  margin-bottom: 24px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.avatar-wrapper {
  position: relative;
  cursor: pointer;
}

.avatar-ring {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid rgba(255, 255, 255, 0.5);
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  padding: 8px; /* 留一点边距让头像在环内 */
}

.avatar-emoji {
  font-size: 40px;
}

.edit-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 24px;
  height: 24px;
  background: #fff;
  border-radius: 50%;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.user-name {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.user-achievements {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.badge {
  font-size: 12px;
  background: rgba(255, 255, 255, 0.3);
  padding: 4px 8px;
  border-radius: 12px;
  backdrop-filter: blur(4px);
}

.stats-row {
  display: flex;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 16px;
  justify-content: space-around;
  backdrop-filter: blur(5px);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-val {
  font-size: 18px;
  font-weight: 700;
  font-family: monospace;
}

.stat-label {
  font-size: 12px;
  opacity: 0.8;
}

.divider {
  width: 1px;
  background: rgba(93, 64, 55, 0.2);
}

/* 菜单组 */
.menu-group {
  margin-bottom: 24px;
}

.group-title {
  font-size: 14px;
  color: var(--text-secondary, #999);
  margin: 0 0 8px 12px;
  font-weight: 500;
}

.menu-card {
  background: var(--bg-card, #fff);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid var(--border-color, #f0f0f0);
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:active {
  background: var(--bg-body, #f5f5f5);
}

.menu-item .icon {
  font-size: 20px;
  margin-right: 12px;
  width: 24px;
  text-align: center;
}

.menu-item .label {
  flex: 1;
  font-size: 15px;
  color: var(--text-primary, #333);
}

.menu-item .arrow {
  color: var(--text-secondary, #ccc);
  font-size: 20px;
}

.setting-select {
  border: none;
  background: transparent;
  text-align: right;
  font-size: 14px;
  color: var(--text-secondary, #666);
  outline: none;
}

/* 退出按钮 */
.logout-btn {
  width: 100%;
  padding: 16px;
  background: var(--bg-card, #fff);
  border: 1px solid #FFCDD2;
  border-radius: 20px;
  color: #D32F2F;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 24px;
}

.app-version {
  text-align: center;
  color: var(--text-tertiary, #ccc);
  font-size: 12px;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  backdrop-filter: blur(4px);
}

.modal-card {
  width: 80%;
  max-width: 300px;
  background: var(--bg-card, #fff);
  border-radius: 24px;
  padding: 20px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  color: var(--text-primary, #333);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h3 { margin: 0; font-size: 18px; }
.close-btn { background: none; border: none; font-size: 20px; color: var(--text-secondary, #999); }

.action-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 12px;
  margin-bottom: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.action-btn.primary { background: var(--primary-color, #FFD54F); color: #5D4037; }
.action-btn.secondary { background: var(--bg-body, #f5f5f5); color: var(--text-secondary, #666); }

.bottom-nav-wrapper {
  position: sticky;
  bottom: 0;
  z-index: 100;
}
</style>
