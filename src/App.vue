<template>
  <PhoneShell>
    <HomePage />
  </PhoneShell>
</template>

<script setup>
import PhoneShell from './components/PhoneShell.vue'
import HomePage from './views/HomePage.vue'
</script>

<style>
/* 全局样式重置和基础设置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  padding: 20px;
}

#app {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>