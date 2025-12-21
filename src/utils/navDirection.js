import { ref } from 'vue'

export const navDirection = ref('none') // 'left' | 'right' | 'none'

export function setNavLeft() {
  navDirection.value = 'left'
  // 重置避免连续动画叠加
  setTimeout(() => {
    navDirection.value = 'none'
  }, 400)
}

export function setNavRight() {
  navDirection.value = 'right'
  setTimeout(() => {
    navDirection.value = 'none'
  }, 400)
}
