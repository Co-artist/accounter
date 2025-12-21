// 数据导出工具

/**
 * 将数据导出为JSON格式
 * @param {Array} data - 要导出的数据数组
 * @param {string} filename - 导出的文件名
 */
export const exportToJSON = (data, filename) => {
  try {
    // 创建Blob对象
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    // 创建下载链接
    const url = URL.createObjectURL(blob);
    // 创建a标签并触发下载
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    // 清理
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('导出JSON失败:', error);
    return false;
  }
};

/**
 * 将数据导出为CSV格式
 * @param {Array} data - 要导出的数据数组
 * @param {string} filename - 导出的文件名
 */
export const exportToCSV = (data, filename) => {
  try {
    if (!data || data.length === 0) {
      console.error('没有数据可导出');
      return false;
    }
    
    // 获取表头
    const headers = Object.keys(data[0]);
    
    // 转换数据行
    const csvContent = [
      // 添加表头
      headers.join(','),
      // 添加数据行
      ...data.map(row => {
        return headers.map(header => {
          // 处理包含逗号、引号或换行符的数据
          const cell = row[header] || '';
          const stringCell = typeof cell === 'string' ? cell : String(cell);
          return `"${stringCell.replace(/"/g, '""')}"`;
        }).join(',');
      })
    ].join('\n');
    
    // 创建Blob对象
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    // 创建下载链接
    const url = URL.createObjectURL(blob);
    // 创建a标签并触发下载
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    // 清理
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('导出CSV失败:', error);
    return false;
  }
};

/**
 * 导出交易记录
 * @param {Array} transactions - 交易记录数据
 * @param {string} format - 导出格式，支持'csv'和'json'
 * @param {Object} options - 导出选项，如日期范围等
 */
export const exportTransactions = (transactions, format = 'csv', options = {}) => {
  try {
    let filteredTransactions = [...transactions];
    
    // 根据日期范围过滤
    if (options.startDate && options.endDate) {
      filteredTransactions = filteredTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        const startDate = new Date(options.startDate);
        const endDate = new Date(options.endDate);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
    }
    
    // 导出数据
    const filename = 'acconuter_transactions';
    if (format === 'csv') {
      return exportToCSV(filteredTransactions, filename);
    } else {
      return exportToJSON(filteredTransactions, filename);
    }
  } catch (error) {
    console.error('导出交易记录失败:', error);
    return false;
  }
};

/**
 * 导出分类数据
 * @param {Array} categories - 分类数据
 * @param {string} format - 导出格式，支持'csv'和'json'
 */
export const exportCategories = (categories, format = 'csv') => {
  try {
    const filename = 'acconuter_categories';
    if (format === 'csv') {
      return exportToCSV(categories, filename);
    } else {
      return exportToJSON(categories, filename);
    }
  } catch (error) {
    console.error('导出分类数据失败:', error);
    return false;
  }
};

/**
 * 导出预算数据
 * @param {Array} budgets - 预算数据
 * @param {string} format - 导出格式，支持'csv'和'json'
 */
export const exportBudgets = (budgets, format = 'csv') => {
  try {
    const filename = 'acconuter_budgets';
    if (format === 'csv') {
      return exportToCSV(budgets, filename);
    } else {
      return exportToJSON(budgets, filename);
    }
  } catch (error) {
    console.error('导出预算数据失败:', error);
    return false;
  }
};

/**
 * 导出所有数据
 * @param {Object} data - 包含所有数据的对象，如{ transactions, categories, budgets }
 * @param {string} format - 导出格式，支持'csv'和'json'
 * @param {Object} options - 导出选项
 */
export const exportAllData = (data, format = 'csv', options = {}) => {
  try {
    const { transactions, categories, budgets } = data;
    
    // 导出交易记录
    exportTransactions(transactions, format, options);
    
    // 导出分类数据
    exportCategories(categories, format);
    
    // 导出预算数据
    exportBudgets(budgets, format);
    
    return true;
  } catch (error) {
    console.error('导出所有数据失败:', error);
    return false;
  }
};
