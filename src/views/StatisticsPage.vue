<template>
  <div class="statistics-page">
    <!-- 内容区域 -->
    <div class="content-wrapper" ref="swipeEl">
      <!-- 头部概览卡片 -->
      <div class="overview-card">
        <div class="card-header">
          <h2>{{ t('数据森林') }}</h2>
          <div class="month-selector">
            <button class="month-btn prev" @click="changeMonth(-1)">‹</button>
            <span class="current-month" @click="openMonthPicker">{{ currentMonthLabel }}</span>
            <input 
              type="month" 
              ref="monthPicker" 
              class="hidden-date-input"
              @change="handleDateChange"
            >
            <button class="month-btn next" @click="changeMonth(1)">›</button>
          </div>
        </div>
        
        <div class="overview-stats">
          <div class="stat-group">
            <span class="label">{{ t('总支出') }}</span>
            <span class="value expense">¥{{ summary.totalExpense.toFixed(2) }}</span>
          </div>
          <div class="divider"></div>
          <div class="stat-group">
            <span class="label">{{ t('总收入') }}</span>
            <span class="value income">¥{{ summary.totalIncome.toFixed(2) }}</span>
          </div>
          <div class="divider"></div>
          <div class="stat-group">
            <span class="label">{{ t('结余') }}</span>
            <span class="value balance">¥{{ summary.balance.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- 筛选器 (胶囊样式) -->
      <div class="filter-capsules">
        <button 
          v-for="range in timeRanges" 
          :key="range.value"
          class="capsule-btn"
          :class="{ active: selectedTimeRange === range.value }"
          @click="selectTimeRange(range.value)"
        >
          {{ range.label }}
        </button>
      </div>

      <!-- 图表区域 -->
      <div class="charts-grid">
        <!-- 消费类别占比 (饼图) -->
        <div class="chart-card">
          <div class="card-title">
            <span class="icon">🥧</span>
            <h3>{{ t('消费占比') }}</h3>
            <div class="type-toggle">
              <button 
                :class="{ active: pieChartType === 'expense' }" 
                @click="pieChartType = 'expense'; updateStats()"
              >{{ t('支出') }}</button>
              <button 
                :class="{ active: pieChartType === 'income' }" 
                @click="pieChartType = 'income'; updateStats()"
              >{{ t('收入') }}</button>
            </div>
          </div>
          <div ref="pieChartRef" class="chart-container"></div>
        </div>

        <!-- 月度趋势 (柱状图) -->
        <div class="chart-card">
          <div class="card-title">
            <span class="icon">📊</span>
            <h3>{{ t('收支趋势') }}</h3>
          </div>
          <div ref="barChartRef" class="chart-container"></div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="transactions.length === 0" class="empty-state">
        <div class="empty-illustration">🍃</div>
        <p>{{ t('森林里空空如也，快去记一笔吧~') }}</p>
      </div>
    </div>
    
    <!-- 底部导航 -->
    <div class="bottom-nav-wrapper">
      <BottomNavigation 
        active-item="statistics"
        @navigate="handleNavigate"
      />
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'StatisticsPage' })
import { ref, onMounted, watch, inject, computed, onActivated, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { attachSwipeNavigation } from '../utils/swipeNavigation'
import * as echarts from 'echarts'
import BottomNavigation from '../components/BottomNavigation.vue'

// 注入
const t = inject('t')
const store = inject('store')
const router = useRouter()
const swipeEl = ref(null)

// 状态
const transactions = computed(() => store.state.transactions)
const selectedTimeRange = ref('30d')
const pieChartType = ref('expense')
const currentDate = ref(new Date())
const monthPicker = ref(null)

// 选项配置
const timeRanges = [
  { label: '近7天', value: '7d' },
  { label: '近30天', value: '30d' },
  { label: '本年', value: '1y' },
  { label: '全部', value: 'all' }
]

// 汇总数据
const summary = ref({
  totalIncome: 0,
  totalExpense: 0,
  balance: 0
})

// 图表引用
const pieChartRef = ref(null)
const barChartRef = ref(null)
let pieChart = null
let barChart = null

// 月份显示
const currentMonthLabel = computed(() => {
  const y = currentDate.value.getFullYear()
  const m = currentDate.value.getMonth() + 1
  return t('{y}年{m}月', { y, m })
})

// 切换月份
const changeMonth = (delta) => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + delta)
  currentDate.value = newDate
  // 切换月份时，自动将筛选范围设为月度
  // selectedTimeRange.value = 'month' // 暂时不自动切换，保持原有逻辑或需要新增 'month' 类型
  updateStats()
}

// 打开日期选择器
const openMonthPicker = () => {
  if (monthPicker.value) {
    monthPicker.value.showPicker()
  }
}

// 处理日期选择
const handleDateChange = (event) => {
  const value = event.target.value
  if (value) {
    const [year, month] = value.split('-')
    const newDate = new Date(parseInt(year), parseInt(month) - 1, 1)
    currentDate.value = newDate
    updateStats()
  }
}

// 选择时间范围
const selectTimeRange = (range) => {
  selectedTimeRange.value = range
  updateStats()
}

// 初始化图表
const initCharts = () => {
  if (pieChartRef.value) pieChart = echarts.init(pieChartRef.value)
  if (barChartRef.value) barChart = echarts.init(barChartRef.value)
  
  window.addEventListener('resize', resizeCharts)
}

const resizeCharts = () => {
  pieChart?.resize()
  barChart?.resize()
}

// 核心统计逻辑
const updateStats = () => {
  calculateSummary()
  updatePieChart()
  updateBarChart()
}

// 计算汇总
const calculateSummary = () => {
  const filtered = filterTransactions()
  const income = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  
  summary.value = {
    totalIncome: income,
    totalExpense: expense,
    balance: income - expense
  }
}

// 筛选逻辑
const filterTransactions = () => {
  let filtered = [...transactions.value]
  const now = new Date()
  let startTime = new Date(0)

  // 如果 selectedTimeRange 是特定范围，则使用范围
  // 如果用户手动切换了月份，我们应该展示该月的数据
  // 这里逻辑稍微有点冲突：是优先展示“筛选器”还是“当前月份”？
  // 通常：点击胶囊 -> 切换到对应范围（忽略当前月份显示）
  // 点击月份 -> 切换到该月数据（且胶囊应取消选中或新增‘本月’状态）
  
  // 为了简单，我们约定：如果 selectedTimeRange 是 'all'，则不过滤（或按月份过滤？）
  // 修正逻辑：
  // 1. 如果胶囊选中了 '7d', '30d', '1y'，则按范围过滤，忽略 currentMonth
  // 2. 如果要支持按月查看，应该加一个 'month' 选项，或者当用户点击月份时，清除 selectedTimeRange
  
  if (selectedTimeRange.value) {
    switch (selectedTimeRange.value) {
      case '7d': startTime = new Date(now - 7 * 86400000); break;
      case '30d': startTime = new Date(now - 30 * 86400000); break;
      case '1y': startTime = new Date(now.getFullYear(), 0, 1); break;
      case 'all': break; // 显示全部
    }
    
    if (selectedTimeRange.value !== 'all') {
      filtered = filtered.filter(t => new Date(t.date) >= startTime)
    }
  } else {
    // 如果没有选胶囊（即按月查看模式）
    const y = currentDate.value.getFullYear()
    const m = currentDate.value.getMonth()
    filtered = filtered.filter(t => {
      const d = new Date(t.date)
      return d.getFullYear() === y && d.getMonth() === m
    })
  }

  return filtered
}

// 修改 selectTimeRange，点击月份时清空它
const onMonthChange = () => {
  selectedTimeRange.value = '' // 清空胶囊选择，进入月视图模式
}

// 修正 changeMonth 和 handleDateChange
// ... 在 changeMonth 和 handleDateChange 中调用 onMonthChange()

// 更新饼图
const updatePieChart = () => {
  if (!pieChart) return
  const filtered = filterTransactions()
  const type = pieChartType.value
  
  const dataMap = {}
  filtered.filter(t => t.type === type).forEach(t => {
    dataMap[t.category] = (dataMap[t.category] || 0) + t.amount
  })
  
  const data = Object.entries(dataMap).map(([name, value]) => ({ name: t(name), value }))
  
  pieChart.setOption({
    color: ['#FFD54F', '#FF7043', '#4CAF50', '#2196F3', '#9C27B0', '#FF9800'],
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '50%'],
      itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      data
    }]
  })
}

// 更新柱状图
const updateBarChart = () => {
  if (!barChart) return
  const filtered = filterTransactions()
  // 按日聚合
  const dailyMap = {}
  filtered.forEach(t => {
    const d = t.date.substring(5) // MM-DD
    if (!dailyMap[d]) dailyMap[d] = { income: 0, expense: 0 }
    dailyMap[d][t.type] += t.amount
  })
  
  const dates = Object.keys(dailyMap).sort().slice(-7) // 只展示最近7个有数据的日子，避免拥挤
  
  barChart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: dates, axisLine: { show: false }, axisTick: { show: false } },
    yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#eee' } } },
    series: [
      { name: t('收入'), type: 'bar', stack: 'total', data: dates.map(d => dailyMap[d].income), itemStyle: { color: '#4CAF50', borderRadius: [0, 0, 4, 4] }, barWidth: 12 },
      { name: t('支出'), type: 'bar', stack: 'total', data: dates.map(d => -dailyMap[d].expense), itemStyle: { color: '#FF7043', borderRadius: [4, 4, 0, 0] }, barWidth: 12 }
    ]
  })
}

const handleNavigate = () => {}

onMounted(async () => {
  store.subscribe('transactions', updateStats)
  await nextTick()
  initCharts()
  updateStats()
  attachSwipeNavigation(swipeEl.value, 'statistics', router)
})

onActivated(() => resizeCharts())
</script>

<style scoped>
.statistics-page {
  width: 100%;
  height: 100%;
  background: var(--bg-body, #f5f5f5);
  display: flex;
  flex-direction: column;
}

/* 隐藏的日期输入框 */
.hidden-date-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  opacity: 0;
  visibility: hidden;
  border: none;
  padding: 0;
  margin: 0;
  z-index: -1;
}

/* 概览卡片 */
.overview-card {
  background: var(--primary-gradient, linear-gradient(135deg, #FFD54F 0%, #FFA726 100%));
  border-radius: 24px;
  padding: 24px;
  color: var(--text-on-primary, #ffffff);
  box-shadow: 0 8px 24px rgba(255, 167, 38, 0.25);
  margin-bottom: 24px;
}

/* 暗色模式下概览卡片适配 */
:global([data-theme="dark"]) .overview-card {
  background: linear-gradient(135deg, #24283b 0%, #1a1b26 100%);
  color: #FFD54F;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 213, 79, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: nowrap; /* 禁止换行 */
}

.card-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  white-space: nowrap; /* 禁止标题换行 */
  flex-shrink: 0; /* 禁止挤压标题 */
}

.overview-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-group .label {
  font-size: 12px;
  opacity: 0.9;
  margin-bottom: 4px;
}

.stat-group .value {
  font-size: 20px;
  font-weight: 700;
  /* font-family: monospace; 移除 monospace 以匹配设计 */
}

.divider {
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.3);
}

.month-selector {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 4px 8px;
  position: relative;
}

.month-btn {
  background: none;
  border: none;
  color: inherit; /* 继承父级颜色，在卡片中通常为深色或适配后的颜色 */
  font-size: 18px;
  padding: 0 8px;
  cursor: pointer;
}

.current-month {
  font-size: 14px;
  font-weight: 600;
  min-width: 60px;
  text-align: center;
  cursor: pointer;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.5); /* 适配深色背景 */
}

/* 筛选胶囊 */
.capsule-btn {
  border: none;
  background: var(--bg-card, #fff);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  color: var(--text-secondary, #666);
  white-space: nowrap;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.capsule-btn.active {
  background: var(--primary-color, #FFD54F);
  color: #5D4037; /* 选中态文字颜色固定为深色以保证对比度 */
  font-weight: 600;
  transform: translateY(-1px);
}

/* 图表卡片 */
.chart-card {
  background: var(--bg-card, #fff);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.04);
  color: var(--text-primary, #333);
  border: 1px solid rgba(0,0,0,0.02);
}

.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: nowrap;
}

.card-title h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  flex: 1;
  margin-left: 8px;
  color: var(--text-primary, #333);
  white-space: nowrap;
}

.type-toggle {
  display: flex;
  background: rgba(0,0,0,0.05);
  padding: 3px;
  border-radius: 16px;
  flex-shrink: 0;
}

.type-toggle button {
  border: none;
  background: none;
  padding: 6px 16px;
  border-radius: 14px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary, #666);
  transition: all 0.3s ease;
  cursor: pointer;
}

.type-toggle button.active {
  background: var(--bg-card, #fff);
  color: var(--text-primary, #333);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  font-weight: 600;
}

.chart-container {
  height: 220px;
  width: 100%;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 0;
  color: #999;
}

.empty-illustration {
  font-size: 48px;
  margin-bottom: 16px;
}

/* 底部导航占位 */
.bottom-nav-wrapper {
  position: sticky;
  bottom: 0;
  z-index: 100;
}
</style>
