import { useEffect, useRef } from 'react'

const RADIUS = 420
const STRENGTH = 220

export function useBlobRepulsion<T extends HTMLElement>() {
  const containerRef = useRef<T>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const blobs = Array.from(
      container.querySelectorAll<HTMLElement>('[data-blob]'),
    )

    function handleMove(e: MouseEvent) {
      for (const blob of blobs) {
        const rect = blob.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2

        const dx = cx - e.clientX
        const dy = cy - e.clientY
        const dist = Math.hypot(dx, dy)

        if (dist < RADIUS && dist > 0) {
          const force = (1 - dist / RADIUS) * STRENGTH
          const pushX = (dx / dist) * force
          const pushY = (dy / dist) * force
          blob.style.setProperty('--push-x', `${pushX}px`)
          blob.style.setProperty('--push-y', `${pushY}px`)
        } else {
          blob.style.setProperty('--push-x', '0px')
          blob.style.setProperty('--push-y', '0px')
        }
      }
    }

    function reset() {
      for (const blob of blobs) {
        blob.style.setProperty('--push-x', '0px')
        blob.style.setProperty('--push-y', '0px')
      }
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseleave', reset)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseleave', reset)
    }
  }, [])

  return containerRef
}
