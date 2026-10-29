// v-reveal: fades + lifts an element in once, the first time it scrolls into
// view. Respects prefers-reduced-motion (reveals immediately, no observer).
// Siblings stagger via nth-child transition-delay in motion.css — simplest
// way to get a cascade without tracking index per element here.
export const reveal = {
  mounted(el) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.classList.add('reveal')
    if (reduceMotion) {
      el.classList.add('reveal-visible')
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    el._revealObserver = observer
  },
  unmounted(el) {
    el._revealObserver?.disconnect()
  },
}
