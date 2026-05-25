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
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth
        canvas.height = parent.clientHeight
      }
    }
    
    window.addEventListener('resize', handleResize)
    handleResize()

    // ─── Setup Entities ───
    
    // 1. Hyperspace Stars
    const numStars = 800
    const stars: { x: number, y: number, z: number, isGalaxy: boolean }[] = []
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * 4000 - 2000,
        y: Math.random() * 4000 - 2000,
        z: Math.random() * 2000,
        isGalaxy: Math.random() > 0.95 
      })
    }

    // 2. Milky Way Background (slow panning dust)
    const dustParticles: { x: number, y: number, size: number, opacity: number }[] = []
    for (let i = 0; i < 200; i++) {
      dustParticles.push({
        x: Math.random() * 2000,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.3 + 0.1
      })
    }

    // 3. Cinematic Events State
    let tick = 0
    let alienState = { active: false, timer: 0, x: 0, y: 0, scale: 0 }
    let earthState = { active: false, x: -100, y: 20, z: 1000 }
    let voyagerState = { active: false, x: 2000, y: 10, z: 800 }
    let shipState = { active: false, x: 0, y: 0, speed: 0, length: 0 }

    const speed = 25 // Hyperspace speed

    const render = () => {
      tick++
      
      // Clear background (White)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      const cx = canvas.width / 2
      const cy = canvas.height / 2

      // ─── Draw Milky Way Background ───
      for (const p of dustParticles) {
        p.x -= 0.5 // Slow pan left
        if (p.x < -10) p.x = canvas.width + 10
        ctx.fillStyle = `rgba(36, 161, 222, ${p.opacity})`
        ctx.fillRect(p.x, p.y, p.size, p.size)
      }

      // ─── Draw Earth Event ───
      if (!earthState.active && Math.random() < 0.001) {
        earthState = { active: true, x: -200, y: Math.random() * canvas.height, z: 1500 }
      }
      if (earthState.active) {
        earthState.x += 2
        earthState.z -= 10
        const scale = 2000 / Math.max(earthState.z, 100)
        const ex = (earthState.x / Math.max(earthState.z, 1)) * 800 + cx
        const ey = (earthState.y / Math.max(earthState.z, 1)) * 800 + cy
        
        // Draw Earth (Blue circle with green blocks)
        const radius = 15 * scale
        ctx.beginPath()
        ctx.arc(ex, ey, radius, 0, Math.PI * 2)
        ctx.fillStyle = '#24A1DE'
        ctx.fill()
        
        // Pixel continents
        ctx.fillStyle = '#10B981' // Green
        ctx.fillRect(ex - radius*0.4, ey - radius*0.3, radius*0.8, radius*0.4)
        ctx.fillRect(ex - radius*0.2, ey + radius*0.1, radius*0.6, radius*0.5)

        // Draw Moon
        const mx = ex + Math.cos(tick * 0.05) * (radius * 2)
        const my = ey + Math.sin(tick * 0.05) * (radius * 0.5)
        ctx.beginPath()
        ctx.arc(mx, my, radius * 0.3, 0, Math.PI * 2)
        ctx.fillStyle = '#9CA3AF' // Grey
        ctx.fill()

        if (earthState.z < 0) earthState.active = false
      }

      // ─── Draw Voyager Event ───
      if (!voyagerState.active && Math.random() < 0.002) {
        voyagerState = { active: true, x: canvas.width + 200, y: Math.random() * canvas.height, z: 800 }
      }
      if (voyagerState.active) {
        voyagerState.x -= 4
        voyagerState.z -= 5
        const scale = 1000 / Math.max(voyagerState.z, 100)
        const vx = (voyagerState.x / Math.max(voyagerState.z, 1)) * 800 + cx
        const vy = (voyagerState.y / Math.max(voyagerState.z, 1)) * 800 + cy

        ctx.save()
        ctx.translate(vx, vy)
        ctx.rotate(tick * 0.02)
        ctx.scale(scale, scale)
        // Dish
        ctx.strokeStyle = '#4B5563'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(0, 0, 8, Math.PI, Math.PI * 2)
        ctx.stroke()
        // Body
        ctx.fillStyle = '#D1D5DB'
        ctx.fillRect(-4, 0, 8, 12)
        // Antenna
        ctx.beginPath()
        ctx.moveTo(0, 12)
        ctx.lineTo(15, 25)
        ctx.stroke()
        ctx.restore()

        if (voyagerState.z < 0 || voyagerState.x < -1000) voyagerState.active = false
      }

      // ─── Draw Fast Spaceships ───
      if (!shipState.active && Math.random() < 0.01) {
        shipState = { 
          active: true, 
          x: -500, 
          y: Math.random() * canvas.height, 
          speed: Math.random() * 40 + 20,
          length: Math.random() * 100 + 50
        }
      }
      if (shipState.active) {
        shipState.x += shipState.speed
        
        ctx.strokeStyle = '#3B82F6' // Fast blue streak
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(shipState.x, shipState.y)
        ctx.lineTo(shipState.x - shipState.length, shipState.y)
        ctx.stroke()

        if (shipState.x - shipState.length > canvas.width) shipState.active = false
      }

      // ─── Draw Hyperspace Stars ───
      ctx.fillStyle = '#24A1DE' 

      for (let i = 0; i < numStars; i++) {
        const star = stars[i]
        if (!star) continue
        
        // Galaxies move slower, stars move fast
        star.z -= star.isGalaxy ? speed * 0.5 : speed

        // Reset if it goes behind the camera
        if (star.z <= 0) {
          star.x = Math.random() * 4000 - 2000
          star.y = Math.random() * 4000 - 2000
          star.z = 2000
          star.isGalaxy = Math.random() > 0.95
        }

        const px = (star.x / star.z) * 800 + cx
        const py = (star.y / star.z) * 800 + cy

        if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
          const size = (star.isGalaxy ? 6 : 2) * (2000 - star.z) / 2000
          
          ctx.fillRect(px, py, Math.max(1, size), Math.max(1, size))
          
          if (!star.isGalaxy) {
            // Draw streak for hyperspace
            const prevZ = star.z + speed
            const prevPx = (star.x / prevZ) * 800 + cx
            const prevPy = (star.y / prevZ) * 800 + cy
            
            ctx.beginPath()
            ctx.moveTo(px, py)
            ctx.lineTo(prevPx, prevPy)
            ctx.strokeStyle = `rgba(36, 161, 222, ${Math.max(0.1, 1 - star.z/2000)})`
            ctx.lineWidth = Math.max(0.5, size * 0.5)
            ctx.stroke()
          }
        }
      }

      // ─── Draw Alien Event (Foreground) ───
      if (!alienState.active && Math.random() < 0.0005) {
        alienState = { active: true, timer: 0, x: cx + (Math.random()*100 - 50), y: cy, scale: 0 }
      }
      if (alienState.active) {
        alienState.timer++
        
        // Jump to screen, hold, fall off
        if (alienState.timer < 30) {
          alienState.scale += 0.2 // Jump forward
        } else if (alienState.timer > 150) {
          alienState.y += 10 // Fall down
        }

        const s = alienState.scale
        const ax = alienState.x
        const ay = alienState.y

        ctx.save()
        ctx.translate(ax, ay)
        ctx.scale(s, s)

        // Pixel Alien (Grey)
        ctx.fillStyle = '#6B7280'
        
        // Head
        ctx.fillRect(-10, -15, 20, 15)
        // Eyes (Black)
        ctx.fillStyle = '#111827'
        ctx.fillRect(-8, -10, 4, 4)
        ctx.fillRect(4, -10, 4, 4)
        
        // Waving Hand
        ctx.fillStyle = '#6B7280'
        if (alienState.timer > 30 && alienState.timer < 150) {
          // Hand goes up and down
          const handY = Math.sin(tick * 0.5) * 5
          ctx.fillRect(-20, handY - 5, 5, 10)
        }

        ctx.restore()

        if (alienState.timer > 200) alienState.active = false
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
