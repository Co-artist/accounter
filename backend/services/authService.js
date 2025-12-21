import jwt from 'jsonwebtoken'
import jwtConfig from '../config/jwt.js'
import User from '../database/models/User.js'

// 生成JWT令牌
const generateToken = (id) => jwt.sign({ id }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn })

// 用户注册
const registerUser = async (username, password) => {
  // 检查用户是否存在
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error('Username already exists');
  }

  // 随机分配一个猫头鹰头像 (owl-1 到 owl-6)
  const randomAvatarId = `owl-${Math.floor(Math.random() * 6) + 1}`;

  // 创建新用户 (密码会在 save 前自动加密)
  const user = await User.create({
    username,
    password,
    avatar: randomAvatarId
  });

  return {
    _id: user._id,
    username: user.username,
    avatar: user.avatar || randomAvatarId, // Fallback if avatar not set in schema yet? But we didn't add avatar to User schema!
    token: generateToken(user._id)
  };
}

// 用户登录
const loginUser = async (username, password) => {
  // 查找用户
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error('Invalid username or password');
  }

  // 验证密码
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new Error('Invalid username or password');
  }

  return {
    _id: user._id,
    username: user.username,
    avatar: user.avatar || 'owl-1', // Default avatar if not present
    token: generateToken(user._id)
  };
}

// 获取当前用户
const getCurrentUser = async (userId) => {
  const user = await User.findById(userId).select('-password'); // 不返回密码
  if (!user) {
    throw new Error('User not found');
  }
  
  return {
    _id: user._id,
    username: user.username,
    avatar: user.avatar || 'owl-1',
    createdAt: user.createdAt
  };
}

const findUserById = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) return null;
  
  return {
    id: user._id,
    username: user.username,
    avatar: user.avatar || 'owl-1',
    createdAt: user.createdAt
  };
}

export { registerUser, loginUser, getCurrentUser, findUserById }
