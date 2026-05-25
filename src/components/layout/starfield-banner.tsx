'use client'

import React, { useEffect, useRef } from 'react'

export function StarfieldBanner() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    
    const handleResize = () => {
      // Set canvas drawing buffer to match element size
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth
        canvas.height = parent.clientHeight
      }
    }
    
    window.addEventListener('resize', handleResize)
    handleResize()

    // Starfield setup
    const numStars = 400
    const stars: { x: number, y: number, z: number, isGalaxy: boolean }[] = []
    
    // Distribute stars randomly in a 3D space
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * 4000 - 2000,
        y: Math.random() * 4000 - 2000,
        z: Math.random() * 2000,
        isGalaxy: Math.random() > 0.98 // 2% chance to be a larger "galaxy" block
      })
    }

    // High speed for "speed of light"
    const speed = 25

    const render = () => {
      // Clear with white
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#24A1DE' // Blue color for stars and galaxies

      const cx = canvas.width / 2
      const cy = canvas.height / 2

      for (let i = 0; i < numStars; i++) {
        const star = stars[i]
        if (!star) continue
        
        // Galaxies move faster
        star.z -= star.isGalaxy ? speed * 1.5 : speed

        // Reset if it goes behind the camera
        if (star.z <= 0) {
          star.x = Math.random() * 4000 - 2000
          star.y = Math.random() * 4000 - 2000
          star.z = 2000
          star.isGalaxy = Math.random() > 0.98
        }

        // Project 3D to 2D
        const px = (star.x / star.z) * 800 + cx
        const py = (star.y / star.z) * 800 + cy

        // Only draw if within screen
        if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
          // Size scaling based on distance (closer is larger)
          const size = (star.isGalaxy ? 12 : 3) * (2000 - star.z) / 2000
          
          // Oldschool monochrome pixel style (draw solid squares)
          ctx.fillRect(px, py, Math.max(1, size), Math.max(1, size))
          
          // Draw trails for high speed effect (optional, maybe keep it clean blocks for pixel art)
          const prevZ = star.z + (star.isGalaxy ? speed * 1.5 : speed)
          const prevPx = (star.x / prevZ) * 800 + cx
          const prevPy = (star.y / prevZ) * 800 + cy
          
          ctx.beginPath()
          ctx.moveTo(px, py)
          ctx.lineTo(prevPx, prevPy)
          ctx.strokeStyle = '#24A1DE'
          ctx.lineWidth = Math.max(1, size * 0.5)
          ctx.stroke()
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full z-0"
      style={{ display: 'block' }}
    />
  )
}
