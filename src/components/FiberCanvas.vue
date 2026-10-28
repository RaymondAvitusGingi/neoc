<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { FIBERS } from '@/services/defaults'

const canvasRef = ref(null)
let raf = null
let strands = []
let resizeObserver = null

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function buildStrands(width, height) {
  const count = 10
  const picks = [0, 1, 2, 9, 11, 4, 6, 8, 10, 5]
  strands = Array.from({ length: count }, (_, i) => {
    const y = height * (0.06 + (i / (count - 1)) * 0.88)
    return {
      y,
      amp: 8 + Math.random() * 16,
      freq: 0.004 + Math.random() * 0.004,
      speed: 0.4 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      width: 1 + Math.random() * 0.8,
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
    ctx.globalAlpha = 0.17
    ctx.lineWidth = s.width
    for (let x = 0; x <= width; x += 6) {
      const y = s.y + Math.sin(x * s.freq + s.phase + t * 0.0006 * s.speed) * s.amp
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.stroke()

    if (!reduceMotion) {
      s.pulse = (s.pulse + s.speed * 1.6) % (width + 120)
      const px = s.pulse - 60
      const py = s.y + Math.sin(px * s.freq + s.phase + t * 0.0006 * s.speed) * s.amp
      const grad = ctx.createRadialGradient(px, py, 0, px, py, 24)
      grad.addColorStop(0, s.color)
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.globalAlpha = 0.6
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(px, py, 24, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  ctx.globalAlpha = 1
}

function loop(ctx, canvas, dpr) {
  const t = performance.now()
  draw(ctx, canvas.width / dpr, canvas.height / dpr, t)
  if (!reduceMotion) raf = requestAnimationFrame(() => loop(ctx, canvas, dpr))
}

let lastDpr = 1

function resize(canvas) {
  const rect = canvas.parentElement.getBoundingClientRect()
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  lastDpr = dpr
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  const ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)
  buildStrands(rect.width, rect.height)
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  resize(canvas)
  draw(ctx, canvas.width / lastDpr, canvas.height / lastDpr, 0)
  if (!reduceMotion) raf = requestAnimationFrame(() => loop(ctx, canvas, lastDpr))

  resizeObserver = new ResizeObserver(() => {
    resize(canvas)
    draw(ctx, canvas.width / lastDpr, canvas.height / lastDpr, performance.now())
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
