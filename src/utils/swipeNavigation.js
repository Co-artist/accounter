import { setNavLeft, setNavRight } from './navDirection'

export function attachSwipeNavigation(el, currentId, router, options = {}) {
  if (!el) return
  const tabs = ['home', 'statistics', 'category', 'profile']
  const index = tabs.indexOf(currentId)
  if (index < 0) return
  const threshold = options.threshold || 60
  const ratio = options.ratio || 1.5
  const cooldownMs = options.cooldownMs || 450
  let startX = 0
  let startY = 0
  let lastAt = 0
  const onStart = (e) => {
    const t = e.touches[0]
    startX = t.clientX
    startY = t.clientY
  }
  const onEnd = (e) => {
    const now = Date.now()
    if (now - lastAt < cooldownMs) return
    const t = e.changedTouches[0]
    const dx = t.clientX - startX
    const dy = t.clientY - startY
    if (Math.abs(dx) < threshold) return
    if (Math.abs(dx) <= Math.abs(dy) * ratio) return
    if (dx < 0) {
      const next = index + 1
      if (next < tabs.length) {
        const map = { home: '/', statistics: '/statistics', category: '/category', profile: '/profile' }
        setNavLeft()
        router.push(map[tabs[next]])
        lastAt = now
      }
    } else {
      const prev = index - 1
      if (prev >= 0) {
        const map = { home: '/', statistics: '/statistics', category: '/category', profile: '/profile' }
        setNavRight()
        router.push(map[tabs[prev]])
        lastAt = now
      }
    }
  }
  el.addEventListener('touchstart', onStart, { passive: true })
  el.addEventListener('touchend', onEnd, { passive: true })
  return () => {
    el.removeEventListener('touchstart', onStart)
    el.removeEventListener('touchend', onEnd)
  }
}
