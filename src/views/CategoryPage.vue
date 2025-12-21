<template>
  <div class="category-page">
    <div class="content-wrapper" ref="swipeEl">
      <!-- 头部 -->
      <header class="page-header">
        <h1 class="header-title">{{ t('分类收藏架') }}</h1>
        <button class="add-fab" @click="showAddForm" :title="t('添加')">
          <span class="icon">➕</span>
        </button>
      </header>

      <!-- 类型切换 (胶囊) -->
      <div class="type-capsules">
        <button 
          v-for="tab in tabs" 
          :key="tab.value"
          class="capsule-btn"
          :class="{ active: activeTab === tab.value }"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- 分类网格 -->
      <div class="category-grid">
        <div 
          v-for="category in filteredCategories" 
          :key="category.id"
          class="category-item"
          :class="[category.type, { editing: isEditing }]"
          :style="{ '--cat-color': category.color }"
          @click="handleCategoryClick(category)"
          @contextmenu.prevent="isEditing = !isEditing"
        >
          <div class="icon-box">
            <span class="emoji">{{ category.icon }}</span>
            <button v-if="isEditing" class="delete-badge" @click.stop="deleteCategory(category)">✕</button>
          </div>
          <span class="name">{{ t(category.name) }}</span>
        </div>

        <!-- 添加卡片 (当列表为空或在最后) -->
        <div class="category-item add-placeholder" @click="showAddForm">
          <div class="icon-box dashed">
            <span class="emoji">➕</span>
          </div>
          <span class="name">{{ t('添加') }}</span>
        </div>
      </div>

      <!-- 提示 -->
      <p class="hint-text" v-if="!isEditing">{{ t('长按分类可进入编辑模式') }}</p>
      <button v-else class="done-edit-btn" @click="isEditing = false">{{ t('完成编辑') }}</button>
    </div>

    <!-- 底部导航 -->
    <div class="bottom-nav-wrapper">
      <BottomNavigation 
        active-item="category"
        @navigate="handleNavigate"
      />
    </div>

    <!-- 编辑表单弹窗 -->
    <div class="modal-overlay" v-if="showForm" @click="closeForm">
      <div class="modal-card" @click.stop>
        <div class="modal-header">
          <h3>{{ editingCategory ? t('编辑藏品') : t('新藏品') }}</h3>
          <button class="close-btn" @click="closeForm">✕</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>{{ t('类型') }}</label>
            <div class="type-selector">
              <button 
                class="type-option" 
                :class="{ active: form.type === 'expense' }"
                @click="form.type = 'expense'"
              >{{ t('支出') }}</button>
              <button 
                class="type-option" 
                :class="{ active: form.type === 'income' }"
                @click="form.type = 'income'"
              >{{ t('收入') }}</button>
            </div>
          </div>

          <div class="form-group">
            <label>{{ t('名称') }}</label>
            <input 
              type="text" 
              v-model="form.name" 
              class="form-input" 
              :placeholder="t('给它起个名字')" 
              maxlength="10"
            >
          </div>

          <div class="form-group">
            <label>{{ t('图标') }}</label>
            <div class="icon-grid">
              <button 
                v-for="icon in availableIcons" 
                :key="icon"
                class="icon-btn"
                :class="{ active: form.icon === icon }"
                @click="form.icon = icon"
              >{{ icon }}</button>
            </div>
          </div>

          <div class="form-group">
            <label>{{ t('颜色') }}</label>
            <div class="color-grid">
              <button 
                v-for="color in availableColors" 
                :key="color"
                class="color-dot"
                :class="{ active: form.color === color }"
                :style="{ backgroundColor: color }"
                @click="form.color = color"
              ></button>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-primary" @click="saveCategory">{{ t('保存') }}</button>
        </div>
      </div>
    </div>
    
    <!-- 确认删除弹窗 -->
    <ConfirmModal
      v-model:visible="confirmModalVisible"
      :title="t('确认删除')"
      :message="t('确定要丢弃这个藏品吗？', { name: deleteTargetCategory?.name || '' })"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup>
defineOptions({ name: 'CategoryPage' })
import { ref, computed, onMounted, inject, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { attachSwipeNavigation } from '../utils/swipeNavigation'
import BottomNavigation from '../components/BottomNavigation.vue'
import ConfirmModal from '../components/ConfirmModal.vue'

// 注入
const t = inject('t')
const store = inject('store')
const router = useRouter()
const swipeEl = ref(null)

// 状态
const activeTab = ref('expense') // 默认显示支出
const showForm = ref(false)
const isEditing = ref(false)
const editingCategory = ref(null)
const confirmModalVisible = ref(false)
const deleteTargetCategory = ref(null)

// 标签
const tabs = [
  { value: 'expense', label: t('支出') },
  { value: 'income', label: t('收入') }
]

// 数据
const categories = computed(() => store.state.categories)
const filteredCategories = computed(() => {
  return categories.value.filter(cat => cat.type === activeTab.value)
})

// 表单
const form = ref({ type: 'expense', name: '', icon: '🍕', color: '#FF7043' })

const availableIcons = ['🍕', '🚌', '🏠', '👗', '🎮', '💊', '📚', '🎁', '💰', '✈️', '🐶', '📱', '🔧', '🎤', '🏋️']
const availableColors = ['#FF7043', '#FFD54F', '#4CAF50', '#2196F3', '#9C27B0', '#E91E63', '#795548', '#607D8B']

// 方法
const handleCategoryClick = (category) => {
  if (isEditing.value) {
    editCategory(category)
  } else {
    // 点击反馈动画，或者进入该分类详情（如果有）
  }
}

const showAddForm = () => {
  editingCategory.value = null
  form.value = { type: activeTab.value, name: '', icon: '🍕', color: availableColors[0] }
  showForm.value = true
}

const editCategory = (category) => {
  editingCategory.value = category
  form.value = { ...category }
  showForm.value = true
}

const deleteCategory = (category) => {
  deleteTargetCategory.value = category
  confirmModalVisible.value = true
}

const confirmDelete = () => {
  if (deleteTargetCategory.value) {
    store.categories.delete(deleteTargetCategory.value.id)
    deleteTargetCategory.value = null
    // 如果删完了，自动退出编辑模式
    if (filteredCategories.value.length === 0) isEditing.value = false
  }
}

const cancelDelete = () => {
  deleteTargetCategory.value = null
}

const saveCategory = () => {
  if (!form.value.name.trim()) return
  
  const data = {
    id: editingCategory.value?.id || Date.now().toString(),
    ...form.value,
    usageCount: editingCategory.value?.usageCount || 0,
    amountRatio: editingCategory.value?.amountRatio || 0
  }
  
  if (editingCategory.value) {
    store.categories.update(data.id, data)
  } else {
    store.categories.add(data)
  }
  closeForm()
}

const closeForm = () => {
  showForm.value = false
}

const handleNavigate = () => {}

onMounted(() => {
  attachSwipeNavigation(swipeEl.value, 'category', router)
})
</script>

<style scoped>
.category-page {
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

/* 头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary, #333);
  margin: 0;
}

.add-fab {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--primary-color, #FFD54F);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 4px 12px rgba(255, 213, 79, 0.4);
  cursor: pointer;
  transition: transform 0.2s;
}

.add-fab:active {
  transform: scale(0.9);
}

/* 胶囊切换 */
.type-capsules {
  display: flex;
  background: var(--bg-card, #fff);
  padding: 4px;
  border-radius: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.capsule-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 20px;
  background: transparent;
  color: var(--text-secondary, #999);
  font-weight: 600;
  transition: all 0.2s;
}

.capsule-btn.active {
  background: var(--primary-color, #FFD54F);
  color: #5D4037; /* 选中文字固定深色 */
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* 分类网格 */
.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 8px;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  position: relative;
}

.icon-box {
  width: 56px;
  height: 56px;
  background: var(--bg-card, #fff);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border: 2px solid transparent;
  transition: all 0.2s;
  position: relative;
}

.category-item:active .icon-box {
  transform: scale(0.95);
}

/* 动态边框颜色 */
.category-item .icon-box {
  border-color: var(--cat-color, transparent);
  background: rgba(255, 255, 255, 0.8);
}

:global([data-theme="dark"]) .category-item .icon-box {
  background: rgba(255, 255, 255, 0.1);
}

.add-placeholder .icon-box.dashed {
  border: 2px dashed #ccc;
  background: transparent;
  color: #ccc;
}

.name {
  font-size: 12px;
  color: var(--text-primary, #666);
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

/* 编辑模式 */
.category-item.editing {
  animation: shake 0.3s infinite ease-in-out;
}

.delete-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #FF5252;
  color: white;
  border: 2px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  padding: 0;
}

@keyframes shake {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-2deg); }
  75% { transform: rotate(2deg); }
}

.hint-text {
  text-align: center;
  color: #999;
  font-size: 12px;
  margin-top: 32px;
}

.done-edit-btn {
  display: block;
  margin: 32px auto;
  padding: 8px 24px;
  border-radius: 20px;
  background: var(--primary-color, #FFD54F);
  border: none;
  font-weight: 600;
  color: #5D4037;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}

.modal-card {
  width: 80%;
  max-width: 320px;
  background: var(--bg-card, #fff);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  color: var(--text-primary, #333);
}

@keyframes popIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: var(--text-primary, #333);
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  color: var(--text-secondary, #999);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 12px;
  color: var(--text-secondary, #999);
  margin-bottom: 8px;
}

.type-selector {
  display: flex;
  background: var(--bg-body, #f5f5f5);
  border-radius: 12px;
  padding: 4px;
}

.type-option {
  flex: 1;
  padding: 8px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 14px;
  color: var(--text-secondary, #666);
}

.type-option.active {
  background: var(--bg-card, #fff);
  color: var(--text-primary, #333);
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.form-input {
  width: 100%;
  padding: 12px;
  background: var(--bg-body, #f5f5f5);
  border: none;
  border-radius: 12px;
  font-size: 16px;
  color: var(--text-primary, #333);
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-color, #eee);
  border-radius: 12px;
  background: var(--bg-card, #fff);
  font-size: 20px;
}

.icon-btn.active {
  border-color: var(--primary-color, #FFD54F);
  background: rgba(255, 213, 79, 0.2); /* 适配暗色模式下的高亮背景 */
}

.color-grid {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.color-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid transparent;
}

.color-dot.active {
  border-color: #333;
  transform: scale(1.1);
}

.btn-primary {
  width: 100%;
  padding: 14px;
  background: var(--primary-color, #FFD54F);
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 700;
  color: #5D4037;
}

.bottom-nav-wrapper {
  position: sticky;
  bottom: 0;
  z-index: 100;
}
</style>
