<template>
  <div class="category-page">
    <!-- 内容区域 -->
    <div class="content-wrapper">
    <!-- 顶部导航栏 -->
    <header class="category-header">
      <h1 class="header-title">{{ t('分类管理') }}</h1>
      <button class="add-btn" @click="showAddForm" :title="t('添加')">
        <span class="add-icon">➕</span>
      </button>
    </header>

    <!-- 分类类型切换 -->
    <div class="category-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.value"
        class="tab-btn"
        :class="{ active: activeTab === tab.value }"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 搜索与筛选 -->
    <div class="search-filter-container">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <span class="search-icon">🔍</span>
        <input 
          type="text" 
          class="search-input"
          v-model="searchQuery"
          :placeholder="t('搜索分类名称')"
          maxlength="20"
        >
        <button 
          v-if="searchQuery" 
          class="clear-btn"
          @click="searchQuery = ''"
        >
          ✕
        </button>
      </div>
      
      <!-- 筛选选项 -->
      <div class="filter-options">
        <button 
          class="filter-btn"
          :class="{ active: sortBy === 'default' }"
          @click="sortBy = 'default'"
        >
          {{ t('默认') }}
        </button>
        <button 
          class="filter-btn"
          :class="{ active: sortBy === 'usageCount' }"
          @click="sortBy = 'usageCount'"
        >
          {{ t('使用频率') }}
        </button>
        <button 
          class="filter-btn"
          :class="{ active: sortBy === 'amountRatio' }"
          @click="sortBy = 'amountRatio'"
        >
          {{ t('金额占比') }}
        </button>
        <button 
          class="filter-btn"
          :class="{ active: sortBy === 'name' }"
          @click="sortBy = 'name'"
        >
          {{ t('名称') }}
        </button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-section">
      <h3 class="section-title">{{ t('分类统计') }}</h3>
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-label">{{ t('总分类数') }}</div>
          <div class="stat-value">{{ totalCategories }}</div>
        </div>
        <div class="stat-card income">
          <div class="stat-label">{{ t('收入分类') }}</div>
          <div class="stat-value">{{ incomeCategoriesCount }}</div>
        </div>
        <div class="stat-card expense">
          <div class="stat-label">{{ t('支出分类') }}</div>
          <div class="stat-value">{{ expenseCategoriesCount }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">{{ t('平均使用率') }}</div>
          <div class="stat-value">{{ averageUsage }}次</div>
        </div>
      </div>
      
      <!-- 图表区域 -->
      <div class="charts-section">
        <!-- 饼图：分类占比 -->
        <div class="chart-container">
          <h4 class="chart-title">{{ t('分类金额占比') }}</h4>
          <!-- 直接使用div作为图表容器，移除额外的包装器 -->
          <div 
            ref="pieChartRef" 
            class="pie-chart" 
            :class="activeTab === 'all' ? 'hidden' : ''"
          ></div>
          <div v-if="activeTab === 'all'" class="chart-placeholder">
            <div class="placeholder-icon">📊</div>
            <div class="placeholder-text">{{ t('请选择收入或支出分类查看占比') }}</div>
          </div>
        </div>
        
        <!-- 柱状图：使用频率 -->
        <div class="chart-container">
          <h4 class="chart-title">{{ t('分类使用频率') }}</h4>
          <div ref="barChartRef" class="chart"></div>
        </div>
      </div>
    </div>

    <!-- 分类列表 -->
    <div class="category-list">
      <div 
        v-for="category in filteredCategories" 
        :key="category.id"
        class="category-card"
        :class="category.type"
        draggable="true"
        @dragstart="dragStart($event, category)"
        @dragover.prevent
        @dragenter.prevent
        @drop="drop($event, category)"
        :style="{ opacity: draggingId === category.id ? '0.5' : '1' }"
      >
        <div class="card-left">
          <span class="category-icon">{{ category.icon }}</span>
          <div class="category-info">
            <div class="category-name">{{ category.name }}</div>
            <div class="category-stats">
              <span class="usage-count">{{ t('使用') }} {{ category.usageCount }} {{ t('次') }}</span>
              <span class="amount-ratio">{{ category.amountRatio }}%</span>
            </div>
          </div>
        </div>
        <div class="card-right">
          <button 
            class="action-btn edit"
            @click="editCategory(category)"
            :title="t('编辑')"
          >
            ✏️
          </button>
          <button 
            class="action-btn delete"
            @click="deleteCategory(category)"
            :title="t('删除')"
          >
            🗑️
          </button>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-if="filteredCategories.length === 0" class="empty-state">
        <div class="empty-icon">📋</div>
        <div class="empty-text">{{ t('暂无分类') }}</div>
        <div class="empty-hint">{{ t('点击右上角添加按钮创建分类') }}</div>
      </div>
    </div>

    <!-- 分类编辑表单 -->
    <div class="form-overlay" v-if="showForm" @click="closeForm"></div>
    <div class="category-form" v-if="showForm">
      <div class="form-header">
        <h3>{{ editingCategory ? t('编辑分类') : t('添加分类') }}</h3>
        <button class="form-close" @click="closeForm">✕</button>
      </div>
      <div class="form-content">
        <!-- 分类类型 -->
        <div class="form-group">
          <label class="form-label">{{ t('分类类型') }}</label>
          <div class="type-selector">
            <button 
              class="type-btn"
              :class="{ active: form.type === 'income' }"
              @click="form.type = 'income'"
            >
              {{ t('收入') }}
            </button>
            <button 
              class="type-btn"
              :class="{ active: form.type === 'expense' }"
              @click="form.type = 'expense'"
            >
              {{ t('支出') }}
            </button>
          </div>
        </div>
        
        <!-- 分类名称 -->
        <div class="form-group">
          <label class="form-label">{{ t('分类名称') }}</label>
          <input 
            type="text" 
            class="form-input"
            v-model="form.name"
            :placeholder="t('请输入分类名称')"
            maxlength="20"
          >
        </div>
        
        <!-- 分类图标 -->
        <div class="form-group">
          <label class="form-label">{{ t('分类图标') }}</label>
          <div class="icon-selector">
            <button 
              v-for="icon in availableIcons" 
              :key="icon"
              class="icon-btn"
              :class="{ active: form.icon === icon }"
              @click="form.icon = icon"
            >
              {{ icon }}
            </button>
          </div>
        </div>
        
        <!-- 分类颜色 -->
        <div class="form-group">
          <label class="form-label">{{ t('分类颜色') }}</label>
          <div class="color-selector">
            <button 
              v-for="color in availableColors" 
              :key="color"
              class="color-btn"
              :class="{ active: form.color === color }"
              :style="{ backgroundColor: color }"
              @click="form.color = color"
            ></button>
          </div>
        </div>
      </div>
      <div class="form-footer">
        <button class="form-btn cancel" @click="closeForm">{{ t('取消') }}</button>
        <button 
          class="form-btn submit" 
          @click="saveCategory"
          :disabled="!form.name"
        >
          {{ t('保存') }}
        </button>
      </div>
    </div>
    </div>
    
    <!-- 底部导航 -->
    <div class="bottom-nav-wrapper">
      <BottomNavigation 
        active-item="category"
        @navigate="handleNavigate"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, inject } from 'vue'
import * as echarts from 'echarts'
import BottomNavigation from '../components/BottomNavigation.vue'

// 注入翻译函数和store
const t = inject('t')
const store = inject('store')

// 分类类型标签
const tabs = [
  { value: 'all', label: t('全部') },
  { value: 'income', label: t('收入') },
  { value: 'expense', label: t('支出') }
]

// 状态管理
const activeTab = ref('all')
const showForm = ref(false)
const editingCategory = ref(null)
const searchQuery = ref('')
const sortBy = ref('default')
const draggingId = ref(null)

// 图表引用
const pieChartRef = ref(null)
const barChartRef = ref(null)

// 图表实例
let pieChart = null
let barChart = null

// 可用图标
const availableIcons = [
  '💰', '🎁', '📈', '💼', '📊', '🧧', '↩️', '🌟', '💸',
  '🍴', '🚗', '🛒', '🎮', '🏠', '💡', '🏥', '📚', '👗',
  '✈️', '🎉', '📱', '🐶', '🏃', '📝', '💳', '📱', '🖥️'
]

// 可用颜色
const availableColors = [
  '#4caf50', '#f44336', '#2196f3', '#ff9800', '#9c27b0',
  '#3f51b5', '#00bcd4', '#8bc34a', '#ffeb3b', '#795548'
]

// 表单数据
const form = ref({
  type: 'expense',
  name: '',
  icon: '📝',
  color: '#3f51b5'
})

// 从store获取分类数据
const categories = computed(() => store.state.categories)

// 统计计算属性
const totalCategories = computed(() => categories.value.length)
const incomeCategoriesCount = computed(() => 
  categories.value.filter(cat => cat.type === 'income').length
)
const expenseCategoriesCount = computed(() => 
  categories.value.filter(cat => cat.type === 'expense').length
)
const averageUsage = computed(() => {
  const totalUsage = categories.value.reduce((sum, cat) => sum + cat.usageCount, 0)
  return totalCategories.value > 0 ? Math.round(totalUsage / totalCategories.value) : 0
})

// 图表数据计算
const pieChartData = computed(() => {
  if (activeTab.value === 'all') return []
  
  const type = activeTab.value
  return categories.value
    .filter(cat => cat.type === type)
    .map(cat => ({
      name: cat.name,
      value: cat.amountRatio
    }))
})

const barChartData = computed(() => {
  const data = categories.value
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, 8) // 只显示前8个分类
  
  return {
    categories: data.map(cat => cat.name),
    usageCounts: data.map(cat => cat.usageCount)
  }
})

// 初始化图表
const initCharts = () => {
  // 确保容器已经渲染完成并有正确的尺寸
  setTimeout(() => {
    // 检查容器的实际尺寸
    if (pieChartRef.value) {
      console.log('Pie chart container dimensions:', {
        width: pieChartRef.value.clientWidth,
        parentWidth: pieChartRef.value.parentElement.clientWidth
      })
      // 移除手动设置的尺寸，让图表自动适应
      pieChartRef.value.style.width = ''
      pieChartRef.value.style.height = ''
      pieChart = echarts.init(pieChartRef.value)
    }
    
    if (barChartRef.value) {
      barChartRef.value.style.width = ''
      barChartRef.value.style.height = ''
      barChart = echarts.init(barChartRef.value)
    }
    
    // 监听窗口大小变化，调整图表大小
    window.addEventListener('resize', () => {
      pieChart?.resize()
      barChart?.resize()
    })
    
    // 更新图表数据
    updateCharts()
  }, 200)
}

// 更新图表
const updateCharts = () => {
  // 饼图配置 - 完整版本
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}%'
      },
      legend: {
        orient: 'horizontal',
        bottom: 10,
        left: 'center',
        type: 'scroll',
        textStyle: {
          fontSize: 10,
          overflow: 'visible'
        },
        itemGap: 15,
        padding: [0, 10, 0, 10],
        itemWidth: 10,
        itemHeight: 10
      },
      series: [
        {
          name: '分类占比',
          type: 'pie',
          radius: ['35%', '70%'],
          center: ['50%', '45%'],
          data: pieChartData.value,
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 12,
              fontWeight: 'bold'
            }
          }
        }
      ]
    }
    
    pieChart.setOption(option)
    // 确保图表适应容器大小
    setTimeout(() => {
      pieChart.resize()
    }, 0)
  
  // 更新柱状图
  if (barChart) {
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: '{b}: {c}次'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '20%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: barChartData.value.categories,
        axisLabel: {
          rotate: 45,
          fontSize: 10
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 10
        }
      },
      series: [
        {
          name: '使用频率',
          type: 'bar',
          data: barChartData.value.usageCounts,
          itemStyle: {
            borderRadius: [4, 4, 0, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#667eea' },
              { offset: 1, color: '#764ba2' }
            ])
          }
        }
      ]
    }
    
    barChart.setOption(option)
  }
}

// 监听相关数据变化，更新图表
watch(
  [pieChartData, barChartData, activeTab],
  () => {
    updateCharts()
  },
  { deep: true }
)

// 组件挂载时初始化图表
onMounted(() => {
  initCharts()
})

// 过滤后的分类
const filteredCategories = computed(() => {
  // 1. 按标签过滤
  let result = activeTab.value === 'all' 
    ? categories.value 
    : categories.value.filter(category => category.type === activeTab.value)
  
  // 2. 按名称搜索
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(category => 
      category.name.toLowerCase().includes(query)
    )
  }
  
  // 3. 排序
  result = [...result].sort((a, b) => {
    switch (sortBy.value) {
      case 'usageCount':
        return b.usageCount - a.usageCount
      case 'amountRatio':
        return b.amountRatio - a.amountRatio
      case 'name':
        return a.name.localeCompare(b.name)
      default: // 'default'
        return 0 // 保持原顺序
    }
  })
  
  return result
})

// 打开添加分类表单
const showAddForm = () => {
  editingCategory.value = null
  resetForm()
  showForm.value = true
}

// 编辑分类
const editCategory = (category) => {
  editingCategory.value = category
  form.value = {
    type: category.type,
    name: category.name,
    icon: category.icon,
    color: category.color
  }
  showForm.value = true
}

// 删除分类
const deleteCategory = (category) => {
  if (confirm(`确定要删除分类 "${category.name}" 吗？`)) {
    store.categories.delete(category.id)
  }
}

// 保存分类
const saveCategory = () => {
  if (!form.value.name.trim()) return
  
  const categoryData = {
    id: editingCategory.value?.id || Date.now().toString(),
    name: form.value.name,
    icon: form.value.icon,
    type: form.value.type,
    color: form.value.color,
    usageCount: editingCategory.value?.usageCount || 0,
    amountRatio: editingCategory.value?.amountRatio || 0
  }
  
  if (editingCategory.value) {
    // 编辑现有分类
    store.categories.update(categoryData.id, categoryData)
  } else {
    // 添加新分类
    store.categories.add(categoryData)
  }
  
  closeForm()
}

// 关闭表单
const closeForm = () => {
  showForm.value = false
  editingCategory.value = null
  resetForm()
}

// 重置表单
const resetForm = () => {
  form.value = {
    type: 'expense',
    name: '',
    icon: '📝',
    color: '#3f51b5'
  }
}

// 拖拽排序功能
// 拖拽开始
const dragStart = (event, category) => {
  draggingId.value = category.id
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', category.id)
}

// 拖拽结束
const drop = (event, targetCategory) => {
  const draggedId = event.dataTransfer.getData('text/plain')
  if (draggedId === targetCategory.id) return
  
  // 找到拖拽元素和目标元素在原始数组中的索引
  const draggedIndex = categories.value.findIndex(cat => cat.id === draggedId)
  const targetIndex = categories.value.findIndex(cat => cat.id === targetCategory.id)
  
  if (draggedIndex === -1 || targetIndex === -1) return
  
  // 执行拖拽排序
  const draggedCategory = categories.value[draggedIndex]
  categories.value.splice(draggedIndex, 1)
  categories.value.splice(targetIndex, 0, draggedCategory)
  
  // 重置拖拽状态
  draggingId.value = null
}

// 处理导航事件
const handleNavigate = (itemId) => {
  // 如果点击的是中间的记账按钮，可以在这里添加相应的处理逻辑
  // 例如跳转到记账页面或显示记账表单
  if (itemId === 'add') {
    // 这里可以添加显示记账表单的逻辑
    console.log('点击了记账按钮')
  }
}
</script>

<style scoped>
/* 全局样式 */
.category-page {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
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

/* 底部导航固定在内容底部 */
.bottom-nav-wrapper {
  position: sticky;
  bottom: 0;
  z-index: 100;
  flex-shrink: 0;
}

.category-page {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 顶部导航栏 */
.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.header-title {
  font-size: 20px;
  font-weight: 600;
  color: #333333;
  margin: 0;
}

.add-btn {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background-color: #667eea;
  color: white;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  transition: all 0.2s ease;
}

.add-btn:active {
  transform: scale(0.95);
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
}

/* 分类类型切换 */
.category-tabs {
  display: flex;
  background-color: #ffffff;
  margin: 0 16px 16px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

/* 搜索与筛选容器 */
.search-filter-container {
  padding: 0 16px 16px;
}

/* 搜索栏 */
.search-bar {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 24px;
  padding: 8px 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  margin-bottom: 12px;
}

.search-icon {
  font-size: 16px;
  color: #999;
  margin-right: 8px;
}

.search-input {
  flex: 1;
  border: none;
  font-size: 14px;
  padding: 8px 0;
  outline: none;
  background: transparent;
  color: #333;
}

.search-input::placeholder {
  color: #999;
}

.clear-btn {
  background: none;
  border: none;
  font-size: 16px;
  color: #999;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.clear-btn:active {
  background-color: rgba(0, 0, 0, 0.2);
  color: #333;
  transform: scale(0.9);
}

/* 筛选选项 */
.filter-options {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 4px 0;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}

.filter-options::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}

.filter-btn {
  flex: 0 0 auto;
  padding: 10px 18px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  background-color: white;
  color: #666;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  min-width: 80px;
  text-align: center;
}

.filter-btn:active {
  transform: scale(0.95);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.filter-btn.active {
  background-color: #667eea;
  border-color: #667eea;
  color: white;
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
}

/* 统计卡片样式 */
.stats-section {
  padding: 0 16px 16px;
  background-color: white;
  margin: 0 16px 16px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  padding: 16px 0 0 0;
  text-align: center;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.stat-card {
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 12px;
  text-align: center;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: #667eea;
}

.stat-card.income::before {
  background-color: #4caf50;
}

.stat-card.expense::before {
  background-color: #f44336;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

/* 图表区域样式 */
.charts-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 16px;
  width: 100%;
  margin: 0 auto;
}

.chart-container {
  background-color: #fafafa;
  border-radius: 12px;
  padding: 16px;
  position: relative;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.chart-title {
  font-size: 14px;
  font-weight: 500;
  color: #666;
  margin: 0 0 12px 0;
  text-align: center;
}

.chart {
  width: 100%;
  height: 250px;
  min-height: 250px;
  margin: 0 auto;
  display: block;
  position: relative;
  left: 0;
  right: 0;
}

.chart.hidden {
  display: none;
}

/* 饼图容器样式 */
.pie-chart {
  width: 100%;
  height: 250px;
  margin: 0 auto;
  display: block;
  position: relative;
}

.chart {  
  width: 100%;
  height: 250px;
  margin: 0 auto;
  display: block;
}

/* 图表占位符 */
.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* 与图表高度保持一致 */
  height: 220px;
  background-color: #f5f5f5;
  border-radius: 8px;
  color: #999;
}

.placeholder-icon {
  font-size: 40px;
  margin-bottom: 8px;
  opacity: 0.5;
}

.placeholder-text {
  font-size: 14px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .search-filter-container {
    padding: 0 12px 12px;
  }
  
  .search-bar {
    margin-bottom: 8px;
    padding: 6px 12px;
  }
  
  .search-input {
    font-size: 13px;
    padding: 6px 0;
  }
  
  .filter-btn {
    padding: 6px 12px;
    font-size: 11px;
  }
  
  /* 统计卡片响应式 */
  .stats-section {
    margin: 0 12px 12px;
    padding: 0 12px 12px;
  }
  
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-bottom: 12px;
  }
  
  .stat-card {
    padding: 12px;
  }
  
  .stat-label {
    font-size: 11px;
  }
  
  .stat-value {
    font-size: 20px;
  }
  
  .chart {
    height: 220px;
    min-height: 220px;
  }
  
  .chart-placeholder {
    height: 220px;
    min-height: 220px;
  }
  
  .chart-title {
    font-size: 12px;
  }
}

.tab-btn {
  flex: 1;
  padding: 12px;
  border: none;
  background-color: transparent;
  color: #666666;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn.active {
  background-color: #667eea;
  color: white;
}

/* 分类列表 */
.category-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px 16px;
  -webkit-overflow-scrolling: touch;
}

/* 隐藏滚动条 */
.category-list::-webkit-scrollbar {
  display: none;
}

/* 分类卡片 */
.category-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.category-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: #666666;
}

.category-card.income::before {
  background-color: #4caf50;
}

.category-card.expense::before {
  background-color: #f44336;
}

.card-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.category-icon {
  font-size: 28px;
}

.category-info {
  flex: 1;
}

.category-name {
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 4px;
}

.category-stats {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #999999;
}

.card-right {
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

.action-btn:active {
  transform: scale(0.95); /* 点击时的反馈效果 */
  background-color: rgba(0, 0, 0, 0.1);
}

.action-btn.edit:active {
  background-color: rgba(255, 215, 0, 0.2);
}

.action-btn.delete:active {
  background-color: rgba(255, 0, 0, 0.1);
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 16px;
  color: #666666;
  margin-bottom: 8px;
}

.empty-hint {
  font-size: 14px;
  color: #999999;
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

.category-form {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
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
  border-bottom: 1px solid #f0f0f0;
}

.form-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333333;
}

.form-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999999;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.form-close:hover {
  background-color: rgba(0, 0, 0, 0.1);
  color: #333333;
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
  color: #333333;
  margin-bottom: 8px;
}

/* 分类类型选择 */
.type-selector {
  display: flex;
  gap: 12px;
}

.type-btn {
  flex: 1;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background-color: #f9f9f9;
  color: #666666;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.type-btn.active {
  border-color: #667eea;
  background-color: #667eea;
  color: white;
}

/* 输入框 */
.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  font-size: 16px;
  color: #333333;
  background-color: #f9f9f9;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* 图标选择器 */
.icon-selector {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12px;
  margin: 16px 0;
  max-height: 140px;
  overflow-y: auto;
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 12px;
}

.icon-btn {
  width: 44px;
  height: 44px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: white;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn.active {
  border-color: #667eea;
  background-color: #667eea;
  color: white;
}

/* 颜色选择器 */
.color-selector {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 12px;
  margin: 16px 0;
}

.color-btn {
  width: 40px;
  height: 40px;
  border: 2px solid transparent;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.color-btn.active {
  border-color: #667eea;
  transform: scale(1.2);
}

/* 表单按钮 */
.form-footer {
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
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
  background-color: #f5f5f5;
  color: #666666;
}

.form-btn.cancel:hover {
  background-color: #e0e0e0;
}

.form-btn.submit {
  background-color: #667eea;
  color: white;
}

.form-btn.submit:hover:not(:disabled) {
  background-color: #5568d3;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.form-btn.submit:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.6;
}

/* 动画效果 */
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
  .category-page {
    padding-bottom: 0;
  }
  
  .category-header {
    padding: 12px 16px;
  }
  
  .header-title {
    font-size: 18px;
  }
  
  .add-btn {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
  
  .category-tabs {
    margin: 0 12px 12px;
  }
  
  .tab-btn {
    padding: 10px;
    font-size: 13px;
  }
  
  .category-list {
    padding: 0 12px 12px;
  }
  
  .category-card {
    padding: 12px;
    margin-bottom: 8px;
  }
  
  .category-icon {
    font-size: 24px;
  }
  
  .category-name {
    font-size: 15px;
  }
  
  .category-stats {
    font-size: 11px;
    gap: 8px;
  }
  
  .category-form {
    padding: 16px;
    border-radius: 16px 16px 0 0;
  }
  
  .form-header {
    margin-bottom: 16px;
    padding-bottom: 8px;
  }
  
  .form-header h3 {
    font-size: 16px;
  }
  
  .form-group {
    margin-bottom: 16px;
  }
  
  .form-btn {
    padding: 12px;
    font-size: 15px;
  }
  
  .icon-selector {
    grid-template-columns: repeat(7, 1fr);
    gap: 10px;
    max-height: 100px;
  }
  
  .icon-btn {
    width: 36px;
    height: 36px;
    font-size: 18px;
  }
  
  .color-selector {
    grid-template-columns: repeat(8, 1fr);
    gap: 10px;
  }
  
  .color-btn {
    width: 28px;
    height: 28px;
  }
}
</style>
