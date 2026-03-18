import { useState, useEffect, useRef, useCallback } from "react"
import * as THREE from "three"

// ── Global CSS ─────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Share+Tech+Mono&family=Tiro+Devanagari+Hindi:ital@0;1&display=swap');

*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{background:#03030F;overflow-x:hidden}
::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-thumb{background:#A07A0A}

.fc{font-family:'Cinzel Decorative',serif}
.fg{font-family:'EB Garamond',serif}
.fm{font-family:'Share Tech Mono',monospace}
.fd{font-family:'Tiro Devanagari Hindi',serif}

@keyframes shimmerGold{
  0%{background-position:-300% center}
  100%{background-position:300% center}
}
@keyframes breathe3d{
  0%,100%{transform:scale(1) rotateZ(0deg) translateZ(0)}
  50%{transform:scale(1.04) rotateZ(0.8deg) translateZ(8px)}
}
@keyframes floatY{
  0%,100%{transform:translateY(0px) translateZ(0)}
  50%{transform:translateY(-14px) translateZ(10px)}
}
@keyframes rise{
  0%{opacity:0;transform:translateY(0) translateX(var(--dx))}
  8%{opacity:0.9}
  92%{opacity:0.4}
  100%{opacity:0;transform:translateY(-105vh) translateX(var(--dx))}
}
@keyframes revealIn{
  from{opacity:0;transform:perspective(900px) translateY(70px) translateZ(-90px) rotateX(18deg)}
  to{opacity:1;transform:perspective(900px) translateY(0) translateZ(0) rotateX(0deg)}
}
@keyframes spinOrb{
  0%{transform:rotate(0deg) translateX(140px) rotate(0deg)}
  100%{transform:rotate(360deg) translateX(140px) rotate(-360deg)}
}
@keyframes pulseDot{
  0%,100%{transform:scale(1);opacity:0.9}
  50%{transform:scale(1.6);opacity:0.4}
}
@keyframes borderFlow{
  0%,100%{border-color:#A07A0A}
  33%{border-color:#E8650A}
  66%{border-color:#CC5577}
}
@keyframes haloSpin{
  to{transform:rotate(360deg)}
}
@keyframes cursorRingPulse{
  0%,100%{transform:translate(-50%,-50%) scale(1) rotate(0deg);opacity:0.7}
  50%{transform:translate(-50%,-50%) scale(1.18) rotate(180deg);opacity:0.4}
}
@keyframes cursorOrbitA{
  0%{transform:translate(-50%,-50%) rotate(0deg) translateX(18px) rotate(0deg)}
  100%{transform:translate(-50%,-50%) rotate(360deg) translateX(18px) rotate(-360deg)}
}
@keyframes cursorOrbitB{
  0%{transform:translate(-50%,-50%) rotate(0deg) translateX(14px) rotate(0deg)}
  100%{transform:translate(-50%,-50%) rotate(-360deg) translateX(14px) rotate(360deg)}
}
@keyframes trailFade{
  0%{opacity:0.7;transform:translate(-50%,-50%) scale(1)}
  100%{opacity:0;transform:translate(-50%,-50%) scale(0.1)}
}
@keyframes cursorHoverGrow{
  0%,100%{transform:translate(-50%,-50%) scale(1.6) rotate(0deg)}
  50%{transform:translate(-50%,-50%) scale(1.8) rotate(45deg)}
}

*{cursor:none!important}


.gold-shimmer{
  background:linear-gradient(90deg,#A07A0A,#F0E8D0,#E8650A,#D4A017,#F0E8D0,#A07A0A);
  background-size:300% auto;
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  background-clip:text;
  animation:shimmerGold 5s linear infinite;
}

.flip-card{perspective:1200px;cursor:pointer}
.flip-inner{
  position:relative;width:100%;height:100%;
  transform-style:preserve-3d;
  transition:transform 0.75s cubic-bezier(0.4,0,0.2,1);
}
.flip-card:hover .flip-inner,.flip-card.flipped .flip-inner{transform:rotateY(180deg)}
.flip-face{
  position:absolute;inset:0;
  backface-visibility:hidden;
  -webkit-backface-visibility:hidden;
}
.flip-back{transform:rotateY(180deg)}

.reveal{
  opacity:0;
  transform:perspective(900px) translateY(65px) translateZ(-80px) rotateX(16deg);
  transition:opacity 0.9s cubic-bezier(0.23,1,0.32,1),
             transform 0.9s cubic-bezier(0.23,1,0.32,1);
}
.reveal.in{
  opacity:1;
  transform:perspective(900px) translateY(0) translateZ(0) rotateX(0deg);
}

.tilt-card{
  transform-style:preserve-3d;
  transition:transform 0.2s ease,box-shadow 0.2s ease;
  will-change:transform;
}

.nav-link{
  font-family:'Share Tech Mono',monospace;
  font-size:10px;letter-spacing:0.25em;
  color:#6A6458;text-decoration:none;
  text-transform:uppercase;
  transition:color 0.3s,text-shadow 0.3s;
}
.nav-link:hover{color:#E8650A;text-shadow:0 0 12px #E8650A55}

.btn-saffron{
  font-family:'Share Tech Mono',monospace;
  font-size:10px;letter-spacing:0.3em;
  text-transform:uppercase;
  padding:0.9rem 2.2rem;
  background:#E8650A;color:#03030F;
  border:1px solid #E8650A;
  cursor:pointer;transition:all 0.3s;
  text-decoration:none;display:inline-block;
  transform-style:preserve-3d;
}
.btn-saffron:hover{
  background:#F0E8D0;border-color:#F0E8D0;
  transform:perspective(400px) translateZ(8px);
  box-shadow:0 8px 30px #E8650A44;
}
.btn-ghost{
  font-family:'Share Tech Mono',monospace;
  font-size:10px;letter-spacing:0.3em;text-transform:uppercase;
  padding:0.9rem 2.2rem;background:transparent;
  color:#6A6458;border:1px solid #2A2820;
  cursor:pointer;transition:all 0.3s;
  text-decoration:none;display:inline-block;
}
.btn-ghost:hover{border-color:#A07A0A;color:#D4A017;transform:perspective(400px) translateZ(6px)}

.chip{
  font-family:'Share Tech Mono',monospace;
  font-size:8px;letter-spacing:0.15em;
  padding:0.25rem 0.6rem;
  border:1px solid #2A2820;color:#6A6458;
  text-transform:uppercase;display:inline-block;
  transition:all 0.3s;
}
.chip.lit{border-color:#A07A0A;color:#D4A017}

.card-border{animation:borderFlow 4s ease-in-out infinite}

.section-bg-glow{
  position:absolute;width:600px;height:600px;
  border-radius:50%;pointer-events:none;
  filter:blur(120px);opacity:0.06;
}
`

// ── Three.js Scene ─────────────────────────────────────────────────────────
function ThreeScene() {
  const mountRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const el = mountRef.current
    if (!el) return
    const W = el.clientWidth, H = el.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(58, W / H, 0.1, 1000)
    camera.position.z = 5.5

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.15))
    const pl1 = new THREE.PointLight(0xE8650A, 3, 18)
    pl1.position.set(3, 3, 3); scene.add(pl1)
    const pl2 = new THREE.PointLight(0xCC5577, 2, 14)
    pl2.position.set(-3, -2, 2); scene.add(pl2)
    const pl3 = new THREE.PointLight(0xD4A017, 1.5, 10)
    pl3.position.set(0, -3, 0); scene.add(pl3)

    // Main group
    const mainGroup = new THREE.Group()
    scene.add(mainGroup)

    // Central Torus Knot — 3D Sacred Yantra
    const tkGeo = new THREE.TorusKnotGeometry(1.3, 0.07, 220, 20, 3, 5)
    const tkEdges = new THREE.EdgesGeometry(tkGeo)
    const tkLines = new THREE.LineSegments(tkEdges, new THREE.LineBasicMaterial({
      color: 0xD4A017, transparent: true, opacity: 0.75
    }))
    mainGroup.add(tkLines)

    // Inner torus knot — lotus (2,3 knot)
    const tkGeo2 = new THREE.TorusKnotGeometry(0.75, 0.045, 150, 16, 2, 3)
    const tkEdges2 = new THREE.EdgesGeometry(tkGeo2)
    const tkLines2 = new THREE.LineSegments(tkEdges2, new THREE.LineBasicMaterial({
      color: 0xCC5577, transparent: true, opacity: 0.6
    }))
    tkLines2.rotation.x = Math.PI / 3
    mainGroup.add(tkLines2)

    // Octahedron — Ashta corners (8 directions in Vedic cosmology)
    const octaGeo = new THREE.OctahedronGeometry(2.4, 0)
    const octaEdges = new THREE.EdgesGeometry(octaGeo)
    const octaLines = new THREE.LineSegments(octaEdges, new THREE.LineBasicMaterial({
      color: 0xE8650A, transparent: true, opacity: 0.28
    }))
    mainGroup.add(octaLines)

    // Icosahedron outer lattice
    const icosaGeo = new THREE.IcosahedronGeometry(3.1, 0)
    const icosaEdges = new THREE.EdgesGeometry(icosaGeo)
    const icosaLines = new THREE.LineSegments(icosaEdges, new THREE.LineBasicMaterial({
      color: 0x00BFA0, transparent: true, opacity: 0.12
    }))
    mainGroup.add(icosaLines)

    // 8 Lotus-petal rings
    const ringGroup = new THREE.Group()
    for (let i = 0; i < 8; i++) {
      const rGeo = new THREE.TorusGeometry(2.0, 0.012, 6, 90)
      const rEdge = new THREE.EdgesGeometry(rGeo)
      const ring = new THREE.LineSegments(rEdge, new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? 0xD4A017 : 0xCC5577,
        transparent: true, opacity: 0.22
      }))
      ring.rotation.y = (i / 8) * Math.PI
      ring.rotation.x = (i / 16) * Math.PI
      ringGroup.add(ring)
    }
    mainGroup.add(ringGroup)

    // Outer grand sphere wireframe
    const outerGeo = new THREE.IcosahedronGeometry(4.2, 1)
    const outerEdges = new THREE.EdgesGeometry(outerGeo)
    const outerLines = new THREE.LineSegments(outerEdges, new THREE.LineBasicMaterial({
      color: 0xD4A017, transparent: true, opacity: 0.05
    }))
    scene.add(outerLines)

    // Particle field — 4000 stars
    const pCount = 4000
    const pPos = new Float32Array(pCount * 3)
    const pCol = new Float32Array(pCount * 3)
    const palette = [
      new THREE.Color(0xE8650A),
      new THREE.Color(0xD4A017),
      new THREE.Color(0xCC5577),
      new THREE.Color(0x00BFA0),
      new THREE.Color(0xF0E8D0),
    ]
    for (let i = 0; i < pCount; i++) {
      const r = 5 + Math.random() * 9
      const t = Math.random() * Math.PI * 2
      const p = Math.acos(2 * Math.random() - 1)
      pPos[i*3]   = r * Math.sin(p) * Math.cos(t)
      pPos[i*3+1] = r * Math.sin(p) * Math.sin(t)
      pPos[i*3+2] = r * Math.cos(p)
      const c = palette[Math.floor(Math.random() * palette.length)]
      pCol[i*3] = c.r; pCol[i*3+1] = c.g; pCol[i*3+2] = c.b
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3))
    const pMat = new THREE.PointsMaterial({ size: 0.022, vertexColors: true, transparent: true, opacity: 0.8 })
    const particles = new THREE.Points(pGeo, pMat)
    scene.add(particles)

    // Orbiting orbs — Navagrahas (9 planets)
    const orbMeshes = []
    const orbColors = [0xE8650A, 0xD4A017, 0xCC5577, 0x00BFA0, 0xF0E8D0, 0xC4500A, 0x8A2040]
    for (let i = 0; i < 7; i++) {
      const oGeo = new THREE.SphereGeometry(0.065, 10, 10)
      const oMat = new THREE.MeshBasicMaterial({ color: orbColors[i] })
      const orb = new THREE.Mesh(oGeo, oMat)
      const angle = (i / 7) * Math.PI * 2
      orb.userData = { angle, radius: 2.8 + (i % 3) * 0.5, speed: 0.25 + i * 0.05, vy: Math.random() * 0.3 + 0.1 }
      scene.add(orb)
      orbMeshes.push(orb)
    }

    // Animation
    const clock = new THREE.Clock()
    let raf
    const animate = () => {
      raf = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      mainGroup.rotation.y = t * 0.07
      mainGroup.rotation.x = Math.sin(t * 0.04) * 0.12
      tkLines2.rotation.z = t * 0.10
      ringGroup.rotation.z = t * 0.035
      octaLines.rotation.y = -t * 0.05
      icosaLines.rotation.x = t * 0.025
      outerLines.rotation.y = t * 0.01
      outerLines.rotation.z = t * 0.008
      particles.rotation.y = t * 0.012
      particles.rotation.x = t * 0.007

      orbMeshes.forEach((orb, i) => {
        const a = orb.userData.angle + t * orb.userData.speed
        orb.position.x = Math.cos(a) * orb.userData.radius
        orb.position.y = Math.sin(t * orb.userData.vy + i * 1.3) * 2.2
        orb.position.z = Math.sin(a) * orb.userData.radius
      })

      // Smooth mouse parallax
      camera.position.x += (mouseRef.current.x * 0.9 - camera.position.x) * 0.04
      camera.position.y += (-mouseRef.current.y * 0.6 - camera.position.y) * 0.04
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      const nW = el.clientWidth, nH = el.clientHeight
      camera.aspect = nW / nH
      camera.updateProjectionMatrix()
      renderer.setSize(nW, nH)
    }
    const onMouse = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMouse)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouse)
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
}

// ── 3D Tilt Card ──────────────────────────────────────────────────────────
function TiltCard({ children, style }) {
  const ref = useRef(null)
  const onMove = (e) => {
    const el = ref.current; if (!el) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left, y = e.clientY - r.top
    const rx = ((y - r.height / 2) / r.height) * -18
    const ry = ((x - r.width / 2) / r.width) * 18
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(14px) scale(1.01)`
    el.style.boxShadow = `${-ry * 0.4}px ${rx * 0.4}px 40px rgba(232,101,10,0.18)`
  }
  const onLeave = () => {
    const el = ref.current; if (!el) return
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0) scale(1)'
    el.style.boxShadow = 'none'
  }
  return (
    <div ref={ref} className="tilt-card" style={style}
      onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  )
}

// ── Flip Card ─────────────────────────────────────────────────────────────
function FlipCard({ front, back, height }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <div className={`flip-card${flipped ? ' flipped' : ''}`}
      style={{ height }} onClick={() => setFlipped(f => !f)}>
      <div className="flip-inner">
        <div className="flip-face">{front}</div>
        <div className="flip-face flip-back">{back}</div>
      </div>
    </div>
  )
}

// ── Scroll Reveal ─────────────────────────────────────────────────────────
function Reveal({ children, delay = 0 }) {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect() } }, { threshold: 0.08 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={`reveal${vis ? ' in' : ''}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

// ── Rising Sparks ─────────────────────────────────────────────────────────
function Sparks() {
  const sparks = useRef(Array.from({ length: 24 }, (_, i) => ({
    id: i, left: `${Math.random() * 100}%`,
    size: `${Math.random() * 3 + 1}px`,
    dx: `${(Math.random() - 0.5) * 180}px`,
    dur: `${Math.random() * 13 + 7}s`,
    delay: `${Math.random() * 7}s`,
    color: ['#E8650A','#D4A017','#CC5577','#F0E8D0','#00BFA0'][Math.floor(Math.random() * 5)]
  }))).current
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      {sparks.map(s => (
        <div key={s.id} style={{
          position: 'absolute', bottom: '-4px', left: s.left,
          width: s.size, height: s.size, borderRadius: '50%', background: s.color,
          '--dx': s.dx, animation: `rise ${s.dur} linear ${s.delay} infinite`
        }} />
      ))}
    </div>
  )
}

// ── Sacred Cursor ─────────────────────────────────────────────────────────
function SacredCursor() {
  const dotRef   = useRef(null)
  const ringRef  = useRef(null)
  const glowRef  = useRef(null)
  const trailRef = useRef([])
  const pos      = useRef({ x: -200, y: -200 })
  const ring     = useRef({ x: -200, y: -200 })
  const hovering = useRef(false)
  const rafRef   = useRef(null)

  useEffect(() => {
    const TRAIL_COUNT = 10
    // Build trail elements
    const trails = Array.from({ length: TRAIL_COUNT }, (_, i) => {
      const el = document.createElement('div')
      el.style.cssText = `
        position:fixed;pointer-events:none;z-index:99997;
        width:${6 - i * 0.4}px;height:${6 - i * 0.4}px;
        border-radius:50%;
        background:${i % 3 === 0 ? '#E8650A' : i % 3 === 1 ? '#D4A017' : '#CC5577'};
        opacity:0;
        transform:translate(-50%,-50%);
        transition:opacity 0.1s;
        mix-blend-mode:screen;
      `
      document.body.appendChild(el)
      return el
    })
    trailRef.current = trails

    // Trail positions queue
    const queue = Array(TRAIL_COUNT).fill({ x: -200, y: -200 })

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      // shift queue
      queue.unshift({ x: e.clientX, y: e.clientY })
      if (queue.length > TRAIL_COUNT) queue.pop()
    }

    const onEnter = () => { hovering.current = true }
    const onLeave = () => { hovering.current = false }

    // Attach hover detection to interactive elements
    const sel = 'a,button,[class*="tilt"],[class*="flip"]'
    const attachHover = () => {
      document.querySelectorAll(sel).forEach(el => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    }
    attachHover()
    const mo = new MutationObserver(attachHover)
    mo.observe(document.body, { childList: true, subtree: true })

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate)
      const { x, y } = pos.current

      // Main dot snap
      if (dotRef.current) {
        dotRef.current.style.left = x + 'px'
        dotRef.current.style.top  = y + 'px'
        const scale = hovering.current ? 1.5 : 1
        dotRef.current.style.transform = `translate(-50%,-50%) scale(${scale})`
        dotRef.current.style.boxShadow = hovering.current
          ? '0 0 22px 6px rgba(232,101,10,0.7), 0 0 50px 12px rgba(212,160,23,0.35)'
          : '0 0 12px 3px rgba(232,101,10,0.5), 0 0 28px 6px rgba(212,160,23,0.2)'
      }

      // Outer ring — lag behind
      ring.current.x += (x - ring.current.x) * 0.12
      ring.current.y += (y - ring.current.y) * 0.12
      if (ringRef.current) {
        ringRef.current.style.left = ring.current.x + 'px'
        ringRef.current.style.top  = ring.current.y + 'px'
        const rs = hovering.current ? 2.2 : 1
        ringRef.current.style.width  = `${44 * rs}px`
        ringRef.current.style.height = `${44 * rs}px`
        ringRef.current.style.borderColor = hovering.current ? '#E8650A' : '#A07A0A'
        ringRef.current.style.opacity = hovering.current ? '0.9' : '0.6'
      }

      // Glow blob
      if (glowRef.current) {
        glowRef.current.style.left = x + 'px'
        glowRef.current.style.top  = y + 'px'
        glowRef.current.style.opacity = hovering.current ? '0.18' : '0.08'
      }

      // Trail
      queue.forEach((p, i) => {
        const t = trails[i]
        if (!t) return
        t.style.left = p.x + 'px'
        t.style.top  = p.y + 'px'
        t.style.opacity = String(Math.max(0, (1 - i / TRAIL_COUNT) * (hovering.current ? 0.8 : 0.45)))
      })
    }

    window.addEventListener('mousemove', onMove)
    animate()

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
      mo.disconnect()
      trails.forEach(t => t.remove())
      document.querySelectorAll(sel).forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [])

  return (
    <>
      {/* Glow blob */}
      <div ref={glowRef} style={{
        position: 'fixed', zIndex: 99996, pointerEvents: 'none',
        width: '160px', height: '160px', borderRadius: '50%',
        background: 'radial-gradient(circle, #E8650A 0%, #D4A017 40%, transparent 70%)',
        transform: 'translate(-50%,-50%)',
        filter: 'blur(30px)', transition: 'opacity 0.3s',
        mixBlendMode: 'screen',
      }} />

      {/* Outer spinning ring */}
      <div ref={ringRef} style={{
        position: 'fixed', zIndex: 99998, pointerEvents: 'none',
        width: '44px', height: '44px', borderRadius: '50%',
        border: '1px solid #A07A0A',
        transform: 'translate(-50%,-50%)',
        transition: 'width 0.35s cubic-bezier(0.23,1,0.32,1), height 0.35s cubic-bezier(0.23,1,0.32,1), border-color 0.3s, opacity 0.3s',
        animation: 'cursorRingPulse 3s ease-in-out infinite',
      }}>
        {/* Tick marks on ring */}
        {[0,45,90,135,180,225,270,315].map(deg => (
          <div key={deg} style={{
            position: 'absolute', width: '2px', height: '4px',
            background: '#D4A017', opacity: 0.6,
            top: '50%', left: '50%', transformOrigin: '0 -19px',
            transform: `translate(-50%,0) rotate(${deg}deg) translateY(-19px)`,
          }} />
        ))}
      </div>

      {/* Orbiting mini-dots */}
      <div style={{
        position: 'fixed', zIndex: 99999, pointerEvents: 'none',
        left: pos.current.x, top: pos.current.y,
      }}>
        {/* These are absolutely positioned via animation, centered on cursor */}
      </div>

      {/* Main dot — OM symbol */}
      <div ref={dotRef} style={{
        position: 'fixed', zIndex: 99999, pointerEvents: 'none',
        width: '26px', height: '26px', borderRadius: '50%',
        background: 'radial-gradient(circle at 40% 35%, #F0E8D0 0%, #E8650A 55%, #A07A0A 100%)',
        transform: 'translate(-50%,-50%)',
        transition: 'transform 0.15s cubic-bezier(0.23,1,0.32,1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 12px 3px rgba(232,101,10,0.5), 0 0 28px 6px rgba(212,160,23,0.2)',
      }}>
        <span style={{
          fontFamily: "'Tiro Devanagari Hindi', serif",
          fontSize: '13px', lineHeight: 1, color: '#03030F',
          fontWeight: 'bold', userSelect: 'none',
          transform: 'translateY(0.5px)',
        }}>ॐ</span>

        {/* Orbiting saffron orb */}
        <div style={{
          position: 'absolute', width: '5px', height: '5px', borderRadius: '50%',
          background: '#D4A017',
          animation: 'cursorOrbitA 1.6s linear infinite',
          top: '50%', left: '50%',
        }} />
        {/* Orbiting lotus orb */}
        <div style={{
          position: 'absolute', width: '4px', height: '4px', borderRadius: '50%',
          background: '#CC5577',
          animation: 'cursorOrbitB 2.2s linear infinite',
          top: '50%', left: '50%',
        }} />
      </div>
    </>
  )
}

// ── Section Label ─────────────────────────────────────────────────────────
function SectionLabel({ num, deva, en }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.6rem' }}>
      <span className="fm" style={{ fontSize: '9px', letterSpacing: '0.4em', color: '#00BFA0', textTransform: 'uppercase' }}>
        {num} —
      </span>
      <span className="fd" style={{ fontSize: '1.1rem', color: '#E8650A' }}>{deva}</span>
      <span className="fm" style={{ fontSize: '9px', letterSpacing: '0.35em', color: '#00BFA0', textTransform: 'uppercase' }}>{en}</span>
    </div>
  )
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────
export default function JnanaBrand() {
  const [scrolled, setScrolled] = useState(false)
  const [hoveredService, setHoveredService] = useState(null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const C = {
    night: '#03030F', deep: '#06061A', surface: '#0B0B22',
    saffron: '#E8650A', saffron2: '#C4500A',
    turmeric: '#D4A017', turmeric2: '#A07A0A',
    lotus: '#CC5577', lotus2: '#8A2040',
    teal: '#00BFA0', parchment: '#F0E8D0',
    cream: '#C8BEA0', mist: '#6A6458', faint: '#2A2820',
  }

  const pillars = [
    {
      num: '01', sym: '🪷', name: 'Dharma', deva: 'धर्म', sub: 'Sacred Purpose',
      desc: 'In Vedic cosmology, Dharma is the invisible architecture that holds all things in right order. I bring this principle to brand and business — every strategy must be aligned with deeper purpose, or it collapses.',
      chips: ['Brand Dharma','Life Strategy','Purpose Mapping','Karma Analysis'],
      color: C.saffron
    },
    {
      num: '02', sym: '🔥', name: 'Jñāna', deva: 'ज्ञान', sub: 'Living Intelligence',
      desc: 'Jñāna is not information — it is direct perception of truth. From the Upanishadic tradition to cutting-edge AI, I bridge the intelligence of ancient Gurus with machine learning and systems philosophy.',
      chips: ['AI & Systems','Deep Research','Vedantic Logic','Data Dharma'],
      color: C.turmeric
    },
    {
      num: '03', sym: '⚡', name: 'Shakti', deva: 'शक्ति', sub: 'Primal Power',
      desc: 'Shakti is the divine force that drives all creation. In business, it is the invisible energy behind brand magnetism, audience transformation, and market-breaking innovation. I help you locate yours and amplify it.',
      chips: ['Growth Systems','Transformation','Digital Presence','Brand Energy'],
      color: C.lotus
    },
  ]

  const services = [
    {
      id: 'SEVA.001', name: 'Oracle Sangam', deva: 'ओरेकल संगम',
      desc: 'A deep-dive intensive for founders and visionaries at crossroads. Vedic pattern recognition meets strategic roadmapping aligned to your swadharma — your unique path.',
      backTitle: 'What You Receive', backDesc: 'A full-day private session, a written dharma map, a 3-month strategic framework, and a 30-day integration call. By application only.',
      icon: '🔮'
    },
    {
      id: 'SEVA.002', name: 'Brand Yantra', deva: 'ब्रांड यंत्र',
      desc: 'A Yantra is a sacred diagram encoding divine energy. Your brand deserves the same — identity forged from archetype, culture, and cosmic positioning. A living field, not just aesthetics.',
      backTitle: 'The Deliverables', backDesc: 'Brand identity system, visual language, Devanagari-integrated logomark, color + typography codex, voice & tone guide, brand manifesto.',
      icon: '🪷'
    },
    {
      id: 'SEVA.003', name: 'AI Brahmastra', deva: 'AI ब्रह्मास्त्र',
      desc: 'Brahmastra — the ultimate weapon fashioned by Brahma. Custom AI systems and automation infrastructure built with divine precision: every algorithm intentional, every pipeline purposeful.',
      backTitle: 'Technical Scope', backDesc: 'Custom AI agent workflows, RAG pipelines, automation architecture, LLM fine-tuning strategy, API integrations, and deployment infrastructure.',
      icon: '⚡'
    },
    {
      id: 'SEVA.004', name: 'Gurukul Circle', deva: 'गुरुकुल',
      desc: 'The original Gurukul was not a classroom — it was an immersive field of transformation. A private cohort integrating Dharma, Jñāna, and Shakti into life and work. By application only.',
      backTitle: 'What\'s Included', backDesc: 'Monthly live session, private community, resource library, weekly transmission newsletter, quarterly 1:1 call, and lifetime access to recordings.',
      icon: '🕉️'
    },
  ]

  const sx = { // shared styles
    section: { padding: '7rem 2rem', position: 'relative', overflow: 'hidden' },
    inner: { maxWidth: '1120px', margin: '0 auto' },
    h2: { fontFamily: "'Cinzel Decorative', serif", fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '0.05em', marginBottom: '1.2rem' },
    body: { fontFamily: "'EB Garamond', serif", fontSize: '1.1rem', color: C.mist, lineHeight: 1.9 },
    label: { fontFamily: "'Share Tech Mono', monospace", fontSize: '8px', letterSpacing: '0.4em', color: C.mist, textTransform: 'uppercase', display: 'block' },
    border: { border: `1px solid ${C.faint}` },
  }

  return (
    <div style={{ background: C.night, color: C.cream, fontFamily: "'EB Garamond', serif", overflowX: 'hidden' }}>
      <style>{CSS}</style>
      <SacredCursor />

      {/* ── NAV ──────────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1.2rem 3rem',
        background: scrolled ? 'rgba(3,3,15,0.94)' : 'linear-gradient(to bottom,rgba(3,3,15,0.9),transparent)',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
        borderBottom: scrolled ? `1px solid ${C.faint}` : 'none',
        transition: 'all 0.4s ease',
      }}>
        <a href="#" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span className="fd" style={{ fontSize: '1.5rem', color: C.saffron, animation: 'breathe3d 5s ease-in-out infinite' }}>ॐ</span>
          <span className="fc" style={{ fontSize: '1rem', color: C.turmeric, letterSpacing: '0.15em' }}>JÑĀNA</span>
        </a>
        <nav style={{ display: 'flex', gap: '2.5rem', listStyle: 'none' }}>
          {[['#about','Parichaya'],['#pillars','Stambha'],['#services','Seva'],['#contact','Namaskar']].map(([h,l]) => (
            <a key={h} href={h} className="nav-link">{l}</a>
          ))}
        </nav>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section style={{ minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '7rem 2rem 5rem', overflow: 'hidden' }}>
        <ThreeScene />
        <Sparks />

        {/* Giant OM watermark */}
        <div className="fd" aria-hidden="true" style={{
          position: 'absolute', inset: 0, zIndex: 1, display: 'flex',
          alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
          fontSize: 'clamp(12rem,35vw,28rem)', color: C.saffron, opacity: 0.04,
          animation: 'breathe3d 7s ease-in-out infinite', userSelect: 'none',
        }}>ॐ</div>

        {/* Halo ring */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 'min(70vw,580px)', height: 'min(70vw,580px)',
          borderRadius: '50%', border: '1px solid rgba(212,160,23,0.12)',
          animation: 'haloSpin 30s linear infinite', zIndex: 1,
          boxShadow: '0 0 60px rgba(232,101,10,0.06) inset',
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 'min(55vw,450px)', height: 'min(55vw,450px)',
          borderRadius: '50%', border: '1px solid rgba(204,85,119,0.1)',
          animation: 'haloSpin 20s linear infinite reverse', zIndex: 1,
        }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '860px' }}>
          {/* Eyebrow */}
          <p className="fm" style={{
            fontSize: '10px', letterSpacing: '0.6em', color: C.teal,
            textTransform: 'uppercase', marginBottom: '1.2rem',
            animation: 'revealIn 1.2s ease both',
          }}>
            <span className="fd" style={{ fontSize: '1.2rem', color: C.saffron, letterSpacing: 0, margin: '0 0.5rem' }}>ॐ</span>
            Dharma · Jñāna · Karma
            <span className="fd" style={{ fontSize: '1.2rem', color: C.saffron, letterSpacing: 0, margin: '0 0.5rem' }}>ॐ</span>
          </p>

          {/* Main name */}
          <h1 className="fc gold-shimmer" style={{
            fontSize: 'clamp(4rem,14vw,11rem)', fontWeight: 900,
            lineHeight: 0.85, letterSpacing: '0.1em',
            animation: 'revealIn 1.2s ease 0.1s both',
            marginBottom: '0.4rem',
          }}>JÑĀNA</h1>

          <span className="fd" style={{
            fontSize: 'clamp(1.2rem,3.5vw,2.2rem)', color: C.saffron, opacity: 0.7,
            letterSpacing: '0.2em', display: 'block',
            animation: 'revealIn 1.2s ease 0.22s both', marginBottom: '0.8rem',
          }}>ज्ञान</span>

          <p className="fm" style={{
            fontSize: 'clamp(0.6rem,1.4vw,0.75rem)', letterSpacing: '0.55em', color: C.mist,
            textTransform: 'uppercase', animation: 'revealIn 1.2s ease 0.34s both', marginBottom: '2.2rem',
          }}>Spirit &nbsp;·&nbsp; Mind &nbsp;·&nbsp; Machine</p>

          <div style={{ animation: 'revealIn 1.2s ease 0.46s both', marginBottom: '1.8rem' }}>
            <span className="fd" style={{ fontSize: '1.6rem', color: C.turmeric2, letterSpacing: '0.4em' }}>🪷 ॐ 🪷</span>
          </div>

          <p className="fg" style={{
            fontSize: 'clamp(1rem,2.5vw,1.35rem)', fontStyle: 'italic',
            color: C.cream, lineHeight: 1.7, maxWidth: '640px', margin: '0 auto 2.8rem',
            animation: 'revealIn 1.2s ease 0.58s both',
          }}>
            The Vedas whispered it first —{' '}
            <span style={{ color: C.turmeric }}>the universe is pure intelligence.</span>{' '}
            I build at that intersection: where ancient dharma encodes into modern systems,
            and where business strategy awakens to its own consciousness.
          </p>

          <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center', flexWrap: 'wrap', animation: 'revealIn 1.2s ease 0.7s both' }}>
            <a href="#services" className="btn-saffron">Begin the Seva</a>
            <a href="#pillars" className="btn-ghost">Explore the Path</a>
          </div>
        </div>

        <div className="fd" style={{
          position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
          fontSize: '1.8rem', color: C.saffron, zIndex: 2, opacity: 0.5,
          animation: 'floatY 2.5s ease-in-out infinite',
        }}>↓</div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────────────── */}
      <section id="about" style={{ ...sx.section, background: C.deep }}>
        <div style={{ ...sx.inner }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '5rem', alignItems: 'center' }}>

            {/* 3D Portrait */}
            <Reveal>
              <TiltCard style={{
                width: '100%', aspectRatio: '3/4',
                background: `linear-gradient(145deg,#0A0A1E,#12101E)`,
                border: `1px solid ${C.turmeric2}`,
                position: 'relative', overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span className="fd" style={{
                  fontSize: '9rem', color: C.saffron2, opacity: 0.22,
                  animation: 'breathe3d 5s ease-in-out infinite', userSelect: 'none',
                }}>ॐ</span>
                {/* corner lotus */}
                {['tl','tr','bl','br'].map((pos,i) => (
                  <span key={pos} className="fd" style={{
                    position: 'absolute', fontSize: '1.1rem', color: C.turmeric2, opacity: 0.6,
                    top: i < 2 ? '12px' : 'auto', bottom: i >= 2 ? '12px' : 'auto',
                    left: i % 2 === 0 ? '12px' : 'auto', right: i % 2 !== 0 ? '12px' : 'auto',
                  }}>🪷</span>
                ))}
                {/* Animated border glow */}
                <div style={{
                  position: 'absolute', inset: 0,
                  boxShadow: '0 0 40px rgba(232,101,10,0.08) inset',
                  pointerEvents: 'none',
                }} />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: C.saffron2, padding: '0.6rem 1.2rem',
                }}>
                  <span className="fm" style={{ fontSize: '9px', letterSpacing: '0.3em', color: C.night, textTransform: 'uppercase' }}>
                    The Rishi-Technologist
                  </span>
                </div>
              </TiltCard>
            </Reveal>

            {/* Text */}
            <div>
              <Reveal>
                <SectionLabel num="01" deva="परिचय" en="Parichaya" />
                <h2 className="fc" style={{ ...sx.h2, background: `linear-gradient(135deg,${C.parchment},${C.turmeric})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Born Between Two Eternities
                </h2>
                <p style={{ ...sx.body, marginBottom: '1.2rem' }}>
                  In the Vedic tradition, the <em style={{ color: C.turmeric }}>Rishi</em> was one who saw through Maya — the grand illusion — and coded reality into verse. I carry that same sight into the age of algorithms.
                </p>
                <p style={{ ...sx.body, marginBottom: '2rem' }}>
                  Rooted in the Bharat that gave the world zero and infinity, I wield the technologies of tomorrow with the dharmic precision of the ancients. My work is not merely digital — it is a <em style={{ color: C.saffron }}>yajna</em>, a sacred offering.
                </p>
              </Reveal>

              {/* Vedic badges */}
              <Reveal delay={100}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
                  {[['🔥','Vedic Systems'],['💻','AI Architecture'],['🪷','Consciousness'],['⚡','Shakti Strategy'],['🕉','Brand Dharma'],['♾','Deep Tech']].map(([icon,label]) => (
                    <span key={label} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                      border: `1px solid ${C.faint}`, padding: '0.35rem 0.8rem',
                      cursor: 'default', transition: 'all 0.3s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = C.turmeric2; e.currentTarget.style.color = C.turmeric }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = C.faint; e.currentTarget.style.color = C.mist }}
                    >
                      <span style={{ fontSize: '1rem' }}>{icon}</span>
                      <span className="fm" style={{ fontSize: '8px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'inherit' }}>{label}</span>
                    </span>
                  ))}
                </div>
              </Reveal>

              {/* Stats */}
              <Reveal delay={200}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }}>
                  {[['∞','Timeless wisdom'],['7','Years initiated'],['OM','The first word']].map(([n,l]) => (
                    <div key={n} style={{ borderTop: `1px solid ${C.faint}`, paddingTop: '1rem' }}>
                      <span className="fc" style={{ fontSize: '2rem', color: C.saffron, display: 'block', lineHeight: 1 }}>{n}</span>
                      <span className="fm" style={{ fontSize: '8px', letterSpacing: '0.2em', color: C.faint, textTransform: 'uppercase', marginTop: '0.4rem', display: 'block' }}>{l}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── PILLARS (STAMBHA) ─────────────────────────────────────── */}
      <section id="pillars" style={{ ...sx.section }}>
        {/* background glow */}
        <div className="section-bg-glow" style={{ background: C.saffron, top: '-100px', left: '-100px' }} />
        <div className="section-bg-glow" style={{ background: C.lotus, bottom: '-100px', right: '-100px' }} />

        <div style={{ ...sx.inner }}>
          <Reveal>
            <SectionLabel num="02" deva="स्तम्भ" en="Stambha · The Three Pillars" />
            <h2 className="fc" style={{ ...sx.h2, background: `linear-gradient(135deg,${C.parchment},${C.turmeric})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Trimurti of the Work
            </h2>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0', marginTop: '3.5rem', border: `1px solid ${C.faint}` }}>
            {pillars.map((p, i) => (
              <Reveal key={p.num} delay={i * 120}>
                <TiltCard style={{
                  padding: '2.8rem 2.2rem',
                  borderRight: i < 2 ? `1px solid ${C.faint}` : 'none',
                  height: '100%', cursor: 'default',
                  background: 'transparent',
                  transition: 'background 0.4s',
                }}
                >
                  <span className="fm" style={{ fontSize: '9px', color: C.lotus, letterSpacing: '0.4em', marginBottom: '1rem', display: 'block' }}>{p.num} / 03</span>
                  <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem', animation: `floatY ${3 + i * 0.5}s ease-in-out infinite` }}>{p.sym}</span>
                  <h3 className="fc" style={{ fontSize: '1.1rem', color: C.parchment, marginBottom: '0.3rem', letterSpacing: '0.05em' }}>{p.name}</h3>
                  <span className="fd" style={{ fontSize: '1rem', color: p.color, opacity: 0.75, display: 'block', marginBottom: '1rem' }}>{p.deva} — {p.sub}</span>
                  <p style={{ ...sx.body, fontSize: '0.93rem', lineHeight: 1.85 }}>{p.desc}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '1.2rem' }}>
                    {p.chips.map((c, ci) => (
                      <span key={c} className={`chip${ci < 2 ? ' lit' : ''}`}>{c}</span>
                    ))}
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES / SEVA (FLIP CARDS) ─────────────────────────── */}
      <section id="services" style={{ ...sx.section, background: C.deep }}>
        <div style={{ ...sx.inner }}>
          <Reveal>
            <SectionLabel num="03" deva="सेवा" en="Seva · Sacred Services" />
            <h2 className="fc" style={{ ...sx.h2, background: `linear-gradient(135deg,${C.parchment},${C.turmeric})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              The Offerings
            </h2>
            <p className="fm" style={{ fontSize: '9px', letterSpacing: '0.3em', color: C.mist, textTransform: 'uppercase', marginBottom: '3.5rem' }}>
              ↙ Click any card to reveal details ↗
            </p>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1.5px', background: C.faint }}>
            {services.map((s, i) => (
              <Reveal key={s.id} delay={i * 100}>
                <FlipCard
                  height="320px"
                  front={
                    <div style={{
                      background: C.night, padding: '2.8rem',
                      height: '100%', position: 'relative', overflow: 'hidden',
                      display: 'flex', flexDirection: 'column',
                    }}>
                      {/* Glow on hover */}
                      <div style={{
                        position: 'absolute', inset: 0, opacity: 0.04,
                        background: `radial-gradient(circle at 50% 0%, ${C.saffron}, transparent 70%)`,
                        pointerEvents: 'none',
                      }} />
                      <span className="fm" style={{ fontSize: '9px', letterSpacing: '0.4em', color: C.teal, marginBottom: '1rem', display: 'block' }}>{s.id}</span>
                      <span style={{ fontSize: '2rem', marginBottom: '1rem', display: 'block', animation: `floatY ${4 + i * 0.3}s ease-in-out infinite` }}>{s.icon}</span>
                      <h3 className="fc" style={{ fontSize: '1.15rem', color: C.parchment, marginBottom: '0.3rem', letterSpacing: '0.04em' }}>{s.name}</h3>
                      <span className="fd" style={{ fontSize: '0.95rem', color: C.saffron, opacity: 0.6, display: 'block', marginBottom: '1rem' }}>{s.deva}</span>
                      <p style={{ ...sx.body, fontSize: '0.93rem', lineHeight: 1.8, flex: 1 }}>{s.desc}</p>
                      <div style={{ width: '36px', height: '1px', background: `linear-gradient(90deg,${C.turmeric2},transparent)`, marginTop: '1.5rem' }} />
                    </div>
                  }
                  back={
                    <div style={{
                      background: `linear-gradient(135deg,#0A0A1E,#12101E)`,
                      border: `1px solid ${C.turmeric2}`,
                      padding: '2.8rem', height: '100%',
                      display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    }}>
                      <span className="fd" style={{ fontSize: '2rem', color: C.saffron, display: 'block', marginBottom: '1.2rem' }}>🔱</span>
                      <h4 className="fc" style={{ fontSize: '0.95rem', color: C.turmeric, letterSpacing: '0.08em', marginBottom: '1rem' }}>{s.backTitle}</h4>
                      <p style={{ ...sx.body, fontSize: '0.95rem', lineHeight: 1.85 }}>{s.backDesc}</p>
                      <button className="btn-saffron" style={{ marginTop: '2rem', fontSize: '9px' }}>
                        Apply Now →
                      </button>
                    </div>
                  }
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUTRA / PHILOSOPHY ──────────────────────────────────── */}
      <section style={{ ...sx.section, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Giant bg OM */}
        <div className="fd" aria-hidden="true" style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '26rem', color: C.saffron, opacity: 0.025,
          animation: 'breathe3d 8s ease-in-out infinite', pointerEvents: 'none', userSelect: 'none',
        }}>ॐ</div>

        <div style={{ ...sx.inner, position: 'relative', zIndex: 1 }}>
          <Reveal>
            <SectionLabel num="04" deva="सूत्र" en="The Core Sutra" />
            <h2 className="fc" style={{ ...sx.h2, background: `linear-gradient(135deg,${C.parchment},${C.turmeric})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', textAlign: 'center' }}>
              The Living Transmission
            </h2>
          </Reveal>

          <Reveal delay={150}>
            <div style={{ margin: '3rem auto', maxWidth: '780px' }}>
              <div style={{
                border: `1px solid ${C.faint}`, padding: '3.5rem',
                background: 'rgba(6,6,26,0.6)', backdropFilter: 'blur(4px)',
                position: 'relative',
              }}>
                {/* Corner decorations */}
                {[['top','left'],['top','right'],['bottom','left'],['bottom','right']].map(([v,h]) => (
                  <div key={`${v}${h}`} style={{
                    position: 'absolute', width: '20px', height: '20px',
                    [v]: '-1px', [h]: '-1px',
                    borderTop: v === 'top' ? `2px solid ${C.saffron}` : 'none',
                    borderBottom: v === 'bottom' ? `2px solid ${C.saffron}` : 'none',
                    borderLeft: h === 'left' ? `2px solid ${C.saffron}` : 'none',
                    borderRight: h === 'right' ? `2px solid ${C.saffron}` : 'none',
                  }} />
                ))}

                <span className="fd" style={{
                  fontSize: 'clamp(1.2rem,2.5vw,1.8rem)', color: C.saffron,
                  display: 'block', marginBottom: '1.5rem', lineHeight: 1.6,
                }}>
                  अहं ब्रह्मास्मि — यत् पिण्डे तत् ब्रह्माण्डे
                </span>
                <p className="fg" style={{
                  fontSize: 'clamp(1rem,2vw,1.3rem)', fontStyle: 'italic',
                  color: C.cream, lineHeight: 1.75, marginBottom: '1.5rem',
                }}>
                  "I am the Brahman — that which is in the atom, is also in the cosmos."<br />
                  What patterns the universe, patterns the market. What governs the stars, governs systems.
                </p>
                <span className="fm" style={{ fontSize: '9px', letterSpacing: '0.4em', color: C.turmeric2, textTransform: 'uppercase' }}>
                  — Brihadaranyaka Upanishad · Applied to the digital age
                </span>
              </div>
            </div>

            <span className="fd" style={{ fontSize: '1.8rem', color: C.turmeric2, letterSpacing: '0.6em', display: 'block', margin: '2rem auto' }}>✦ ✦ ✦</span>

            <p className="fg" style={{ fontStyle: 'italic', fontSize: '1.1rem', color: C.mist, maxWidth: '680px', margin: '0 auto', lineHeight: 1.9 }}>
              The ancient ones encoded the laws of reality in the Vedas. The modern ones encode them in algorithms.<br />
              I stand at the point where these two tongues become one — and from that silence, I build.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── BRAND CODEX ──────────────────────────────────────────── */}
      <section style={{ ...sx.section, background: C.deep }}>
        <div style={{ ...sx.inner }}>
          <Reveal>
            <SectionLabel num="05" deva="संहिता" en="Samhita · Brand Codex" />
            <h2 className="fc" style={{ ...sx.h2, background: `linear-gradient(135deg,${C.parchment},${C.turmeric})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Identity System
            </h2>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', marginTop: '3.5rem' }}>

            {/* Colors */}
            <Reveal>
              <p className="fm" style={{ fontSize: '8px', letterSpacing: '0.4em', color: C.mist, textTransform: 'uppercase', marginBottom: '1.4rem', borderBottom: `1px solid ${C.faint}`, paddingBottom: '0.8rem' }}>
                Rang Pallette · रंग
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '0.5rem', marginBottom: '0.8rem' }}>
                {[
                  ['#03030F','Akash Night','1px solid #2A2820'],
                  ['#E8650A','Saffron',''],
                  ['#D4A017','Turmeric Gold',''],
                  ['#CC5577','Lotus Pink',''],
                  ['#00BFA0','Nilam Teal',''],
                  ['#B5180E','Kumkum Red',''],
                  ['#F0E8D0','Parchment',''],
                  ['#1B0040','Indigo Deep','1px solid #3A2A60'],
                  ['#C8A060','Sandalwood',''],
                  ['#2A2820','Charcoal','1px solid #3A3830'],
                ].map(([hex,name,border]) => (
                  <div key={hex}>
                    <div style={{ background: hex, border: border || 'none', aspectRatio: '1', transition: 'transform 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'perspective(200px) translateZ(8px) scale(1.05)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                    />
                    <span className="fm" style={{ fontSize: '7px', color: C.mist, marginTop: '0.35rem', display: 'block', lineHeight: 1.3 }}>{hex}<br />{name}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Typography */}
            <Reveal delay={100}>
              <p className="fm" style={{ fontSize: '8px', letterSpacing: '0.4em', color: C.mist, textTransform: 'uppercase', marginBottom: '1.4rem', borderBottom: `1px solid ${C.faint}`, paddingBottom: '0.8rem' }}>
                Lipi · लिपि — Type System
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {[
                  { meta: 'Display — Cinzel Decorative 900', el: <span className="fc" style={{ fontSize: '1.9rem', fontWeight: 900, color: C.turmeric, lineHeight: 1.1, display: 'block' }}>JÑĀNA</span> },
                  { meta: 'Devanagari — Tiro Devanagari Hindi', el: <span className="fd" style={{ fontSize: '1.5rem', color: C.saffron, display: 'block' }}>ज्ञान · धर्म · शक्ति</span> },
                  { meta: 'Body — EB Garamond 400', el: <p className="fg" style={{ fontSize: '1rem', color: C.mist, lineHeight: 1.7 }}>Ancient wisdom encoded in living systems — precision without ego, intention without attachment.</p> },
                  { meta: 'Code — Share Tech Mono', el: <p className="fm" style={{ fontSize: '0.68rem', letterSpacing: '0.3em', color: C.teal }}>SEVA.001 // ORACLE SANGAM</p> },
                ].map(({ meta, el }) => (
                  <div key={meta} style={{ borderBottom: `1px solid ${C.faint}`, paddingBottom: '1rem' }}>
                    <span className="fm" style={{ fontSize: '8px', color: C.faint, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.3rem', display: 'block' }}>{meta}</span>
                    {el}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Voice Matrix */}
          <Reveal delay={200}>
            <div style={{ marginTop: '4rem' }}>
              <p className="fm" style={{ fontSize: '8px', letterSpacing: '0.4em', color: C.mist, textTransform: 'uppercase', marginBottom: '1.5rem', borderBottom: `1px solid ${C.faint}`, paddingBottom: '0.8rem' }}>
                Vani · वाणी — Brand Voice Matrix
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.5px', background: C.faint }}>
                {[
                  ['Cryptic','रहस्यमय','NOT confusing'],
                  ['Dharmic','धार्मिक','NOT preachy'],
                  ['Ancient','प्राचीन','NOT nostalgic'],
                  ['Precise','सटीक','NOT mechanical'],
                ].map(([en, hi, not]) => (
                  <TiltCard key={en} style={{
                    background: C.night, padding: '1.8rem',
                    display: 'flex', flexDirection: 'column', gap: '0.4rem',
                  }}>
                    <span className="fc" style={{ fontSize: '1.05rem', color: C.turmeric, letterSpacing: '0.05em' }}>{en}</span>
                    <span className="fd" style={{ fontSize: '1.2rem', color: C.saffron, opacity: 0.7 }}>{hi}</span>
                    <span className="fm" style={{ fontSize: '8px', color: C.faint, letterSpacing: '0.2em', textTransform: 'uppercase' }}>{not}</span>
                  </TiltCard>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CONTACT / NAMASKAR ───────────────────────────────────── */}
      <section id="contact" style={{ ...sx.section, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="section-bg-glow" style={{ background: C.lotus, top: '0', left: '50%', transform: 'translateX(-50%)' }} />

        <div style={{ ...sx.inner, position: 'relative', zIndex: 1 }}>
          <Reveal>
            <SectionLabel num="06" deva="नमस्कार" en="Namaskar" />
            <div className="fd" style={{
              fontSize: 'clamp(3rem,8vw,5.5rem)', color: C.saffron,
              display: 'block', marginBottom: '1.5rem', opacity: 0.85,
              animation: 'breathe3d 5s ease-in-out infinite',
            }}>🙏</div>
            <h2 className="fc" style={{ ...sx.h2, background: `linear-gradient(135deg,${C.parchment},${C.turmeric})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', textAlign: 'center' }}>
              The Divine in Me Greets<br />the Divine in You
            </h2>
            <p className="fg" style={{ fontStyle: 'italic', fontSize: '1.1rem', color: C.mist, maxWidth: '540px', margin: '1rem auto 3rem', lineHeight: 1.85 }}>
              You did not arrive here by accident. The Vedas say: <em style={{ color: C.turmeric }}>shishya prapta</em> — the student arrives when they are ready. If this speaks to your dharma, reach forward.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap', marginBottom: '4rem' }}>
              {[
                ['📨','Email','jnana@domain.com'],
                ['🪷','Newsletter','Weekly transmission'],
                ['💼','LinkedIn','Professional network'],
                ['📸','Instagram','@jnana.codes'],
                ['🔱','Book Session','1:1 Oracle Intensive'],
              ].map(([icon,label,sub]) => (
                <TiltCard key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <a href="#" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}
                    onMouseEnter={e => { e.currentTarget.parentElement.style.filter = 'brightness(1.2)' }}
                    onMouseLeave={e => { e.currentTarget.parentElement.style.filter = 'none' }}
                  >
                    <span style={{ fontSize: '1.6rem', animation: `floatY ${3 + Math.random()}s ease-in-out infinite` }}>{icon}</span>
                    <span className="fm" style={{ fontSize: '9px', letterSpacing: '0.3em', color: C.mist, textTransform: 'uppercase' }}>{label}</span>
                    <span className="fm" style={{ fontSize: '8px', color: C.faint, letterSpacing: '0.1em' }}>{sub}</span>
                  </a>
                </TiltCard>
              ))}
            </div>
          </Reveal>

          {/* Final CTA */}
          <Reveal delay={200}>
            <div style={{
              border: `1px solid ${C.faint}`, padding: '3rem', maxWidth: '500px', margin: '0 auto',
              background: 'rgba(6,6,26,0.5)', backdropFilter: 'blur(4px)',
            }}>
              <span className="fd" style={{ fontSize: '1.8rem', color: C.saffron, display: 'block', marginBottom: '1rem' }}>ॐ</span>
              <p className="fg" style={{ fontStyle: 'italic', fontSize: '1rem', color: C.mist, lineHeight: 1.8, marginBottom: '1.5rem' }}>
                Ready to begin the Oracle Sangam intensive? Applications open monthly. Seats are extremely limited.
              </p>
              <a href="#" className="btn-saffron">Apply for Oracle Sangam</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer style={{
        borderTop: `1px solid ${C.faint}`,
        padding: '2rem 3rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '1rem', background: C.deep,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span className="fd" style={{ fontSize: '1.3rem', color: C.saffron }}>ॐ</span>
          <span className="fc" style={{ fontSize: '0.85rem', color: C.turmeric2, letterSpacing: '0.1em' }}>
            JÑĀNA &nbsp;·&nbsp; Spirit · Mind · Machine
          </span>
        </div>
        <span className="fm" style={{ fontSize: '8px', letterSpacing: '0.2em', color: C.faint }}>
          सत्यमेव जयते &nbsp;·&nbsp; Truth alone triumphs &nbsp;·&nbsp; © 2025
        </span>
      </footer>

    </div>
  )
}
