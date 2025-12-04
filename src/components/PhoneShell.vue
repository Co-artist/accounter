<template>
  <div class="phone-container">
    <div class="phone">
      <!-- 顶部摄像头和扬声器 -->
      <div class="phone-top">
        <div class="camera"></div>
        <div class="speaker"></div>
      </div>
      
      <!-- 屏幕区域 -->
      <div class="phone-screen">
        <slot></slot>
      </div>
      
      <!-- 底部Home键 -->
      <div class="phone-bottom">
        <div class="home-button"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 手机外壳组件，用于包裹应用内容
</script>

<style scoped>
.phone-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.phone {
  width: 375px;
  height: 812px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 48px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 10px 20px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  padding: 12px;
  position: relative;
  z-index: 1;
}

.phone::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 48px;
  z-index: -1;
}

.phone-top {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 44px;
  position: relative;
}

.camera {
  width: 12px;
  height: 12px;
  background: #333;
  border-radius: 50%;
  position: absolute;
  left: 40%;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

.speaker {
  width: 60px;
  height: 6px;
  background: #333;
  border-radius: 3px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
}

.phone-screen {
  width: 100%;
  height: calc(100% - 88px);
  background: #f5f5f5;
  border-radius: 36px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

.phone-bottom {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 44px;
}

.home-button {
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

/* 响应式设计 */
@media (max-width: 400px) {
  .phone {
    width: 100%;
    height: 100vh;
    border-radius: 0;
    padding: 0;
    box-shadow: none;
  }
  
  .phone-screen {
    border-radius: 0;
    height: calc(100% - 44px);
  }
  
  .phone-top,
  .phone-bottom {
    display: none;
  }
}
</style>