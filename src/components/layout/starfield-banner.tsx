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
    const numStars = 6000
    const stars: { x: number, y: number, z: number, isGalaxy: boolean }[] = []
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * 4000 - 2000,
        y: Math.random() * 4000 - 2000,
        z: Math.random() * 2000,
        isGalaxy: Math.random() > 0.95 
      })
    }

    // 2. Far Background Stars (Crosses & Dots)
    const bgStars: { x: number, y: number, z: number, opacity: number, type: 'cross' | 'dot' }[] = []
    for (let i = 0; i < 5000; i++) {
      bgStars.push({
        x: Math.random() * 4000 - 2000,
        y: Math.random() * 4000 - 2000,
        z: Math.random() * 2000,
        opacity: Math.random() * 0.5 + 0.1,
        type: Math.random() > 0.6 ? 'cross' : 'dot' // More crosses per user request
      })
    }

    // 3. Spiral Galaxies
    const galaxies: { x: number, y: number, z: number, angle: number, dots: {x: number, y: number, o: number}[] }[] = []
    for (let i = 0; i < 15; i++) { // More galaxies
      const x = Math.random() * 8000 - 4000
      const y = Math.random() * 4000 - 2000
      const z = Math.random() * 3000
      const angle = Math.random() * Math.PI * 2
      const arms = 2 + Math.floor(Math.random() * 4) // 2 to 5 arms
      const gDots: {x: number, y: number, o: number}[] = []
      for (let j = 0; j < 400; j++) {
        const arm = j % arms
        const armAngle = (Math.random() * Math.PI * 2) + (arm * Math.PI * 2 / arms)
        const radius = Math.random() * 200 + 20
        const spiralAngle = armAngle + (radius * 0.05)
        gDots.push({
          x: Math.cos(spiralAngle) * radius,
          y: Math.sin(spiralAngle) * radius,
          o: Math.random() * 0.5 + 0.1
        })
      }
      galaxies.push({ x, y, z, angle, dots: gDots })
    }

    // 4. Cinematic Events State
    let tick = 0
    let alienState = { active: false, timer: 0, x: 0, y: 0, scale: 0 }
    let shipState = { active: false, x: 0, y: 0, z: 2000, speed: 0, length: 0 }
    
    // Sequence Manager
    const eventTypes = ['earth', 'voyager', 'station', 'sun', 'blackhole']
    let currentEventIdx = 0
    let eventState = { active: false, type: 'earth', x: 0, y: 0, z: 0 }

    const speed = 70 // Hyperspace speed

    const render = () => {
      tick++
      
      // Clear background (White)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      const cx = canvas.width / 2
      const cy = canvas.height / 2

      // ─── Draw Far Background Stars (Crosses & Dots) ───
      for (const p of bgStars) {
        p.z -= speed * 0.1 // Much slower than hyperspace stars
        if (p.z <= 0) {
          p.z = 2000
          p.x = Math.random() * 4000 - 2000
          p.y = Math.random() * 4000 - 2000
        }

        const scale = 500 / Math.max(p.z, 1)
        const px = p.x * scale + cx
        const py = p.y * scale + cy
        
        ctx.fillStyle = `rgba(36, 161, 222, ${p.opacity})`
        if (p.type === 'cross') {
          const s = 1.5 * scale // scales up as it gets closer
          ctx.fillRect(px, py - s, s, s * 3)
          ctx.fillRect(px - s, py, s * 3, s)
        } else {
          const s = 1.5 * scale
          ctx.fillRect(px, py, s, s)
        }
      }

      // ─── Draw Spiral Galaxies ───
      for (const g of galaxies) {
        g.z -= speed * 0.05 // Even slower
        g.angle += 0.001 // slow rotation
        if (g.z <= 0) {
          g.z = 3000
          g.x = Math.random() * 8000 - 4000
          g.y = Math.random() * 4000 - 2000
        }

        const scale = 500 / Math.max(g.z, 1)
        const gx = g.x * scale + cx
        const gy = g.y * scale + cy
        
        ctx.save()
        ctx.translate(gx, gy)
        ctx.rotate(g.angle)
        ctx.scale(scale, scale) // Scale the galaxy down based on distance
        for (const d of g.dots) {
          ctx.fillStyle = `rgba(36, 161, 222, ${d.o})`
          ctx.fillRect(d.x, d.y, 2, 2)
        }
        ctx.restore()
      }

      // ─── Large Events Manager ───
      if (!eventState.active && Math.random() < 0.003) {
        const type = eventTypes[currentEventIdx] || 'earth'
        currentEventIdx = (currentEventIdx + 1) % eventTypes.length
        
        let startX = Math.random() * canvas.width * 2 - canvas.width
        let startY = Math.random() * canvas.height
        let startZ = 1500
        
        if (type === 'voyager' || type === 'station') {
          startX = canvas.width + 200
          startZ = 800
        }
        
        eventState = { active: true, type, x: startX, y: startY, z: startZ }
      }

      if (eventState.active) {
        const type = eventState.type
        if (type === 'earth' || type === 'sun' || type === 'blackhole') {
          eventState.x += 2
          eventState.z -= 10
        } else {
          eventState.x -= 4
          eventState.z -= 5
        }

        const scale = 2000 / Math.max(eventState.z, 100)
        const ex = (eventState.x / Math.max(eventState.z, 1)) * 800 + cx
        const ey = (eventState.y / Math.max(eventState.z, 1)) * 800 + cy

        if (type === 'earth') {
          const radius = 15 * scale
          ctx.beginPath()
          ctx.arc(ex, ey, radius, 0, Math.PI * 2)
          ctx.fillStyle = '#24A1DE'
          ctx.fill()
          ctx.fillStyle = '#1D4ED8'
          ctx.fillRect(ex - radius*0.4, ey - radius*0.3, radius*0.8, radius*0.4)
          ctx.fillRect(ex - radius*0.2, ey + radius*0.1, radius*0.6, radius*0.5)
          const mx = ex + Math.cos(tick * 0.05) * (radius * 2)
          const my = ey + Math.sin(tick * 0.05) * (radius * 0.5)
          ctx.beginPath()
          ctx.arc(mx, my, radius * 0.3, 0, Math.PI * 2)
          ctx.fillStyle = '#60A5FA'
          ctx.fill()
        } else if (type === 'voyager') {
          ctx.save()
          ctx.translate(ex, ey)
          ctx.rotate(tick * 0.02)
          ctx.scale(scale, scale)
          ctx.strokeStyle = '#60A5FA'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(0, 0, 8, Math.PI, Math.PI * 2)
          ctx.stroke()
          ctx.fillStyle = '#24A1DE'
          ctx.fillRect(-4, 0, 8, 12)
          ctx.beginPath()
          ctx.moveTo(0, 12)
          ctx.lineTo(15, 25)
          ctx.stroke()
          ctx.restore()
        } else if (type === 'station') {
          ctx.save()
          ctx.translate(ex, ey)
          ctx.rotate(tick * 0.01) // slowly rotate station
          ctx.scale(scale, scale)
          // Outer Ring
          ctx.beginPath()
          ctx.arc(0, 0, 30, 0, Math.PI * 2)
          ctx.strokeStyle = '#1D4ED8'
          ctx.lineWidth = 4
          ctx.stroke()
          // Spokes
          ctx.beginPath()
          ctx.moveTo(-30, 0)
          ctx.lineTo(30, 0)
          ctx.moveTo(0, -30)
          ctx.lineTo(0, 30)
          ctx.strokeStyle = '#24A1DE'
          ctx.lineWidth = 2
          ctx.stroke()
          // Central Core
          ctx.fillStyle = '#24A1DE'
          ctx.fillRect(-8, -8, 16, 16)
          // Illuminators (Windows)
          ctx.fillStyle = '#ffffff'
          for (let w = 0; w < 12; w++) {
            const wa = w * (Math.PI / 6)
            ctx.fillRect(Math.cos(wa)*29 - 1, Math.sin(wa)*29 - 1, 2, 2)
          }
          ctx.fillRect(-3, -3, 2, 2)
          ctx.fillRect(1, -3, 2, 2)
          ctx.fillRect(-3, 1, 2, 2)
          ctx.fillRect(1, 1, 2, 2)
          ctx.restore()
        } else if (type === 'sun') {
          const radius = 25 * scale
          // Draw base
          ctx.beginPath()
          ctx.arc(ex, ey, radius, 0, Math.PI * 2)
          ctx.fillStyle = '#1D4ED8' // Darker blue base
          ctx.fill()
          // Draw textured plasma
          ctx.fillStyle = '#24A1DE'
          ctx.beginPath()
          ctx.arc(ex - radius*0.2, ey - radius*0.2, radius*0.6, 0, Math.PI*2)
          ctx.fill()
          ctx.fillStyle = '#60A5FA'
          ctx.fillRect(ex + radius*0.1, ey + radius*0.2, radius*0.4, radius*0.3)
          ctx.fillRect(ex - radius*0.4, ey + radius*0.1, radius*0.3, radius*0.3)
          // Animated vortex
          ctx.fillStyle = '#1E3A8A' // Very dark blue spot
          const vx = ex + Math.cos(tick*0.05)*radius*0.5
          const vy = ey + Math.sin(tick*0.05)*radius*0.5
          ctx.fillRect(vx, vy, radius*0.2, radius*0.2)
        } else if (type === 'blackhole') {
          const radius = 30 * scale
          ctx.beginPath()
          ctx.ellipse(ex, ey, radius * 2, radius * 0.5, tick * 0.05, 0, Math.PI * 2)
          ctx.strokeStyle = '#60A5FA'
          ctx.lineWidth = 4 * scale
          ctx.stroke()
          ctx.beginPath()
          ctx.arc(ex, ey, radius, 0, Math.PI * 2)
          ctx.fillStyle = '#ffffff'
          ctx.fill()
          ctx.strokeStyle = '#1D4ED8'
          ctx.lineWidth = 2 * scale
          ctx.stroke()
        }

        if (eventState.z < 0 || eventState.x < -1500) eventState.active = false
      }

      // ─── Draw Fast Spaceships ───
      if (!shipState.active && Math.random() < 0.01) {
        shipState = { 
          active: true, 
          x: Math.random() * 4000 - 2000, 
          y: Math.random() * 4000 - 2000, 
          z: 2000,
          speed: Math.random() * 50 + 50, // Super fast
          length: Math.random() * 200 + 100
        }
      }
      if (shipState.active) {
        shipState.z -= shipState.speed
        
        const px = (shipState.x / Math.max(shipState.z, 1)) * 800 + cx
        const py = (shipState.y / Math.max(shipState.z, 1)) * 800 + cy
        
        const prevZ = shipState.z + shipState.length
        const prevPx = (shipState.x / Math.max(prevZ, 1)) * 800 + cx
        const prevPy = (shipState.y / Math.max(prevZ, 1)) * 800 + cy
        
        ctx.strokeStyle = '#24A1DE' // Fast blue streak
        ctx.lineWidth = 4 * (2000 / Math.max(shipState.z, 100))
        ctx.beginPath()
        ctx.moveTo(px, py)
        ctx.lineTo(prevPx, prevPy)
        ctx.stroke()

        if (shipState.z < 0) shipState.active = false
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
            const prevZ = star.z + speed * 3 // Longer streaks
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
          alienState.scale += 0.06 // Jump forward (much smaller max scale)
        } else if (alienState.timer > 150) {
          alienState.y += 10 // Fall down
        }

        const s = alienState.scale
        const ax = alienState.x
        const ay = alienState.y

        ctx.save()
        ctx.translate(ax, ay)
        ctx.scale(s, s)

        // Pixel Alien (Blue)
        ctx.fillStyle = '#24A1DE'
        
        // Head
        ctx.fillRect(-10, -15, 20, 15)
        // Eyes (White)
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(-8, -10, 4, 4)
        ctx.fillRect(4, -10, 4, 4)
        
        // Waving Hand
        ctx.fillStyle = '#24A1DE'
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
