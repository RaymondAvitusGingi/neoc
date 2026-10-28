<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { FIBERS } from '@/services/defaults'

const canvasRef = ref(null)
let raf = null
let strands = []
let resizeObserver = null

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function buildStrands(width, height) {
  const count = 7
  const picks = [0, 1, 2, 9, 11, 4, 6]
  strands = Array.from({ length: count }, (_, i) => {
    const y = height * (0.18 + (i / (count - 1)) * 0.64)
    return {
      y,
      amp: 10 + Math.random() * 18,
      freq: 0.004 + Math.random() * 0.003,
      speed: 0.4 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      color: FIBERS[picks[i % picks.length]][1],
      pulse: Math.random() * width,
    }
  })
}

function draw(ctx, width, height, t) {
  ctx.clearRect(0, 0, width, height)
  for (const s of strands) {
    ctx.beginPath()
    ctx.strokeStyle = s.color
    ctx.globalAlpha = 0.16
    ctx.lineWidth = 1.4
    for (let x = 0; x <= width; x += 6) {
      const y = s.y + Math.sin(x * s.freq + s.phase + t * 0.0006 * s.speed) * s.amp
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.stroke()

    if (!reduceMotion) {
      s.pulse = (s.pulse + s.speed * 1.6) % (width + 120)
      const px = s.pulse - 60
      const py = s.y + Math.sin(px * s.freq + s.phase + t * 0.0006 * s.speed) * s.amp
      const grad = ctx.createRadialGradient(px, py, 0, px, py, 26)
      grad.addColorStop(0, s.color)
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.globalAlpha = 0.55
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(px, py, 26, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  ctx.globalAlpha = 1
}

function loop(ctx, canvas) {
  const t = performance.now()
  draw(ctx, canvas.width, canvas.height, t)
  if (!reduceMotion) raf = requestAnimationFrame(() => loop(ctx, canvas))
}

function resize(canvas) {
  const rect = canvas.parentElement.getBoundingClientRect()
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  const ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)
  canvas.width = rect.width
  canvas.height = rect.height
  buildStrands(rect.width, rect.height)
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  resize(canvas)
  draw(ctx, canvas.width, canvas.height, 0)
  if (!reduceMotion) raf = requestAnimationFrame(() => loop(ctx, canvas))

  resizeObserver = new ResizeObserver(() => {
    resize(canvas)
    draw(ctx, canvas.width, canvas.height, performance.now())
  })
  resizeObserver.observe(canvas.parentElement)
})

onUnmounted(() => {
  if (raf) cancelAnimationFrame(raf)
  if (resizeObserver) resizeObserver.disconnect()
})
</script>

<template>
  <canvas ref="canvasRef" aria-hidden="true"></canvas>
</template>
