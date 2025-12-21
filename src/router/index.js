import { createRouter, createWebHistory } from 'vue-router'

// 静态导入登录和注册页面，避免切换时的白屏加载
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'

// 路由懒加载
const HomePage = () => import('../views/HomePage.vue')
const StatisticsPage = () => import('../views/StatisticsPage.vue')
const CategoryPage = () => import('../views/CategoryPage.vue')
const ProfilePage = () => import('../views/ProfilePage.vue')
const BudgetPage = () => import('../views/BudgetPage.vue')
const PrivacyPage = () => import('../views/PrivacyPage.vue')
const UserAgreement = () => import('../views/UserAgreement.vue')
const PrivacyPolicy = () => import('../views/PrivacyPolicy.vue')
const FeedbackPage = () => import('../views/FeedbackPage.vue')

const routes = [
  // 公共路由（无需登录）
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/user-agreement',
    name: 'userAgreement',
    component: UserAgreement,
    meta: { requiresAuth: false }
  },
  {
    path: '/privacy-policy',
    name: 'privacyPolicy',
    component: PrivacyPolicy,
    meta: { requiresAuth: false }
  },
  
  // 需要登录的路由
  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/statistics',
    name: 'statistics',
    component: StatisticsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/category',
    name: 'category',
    component: CategoryPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfilePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/budget',
    name: 'budget',
    component: BudgetPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: PrivacyPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/feedback',
    name: 'feedback',
    component: FeedbackPage,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')
  
  // 如果路由需要认证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 检查是否已登录
    if (!isAuthenticated) {
      // 未登录，跳转到登录页
      next({ name: 'login' })
    } else {
      // 已登录，继续
      next()
    }
  } else {
    // 无需认证的路由，直接继续
    next()
  }
})

export default router
