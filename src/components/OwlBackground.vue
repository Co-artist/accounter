<template>
  <div class="owl-background">
    <img src="../assets/owl-decoration.svg" alt="Owl Decoration" class="decoration-image" />
  </div>
</template>

<style scoped>
.owl-background {
  position: fixed;
  bottom: 80px;
  right: -20px;
  width: 200px;
  height: 200px;
  opacity: 0.08; /* 极低透明度，确保不干扰 */
  pointer-events: none; /* 点击穿透，不影响交互 */
  z-index: 0; /* 在内容之下 */
  transform: rotate(-10deg);
}

.decoration-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>