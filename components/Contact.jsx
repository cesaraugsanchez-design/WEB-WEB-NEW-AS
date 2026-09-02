'use client'

import { useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Instagram, Loader2, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react'
import { LogoMarca } from './Marca'

const campos = [
  { name: 'nombre', label: 'Nombre completo', type: 'text', autoComplete: 'name', required: true },
  { name: 'email', label: 'Correo electrónico', type: 'email', autoComplete: 'email', required: true },
  { name: 'telefono', label: 'Teléfono', type: 'tel', autoComplete: 'tel', required: false },
  { name: 'entidad', label: 'Empresa o aseguradora', type: 'text', autoComplete: 'organization', required: false },
]

function validar(datos) {
  const errores = {}
  if (!datos.nombre?.trim()) errores.nombre = 'Indique su nombre para poder responderle.'
  if (!datos.email?.trim()) {
    errores.email = 'Necesitamos un correo para enviarle la respuesta.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) {
    errores.email = 'El correo no tiene un formato válido. Ejemplo: nombre@empresa.com'
  }
  if (!datos.mensaje?.trim()) {
    errores.mensaje = 'Describa el siniestro o la consulta, aunque sea brevemente.'
  } else if (datos.mensaje.trim().length < 15) {
    errores.mensaje = 'Amplíe un poco más: al menos 15 caracteres.'
  }
  return errores
}

const datosContacto = [
  { icon: Phone, rotulo: 'Teléfono', valor: '809-792-9384', href: 'tel:+18097929384' },
  { icon: Mail, rotulo: 'Correo', valor: 'recepcion@assanch.com', href: 'mailto:recepcion@assanch.com' },
  {
    icon: MapPin,
    rotulo: 'Oficina principal',
    valor: 'Av. San Vicente de Paul, Esq. Activo 20/30, Alma Rosa II, Santo Domingo Este',
  },
  { icon: Instagram, rotulo: 'Redes', valor: '@assanchadsrd' },
]

export default function Contact() {
  const [errores, setErrores] = useState({})
  const [estado, setEstado] = useState('idle')
  const resumenRef = useRef(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const datos = Object.fromEntries(new FormData(form))
    const errs = validar(datos)
    setErrores(errs)

    if (Object.keys(errs).length) {
      if (Object.keys(errs).length > 1) requestAnimationFrame(() => resumenRef.current?.focus())
      else form.elements[Object.keys(errs)[0]]?.focus()
      return
    }

    setEstado('enviando')
    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      })
      if (!res.ok) throw new Error('respuesta no válida')
      setEstado('ok')
      form.reset()
    } catch {
      setEstado('fallo')
    }
  }

  const listaErrores = Object.entries(errores)
  const inputCls =
    'mt-2 min-h-12 w-full rounded-2xl border border-line bg-canvas px-4 font-body text-navy transition-colors placeholder:text-slate-soft focus:border-blue-300 focus:bg-white focus:outline-none'

  return (
    <section id="contacto" className="relative scroll-mt-28 overflow-hidden py-24 md:py-32" data-reveal-group>
      <div
        aria-hidden
        className="orbe h-[46vw] w-[46vw] bg-blue-300/35"
        style={{ top: '-8%', left: '30%', '--orbe-tiro': '28px' }}
      />

      <div className="section relative">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="pildora">Contacto</p>
          <h2 className="mt-6 font-display text-4xl leading-[1.08] font-medium tracking-[-0.03em] text-navy md:text-5xl">
            Permítanos ser su{' '}
            <span className="texto-degradado font-semibold">aliado de confianza</span>.
          </h2>
          <p className="mt-6 font-body text-lg leading-relaxed text-slate">
            Estamos listos para responder con la profesionalidad y rapidez que su caso
            requiere.
          </p>
        </div>

        {/* El corte va en lg y no en md: entre 768 y 1024 la columna de datos
            queda tan estrecha que parte el correo a mitad de palabra. */}
        <div className="mt-16 grid gap-6 lg:grid-cols-12">
          {/* Datos de contacto: ancla visual oscura de la sección.
              El relieve se construye por capas — halo interior arriba, resplandor
              radial y sombra larga — igual que en los botones. */}
          <div className="reveal banda-oscura lg:col-span-5">
            <div className="relative flex h-full flex-col overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#22323F] via-[#1A2833] to-[#16212A] p-8 shadow-[inset_0_1px_0_rgb(255_255_255/0.16),0_2px_6px_rgb(19_27_33/0.24),0_28px_60px_-24px_rgb(19_27_33/0.55)] md:p-9">
              {/* Resplandor y marca de agua */}
              <div
                aria-hidden
                className="pointer-events-none absolute -top-24 -right-20 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-gold/10 blur-3xl"
              />
              <LogoMarca
                mono
                decorativo
                size={230}
                className="pointer-events-none absolute -right-14 -bottom-16 text-white/[0.06] opacity-90"
              />

              <div className="relative">
                <p className="pildora">Atención 24/7</p>

                <p className="mt-7 font-display text-2xl leading-snug font-medium tracking-[-0.02em] text-white">
                  Un aviso de siniestro activa el expediente en horas.
                </p>

                <ul className="mt-8 space-y-2">
                  {datosContacto.map(({ icon: Icon, rotulo, valor, href }) => {
                    const Fila = href ? 'a' : 'div'
                    return (
                      <li key={rotulo}>
                        <Fila
                          {...(href ? { href } : {})}
                          className={`flex items-start gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.04] p-4 transition-colors duration-300 ${
                            href ? 'hover:border-gold/40 hover:bg-white/[0.08]' : ''
                          }`}
                        >
                          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
                            <Icon size={16} strokeWidth={1.9} aria-hidden />
                          </span>
                          <span className="min-w-0">
                            <span className="block font-body text-[10px] font-semibold tracking-[0.14em] text-mist uppercase">
                              {rotulo}
                            </span>
                            <span className="mt-1 block font-body leading-relaxed break-words text-white">
                              {valor}
                            </span>
                          </span>
                        </Fila>
                      </li>
                    )
                  })}
                </ul>

                {/* WhatsApp de recepcion. `wa.me` exige el numero en formato
                    internacional sin signos: RD es +1 y el prefijo 829. */}
                <a
                  href="https://wa.me/18299187725"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex min-h-13 w-full items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 font-body text-[15px] font-semibold text-[#0B2E13] shadow-[0_10px_26px_-12px_rgba(37,211,102,0.9)] transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <MessageCircle size={18} aria-hidden />
                  Escribir por WhatsApp
                </a>
                <p className="mt-2.5 text-center font-body text-[12px] text-mist">
                  Recepción · 829-918-7725
                </p>
              </div>
            </div>
          </div>

          <div className="reveal lg:col-span-7">
            <form
              onSubmit={onSubmit}
              noValidate
              /* h-full: sin esto el formulario se ajusta a su contenido (645px)
                 mientras la tarjeta oscura llega a 701px, y los bordes
                 inferiores de ambas columnas no coinciden. */
              className="flex h-full flex-col rounded-[2.5rem] border border-line bg-white p-7 shadow-suave md:p-9"
            >
              {listaErrores.length > 1 && (
                <div
                  ref={resumenRef}
                  tabIndex={-1}
                  role="alert"
                  className="mb-8 rounded-2xl border border-signal/30 bg-signal/5 p-5"
                >
                  <p className="flex items-center gap-2 font-display font-semibold text-navy">
                    <AlertCircle size={18} className="text-signal" aria-hidden />
                    Revise {listaErrores.length} campos antes de enviar
                  </p>
                  <ul className="mt-3 space-y-1 pl-6 font-body text-sm text-slate">
                    {listaErrores.map(([campo, msg]) => (
                      <li key={campo} className="list-disc">
                        <a href={`#campo-${campo}`} className="underline hover:text-blue-700">
                          {msg}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Trampa anti-bot: invisible, fuera del orden de tabulación y
                oculta a lectores de pantalla. Ninguna persona la rellena. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="campo-sitioWeb">No rellenar</label>
              <input
                id="campo-sitioWeb"
                name="sitioWeb"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                {campos.map((c) => (
                  <div key={c.name} className={c.name === 'nombre' ? 'sm:col-span-2' : ''}>
                    <label
                      htmlFor={`campo-${c.name}`}
                      className="block font-body text-[11px] font-semibold tracking-[0.12em] text-slate uppercase"
                    >
                      {c.label}
                      {c.required && (
                        <span className="text-blue-700" aria-hidden>
                          {' '}
                          *
                        </span>
                      )}
                      {c.required && <span className="sr-only"> (obligatorio)</span>}
                    </label>
                    <input
                      id={`campo-${c.name}`}
                      name={c.name}
                      type={c.type}
                      autoComplete={c.autoComplete}
                      aria-invalid={errores[c.name] ? 'true' : undefined}
                      aria-describedby={errores[c.name] ? `error-${c.name}` : undefined}
                      className={inputCls}
                    />
                    {errores[c.name] && (
                      <p id={`error-${c.name}`} className="mt-2 font-body text-sm text-signal">
                        {errores[c.name]}
                      </p>
                    )}
                  </div>
                ))}

                <div className="sm:col-span-2">
                  <label
                    htmlFor="campo-mensaje"
                    className="block font-body text-[11px] font-semibold tracking-[0.12em] text-slate uppercase"
                  >
                    Descripción del caso
                    <span className="text-blue-700" aria-hidden>
                      {' '}
                      *
                    </span>
                    <span className="sr-only"> (obligatorio)</span>
                  </label>
                  <textarea
                    id="campo-mensaje"
                    name="mensaje"
                    rows={5}
                    aria-invalid={errores.mensaje ? 'true' : undefined}
                    aria-describedby={errores.mensaje ? 'error-mensaje ayuda-mensaje' : 'ayuda-mensaje'}
                    className="mt-2 w-full rounded-2xl border border-line bg-canvas p-4 font-body text-navy transition-colors focus:border-blue-300 focus:bg-white focus:outline-none"
                  />
                  <p id="ayuda-mensaje" className="mt-2 font-body text-xs text-slate">
                    Incluya fecha, ubicación y tipo de siniestro si aplica.
                  </p>
                  {errores.mensaje && (
                    <p id="error-mensaje" className="mt-1 font-body text-sm text-signal">
                      {errores.mensaje}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-5">
                <button type="submit" disabled={estado === 'enviando'} data-iman className="btn disabled:opacity-50">
                  {estado === 'enviando' ? (
                    <>
                      <Loader2 size={16} className="animate-spin" aria-hidden /> Enviando…
                    </>
                  ) : (
                    <>
                      Solicitar evaluación <Send size={16} aria-hidden />
                    </>
                  )}
                </button>

                <p aria-live="polite" className="font-body text-sm">
                  {estado === 'ok' && (
                    <span className="inline-flex items-center gap-2 text-blue-700">
                      <CheckCircle2 size={16} aria-hidden />
                      Recibido. Le contactamos a la brevedad.
                    </span>
                  )}
                  {estado === 'fallo' && (
                    <span className="inline-flex items-center gap-2 text-signal">
                      <AlertCircle size={16} aria-hidden />
                      No se pudo enviar. Llámenos al 809-792-9384.
                    </span>
                  )}
                </p>
              </div>

              {/* Desvio para el trafico que no viene a pedir cotizacion sino a
                  asignar un caso: ese visitante necesita el formulario de
                  reclamo, no este. */}
              <p className="mt-7 border-t border-line pt-6 font-body text-sm text-slate">
                ¿Es una aseguradora y viene a asignar un siniestro?{' '}
                <a
                  href="/someter-reclamo"
                  className="font-semibold text-blue-700 underline underline-offset-4 hover:text-blue-500"
                >
                  Asigne el reclamo aquí
                </a>
                .
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
