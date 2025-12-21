// 测试store核心功能
import { describe, it, expect, beforeEach } from 'vitest'
import store from '../store'

describe('Store核心功能测试', () => {
  beforeEach(() => {
    // 在每个测试前清除缓存
    store.clearStatsCache()
  })

  describe('交易管理', () => {
    it('应该能够添加交易', () => {
      const initialCount = store.state.transactions.length
      
      const newTransaction = {
        id: `test-${Date.now()}`,
        type: 'income',
        amount: 100,
        category: '测试收入',
        date: new Date().toISOString().split('T')[0],
        note: '测试交易'
      }
      
      store.transactions.add(newTransaction)
      
      expect(store.state.transactions.length).toBe(initialCount + 1)
      expect(store.state.transactions).toContainEqual(newTransaction)
    })

    it('应该能够删除交易', () => {
      // 先添加一个测试交易
      const testTransaction = {
        id: `test-${Date.now()}`,
        type: 'expense',
        amount: 50,
        category: '测试支出',
        date: new Date().toISOString().split('T')[0],
        note: '测试交易'
      }
      
      store.transactions.add(testTransaction)
      const initialCount = store.state.transactions.length
      
      // 删除交易
      store.transactions.delete(testTransaction.id)
      
      expect(store.state.transactions.length).toBe(initialCount - 1)
      expect(store.state.transactions.find(t => t.id === testTransaction.id)).toBeUndefined()
    })
  })

  describe('统计功能', () => {
    it('应该能够正确计算总收入', () => {
      // 清除现有交易，添加测试交易
      store.state.transactions = [
        {
          id: 'test-income-1',
          type: 'income',
          amount: 1000,
          category: '工资',
          date: new Date().toISOString().split('T')[0]
        },
        {
          id: 'test-income-2',
          type: 'income',
          amount: 500,
          category: '奖金',
          date: new Date().toISOString().split('T')[0]
        },
        {
          id: 'test-expense-1',
          type: 'expense',
          amount: 300,
          category: '餐饮',
          date: new Date().toISOString().split('T')[0]
        }
      ]
      
      // 清除缓存
      store.clearStatsCache()
      
      const totalIncome = store.stats.getTotalIncome()
      expect(totalIncome).toBe(1500)
    })

    it('应该能够正确计算总支出', () => {
      // 使用相同的测试数据
      const totalExpense = store.stats.getTotalExpense()
      expect(totalExpense).toBe(300)
    })

    it('应该能够正确计算结余', () => {
      // 使用相同的测试数据
      const balance = store.stats.getBalance()
      expect(balance).toBe(1200)
    })

    it('应该能够正确计算交易笔数', () => {
      const count = store.stats.getTransactionCount()
      expect(count).toBe(3)
    })

    it('应该使用缓存优化性能', () => {
      // 第一次调用，计算结果并缓存
      const result1 = store.stats.getTotalIncome()
      
      // 模拟修改数据
      store.state.transactions.push({
        id: 'test-income-3',
        type: 'income',
        amount: 200,
        category: '额外收入',
        date: new Date().toISOString().split('T')[0]
      })
      
      // 第二次调用，应该返回缓存结果，因为还没有清除缓存
      const result2 = store.stats.getTotalIncome()
      expect(result1).toBe(result2)
      
      // 清除缓存后再次调用，应该返回新结果
      store.clearStatsCache()
      const result3 = store.stats.getTotalIncome()
      expect(result3).toBe(result1 + 200)
    })
  })

  describe('分类管理', () => {
    it('应该能够获取收入分类', () => {
      const incomeCategories = store.categories.getByType('income')
      expect(incomeCategories).toBeInstanceOf(Array)
      incomeCategories.forEach(category => {
        expect(category.type).toBe('income')
      })
    })

    it('应该能够获取支出分类', () => {
      const expenseCategories = store.categories.getByType('expense')
      expect(expenseCategories).toBeInstanceOf(Array)
      expenseCategories.forEach(category => {
        expect(category.type).toBe('expense')
      })
    })
  })
})
