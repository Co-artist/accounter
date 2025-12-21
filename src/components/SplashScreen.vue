<template>
  <div class="splash-container" @click="handleFinish">
    <div class="animation-wrapper">
      <!-- 飞行轨迹层 -->
      <svg class="flight-path-svg" viewBox="0 0 300 300">
          <path id="flightPath" class="flight-path" d="" />
      </svg>

      <!-- 1. 钱罐 (等待金币) -->
      <div class="jar-wrapper">
        <svg class="jar" viewBox="0 0 200 200" width="150" height="150">
          <defs>
            <linearGradient id="jarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#FFC107;stop-opacity:1" />
            </linearGradient>
          </defs>
          
          <!-- 身体 -->
          <circle cx="100" cy="100" r="90" fill="url(#jarGrad)" stroke="#333" stroke-width="4"/>
          
          <!-- 投币口 -->
          <ellipse class="coin-slot" cx="100" cy="40" rx="25" ry="6" fill="#333" opacity="0.8" />
          
          <!-- 觉醒部分 -->
          <g class="awakening-features">
            <!-- 耳朵 -->
            <path class="ear left" d="M30 40 Q 20 20 50 35" fill="#FFA000" stroke="#333" stroke-width="3"/>
            <path class="ear right" d="M170 40 Q 180 20 150 35" fill="#FFA000" stroke="#333" stroke-width="3"/>

            <!-- 眼睛 -->
            <g class="eye-group">
              <circle cx="65" cy="90" r="30" fill="#FFF" stroke="#333" stroke-width="3"/>
              <circle cx="135" cy="90" r="30" fill="#FFF" stroke="#333" stroke-width="3"/>
              <circle cx="65" cy="90" r="12" fill="#333"/>
              <circle cx="135" cy="90" r="12" fill="#333"/>
              <circle cx="68" cy="87" r="4" fill="#FFF"/>
              <circle cx="138" cy="87" r="4" fill="#FFF"/>
            </g>
            
            <!-- 喙 -->
            <path class="beak" d="M90 120 L110 120 L100 140 Z" fill="#FF5722" stroke="#333" stroke-width="2"/>
            
            <!-- 翅膀 -->
            <path class="wing-feature left" d="M30 130 Q 10 150 40 160" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round"/>
            <path class="wing-feature right" d="M170 130 Q 190 150 160 160" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round"/>
            
            <!-- 额头金币印记 -->
            <g class="forehead-coin">
              <circle cx="100" cy="165" r="15" fill="#FFD700" stroke="#333" stroke-width="2"/>
              <text x="100" y="172" font-family="Arial" font-size="14" font-weight="bold" fill="#333" text-anchor="middle">¥</text>
            </g>
          </g>
        </svg>
      </div>

      <!-- 2. 金币 (猫头鹰变身而来) -->
      <div class="coin-wrapper">
        <svg class="coin" viewBox="0 0 40 40" width="40" height="40">
          <circle cx="20" cy="20" r="15" fill="#FFD700" stroke="#E65100" stroke-width="2" />
          <text x="20" y="26" font-size="16" text-anchor="middle" fill="#E65100" font-weight="bold">¥</text>
        </svg>
      </div>

      <!-- 3. 飞行的猫头鹰 (开场主角) -->
      <div class="owl-wrapper">
        <svg class="flying-owl" viewBox="0 0 120 120" width="120" height="120">
          <!-- 身体：圆胖型 -->
          <circle cx="60" cy="65" r="50" fill="#FFD700" stroke="#333" stroke-width="3" />
          
          <!-- 腹部羽毛 -->
          <g class="belly-feathers" fill="none" stroke="#FFA000" stroke-width="2" stroke-linecap="round">
            <path d="M45 80 Q50 85 55 80" />
            <path d="M65 80 Q70 85 75 80" />
            <path d="M55 90 Q60 95 65 90" />
            <path d="M40 90 Q45 95 50 90" />
            <path d="M70 90 Q75 95 80 90" />
            <path d="M50 100 Q55 105 60 100" />
            <path d="M65 100 Q70 105 75 100" />
          </g>

          <!-- 脸部轮廓 (眼罩部分) -->
          <path d="M60 40 Q 30 20 15 50 Q 10 70 30 80 Q 60 70 60 50 Q 60 70 90 80 Q 110 70 105 50 Q 90 20 60 40" 
                fill="#FFF8E1" stroke="#333" stroke-width="2" opacity="0.9"/>

          <!-- 耳朵 -->
          <path class="ear left" d="M25 30 L15 15 L35 25" fill="#FFD700" stroke="#333" stroke-width="2" />
          <path class="ear right" d="M95 30 L105 15 L85 25" fill="#FFD700" stroke="#333" stroke-width="2" />
          
          <!-- 翅膀 (收起状态，因为在飞，后面有扇动动画) -->
          <path class="wing left" d="M10 65 Q -5 45 20 50" fill="#FFA000" stroke="#333" stroke-width="2" />
          <path class="wing right" d="M110 65 Q 125 45 100 50" fill="#FFA000" stroke="#333" stroke-width="2" />
          
          <!-- 眼睛 (大眼睛) -->
          <g class="eyes">
            <circle cx="45" cy="55" r="14" fill="white" stroke="#333" stroke-width="2" />
            <circle cx="75" cy="55" r="14" fill="white" stroke="#333" stroke-width="2" />
            <circle cx="45" cy="55" r="6" fill="#333" />
            <circle cx="75" cy="55" r="6" fill="#333" />
            <circle cx="47" cy="53" r="2" fill="white" />
            <circle cx="77" cy="53" r="2" fill="white" />
          </g>
          
          <!-- 喙 -->
          <path d="M60 65 L55 75 L65 75 Z" fill="#FF5722" stroke="#333" stroke-width="2" />
          
          <!-- 脚 -->
          <path d="M50 115 L50 118 M53 115 L53 118 M47 115 L47 118" stroke="#333" stroke-width="2" />
          <path d="M70 115 L70 118 M73 115 L73 118 M67 115 L67 118" stroke="#333" stroke-width="2" />
        </svg>
        <div class="transform-effect"></div>
      </div>
    </div>

    <!-- 4. 最终文字 -->
    <div class="final-text">
      <h1 class="app-title">猫头鹰记账</h1>
    </div>

    <div class="replay-hint">点击跳过</div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, defineEmits } from 'vue'
import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

// 注册插件
gsap.registerPlugin(MotionPathPlugin)

const emit = defineEmits(['finish'])

let mainTimeline = null
let wingTimeline = null

const handleFinish = () => {
  if (mainTimeline) mainTimeline.kill()
  if (wingTimeline) wingTimeline.kill()
  emit('finish')
}

const initAnimation = () => {
  // 清理之前的动画
  if (mainTimeline) mainTimeline.kill()
  if (wingTimeline) wingTimeline.kill()
  
  // 重置状态
  gsap.set('.owl-wrapper', { clearProps: 'all' })
  gsap.set('.coin-wrapper', { clearProps: 'all', opacity: 0 })
  gsap.set('.jar-wrapper', { clearProps: 'all', scale: 0 })
  gsap.set('.transform-effect', { clearProps: 'all', opacity: 0, scale: 0 })
  gsap.set('.awakening-features', { opacity: 0, scale: 0.5, transformOrigin: 'center' })
  gsap.set('.ear', { scale: 0, transformOrigin: 'bottom center' })
  gsap.set('.wing-feature', { scale: 0, opacity: 0, transformOrigin: 'center' })
  gsap.set('.eye-group', { scale: 0, transformOrigin: 'center' })
  gsap.set('.beak', { scale: 0, transformOrigin: 'top center' })
  gsap.set('.forehead-coin', { opacity: 0, y: -10 })
  
  gsap.set('.coin-slot', { opacity: 0.8 })
  gsap.set('.final-text', { opacity: 0, y: 20 })

  // --- 翅膀扇动循环动画 (独立时间轴) ---
  wingTimeline = gsap.timeline({ repeat: -1, yoyo: true })
  // 更新翅膀扇动逻辑：新的翅膀在左右两侧，扇动应该是绕着连接点旋转
  // left wing origin: ~ 20 65 (inner point)
  // right wing origin: ~ 100 65
  wingTimeline.fromTo('.flying-owl .wing.left', 
      { rotation: -10, transformOrigin: "100% 20%" },
      { rotation: 30, duration: 0.15, ease: "power1.inOut" }
  )
  wingTimeline.fromTo('.flying-owl .wing.right', 
      { rotation: 10, transformOrigin: "0% 20%" },
      { rotation: -30, duration: 0.15, ease: "power1.inOut" },
      "<"
  )
  wingTimeline.pause() // 初始暂停，飞的时候再开

  // --- 主时间轴 ---
  mainTimeline = gsap.timeline()

  // 1. 疾速飞行 & 轨迹 (0s - 0.8s)
  // 初始位置：左侧屏幕外
  mainTimeline.set('.owl-wrapper', { x: () => -window.innerWidth / 2 - 80, y: 0, scale: 0.6, rotation: 0 })
  
  // 开始扇翅膀
  mainTimeline.call(() => wingTimeline.play())

  // 路径设置
  // 注意：SVG viewBox 是 0 0 300 300，中心点是 (150, 150)。
  // 之前的 startX/endX 是基于“容器中心为原点”计算的偏移量。
  // 为了让 MotionPathPlugin 正确对齐，我们需要把这些偏移量转换为 SVG 内部坐标。
  const centerOffsetX = 150;
  const centerOffsetY = 150;

  // 起点：屏幕左外侧 (相对于中心的偏移)
  const relativeStartX = -window.innerWidth / 2 - 80;
  const relativeStartY = 50; 
  
  // 终点：存钱罐正上方 (相对于中心的偏移)
  const relativeEndX = 0;
  const relativeEndY = -140; // 上移到 -140
  
  // 转换为 SVG 坐标
  const svgStartX = centerOffsetX + relativeStartX;
  const svgStartY = centerOffsetY + relativeStartY;
  const svgEndX = centerOffsetX + relativeEndX;
  const svgEndY = centerOffsetY + relativeEndY;
  
  // 控制点也需要转换
  // 二阶贝塞尔曲线控制点：x在中间，y在上方
  const cpX = (svgStartX + svgEndX) / 2;
  const cpY = svgEndY - 100; // 控制点拉高，形成抛物线

  // 更新 SVG path
  const pathD = `M ${svgStartX} ${svgStartY} Q ${cpX} ${cpY}, ${svgEndX} ${svgEndY}`;
  const pathElement = document.getElementById('flightPath');
  if (pathElement) {
    pathElement.setAttribute('d', pathD);
    
    const newPathLength = pathElement.getTotalLength();
    gsap.set('#flightPath', { strokeDasharray: newPathLength, strokeDashoffset: newPathLength, opacity: 0.6 });
  }

  // 1.1 沿路径飞行 (加速到 0.6s)
  mainTimeline
      .to('.owl-wrapper', {
          motionPath: {
              path: "#flightPath",
              align: "#flightPath",
              alignOrigin: [0.5, 0.5],
              autoRotate: true,
          },
          duration: 0.6, // 加速
          ease: "power2.inOut",
          scale: 0.9 
      }, "fly")

  // 1.2 轨迹线动画
  mainTimeline
      .to('#flightPath', {
          strokeDashoffset: 0,
          duration: 0.6, // 加速
          ease: "power2.inOut"
      }, "fly")
      .to('#flightPath', {
          opacity: 0,
          duration: 0.2 // 加速消失
      }, "+=0") 

  // 1.3 存钱罐淡入
  mainTimeline
      .to('.jar-wrapper', {
          scale: 1,
          opacity: 1,
          duration: 0.6, // 加速
          ease: "power1.out"
      }, "fly")

  // 2. 变身 (0.8s - )
  // 此时猫头鹰位于路径终点 (变身点)
  
  mainTimeline
      // 2.1 翻转消失 (重叠 0.1s，提前开始翻转)
      .to('.owl-wrapper', {
          rotationY: 90,
          duration: 0.05, // 更快
          ease: "power1.in"
      }, "-=0.15") // 提前介入
      .set('.owl-wrapper', { opacity: 0 })
      
      // 2.2 金币出现 (需要手动定位到路径终点)
      .set('.coin-wrapper', { 
          opacity: 1, 
          scale: 1.5, // 增大金币
          x: 0, 
          y: -140, // 对应 relativeEndY
          rotationY: -90 
      })
      
      // 2.3 金币翻转完成并向上跃动
      .to('.coin-wrapper', {
          rotationY: 0,
          y: -180, // 向上跳跃
          duration: 0.15, // 快速上跳
          ease: "power1.out"
      })
      
      // 2.4 闪光 (配合上跳)
      .fromTo('.transform-effect', 
          { x: 0, y: -140, scale: 0, opacity: 0.8 }, 
          { scale: 2, opacity: 0, duration: 0.15, ease: "expo.out" }, 
          "<"
      )
      .call(() => wingTimeline.pause())

  // 3. 下落 & 觉醒
  mainTimeline
      // 3.1 迅速下落
      .to('.coin-wrapper', {
          y: 10, // 落入罐中
          duration: 0.25, // 快速下落
          ease: "power2.in", // 加速
          rotationY: 360 // 下落时旋转一圈
      })
      
      // 消失
      .set('.coin-wrapper', { opacity: 0 })
      
      // 钱罐反应
      .to('.jar-wrapper', { scaleX: 1.3, scaleY: 0.7, duration: 0.08, ease: "power4.out" })
      .to('.jar-wrapper', { scaleX: 0.85, scaleY: 1.15, duration: 0.12, ease: "back.out(2)" })
      .to('.jar-wrapper', { scaleX: 1, scaleY: 1, duration: 0.3, ease: "elastic.out(1, 0.3)" })
      
      .to('.coin-slot', { opacity: 0, duration: 0.2 }, "-=0.4")

  // 6. 觉醒 (分部件出现) - 极速版 (修正为 0.35s 总时长)
  // 眼睛 -> 喙 -> 耳朵 -> 翅膀 -> 额头标记
  const featureTime = "-=0.2" 
  
  mainTimeline
      // 提前觉醒开始时间，与钱罐回弹重叠 (Overlap with jar settling)
      .to('.awakening-features', { opacity: 1, scale: 1, duration: 0.05 }, "-=0.3") 
      
      .to('.eye-group', { scale: 1, duration: 0.2, ease: "back.out(2.5)" }, featureTime)
      .to('.beak', { scale: 1, duration: 0.15, ease: "back.out(2.5)" }, "-=0.15")
      .to('.ear', { scale: 1, duration: 0.2, ease: "elastic.out(1, 0.5)", stagger: 0.05 }, "-=0.15")
      .to('.wing-feature', { scale: 1, opacity: 1, duration: 0.2, ease: "power2.out" }, "-=0.15")
      .to('.forehead-coin', { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }, "-=0.15")

  // 文字
  mainTimeline
      .to('.final-text', {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: "power3.out"
      }, "+=0.1")
      .call(transitionToHome, null, "+=0.8") // 等待一会儿后开始过渡
}

const transitionToHome = () => {
  // 查找目标 Logo (直接查找图片元素以获得更精确的尺寸)
  const target = document.querySelector('.owl-logo')
  
  if (target) {
    // 获取位置信息
    const targetRect = target.getBoundingClientRect()
    const jar = document.querySelector('.jar-wrapper')
    
    if (jar) {
      const jarRect = jar.getBoundingClientRect()
      
      // 计算位移 (相对于当前位置)
      // 注意：jar-wrapper 当前是居中的，transform 会基于当前位置
      // 我们需要计算中心点之间的距离
      const jarCenterX = jarRect.left + jarRect.width / 2
      const jarCenterY = jarRect.top + jarRect.height / 2
      
      const targetCenterX = targetRect.left + targetRect.width / 2
      const targetCenterY = targetRect.top + targetRect.height / 2
      
      const deltaX = targetCenterX - jarCenterX
      const deltaY = targetCenterY - jarCenterY
      
      // 计算缩放比例
      // 使用精确的宽度比
      const scale = targetRect.width / jarRect.width

      // 创建过渡时间轴
      const exitTimeline = gsap.timeline({
        onComplete: handleFinish
      })
      
      // 1. 文字消失
      exitTimeline.to('.final-text', {
        opacity: 0,
        y: 20,
        duration: 0.3,
        ease: "power2.in"
      })

      // 1.5 背景透明化 (展示出下方的 Home Page)
      exitTimeline.to('.splash-container', {
        backgroundColor: 'rgba(245, 245, 245, 0)',
        duration: 0.6,
        ease: "power2.inOut"
      }, "<")
      
      // 2. 钱罐飞向目标
      exitTimeline.to('.jar-wrapper', {
        x: `+=${deltaX}`,
        y: `+=${deltaY}`,
        scale: scale,
        transformOrigin: "center center", // 确保从中心缩放
        duration: 0.8,
        ease: "power3.inOut"
      }, "<") // 与文字消失重叠
      
      return
    }
  }
  
  // 如果没找到目标（如在登录页），则执行默认淡出
  gsap.to('.splash-container', {
    opacity: 0,
    duration: 0.5,
    onComplete: handleFinish
  })
}

onMounted(() => {
  initAnimation()
})

onUnmounted(() => {
  if (mainTimeline) mainTimeline.kill()
  if (wingTimeline) wingTimeline.kill()
})
</script>

<style scoped>
.splash-container {
  width: 100vw;
  height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  cursor: pointer;
}

.animation-wrapper {
  position: relative;
  width: 300px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 轨迹线 SVG */
.flight-path-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  pointer-events: none;
  overflow: visible; /* 允许画到外面 */
}

.flight-path {
  fill: none;
  stroke: #FFD700;
  stroke-width: 4;
  stroke-linecap: round;
  opacity: 0.6;
}

/* 初始状态由 GSAP 控制，但保留定位样式 */
.owl-wrapper {
  position: absolute;
  z-index: 20;
  /* 初始不可见，防止 FOUC */
  transform: translateX(-120vw); 
}

.transform-effect {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, #FFD700, transparent 70%);
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
  z-index: 19;
  pointer-events: none;
}

.coin-wrapper {
  position: absolute;
  opacity: 0;
  z-index: 15;
}

.jar-wrapper {
  position: absolute;
  bottom: 50px;
  transform: scale(0);
  opacity: 0;
}

.final-text {
  position: absolute;
  margin-top: 220px;
  opacity: 0;
  transform: translateY(20px);
}

.app-title {
  font-size: 28px;
  color: #333;
  font-weight: bold;
}

.replay-hint {
  position: absolute;
  bottom: 30px;
  color: #999;
  font-size: 14px;
}
</style>
