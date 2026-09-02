'use client'

import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { LogoLockup } from './Marca'

const links = [
  { href: '/#ramos', label: 'Ramos' },
  { href: '/#servicios', label: 'Servicios' },
  { href: '/#nosotros', label: 'Nosotros' },
  { href: '/#alcance', label: 'Alcance' },
  { href: '/#equipo', label: 'Equipo' },
  { href: '/#aliados', label: 'Aliados' },
]

export default function Navbar() {
  const [fijo, setFijo] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setFijo(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        fijo || open ? 'border-b border-line bg-white/85 backdrop-blur-xl' : 'border-b border-transparent'
      }`}
    >
      <nav aria-label="Navegación principal" className="section flex h-20 items-center justify-between">
        <a href="/" aria-label="ASSANCH — inicio" className="flex min-h-12 items-center">
          <LogoLockup height={34} />
        </a>

        {/* Enlaces en cápsula: el recurso de navegación de la referencia */}
        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-line bg-white/70 p-1.5 shadow-suave backdrop-blur-xl lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="flex min-h-9 items-center rounded-full px-4 font-body text-sm font-medium text-slate transition-colors hover:bg-blue-50 hover:text-navy"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a href="/someter-reclamo" className="btn !hidden !min-h-11 !px-5 !text-sm lg:!inline-flex" data-iman>
          Someter un reclamo
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-white text-navy shadow-suave lg:hidden"
        >
          {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
        </button>
      </nav>

      {open && (
        <div id="menu-movil" className="border-t border-line bg-white lg:hidden">
          <ul className="section flex flex-col py-4">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center font-body text-base text-navy transition-colors hover:text-blue-700"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pt-3">
              <a href="/someter-reclamo" onClick={() => setOpen(false)} className="btn w-full">
                Someter un reclamo
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
