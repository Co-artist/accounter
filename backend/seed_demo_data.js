const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./database/models/User');
const Transaction = require('./database/models/Transaction');
const Category = require('./database/models/Category');
const Budget = require('./database/models/Budget');

// Load env vars
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/acconuter');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  try {
    // 1. Create Demo User
    const username = 'demo';
    const password = 'password123';
    
    // Check if user exists
    let user = await User.findOne({ username });
    
    if (user) {
      console.log('Demo user exists, cleaning up old data for this user...');
      await Transaction.deleteMany({ user: user._id });
      await Category.deleteMany({ user: user._id });
      await Budget.deleteMany({ user: user._id });
    } else {
      console.log('Creating new demo user...');
      user = await User.create({
        username,
        password
      });
    }

    const userId = user._id;

    // 2. Create Categories
    console.log('Creating categories...');
    const expenseCategories = [
      { name: '餐饮', icon: '🍔', color: '#FF5722' },
      { name: '交通', icon: '🚗', color: '#2196F3' },
      { name: '购物', icon: '🛍️', color: '#E91E63' },
      { name: '娱乐', icon: '🎮', color: '#9C27B0' },
      { name: '居住', icon: '🏠', color: '#795548' },
      { name: '医疗', icon: '💊', color: '#F44336' },
      { name: '教育', icon: '📚', color: '#3F51B5' },
    ];

    const incomeCategories = [
      { name: '工资', icon: '💰', color: '#4CAF50' },
      { name: '兼职', icon: '💼', color: '#8BC34A' },
      { name: '理财', icon: '📈', color: '#009688' },
      { name: '礼金', icon: '🧧', color: '#FFC107' },
    ];

    // Insert categories
    for (const cat of expenseCategories) {
      await Category.create({ ...cat, type: 'expense', user: userId });
    }
    for (const cat of incomeCategories) {
      await Category.create({ ...cat, type: 'income', user: userId });
    }

    // 3. Create Transactions (Historical Data)
    console.log('Generating transactions...');
    const transactions = [];
    const now = new Date();
    
    // Helper to random date within last N days
    const randomDate = (days) => {
      const date = new Date();
      date.setDate(now.getDate() - Math.floor(Math.random() * days));
      return date;
    };

    // Generate last 3 months data
    // Month 1 (Current Month)
    for (let i = 0; i < 15; i++) {
        transactions.push({
            user: userId,
            type: 'expense',
            amount: Math.floor(Math.random() * 200) + 20, // 20-220
            category: expenseCategories[Math.floor(Math.random() * expenseCategories.length)].name,
            date: randomDate(30),
            note: '日常消费'
        });
    }
    // Income for this month
    transactions.push({
        user: userId,
        type: 'income',
        amount: 8000,
        category: '工资',
        date: new Date(now.getFullYear(), now.getMonth(), 5), // 5th of this month
        note: '发工资啦'
    });

    // Month 2 (Last Month)
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    for (let i = 0; i < 10; i++) {
        const d = new Date(lastMonth);
        d.setDate(Math.floor(Math.random() * 28) + 1);
        transactions.push({
            user: userId,
            type: 'expense',
            amount: Math.floor(Math.random() * 300) + 50,
            category: expenseCategories[Math.floor(Math.random() * expenseCategories.length)].name,
            date: d,
            note: '上月消费'
        });
    }
    transactions.push({
        user: userId,
        type: 'income',
        amount: 8000,
        category: '工资',
        date: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 5),
        note: '上月工资'
    });

    await Transaction.insertMany(transactions);

    // 4. Create Budgets
    console.log('Setting budgets...');
    await Budget.create({
      user: userId,
      category: '餐饮',
      icon: '🍔',
      amount: 2000,
      period: 'monthly',
      type: 'expense'
    });
    
    await Budget.create({
      user: userId,
      category: '交通',
      icon: '🚗',
      amount: 500,
      period: 'monthly',
      type: 'expense'
    });

    console.log('Data seeded successfully!');
    console.log('-----------------------------------');
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log('-----------------------------------');
    
    process.exit();
  } catch (error) {
    console.error(`Error seeding data: ${error}`);
    process.exit(1);
  }
};

seedData();
