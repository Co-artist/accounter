<template>
  <div class="privacy-policy-page">
    <!-- 内容区域 -->
    <div class="content-wrapper">
      <!-- 顶部导航栏 -->
      <header class="policy-header">
        <h1 class="header-title">{{ t('隐私政策') }}</h1>
        <button class="back-btn" @click="handleBack">
          <span class="back-icon">←</span>
        </button>
      </header>

      <!-- 政策内容区域 -->
      <div class="policy-content">
        <div class="policy-section">
          <h2 class="section-title">1. {{ t('引言') }}</h2>
          <p class="section-content">{{ t('欢迎使用我们的记账应用。我们重视您的隐私保护，致力于保护您的个人信息安全。本隐私政策旨在向您说明我们如何收集、使用、存储和保护您的个人信息，以及您享有的权利。') }}</p>
        </div>

        <div class="policy-section">
          <h2 class="section-title">2. {{ t('我们收集的信息') }}</h2>
          <p class="section-content">{{ t('我们可能会收集以下类型的信息：') }}</p>
          <ul class="section-list">
            <li class="list-item">{{ t('账号信息：包括您的用户名、邮箱等账号注册信息。') }}</li>
            <li class="list-item">{{ t('记账数据：包括您记录的收入、支出、分类等记账信息。') }}</li>
            <li class="list-item">{{ t('设备信息：包括您的设备型号、操作系统版本、设备标识符等。') }}</li>
            <li class="list-item">{{ t('使用信息：包括您使用我们服务的方式、频率、时长等。') }}</li>
          </ul>
        </div>

        <div class="policy-section">
          <h2 class="section-title">3. {{ t('信息的使用') }}</h2>
          <p class="section-content">{{ t('我们收集的信息将用于以下目的：') }}</p>
          <ul class="section-list">
            <li class="list-item">{{ t('提供和维护我们的服务，确保服务正常运行。') }}</li>
            <li class="list-item">{{ t('处理您的记账数据，生成统计报告和分析。') }}</li>
            <li class="list-item">{{ t('改进我们的服务，提升用户体验。') }}</li>
            <li class="list-item">{{ t('向您发送重要通知，如服务更新、安全提醒等。') }}</li>
            <li class="list-item">{{ t('根据您的偏好提供个性化服务。') }}</li>
          </ul>
        </div>

        <div class="policy-section">
          <h2 class="section-title">4. {{ t('信息的存储与保护') }}</h2>
          <p class="section-content">{{ t('我们采用行业标准的安全措施保护您的个人信息，包括加密存储、访问控制、定期安全审计等。您的记账数据存储在本地设备上，并可选择备份到云端。我们会尽最大努力保护您的信息安全，但无法保证绝对安全。') }}</p>
        </div>

        <div class="policy-section">
          <h2 class="section-title">5. {{ t('信息的分享') }}</h2>
          <p class="section-content">{{ t('我们不会向第三方出售或出租您的个人信息。在以下情况下，我们可能会分享您的信息：') }}</p>
          <ul class="section-list">
            <li class="list-item">{{ t('获得您的明确同意。') }}</li>
            <li class="list-item">{{ t('遵守法律法规或响应合法的法律程序。') }}</li>
            <li class="list-item">{{ t('保护我们的合法权益，如防止欺诈、维护服务安全等。') }}</li>
            <li class="list-item">{{ t('与我们的关联公司、合作伙伴共享，以提供更优质的服务。') }}</li>
          </ul>
        </div>

        <div class="policy-section">
          <h2 class="section-title">6. {{ t('您的权利') }}</h2>
          <p class="section-content">{{ t('您对您的个人信息享有以下权利：') }}</p>
          <ul class="section-list">
            <li class="list-item">{{ t('访问和查看您的个人信息。') }}</li>
            <li class="list-item">{{ t('修改或更新您的个人信息。') }}</li>
            <li class="list-item">{{ t('删除您的个人信息。') }}</li>
            <li class="list-item">{{ t('限制或反对我们使用您的个人信息。') }}</li>
            <li class="list-item">{{ t('要求我们导出您的数据。') }}</li>
          </ul>
        </div>

        <div class="policy-section">
          <h2 class="section-title">7. {{ t('隐私政策的更新') }}</h2>
          <p class="section-content">{{ t('我们可能会不时更新本隐私政策。更新后的政策将在应用内公布，您继续使用服务即视为接受更新后的政策。我们建议您定期查看本政策，了解我们的隐私保护措施。') }}</p>
        </div>

        <div class="policy-section">
          <h2 class="section-title">8. {{ t('联系我们') }}</h2>
          <p class="section-content">{{ t('如果您对本隐私政策有任何疑问或建议，或需要行使您的权利，请通过以下方式联系我们：') }}</p>
          <p class="section-content">{{ t('邮箱：2178909778@qq.com') }}</p>
        </div>

        <div class="policy-footer">
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
.privacy-policy-page {
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

.privacy-policy-page {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 顶部导航栏 */
.policy-header {
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

/* 政策内容区域 */
.policy-content {
  padding: 16px;
  background-color: var(--background-primary);
}

/* 政策章节 */
.policy-section {
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
  margin: 0 0 12px 0;
}

/* 章节列表 */
.section-list {
  margin: 0 0 12px 16px;
  padding: 0;
}

/* 列表项 */
.list-item {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0 0 8px 0;
}

/* 政策页脚 */
.policy-footer {
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
  .policy-header {
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
  
  .policy-content {
    padding: 12px;
  }
  
  .policy-section {
    padding: 12px;
    margin-bottom: 16px;
  }
  
  .section-title {
    font-size: 15px;
  }
  
  .section-content {
    font-size: 13px;
  }
  
  .list-item {
    font-size: 13px;
  }
  
  .policy-footer {
    padding: 12px;
    margin-top: 24px;
  }
  
  .footer-text {
    font-size: 11px;
  }
}
</style>