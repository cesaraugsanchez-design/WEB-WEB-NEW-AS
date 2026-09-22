'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Lock, Menu, X } from 'lucide-react'
import { LogoLockup } from './Marca'
import { navegacion } from '@/lib/contenido/navegacion'

/* Retardo al salir del disparador: sin él, el hueco entre la cápsula y el panel
   cierra el menú justo cuando el ratón va bajando hacia él. */
const RETARDO_CIERRE = 140

export default function Navbar() {
  const [fijo, setFijo] = useState(false)
  const [movil, setMovil] = useState(false)
  const [abierto, setAbierto] = useState(null) // label del panel abierto
  const [acordeon, setAcordeon] = useState(null)
  const barraRef = useRef(null)
  const temporizador = useRef(null)

  useEffect(() => {
    const alScroll = () => setFijo(window.scrollY > 24)
    alScroll()
    window.addEventListener('scroll', alScroll, { passive: true })
    return () => window.removeEventListener('scroll', alScroll)
  }, [])

  /* Escape cierra el panel y devuelve el foco al disparador; sin eso, quien
     navega con teclado queda con el foco dentro de un panel invisible. */
  useEffect(() => {
    const alTeclado = (e) => {
      if (e.key !== 'Escape') return
      if (abierto) {
        const disparador = document.getElementById(`abre-${abierto}`)
        setAbierto(null)
        disparador?.focus()
      }
      setMovil(false)
    }
    window.addEventListener('keydown', alTeclado)
    return () => window.removeEventListener('keydown', alTeclado)
  }, [abierto])

  // Clic fuera de la barra: cierra.
  useEffect(() => {
    if (!abierto) return
    const alClic = (e) => {
      if (!barraRef.current?.contains(e.target)) setAbierto(null)
    }
    document.addEventListener('pointerdown', alClic)
    return () => document.removeEventListener('pointerdown', alClic)
  }, [abierto])

  useEffect(() => () => clearTimeout(temporizador.current), [])

  const abrir = (label) => {
    clearTimeout(temporizador.current)
    setAbierto(label)
  }
  const cerrarConRetardo = () => {
    clearTimeout(temporizador.current)
    temporizador.current = setTimeout(() => setAbierto(null), RETARDO_CIERRE)
  }

  return (
    <header
      ref={barraRef}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        fijo || movil || abierto
          ? 'border-b border-line bg-white/85 backdrop-blur-xl'
          : 'border-b border-transparent'
      }`}
    >
      {/* El menu de escritorio arranca en 1350 px, no en lg (1024): la capsula
          va posicionada en absoluto y centrada en el viewport, asi que no
          empuja — se solapa. Medido en el navegador: su borde derecho cae en
          V/2 + 340, y el grupo de botones (Interna 102 + hueco 8 + reclamo 173)
          arranca en V - 323. Se tocan en V = 1326 y cada pixel de mas solo
          reparte medio pixel de holgura, asi que 1340 dejaba 7 px —sin solape,
          pero rozando—. 1350 da 12. Estaba en 1180 con un solo boton y en 1320
          con Interna sin icono: el candado son los 20 px de diferencia, y se
          pagan aqui. Por debajo, el acceso vive en el acordeon movil. */}
      <nav aria-label="Navegación principal" className="section flex h-20 items-center justify-between">
        <Link href="/" aria-label="ASSANCH — inicio" className="flex min-h-12 items-center">
          <LogoLockup height={38} />
        </Link>

        {/* Cápsula central: se conserva tal cual estaba. */}
        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-line bg-white/70 p-1.5 shadow-suave backdrop-blur-xl min-[1350px]:flex">
          {navegacion.map((item) => {
            const tienePanel = Boolean(item.columnas?.length)
            const activo = abierto === item.label

            return (
              <li
                key={item.label}
                onMouseEnter={() => tienePanel && abrir(item.label)}
                onMouseLeave={cerrarConRetardo}
              >
                {/* Es un ENLACE, no un botón: sin JavaScript el menú tiene que
                    seguir siendo una lista navegable. `aria-expanded` es válido
                    sobre role=link, y el panel abre también al recibir foco,
                    así que con teclado se llega sin necesidad de pulsar. */}
                <Link
                  id={tienePanel ? `abre-${item.label}` : undefined}
                  href={item.href}
                  onFocus={() => tienePanel && abrir(item.label)}
                  aria-expanded={tienePanel ? activo : undefined}
                  aria-controls={tienePanel ? `panel-${item.label}` : undefined}
                  className={`flex min-h-9 items-center gap-1 rounded-full px-4 font-body text-sm font-medium transition-colors ${
                    activo ? 'bg-blue-50 text-navy' : 'text-slate hover:bg-blue-50 hover:text-navy'
                  }`}
                >
                  {item.label}
                  {tienePanel && (
                    <ChevronDown
                      size={13}
                      aria-hidden
                      className={`transition-transform duration-300 ${activo ? 'rotate-180' : ''}`}
                    />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Interna va a la izquierda: el CTA de cliente conserva el extremo, que
            es donde lo busca quien entra por primera vez. El apartado está
            cerrado por sesión, así que el enlace no descubre nada — solo evita
            que el equipo tenga que teclear la URL. */}
        <div className="hidden items-center gap-2 min-[1350px]:flex">
          {/* El candado es lo que distingue este botón del CTA de al lado: sin él
              son dos cápsulas de colores distintos y el visitante no sabe cuál
              es para él. Cuesta unos 20 px de ancho —el precio del corte a
              1350— y se recuperan en parte apretando el hueco interior de los
              8,8 px del `.btn-oro` a 6. */}
          <Link
            href="/interna"
            title="Acceso del equipo ASSANCH"
            className="btn-oro !min-h-11 !gap-1.5 !px-4 !text-sm"
          >
            <Lock size={14} aria-hidden />
            Interna
          </Link>

          <Link href="/someter-reclamo" className="btn !min-h-11 !px-5 !text-sm" data-iman>
            Asignar un reclamo
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMovil((v) => !v)}
          aria-expanded={movil}
          aria-controls="menu-movil"
          aria-label={movil ? 'Cerrar menú' : 'Abrir menú'}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-white text-navy shadow-suave min-[1350px]:hidden"
        >
          {movil ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
        </button>
      </nav>

      {/* ---------- Paneles de escritorio ---------- */}
      {navegacion.map((item) => {
        if (!item.columnas?.length) return null
        const activo = abierto === item.label

        return (
          <div
            key={item.label}
            id={`panel-${item.label}`}
            hidden={!activo}
            onMouseEnter={() => abrir(item.label)}
            onMouseLeave={cerrarConRetardo}
            className="absolute inset-x-0 top-full hidden justify-center px-6 pb-6 min-[1350px]:flex"
          >
            {/* El ancho sigue al numero de columnas: un panel de una sola
                columna a max-w-3xl deja media caja vacia y se lee como un
                error de maquetacion, no como espacio en blanco. */}
            <div
              className={`w-full rounded-[2rem] border border-line bg-white/95 p-8 shadow-media backdrop-blur-xl ${
                item.columnas.length > 1 ? 'max-w-3xl' : 'max-w-md'
              }`}
            >
              <div className={`grid gap-8 ${item.columnas.length > 1 ? 'sm:grid-cols-2' : ''}`}>
                {item.columnas.map((col) => (
                  <div key={col.titulo}>
                    <p className="font-body text-[11px] font-semibold tracking-[0.12em] text-slate uppercase">
                      {col.titulo}
                    </p>
                    <ul className="mt-4 space-y-0.5">
                      {col.enlaces.map((e) => (
                        <li key={e.href}>
                          <Link
                            href={e.href}
                            onClick={() => setAbierto(null)}
                            className="flex min-h-9 items-center rounded-xl px-3 font-body text-sm text-slate transition-colors hover:bg-blue-50 hover:text-blue-700"
                          >
                            {e.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    {col.pie && (
                      <Link
                        href={col.pie.href}
                        onClick={() => setAbierto(null)}
                        className="mt-3 flex min-h-9 items-center px-3 font-body text-sm font-semibold text-blue-700 hover:underline"
                      >
                        {col.pie.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })}

      {/* ---------- Acordeón móvil ---------- */}
      {movil && (
        <div id="menu-movil" className="border-t border-line bg-white min-[1350px]:hidden">
          <ul className="section flex max-h-[70vh] flex-col overflow-y-auto py-4">
            {navegacion.map((item) => {
              const tienePanel = Boolean(item.columnas?.length)
              const desplegado = acordeon === item.label

              return (
                <li key={item.label} className="border-b border-line last:border-0">
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      onClick={() => setMovil(false)}
                      className="flex min-h-12 flex-1 items-center font-body text-base text-navy"
                    >
                      {item.label}
                    </Link>

                    {tienePanel && (
                      <button
                        type="button"
                        onClick={() => setAcordeon(desplegado ? null : item.label)}
                        aria-expanded={desplegado}
                        aria-label={`${desplegado ? 'Contraer' : 'Desplegar'} ${item.label}`}
                        className="flex h-12 w-12 shrink-0 items-center justify-center text-slate"
                      >
                        <ChevronDown
                          size={17}
                          aria-hidden
                          className={`transition-transform duration-300 ${desplegado ? 'rotate-180' : ''}`}
                        />
                      </button>
                    )}
                  </div>

                  {tienePanel && desplegado && (
                    <ul className="pb-3 pl-4">
                      {item.columnas.flatMap((c) => c.enlaces).map((e) => (
                        <li key={e.href}>
                          <Link
                            href={e.href}
                            onClick={() => setMovil(false)}
                            className="flex min-h-12 items-center font-body text-sm text-slate"
                          >
                            {e.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}

            <li className="flex flex-col gap-2 pt-4">
              <Link href="/someter-reclamo" onClick={() => setMovil(false)} className="btn w-full">
                Asignar un reclamo
              </Link>
              <Link href="/interna" onClick={() => setMovil(false)} className="btn-oro w-full">
                <Lock size={15} aria-hidden />
                Interna
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
