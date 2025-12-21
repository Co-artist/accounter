<template>
  <div class="interactive-logo">
    <!-- 气泡对话框 -->
    <transition name="pop">
      <div v-if="isClosingEyes" class="speech-bubble">
        我不看我不看~
        <div class="bubble-arrow"></div>
      </div>
    </transition>

    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" class="logo-svg">
      <defs>
        <linearGradient id="faceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#FFC107;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- 身体/头部 -->
      <circle cx="100" cy="100" r="90" fill="url(#faceGrad)" stroke="#333" stroke-width="4"/>
      
      <!-- 耳朵 -->
      <path d="M30 40 Q 20 20 50 35" fill="#FFA000" stroke="#333" stroke-width="3"/>
      <path d="M170 40 Q 180 20 150 35" fill="#FFA000" stroke="#333" stroke-width="3"/>

      <!-- 眼睛部分：根据状态切换 -->
      <g v-if="!isClosingEyes" class="eyes-open">
        <!-- 睁眼背景 -->
        <circle cx="65" cy="90" r="30" fill="#FFF" stroke="#333" stroke-width="3"/>
        <circle cx="135" cy="90" r="30" fill="#FFF" stroke="#333" stroke-width="3"/>
        <!-- 瞳孔 -->
        <circle cx="65" cy="90" r="12" fill="#333"/>
        <circle cx="135" cy="90" r="12" fill="#333"/>
        <!-- 高光 -->
        <circle cx="68" cy="87" r="4" fill="#FFF"/>
        <circle cx="138" cy="87" r="4" fill="#FFF"/>
      </g>
      
      <g v-else class="eyes-closed">
        <!-- 闭眼线条 (弯弯的弧线) -->
        <path d="M45 95 Q 65 105 85 95" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round" />
        <path d="M115 95 Q 135 105 155 95" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round" />
        <!-- 闭眼时的睫毛细节 (可选) -->
        <path d="M40 92 L35 88" stroke="#333" stroke-width="3" stroke-linecap="round" />
        <path d="M160 92 L165 88" stroke="#333" stroke-width="3" stroke-linecap="round" />
      </g>
      
      <!-- 嘴巴 -->
      <path d="M90 120 L110 120 L100 140 Z" fill="#FF5722" stroke="#333" stroke-width="2"/>
      
      <!-- 翅膀/手 (闭眼时稍微抬起一点增加动态感) -->
      <g :class="{ 'wings-up': isClosingEyes }">
        <path d="M30 130 Q 10 150 40 160" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round"/>
        <path d="M170 130 Q 190 150 160 160" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round"/>
      </g>
      
      <!-- 钱币 -->
      <circle cx="100" cy="165" r="15" fill="#FFD700" stroke="#333" stroke-width="2"/>
      <text x="100" y="172" font-family="Arial" font-size="14" font-weight="bold" fill="#333" text-anchor="middle">¥</text>
    </svg>
  </div>
</template>

<script setup>
defineProps({
  isClosingEyes: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.interactive-logo {
  position: relative;
  width: 64px;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 气泡样式 */
.speech-bubble {
  position: absolute;
  top: -35px;
  right: -80px;
  background: white;
  padding: 8px 12px;
  border-radius: 12px;
  border: 2px solid #333;
  font-size: 12px;
  font-weight: bold;
  color: #333;
  white-space: nowrap;
  box-shadow: 2px 2px 0px rgba(0,0,0,0.1);
  z-index: 10;
  pointer-events: none;
}

.bubble-arrow {
  position: absolute;
  bottom: -6px;
  left: 20px;
  width: 10px;
  height: 10px;
  background: white;
  border-bottom: 2px solid #333;
  border-right: 2px solid #333;
  transform: rotate(45deg);
}

/* 翅膀动效 */
.wings-up {
  transition: transform 0.3s ease;
  transform-origin: center;
}
.interactive-logo:hover .wings-up, 
.wings-up {
  /* 这里可以添加翅膀微动 */
}

/* 气泡进出动画 */
.pop-enter-active,
.pop-leave-active {
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.5) translateY(10px) rotate(-10deg);
}
</style>
