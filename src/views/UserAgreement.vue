<template>
  <div class="user-agreement-page">
    <!-- 内容区域 -->
    <div class="content-wrapper">
      <!-- 顶部导航栏 -->
      <header class="agreement-header">
        <h1 class="header-title">{{ t('用户协议') }}</h1>
        <button class="back-btn" @click="handleBack">
          <span class="back-icon">←</span>
        </button>
      </header>

      <!-- 协议内容区域 -->
      <div class="agreement-content">
        <div class="agreement-section">
          <h2 class="section-title">1. {{ t('协议的接受与修改') }}</h2>
          <p class="section-content">{{ t('欢迎使用我们的记账应用。通过访问或使用我们的服务，您同意接受本用户协议的全部条款和条件。我们保留随时修改、更新或变更本协议的权利，修改后的协议将在应用内公布，您继续使用服务即视为接受修改后的协议。') }}</p>
        </div>

        <div class="agreement-section">
          <h2 class="section-title">2. {{ t('用户注册与账户安全') }}</h2>
          <p class="section-content">{{ t('您需要创建一个账户才能使用我们的服务。您必须提供真实、准确的信息，并对您账户的所有活动负责。您应妥善保管账户密码，不得将账户转让或授权他人使用。') }}</p>
        </div>

        <div class="agreement-section">
          <h2 class="section-title">3. {{ t('服务内容') }}</h2>
          <p class="section-content">{{ t('我们提供记账、预算管理、统计分析等服务。我们有权根据业务发展需要调整服务内容，无需提前通知用户。') }}</p>
        </div>

        <div class="agreement-section">
          <h2 class="section-title">4. {{ t('用户行为规范') }}</h2>
          <p class="section-content">{{ t('您不得使用我们的服务从事任何违法违规活动，包括但不限于：侵犯他人知识产权、传播非法内容、进行欺诈活动等。违反规定的，我们有权终止您的账户。') }}</p>
        </div>

        <div class="agreement-section">
          <h2 class="section-title">5. {{ t('知识产权') }}</h2>
          <p class="section-content">{{ t('应用内的所有内容，包括但不限于文字、图片、音频、视频等，均受知识产权保护。未经授权，您不得复制、修改或分发这些内容。') }}</p>
        </div>

        <div class="agreement-section">
          <h2 class="section-title">6. {{ t('隐私政策') }}</h2>
          <p class="section-content">{{ t('我们重视您的隐私保护，将按照隐私政策处理您的个人信息。使用我们的服务即表示您同意我们按照隐私政策收集、使用和披露您的信息。') }}</p>
        </div>

        <div class="agreement-section">
          <h2 class="section-title">7. {{ t('免责声明') }}</h2>
          <p class="section-content">{{ t('我们尽力确保服务的稳定性和安全性，但不对服务的可用性、准确性或完整性做出任何明示或暗示的保证。对于因使用或无法使用我们的服务而造成的任何损失，我们不承担责任。') }}</p>
        </div>

        <div class="agreement-section">
          <h2 class="section-title">8. {{ t('协议的终止') }}</h2>
          <p class="section-content">{{ t('您可以随时停止使用我们的服务。我们有权在您违反本协议时终止您的账户，无需提前通知。') }}</p>
        </div>

        <div class="agreement-section">
          <h2 class="section-title">9. {{ t('法律适用与争议解决') }}</h2>
          <p class="section-content">{{ t('本协议受中华人民共和国法律管辖。如发生争议，双方应友好协商解决；协商不成的，任何一方均有权向有管辖权的人民法院提起诉讼。') }}</p>
        </div>

        <div class="agreement-section">
          <h2 class="section-title">10. {{ t('其他条款') }}</h2>
          <p class="section-content">{{ t('本协议构成双方之间的完整协议，取代之前的所有口头或书面协议。如本协议的任何条款被认定为无效或不可执行，不影响其他条款的效力。') }}</p>
        </div>

        <div class="agreement-footer">
          <p class="footer-text">{{ t('最后更新日期：2024年12月6日') }}</p>
        </div>
      </div>
    </div>
    
    <!-- 底部导航 -->
    <div class="bottom-nav-wrapper">
      <BottomNavigation 
        active-item="profile"
        @navigate="handleNavigate"
      />
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import { useRouter } from 'vue-router'
import BottomNavigation from '../components/BottomNavigation.vue'

// 获取路由实例
const router = useRouter()

// 注入翻译函数
const t = inject('t')

// 返回上一页
const handleBack = () => {
  router.back()
}

// 处理导航事件
const handleNavigate = (itemId) => {
  if (itemId === 'add') {
    console.log('点击了记账按钮')
  } else {
    router.push({
      path: itemId === 'home' ? '/' : `/${itemId}`
    })
  }
}
</script>

<style scoped>
.user-agreement-page {
  width: 100%;
  height: 100%;
  background-color: var(--background-primary);
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

.user-agreement-page {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 顶部导航栏 */
.agreement-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  background-color: var(--background-secondary);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  position: relative;
}

.header-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.back-btn {
  position: absolute;
  left: 16px;
  background: none;
  border: none;
  font-size: 20px;
  color: var(--text-primary);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn:hover {
  background-color: var(--border-color);
}

/* 协议内容区域 */
.agreement-content {
  padding: 16px;
  background-color: var(--background-primary);
}

/* 协议章节 */
.agreement-section {
  margin-bottom: 24px;
  padding: 16px;
  background-color: var(--background-secondary);
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
}

/* 章节标题 */
.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 12px 0;
}

/* 章节内容 */
.section-content {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0;
}

/* 协议页脚 */
.agreement-footer {
  margin-top: 32px;
  padding: 16px;
  text-align: center;
  background-color: var(--background-secondary);
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
}

/* 页脚文本 */
.footer-text {
  font-size: 12px;
  color: var(--text-tertiary);
  margin: 0;
}

/* 底部导航固定在内容底部 */
.bottom-nav-wrapper {
  position: sticky;
  bottom: 0;
  z-index: 100;
  flex-shrink: 0;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .agreement-header {
    padding: 12px 16px;
  }
  
  .header-title {
    font-size: 18px;
  }
  
  .back-btn {
    min-width: 40px;
    min-height: 40px;
    font-size: 18px;
  }
  
  .agreement-content {
    padding: 12px;
  }
  
  .agreement-section {
    padding: 12px;
    margin-bottom: 16px;
  }
  
  .section-title {
    font-size: 15px;
  }
  
  .section-content {
    font-size: 13px;
  }
  
  .agreement-footer {
    padding: 12px;
    margin-top: 24px;
  }
  
  .footer-text {
    font-size: 11px;
  }
}
</style>