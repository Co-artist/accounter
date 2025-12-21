import { ref, reactive, computed, watch } from 'vue'

// 初始化数据
const initializeData = () => {
  // 从localStorage加载数据，如果没有则使用默认数据
  const loadFromStorage = (key, defaultValue) => {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : defaultValue
  }

  // 默认交易数据
  const defaultTransactions = [
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

  // 默认分类数据
  const defaultCategories = [
    { id: '1', name: '工资', icon: '💰', type: 'income', color: '#4caf50', usageCount: 12, amountRatio: 65 },
    { id: '2', name: '餐饮', icon: '🍴', type: 'expense', color: '#f44336', usageCount: 45, amountRatio: 30 },
    { id: '3', name: '交通', icon: '🚗', type: 'expense', color: '#2196f3', usageCount: 23, amountRatio: 15 },
    { id: '4', name: '购物', icon: '🛒', type: 'expense', color: '#ff9800', usageCount: 18, amountRatio: 25 },
    { id: '5', name: '娱乐', icon: '🎮', type: 'expense', color: '#9c27b0', usageCount: 9, amountRatio: 10 },
    { id: '6', name: '房租', icon: '🏠', type: 'expense', color: '#3f51b5', usageCount: 1, amountRatio: 40 },
    { id: '7', name: '水电费', icon: '💡', type: 'expense', color: '#00bcd4', usageCount: 3, amountRatio: 5 },
    { id: '8', name: '奖金', icon: '🎁', type: 'income', color: '#8bc34a', usageCount: 2, amountRatio: 20 },
    { id: '9', name: '投资', icon: '📈', type: 'income', color: '#ffeb3b', usageCount: 5, amountRatio: 15 }
  ]

  // 默认预算数据
  const defaultBudgets = [
    {
      id: '1',
      category: '餐饮',
      icon: '🍴',
      amount: 2000,
      used: 1200,
      usagePercentage: 60,
      period: 'monthly',
      type: 'expense'
    },
    {
      id: '2',
      category: '交通',
      icon: '🚗',
      amount: 500,
      used: 250,
      usagePercentage: 50,
      period: 'monthly',
      type: 'expense'
    },
    {
      id: '3',
      category: '购物',
      icon: '🛒',
      amount: 1000,
      used: 800,
      usagePercentage: 80,
      period: 'monthly',
      type: 'expense'
    }
  ]

  return {
    transactions: loadFromStorage('transactions', defaultTransactions),
    categories: loadFromStorage('categories', defaultCategories),
    budgets: loadFromStorage('budgets', defaultBudgets)
  }
}

// 创建数据存储
const store = {
  // 响应式数据
  state: reactive(initializeData()),
  
  // 数据缓存
  cache: {
    stats: {
      totalIncome: null,
      totalExpense: null,
      balance: null,
      transactionCount: null,
      monthlyIncome: null,
      monthlyExpense: null
    }
  },

  // 订阅者管理
  subscribers: new Map(),

  // 订阅数据变化
  subscribe(key, callback) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set())
    }
    this.subscribers.get(key).add(callback)
    
    // 返回取消订阅函数
    return () => {
      this.subscribers.get(key).delete(callback)
    }
  },

  // 发布数据变化
  publish(key, data) {
    if (this.subscribers.has(key)) {
      this.subscribers.get(key).forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error('Subscriber error:', error)
        }
      })
    }
  },

  // 保存数据到localStorage
  saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data))
  },

  // 清除统计缓存
  clearStatsCache() {
    this.cache.stats = {
      totalIncome: null,
      totalExpense: null,
      balance: null,
      transactionCount: null,
      monthlyIncome: null,
      monthlyExpense: null
    }
  },

  // 交易相关方法
  transactions: {
    // 添加交易
    add(transaction) {
      store.state.transactions.push(transaction)
      store.saveToStorage('transactions', store.state.transactions)
      store.publish('transactions', store.state.transactions)
      store.publish('update', { type: 'transaction_added', data: transaction })
      store.clearStatsCache() // 清除统计缓存
      store.updateCategoryUsage()
    },

    // 更新交易
    update(id, updatedTransaction) {
      const index = store.state.transactions.findIndex(t => t.id === id)
      if (index !== -1) {
        const oldTransaction = store.state.transactions[index]
        store.state.transactions[index] = updatedTransaction
        store.saveToStorage('transactions', store.state.transactions)
        store.publish('transactions', store.state.transactions)
        store.publish('update', { type: 'transaction_updated', data: updatedTransaction, oldData: oldTransaction })
        store.clearStatsCache() // 清除统计缓存
        store.updateCategoryUsage()
      }
    },

    // 删除交易
    delete(id) {
      const index = store.state.transactions.findIndex(t => t.id === id)
      if (index !== -1) {
        const deletedTransaction = store.state.transactions[index]
        store.state.transactions.splice(index, 1)
        store.saveToStorage('transactions', store.state.transactions)
        store.publish('transactions', store.state.transactions)
        store.publish('update', { type: 'transaction_deleted', data: deletedTransaction })
        store.clearStatsCache() // 清除统计缓存
        store.updateCategoryUsage()
      }
    },

    // 获取所有交易
    getAll() {
      return store.state.transactions
    }
  },

  // 分类相关方法
  categories: {
    // 添加分类
    add(category) {
      store.state.categories.push(category)
      store.saveToStorage('categories', store.state.categories)
      store.publish('categories', store.state.categories)
      store.publish('update', { type: 'category_added', data: category })
    },

    // 更新分类
    update(id, updatedCategory) {
      const index = store.state.categories.findIndex(c => c.id === id)
      if (index !== -1) {
        store.state.categories[index] = updatedCategory
        store.saveToStorage('categories', store.state.categories)
        store.publish('categories', store.state.categories)
        store.publish('update', { type: 'category_updated', data: updatedCategory })
      }
    },

    // 删除分类
    delete(id) {
      const index = store.state.categories.findIndex(c => c.id === id)
      if (index !== -1) {
        const deletedCategory = store.state.categories[index]
        store.state.categories.splice(index, 1)
        store.saveToStorage('categories', store.state.categories)
        store.publish('categories', store.state.categories)
        store.publish('update', { type: 'category_deleted', data: deletedCategory })
      }
    },

    // 获取所有分类
    getAll() {
      return store.state.categories
    },

    // 获取指定类型的分类
    getByType(type) {
      return store.state.categories.filter(category => category.type === type)
    }
  },

  // 预算相关方法
  budgets: {
    // 添加预算
    add(budget) {
      store.state.budgets.push(budget)
      store.saveToStorage('budgets', store.state.budgets)
      store.publish('budgets', store.state.budgets)
      store.publish('update', { type: 'budget_added', data: budget })
    },

    // 更新预算
    update(id, updatedBudget) {
      const index = store.state.budgets.findIndex(b => b.id === id)
      if (index !== -1) {
        store.state.budgets[index] = updatedBudget
        store.saveToStorage('budgets', store.state.budgets)
        store.publish('budgets', store.state.budgets)
        store.publish('update', { type: 'budget_updated', data: updatedBudget })
      }
    },

    // 删除预算
    delete(id) {
      const index = store.state.budgets.findIndex(b => b.id === id)
      if (index !== -1) {
        const deletedBudget = store.state.budgets[index]
        store.state.budgets.splice(index, 1)
        store.saveToStorage('budgets', store.state.budgets)
        store.publish('budgets', store.state.budgets)
        store.publish('update', { type: 'budget_deleted', data: deletedBudget })
      }
    },

    // 获取所有预算
    getAll() {
      return store.state.budgets
    },

    // 获取指定分类的预算
    getByCategory(category) {
      return store.state.budgets.find(budget => budget.category === category)
    },

    // 获取指定类型的预算
    getByType(type) {
      return store.state.budgets.filter(budget => budget.type === type)
    }
  },

  // 统计相关计算
  stats: {
    // 计算总收入
    getTotalIncome() {
      // 检查缓存
      if (store.cache.stats.totalIncome !== null) {
        return store.cache.stats.totalIncome
      }
      
      const result = store.state.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)
      
      // 缓存结果
      store.cache.stats.totalIncome = result
      return result
    },

    // 计算总支出
    getTotalExpense() {
      // 检查缓存
      if (store.cache.stats.totalExpense !== null) {
        return store.cache.stats.totalExpense
      }
      
      const result = store.state.transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
      
      // 缓存结果
      store.cache.stats.totalExpense = result
      return result
    },

    // 计算结余
    getBalance() {
      // 检查缓存
      if (store.cache.stats.balance !== null) {
        return store.cache.stats.balance
      }
      
      const result = this.getTotalIncome() - this.getTotalExpense()
      
      // 缓存结果
      store.cache.stats.balance = result
      return result
    },

    // 计算交易笔数
    getTransactionCount() {
      // 检查缓存
      if (store.cache.stats.transactionCount !== null) {
        return store.cache.stats.transactionCount
      }
      
      const result = store.state.transactions.length
      
      // 缓存结果
      store.cache.stats.transactionCount = result
      return result
    },

    // 计算本月收入
    getMonthlyIncome() {
      // 检查缓存
      if (store.cache.stats.monthlyIncome !== null) {
        return store.cache.stats.monthlyIncome
      }
      
      const currentMonth = new Date().toISOString().slice(0, 7)
      const result = store.state.transactions
        .filter(t => t.type === 'income' && t.date.startsWith(currentMonth))
        .reduce((sum, t) => sum + t.amount, 0)
      
      // 缓存结果
      store.cache.stats.monthlyIncome = result
      return result
    },

    // 计算本月支出
    getMonthlyExpense() {
      // 检查缓存
      if (store.cache.stats.monthlyExpense !== null) {
        return store.cache.stats.monthlyExpense
      }
      
      const currentMonth = new Date().toISOString().slice(0, 7)
      const result = store.state.transactions
        .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
        .reduce((sum, t) => sum + t.amount, 0)
      
      // 缓存结果
      store.cache.stats.monthlyExpense = result
      return result
    }
  },

  // 更新分类使用情况
  updateCategoryUsage() {
    // 重置所有分类的使用次数
    store.state.categories.forEach(category => {
      category.usageCount = 0
    })

    // 计算每个分类的使用次数
    store.state.transactions.forEach(transaction => {
      const category = store.state.categories.find(c => c.name === transaction.category)
      if (category) {
        category.usageCount++
      }
    })

    // 计算每个分类的金额占比
    const calculateRatio = (type) => {
      const transactions = store.state.transactions.filter(t => t.type === type)
      const total = transactions.reduce((sum, t) => sum + t.amount, 0)
      
      if (total === 0) {
        store.state.categories
          .filter(c => c.type === type)
          .forEach(c => {
            c.amountRatio = 0
          })
        return
      }

      // 按分类分组计算金额
      const categoryAmounts = {}
      transactions.forEach(t => {
        if (!categoryAmounts[t.category]) {
          categoryAmounts[t.category] = 0
        }
        categoryAmounts[t.category] += t.amount
      })

      // 更新每个分类的金额占比
      store.state.categories
        .filter(c => c.type === type)
        .forEach(c => {
          c.amountRatio = total > 0 ? Math.round((categoryAmounts[c.name] || 0) / total * 100) : 0
        })
    }

    calculateRatio('income')
    calculateRatio('expense')

    store.saveToStorage('categories', store.state.categories)
    store.publish('categories', store.state.categories)
  }
}

// 监听localStorage变化，实现跨页面数据同步
window.addEventListener('storage', (e) => {
  if (e.key === 'transactions') {
    store.state.transactions = JSON.parse(e.newValue || '[]')
    store.publish('transactions', store.state.transactions)
    store.publish('update', { type: 'storage_changed', key: 'transactions' })
    store.updateCategoryUsage()
  } else if (e.key === 'categories') {
    store.state.categories = JSON.parse(e.newValue || '[]')
    store.publish('categories', store.state.categories)
    store.publish('update', { type: 'storage_changed', key: 'categories' })
  } else if (e.key === 'budgets') {
    store.state.budgets = JSON.parse(e.newValue || '[]')
    store.publish('budgets', store.state.budgets)
    store.publish('update', { type: 'storage_changed', key: 'budgets' })
  }
})

// 初始化时更新分类使用情况
store.updateCategoryUsage()

export default store
