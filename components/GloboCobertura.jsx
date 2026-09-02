'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Globo terraqueo interactivo con geografia real.
 *
 * Datos: Natural Earth 50m admin_0 (dominio publico), simplificados con
 * Douglas-Peucker y servidos desde `public/geo/paises.json` — 114 kB frente a
 * los 4,5 MB del original. Se piden UNA vez y desde el propio dominio: el
 * componente de referencia pedia el GeoJSON a githubusercontent en cada carga,
 * lo que ata la pagina a un tercero.
 *
 * Las islas del Caribe llevan tolerancia de simplificacion mas fina que los
 * paises grandes; a esta escala Puerto Rico desaparece con la tolerancia comun.
 *
 * Proyeccion ortografica resuelta a mano (no se usa d3, ~250 kB para lo que
 * aqui son treinta lineas de trigonometria).
 */

const RAD = Math.PI / 180

/* `dx`/`dy` y `alinea` colocan cada etiqueta a mano: en el Caribe los cuatro
   puntos caen muy juntos y con una colocacion uniforme se solapan entre si. */
const PUNTOS_CLAVE = [
  { nombre: 'República Dominicana', lon: -70.16, lat: 18.74, principal: true, dx: 13, dy: -13, alinea: 'left' },
  { nombre: 'Puerto Rico', lon: -66.59, lat: 18.22, dx: 12, dy: 20, alinea: 'left' },
  { nombre: 'El Salvador', lon: -88.9, lat: 13.79, dx: -13, dy: -6, alinea: 'right' },
  { nombre: 'Colombia', lon: -74.3, lat: 4.57, dx: 13, dy: 14, alinea: 'left' },
]

/* El eje Z va NEGADO respecto a la convencion ingenua. Con `+sin(lon)` la
   esfera sale espejada: el este aparece a la izquierda, y Puerto Rico —que esta
   al este de Republica Dominicana— se dibujaba a su izquierda. */
function aVector(lon, lat) {
  const la = lat * RAD
  const lo = lon * RAD
  return [Math.cos(la) * Math.cos(lo), Math.sin(la), -Math.cos(la) * Math.sin(lo)]
}

function rotar([x, y, z], giro, inclinacion) {
  const cg = Math.cos(giro)
  const sg = Math.sin(giro)
  const x1 = x * cg - z * sg
  const z1 = x * sg + z * cg
  const ci = Math.cos(inclinacion)
  const si = Math.sin(inclinacion)
  return [x1, y * ci - z1 * si, y * si + z1 * ci]
}

export default function GloboCobertura({ className = '' }) {
  const canvasRef = useRef(null)
  const envolturaRef = useRef(null)
  const [estado, setEstado] = useState('cargando') // cargando | listo | error
  const [reducido, setReducido] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const envoltura = envolturaRef.current
    if (!canvas || !envoltura) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const consulta = window.matchMedia('(prefers-reduced-motion: reduce)')
    let sinMovimiento = consulta.matches
    setReducido(sinMovimiento)

    let ancho = 0
    let alto = 0
    let radio = 0
    let raf = 0
    let paises = null
    let cancelado = false

    // Orientacion inicial calculada: un punto de longitud L queda de frente
    // cuando giro = 90° − L, y centrado en vertical con inclinacion = latitud.
    // Con el eje Z negado, un punto de longitud L queda de frente en L + 90°.
    const GIRO_BASE = (PUNTOS_CLAVE[0].lon + 90) * RAD
    let giro = GIRO_BASE
    let inclinacion = PUNTOS_CLAVE[0].lat * RAD
    let auto = true
    let escala = 1
    const t0 = Date.now()

    const medir = () => {
      const r = envoltura.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      ancho = r.width
      alto = r.height
      canvas.width = Math.floor(ancho * dpr)
      canvas.height = Math.floor(alto * dpr)
      canvas.style.width = `${ancho}px`
      canvas.style.height = `${alto}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      radio = (Math.min(ancho, alto) / 2) * 0.84
    }

    const proyectar = (lon, lat) => {
      const [x, y, z] = rotar(aVector(lon, lat), giro, inclinacion)
      return {
        x: ancho / 2 + x * radio * escala,
        y: alto / 2 - y * radio * escala,
        z,
      }
    }

    const pintar = () => {
      ctx.clearRect(0, 0, ancho, alto)
      const cx = ancho / 2
      const cy = alto / 2
      const r = radio * escala

      // Oceano: degradado muy suave hacia el azul de marca
      const grad = ctx.createRadialGradient(cx - r * 0.32, cy - r * 0.36, r * 0.08, cx, cy, r)
      grad.addColorStop(0, '#F7FBFE')
      grad.addColorStop(1, '#DCEBF7')
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fillStyle = grad
      ctx.fill()

      // Todo lo que sigue queda recortado al disco
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.clip()

      // Retícula
      ctx.strokeStyle = 'rgba(47, 128, 194, 0.13)'
      ctx.lineWidth = 1
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath()
        let ini = false
        for (let lon = -180; lon <= 180; lon += 3) {
          const p = proyectar(lon, lat)
          if (p.z <= 0) { ini = false; continue }
          if (!ini) { ctx.moveTo(p.x, p.y); ini = true } else ctx.lineTo(p.x, p.y)
        }
        ctx.stroke()
      }
      for (let lon = -180; lon < 180; lon += 30) {
        ctx.beginPath()
        let ini = false
        for (let lat = -90; lat <= 90; lat += 3) {
          const p = proyectar(lon, lat)
          if (p.z <= 0) { ini = false; continue }
          if (!ini) { ctx.moveTo(p.x, p.y); ini = true } else ctx.lineTo(p.x, p.y)
        }
        ctx.stroke()
      }

      if (paises) {
        // Tierra: relleno suave y contorno mas marcado
        for (const pais of paises) {
          for (const anillo of pais.p) {
            const proyectados = anillo.map(([lon, lat]) => proyectar(lon, lat))
            const visibles = proyectados.filter((p) => p.z > 0)
            if (visibles.length < 3) continue

            ctx.beginPath()
            visibles.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)))
            ctx.closePath()
            ctx.fillStyle = 'rgba(30, 84, 128, 0.13)'
            ctx.fill()
            ctx.strokeStyle = 'rgba(30, 84, 128, 0.55)'
            ctx.lineWidth = 0.9
            ctx.stroke()
          }
        }

        // Nombres de los paises grandes. Solo cerca del centro del disco: en el
        // borde la proyeccion los amontona y se vuelven ilegibles.
        ctx.font = '600 10px system-ui, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillStyle = 'rgba(19, 27, 33, 0.62)'
        for (const pais of paises) {
          if (pais.r > 2) continue
          const p = proyectar(pais.c[0], pais.c[1])
          if (p.z < 0.42) continue
          ctx.fillText(pais.n, p.x, p.y)
        }
      }

      ctx.restore()

      // Borde del disco
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(47, 128, 194, 0.35)'
      ctx.lineWidth = 1.2
      ctx.stroke()

      // Marcadores parpadeantes
      const t = (Date.now() % 2400) / 2400
      for (const m of PUNTOS_CLAVE) {
        const p = proyectar(m.lon, m.lat)
        if (p.z <= 0.02) continue

        if (!sinMovimiento) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, 5 + t * (m.principal ? 26 : 18), 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(255, 182, 0, ${0.6 * (1 - t)})`
          ctx.lineWidth = 2
          ctx.stroke()
        }

        const rp = m.principal ? 6 : 4.5
        ctx.beginPath()
        ctx.arc(p.x, p.y, rp, 0, Math.PI * 2)
        ctx.fillStyle = '#FFB600'
        ctx.fill()
        ctx.strokeStyle = '#131B21'
        ctx.lineWidth = m.principal ? 2 : 1.5
        ctx.stroke()

        if (m.principal || p.z > 0.3) {
          ctx.font = `${m.principal ? '700' : '600'} 11px system-ui, sans-serif`
          const w = ctx.measureText(m.nombre).width
          const ex = p.x + m.dx
          const ey = p.y + m.dy
          const izq = m.alinea === 'left' ? ex : ex - w

          // Fondo opaco: sin el, el nombre se pierde sobre el relleno de tierra
          ctx.fillStyle = 'rgba(255, 255, 255, 0.92)'
          ctx.beginPath()
          if (ctx.roundRect) ctx.roundRect(izq - 6, ey - 12, w + 12, 18, 9)
          else ctx.rect(izq - 6, ey - 12, w + 12, 18)
          ctx.fill()
          ctx.strokeStyle = 'rgba(47, 128, 194, 0.22)'
          ctx.lineWidth = 1
          ctx.stroke()

          // Guia del marcador a la etiqueta
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(m.alinea === 'left' ? izq - 6 : izq + w + 6, ey - 3)
          ctx.strokeStyle = 'rgba(19, 27, 33, 0.28)'
          ctx.stroke()

          ctx.fillStyle = '#131B21'
          ctx.textAlign = m.alinea
          ctx.fillText(m.nombre, ex, ey)
          ctx.textAlign = 'center'
        }
      }
    }

    /* Oscilacion en vez de giro continuo. Un globo que da vueltas enteras acaba
       mostrando el Pacifico, justo lo contrario de lo que esta pagina quiere
       comunicar: aqui el vaiven de ±24° mantiene el Caribe siempre a la vista. */
    const bucle = () => {
      if (auto && !sinMovimiento) {
        giro = GIRO_BASE + Math.sin((Date.now() - t0) / 9000) * 0.42
      }
      pintar()
      raf = requestAnimationFrame(bucle)
    }

    // --- Interaccion ---
    let arrastrando = false
    let x0 = 0, y0 = 0, g0 = 0, i0 = 0

    const abajo = (e) => {
      arrastrando = true; auto = false
      x0 = e.clientX; y0 = e.clientY; g0 = giro; i0 = inclinacion
      canvas.setPointerCapture?.(e.pointerId)
    }
    const mover = (e) => {
      if (!arrastrando) return
      // Signo negativo: arrastrar a la derecha debe llevar la tierra a la derecha
      giro = g0 - (e.clientX - x0) * 0.006
      inclinacion = Math.max(-1.2, Math.min(1.2, i0 - (e.clientY - y0) * 0.006))
    }
    /* Al soltar NO se reanuda la oscilacion: reactivarla haria saltar el globo
       de golpe a la posicion base. Quien arrastra toma el control. */
    const arriba = () => { arrastrando = false }
    const rueda = (e) => {
      e.preventDefault()
      escala = Math.max(0.8, Math.min(2.6, escala * (e.deltaY > 0 ? 0.92 : 1.08)))
    }

    // Equivalente por teclado del arrastre (WCAG 2.2: toda accion de arrastre
    // necesita alternativa de un solo puntero y de teclado).
    const tecla = (e) => {
      const paso = 0.12
      if (e.key === 'ArrowLeft') { giro += paso; auto = false }
      else if (e.key === 'ArrowRight') { giro -= paso; auto = false }
      else if (e.key === 'ArrowUp') { inclinacion = Math.max(-1.2, inclinacion - paso); auto = false }
      else if (e.key === 'ArrowDown') { inclinacion = Math.min(1.2, inclinacion + paso); auto = false }
      else if (e.key === '+' || e.key === '=') escala = Math.min(2.6, escala * 1.12)
      else if (e.key === '-') escala = Math.max(0.8, escala * 0.9)
      else return
      e.preventDefault()
      pintar()
    }

    const ro = new ResizeObserver(() => { medir(); pintar() })
    ro.observe(envoltura)

    const alCambiarMovimiento = (ev) => {
      sinMovimiento = ev.matches
      setReducido(ev.matches)
      pintar()
    }

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { if (!raf) raf = requestAnimationFrame(bucle) }
      else if (raf) { cancelAnimationFrame(raf); raf = 0 }
    }, { threshold: 0.01 })

    medir()
    pintar()

    fetch('/geo/paises.json')
      .then((r) => {
        if (!r.ok) throw new Error('geografia no disponible')
        return r.json()
      })
      .then((d) => {
        if (cancelado) return
        paises = d.paises
        setEstado('listo')
        io.observe(envoltura)
        pintar()
      })
      .catch(() => {
        if (!cancelado) setEstado('error')
      })

    canvas.addEventListener('pointerdown', abajo)
    canvas.addEventListener('pointermove', mover)
    canvas.addEventListener('pointerup', arriba)
    canvas.addEventListener('pointercancel', arriba)
    canvas.addEventListener('wheel', rueda, { passive: false })
    canvas.addEventListener('keydown', tecla)
    consulta.addEventListener('change', alCambiarMovimiento)

    return () => {
      cancelado = true
      if (raf) cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      canvas.removeEventListener('pointerdown', abajo)
      canvas.removeEventListener('pointermove', mover)
      canvas.removeEventListener('pointerup', arriba)
      canvas.removeEventListener('pointercancel', arriba)
      canvas.removeEventListener('wheel', rueda)
      canvas.removeEventListener('keydown', tecla)
      consulta.removeEventListener('change', alCambiarMovimiento)
    }
  }, [])

  return (
    <div ref={envolturaRef} className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        tabIndex={0}
        role="img"
        aria-label="Globo terráqueo interactivo. Señala República Dominicana, Puerto Rico, El Salvador y Colombia. Use las flechas para girarlo y las teclas más y menos para acercar."
        className="block h-full w-full cursor-grab touch-none rounded-[2.5rem] active:cursor-grabbing"
      />

      <p className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 text-center font-body text-[11px] font-semibold tracking-[0.12em] text-slate uppercase">
        {estado === 'cargando' && 'Cargando geografía…'}
        {estado === 'error' && 'No se pudo cargar la geografía'}
        {estado === 'listo' &&
          (reducido ? 'Movimiento reducido · use las flechas' : 'Arrastre para girar · flechas y +/− también')}
      </p>
    </div>
  )
}
