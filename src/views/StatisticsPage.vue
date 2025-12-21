<template>
  <div class="statistics-page">
    <!-- 内容区域 -->
    <div class="content-wrapper">
    <!-- 页面标题和筛选器 -->
    <div class="stats-header">
      <h2>{{ t('统计页面') }}</h2>
      <div class="filter-container">
        <div class="filter-group">
          <label>{{ t('时间范围') }}:</label>
          <select v-model="selectedTimeRange" @change="updateStats">
            <option value="7d">{{ t('最近7天') }}</option>
            <option value="30d">{{ t('最近30天') }}</option>
            <option value="3m">{{ t('最近3个月') }}</option>
            <option value="1y">{{ t('最近1年') }}</option>
            <option value="all">{{ t('全部') }}</option>
          </select>
        </div>
        <div class="filter-group">
          <label>{{ t('交易类型') }}:</label>
          <select v-model="selectedTransactionType" @change="updateStats">
            <option value="all">{{ t('全部') }}</option>
            <option value="income">{{ t('收入') }}</option>
            <option value="expense">{{ t('支出') }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 数据汇总卡片 -->
    <div class="stats-summary">
      <div class="summary-card income">
        <div class="summary-label">{{ t('总收入') }}</div>
        <div class="summary-value">¥{{ summary.totalIncome.toFixed(2) }}</div>
      </div>
      <div class="summary-card expense">
        <div class="summary-label">{{ t('总支出') }}</div>
        <div class="summary-value">¥{{ summary.totalExpense.toFixed(2) }}</div>
      </div>
      <div class="summary-card balance">
        <div class="summary-label">{{ t('结余') }}</div>
        <div class="summary-value">¥{{ summary.balance.toFixed(2) }}</div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="stats-charts">
      <!-- 饼图：消费类别占比 -->
      <div class="chart-section">
        <div class="chart-header">
          <h3>{{ t('消费类别占比') }}</h3>
          <select v-model="pieChartType" @change="updateStats">
            <option value="expense">{{ t('支出') }}</option>
            <option value="income">{{ t('收入') }}</option>
          </select>
        </div>
        <div ref="pieChartRef" class="chart-container"></div>
      </div>

      <!-- 柱状图：月度收支趋势 -->
      <div class="chart-section">
        <h3>{{ t('月度收支趋势') }}</h3>
        <div ref="barChartRef" class="chart-container"></div>
      </div>

      <!-- 折线图：收支变化曲线 -->
      <div class="chart-section">
        <h3>{{ t('收支变化曲线') }}</h3>
        <div ref="lineChartRef" class="chart-container"></div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <div class="loading-text">{{ t('数据加载中...') }}</div>
    </div>

    <!-- 数据为空状态 -->
    <div v-if="!loading && transactions.length === 0" class="empty-state">
      <div class="empty-icon">📋</div>
      <div class="empty-text">{{ t('还没有交易记录') }}</div>
      <div class="empty-hint">{{ t('点击下方按钮开始记账吧') }}</div>
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
import { ref, onMounted, watch, inject, computed } from 'vue'
import * as echarts from 'echarts'
import BottomNavigation from '../components/BottomNavigation.vue'

// 注入翻译函数和store
const t = inject('t')
const store = inject('store')

// 交易数据 - 从store获取
const transactions = computed(() => store.state.transactions)

// 筛选条件
const selectedTimeRange = ref('30d')
const selectedTransactionType = ref('all')
const pieChartType = ref('expense')

// 汇总数据
const summary = ref({
  totalIncome: 0,
  totalExpense: 0,
  balance: 0
})

// 加载状态
const loading = ref(false)

// 图表引用
const pieChartRef = ref(null)
const barChartRef = ref(null)
const lineChartRef = ref(null)

// 图表实例
let pieChart = null
let barChart = null
let lineChart = null

// 初始化图表
const initCharts = () => {
  // 初始化饼图
  if (pieChartRef.value) {
    pieChart = echarts.init(pieChartRef.value)
  }
  
  // 初始化柱状图
  if (barChartRef.value) {
    barChart = echarts.init(barChartRef.value)
  }
  
  // 初始化折线图
  if (lineChartRef.value) {
    lineChart = echarts.init(lineChartRef.value)
  }
  
  // 窗口大小变化时，调整图表大小
  window.addEventListener('resize', () => {
    pieChart?.resize()
    barChart?.resize()
    lineChart?.resize()
  })
}

// 更新统计数据
const updateStats = () => {
  loading.value = true
  
  // 模拟加载延迟
  setTimeout(() => {
    // 计算汇总数据
    calculateSummary()
    
    // 更新图表
    updatePieChart()
    updateBarChart()
    updateLineChart()
    
    loading.value = false
  }, 300)
}

// 计算汇总数据
const calculateSummary = () => {
  const filteredTransactions = filterTransactions()
  
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  
  summary.value = {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense
  }
}

// 筛选交易数据
const filterTransactions = () => {
  let filtered = [...transactions.value]
  
  // 按时间范围筛选
  const now = new Date()
  let startTime = new Date(0) // 1970-01-01
  
  switch (selectedTimeRange.value) {
    case '7d':
      startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case '30d':
      startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    case '3m':
      startTime = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
      break
    case '1y':
      startTime = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
      break
    default:
      // 全部数据
      break
  }
  
  filtered = filtered.filter(t => {
    const transactionDate = new Date(t.date)
    return transactionDate >= startTime
  })
  
  // 按交易类型筛选
  if (selectedTransactionType.value !== 'all') {
    filtered = filtered.filter(t => t.type === selectedTransactionType.value)
  }
  
  return filtered
}

// 更新饼图
const updatePieChart = () => {
  if (!pieChart) return
  
  const filteredTransactions = filterTransactions()
  const chartType = pieChartType.value
  
  // 按类别分组
  const categoryData = {}  
  filteredTransactions
    .filter(t => t.type === chartType)
    .forEach(t => {
      if (!categoryData[t.category]) {
        categoryData[t.category] = 0
      }
      categoryData[t.category] += t.amount
    })
  
  // 转换为ECharts所需格式
  const seriesData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value
  }))
  
  // 饼图配置
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'horizontal',
        bottom: 10,
        top: 'auto',
        left: 'center',
        type: 'scroll',
        pageButtonPosition: 'end',
        pageTextStyle: {
          color: '#666'
        },
        formatter: '{name}'
      },
      series: [
        {
          name: chartType === 'income' ? t('收入类别') : t('支出类别'),
        type: 'pie',
        radius: ['35%', '65%'],
        center: ['50%', '45%'],
        data: seriesData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          },
          scale: true
        },
        label: {
          show: true,
          formatter: '{d}%',
          fontSize: 12,
          color: '#333'
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 10
        }
      }
    ]
  }
  
  pieChart.setOption(option)
}

// 更新柱状图
const updateBarChart = () => {
  if (!barChart) return
  
  const filteredTransactions = filterTransactions()
  
  // 按月份分组
  const monthlyData = {}
  filteredTransactions.forEach(t => {
    const month = t.date.substring(0, 7) // YYYY-MM
    if (!monthlyData[month]) {
      monthlyData[month] = {
        income: 0,
        expense: 0
      }
    }
    monthlyData[month][t.type] += t.amount
  })
  
  // 转换为ECharts所需格式
  const months = Object.keys(monthlyData).sort()
  const incomeData = months.map(month => monthlyData[month].income)
  const expenseData = months.map(month => monthlyData[month].expense)
  
  // 柱状图配置
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: [t('收入'), t('支出')],
        bottom: 0
      },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: months,
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '收入',
        type: 'bar',
        data: incomeData,
        itemStyle: {
          color: '#4caf50'
        }
      },
      {
        name: '支出',
        type: 'bar',
        data: expenseData,
        itemStyle: {
          color: '#f44336'
        }
      }
    ]
  }
  
  barChart.setOption(option)
}

// 更新折线图
const updateLineChart = () => {
  if (!lineChart) return
  
  const filteredTransactions = filterTransactions()
  
  // 按日期分组
  const dailyData = {}
  filteredTransactions.forEach(t => {
    if (!dailyData[t.date]) {
      dailyData[t.date] = {
        income: 0,
        expense: 0
      }
    }
    dailyData[t.date][t.type] += t.amount
  })
  
  // 转换为ECharts所需格式
  const dates = Object.keys(dailyData).sort()
  const incomeData = dates.map(date => dailyData[date].income)
  const expenseData = dates.map(date => dailyData[date].expense)
  
  // 折线图配置
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: [t('收入'), t('支出')],
        bottom: 0
      },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '收入',
        type: 'line',
        data: incomeData,
        smooth: true,
        itemStyle: {
          color: '#4caf50'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(76, 175, 80, 0.5)' },
            { offset: 1, color: 'rgba(76, 175, 80, 0.1)' }
          ])
        }
      },
      {
        name: '支出',
        type: 'line',
        data: expenseData,
        smooth: true,
        itemStyle: {
          color: '#f44336'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(244, 67, 54, 0.5)' },
            { offset: 1, color: 'rgba(244, 67, 54, 0.1)' }
          ])
        }
      }
    ]
  }
  
  lineChart.setOption(option)
}

// 监听窗口大小变化，调整图表大小
window.addEventListener('resize', () => {
  pieChart?.resize()
  barChart?.resize()
  lineChart?.resize()
})

// 监听store数据变化，更新统计
onMounted(() => {
  // 订阅交易数据变化
  store.subscribe('transactions', () => {
    updateStats()
  })
  
  // 订阅分类数据变化
  store.subscribe('categories', () => {
    updateStats()
  })
  
  initCharts()
  updateStats()
})



// 处理导航事件
const handleNavigate = (itemId) => {
  // 如果点击的是中间的记账按钮，可以在这里添加相应的处理逻辑
  if (itemId === 'add') {
    // 这里可以添加显示记账表单的逻辑
    console.log('点击了记账按钮')
  }
}
</script>

<style scoped>
.statistics-page {
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
  padding: 20px;
  padding-bottom: 60px; /* 为底部导航预留空间 */
}

/* 隐藏滚动条 */
.content-wrapper::-webkit-scrollbar {
  display: none;
}

.statistics-page {
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

/* 页面标题和筛选器 */
.stats-header {
  margin-bottom: 20px;
}

.stats-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.filter-container {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-size: 14px;
  color: #666;
}

.filter-group select {
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

/* 数据汇总卡片 */
.stats-summary {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.summary-card {
  flex: 1;
  padding: 16px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.summary-card.income {
  border-left: 4px solid #4caf50;
}

.summary-card.expense {
  border-left: 4px solid #f44336;
}

.summary-card.balance {
  border-left: 4px solid #2196f3;
}

.summary-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.summary-value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

/* 图表区域 */
.stats-charts {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  gap: 24px;
  display: flex;
  flex-direction: column;
}

/* 隐藏滚动条 */
.stats-charts::-webkit-scrollbar {
  display: none;
}

.chart-section {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.chart-header select {
  padding: 6px 10px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

.chart-container {
  width: 100%;
  height: 350px;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .chart-container {
    height: 300px;
  }
}

/* 加载状态 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #667eea;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 16px;
  color: #666;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: #999;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  margin-bottom: 8px;
  color: #666;
}

.empty-hint {
  font-size: 14px;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .stats-header h2 {
    font-size: 20px;
  }
  
  .filter-container {
    flex-direction: column;
    gap: 12px;
  }
  
  .stats-summary {
    flex-direction: column;
  }
  
  .chart-container {
    height: 250px;
  }
  
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>