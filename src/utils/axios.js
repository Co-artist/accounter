import axios from 'axios';

// 创建axios实例
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001/api', // 后端API基础URL
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器 - 添加token
axiosInstance.interceptors.request.use(
  config => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理响应数据和错误
axiosInstance.interceptors.response.use(
  response => {
    // 只返回数据部分
    return response.data;
  },
  error => {
    // 处理响应错误
    if (error.response) {
      // 服务器返回错误状态码
      switch (error.response.status) {
        case 401:
          // 未授权 - 清除token并跳转到登录页
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          // 禁止访问
          console.error('Forbidden:', error.response.data.message);
          break;
        case 404:
          // 资源未找到
          console.error('Not found:', error.response.data.message);
          break;
        case 500:
          // 服务器错误
          console.error('Server error:', error.response.data.message);
          break;
        default:
          console.error('Error:', error.response.data.message);
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      console.error('Network error: No response received');
    } else {
      // 请求配置错误
      console.error('Request error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
