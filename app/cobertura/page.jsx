'use client'

import Link from 'next/link'
import { Building, Clock, MapPin, Phone } from 'lucide-react'
import Footer from '@/components/Footer'
import GloboCobertura from '@/components/GloboCobertura'
import Navbar from '@/components/Navbar'

const zonas = [
  {
    nombre: 'Zona Oriental / Este',
    oficina: 'Santo Domingo Este',
    detalle: 'Alma Rosa II y provincias del este, incluida la zona hotelera.',
  },
  {
    nombre: 'Distrito Nacional / Sur',
    oficina: 'Santo Domingo',
    detalle: 'Distrito Nacional y provincias del sur.',
  },
  {
    nombre: 'Zona Norte',
    oficina: 'Santiago',
    detalle: 'Cibao y provincias del norte.',
  },
]

export default function Cobertura() {
  return (
    <>
      <Navbar />

      <main id="main" className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
        <div
          aria-hidden
          className="orbe h-[52vw] w-[52vw] bg-blue-300/35"
          style={{ top: '-10%', right: '-8%', '--orbe-tiro': '30px' }}
        />
        <div
          aria-hidden
          className="orbe h-[36vw] w-[36vw] bg-gold/15"
          style={{ bottom: '4%', left: '-10%', '--orbe-tiro': '-24px' }}
        />

        <div className="section relative">
          <div className="mx-auto max-w-2xl text-center">
            <p className="pildora">Cobertura</p>
            <h1 className="mt-6 font-display text-4xl leading-[1.08] font-medium tracking-[-0.03em] text-navy md:text-6xl">
              Presencia inmediata en{' '}
              <span className="texto-degradado font-semibold">todo el territorio</span>.
            </h1>
            <p className="mt-6 font-body text-lg leading-relaxed text-slate">
              Tres oficinas y una flota dedicada nos permiten estar en el sitio del
              siniestro en cualquier punto del país.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-12 lg:items-stretch">
            <div className="tarjeta overflow-hidden p-0 lg:col-span-7">
              <GloboCobertura className="h-[380px] md:h-[520px]" />
            </div>

            <div className="flex flex-col gap-4 lg:col-span-5">
              {zonas.map((z) => (
                <article key={z.nombre} className="tarjeta flex-1 p-7">
                  <h2 className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-[-0.01em] text-navy">
                    <MapPin size={17} aria-hidden className="shrink-0 text-blue-500" />
                    {z.nombre}
                  </h2>
                  <p className="mt-3 font-body text-sm leading-relaxed text-slate">{z.detalle}</p>
                  <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1.5 font-body text-[12px] font-semibold text-blue-700">
                    <Building size={13} aria-hidden />
                    Oficina en {z.oficina}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="tarjeta mt-6 flex flex-wrap items-center justify-between gap-6 p-7 md:p-9">
            <div>
              <p className="flex items-center gap-2.5 font-display text-xl font-semibold tracking-[-0.015em] text-navy">
                <Clock size={19} aria-hidden className="text-blue-500" />
                Aviso de siniestros 24/7
              </p>
              <p className="mt-2 font-body text-sm text-slate">
                Recibido el aviso, el expediente se activa y se designa ajustador.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a href="tel:+18097929384" className="btn">
                <Phone size={16} aria-hidden />
                809-792-9384
              </a>
              <Link href="/someter-reclamo" className="btn-claro">
                Asignar un reclamo
              </Link>
            </div>
          </div>

          <p className="mt-10 text-center font-body text-[13px] leading-relaxed text-slate">
            La esfera es una representación abstracta: sitúa la República Dominicana en
            sus coordenadas reales, sin dibujar contornos costeros.
          </p>
        </div>
      </main>

      <Footer />
    </>
  )
}
