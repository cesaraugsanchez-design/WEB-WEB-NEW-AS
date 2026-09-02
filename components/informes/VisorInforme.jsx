'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react'

/**
 * Visor de informe pagina a pagina.
 *
 * LO QUE PROTEGE Y LO QUE NO. El PDF original nunca se publica: solo salen
 * imagenes de sus paginas, asi que nadie puede obtener el documento. Lo que NO
 * evita —ni esto ni ninguna otra tecnologia— es que quien lo vea haga una
 * captura de pantalla. Si el navegador lo pinta, los pixeles ya estan en su
 * maquina.
 *
 * Por eso aqui no hay bloqueo de clic derecho ni capas transparentes encima:
 * molestan a quien mira de buena fe, no detienen a nadie, y dan una sensacion
 * de seguridad que no existe. `draggable={false}` es lo unico que se pone, y es
 * comodidad, no proteccion.
 */

/**
 * Controles de paginacion. Se repiten arriba y abajo —una pagina de informe es
 * alta y obligar a bajar hasta el final para pasar a la siguiente es un peaje
 * en cada pagina— pero SOLO UNO lleva `aria-live`: dos regiones anunciando lo
 * mismo hacen que el lector de pantalla lo diga dos veces.
 */
function Controles({ pagina, total, ir, vivo, oscuro = false }) {
  const boton = oscuro
    ? 'text-mist hover:bg-white/10 hover:text-white disabled:hover:bg-transparent'
    : 'text-slate hover:bg-blue-50 hover:text-navy disabled:hover:bg-transparent'

  return (
    <div className={`flex items-center justify-between gap-4 px-5 py-3 ${oscuro ? '' : 'bg-white'}`}>
      <button
        type="button"
        onClick={() => ir(pagina - 1)}
        disabled={pagina === 0}
        className={`flex min-h-11 items-center gap-1.5 rounded-full px-4 font-body text-sm font-medium transition-colors disabled:opacity-40 ${boton}`}
      >
        <ChevronLeft size={16} aria-hidden />
        Anterior
      </button>

      <p
        {...(vivo ? { 'aria-live': 'polite' } : { 'aria-hidden': true })}
        className={`font-body text-sm ${oscuro ? 'text-mist' : 'text-slate'}`}
      >
        Página {pagina + 1} de {total}
      </p>

      <button
        type="button"
        onClick={() => ir(pagina + 1)}
        disabled={pagina === total - 1}
        className={`flex min-h-11 items-center gap-1.5 rounded-full px-4 font-body text-sm font-medium transition-colors disabled:opacity-40 ${boton}`}
      >
        Siguiente
        <ChevronRight size={16} aria-hidden />
      </button>
    </div>
  )
}

export default function VisorInforme({ informe }) {
  const [pagina, setPagina] = useState(0)
  const [ampliado, setAmpliado] = useState(false)
  const total = informe.paginas.length

  const ir = (n) => setPagina(Math.min(Math.max(n, 0), total - 1))

  /* Flechas del teclado mientras esta ampliado: es lo que espera cualquiera
     que abra un documento a pantalla completa, y ahi no hay nada mas que
     navegar. Escape cierra. */
  useEffect(() => {
    if (!ampliado) return
    const alTeclado = (e) => {
      if (e.key === 'ArrowLeft') ir(pagina - 1)
      else if (e.key === 'ArrowRight') ir(pagina + 1)
      else if (e.key === 'Escape') setAmpliado(false)
    }
    window.addEventListener('keydown', alTeclado)
    return () => window.removeEventListener('keydown', alTeclado)
  }, [ampliado, pagina, total])

  const imagen = (clase, prioridad) => (
    <Image
      src={informe.paginas[pagina]}
      alt={`Página ${pagina + 1} de ${total} — ${informe.titulo}`}
      width={1600}
      height={2070}
      priority={prioridad}
      draggable={false}
      className={clase}
    />
  )

  return (
    <>
      <div className="overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-suave">
        {total > 1 && (
          <div className="border-b border-line">
            <Controles pagina={pagina} total={total} ir={ir} vivo />
          </div>
        )}

        <div className="relative bg-canvas">
          {imagen('h-auto w-full select-none', pagina === 0)}

          <button
            type="button"
            onClick={() => setAmpliado(true)}
            aria-label="Ver la página a pantalla completa"
            className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/90 text-navy shadow-suave backdrop-blur transition-colors hover:bg-white"
          >
            <Maximize2 size={17} aria-hidden />
          </button>
        </div>

        {total > 1 && (
          <div className="border-t border-line">
            <Controles pagina={pagina} total={total} ir={ir} vivo={false} />
          </div>
        )}
      </div>

      {ampliado && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${informe.titulo}, página ${pagina + 1}`}
          onClick={() => setAmpliado(false)}
          className="fixed inset-0 z-[60] overflow-y-auto bg-navy/90 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={() => setAmpliado(false)}
            aria-label="Cerrar"
            autoFocus
            className="fixed top-5 right-5 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
          >
            <X size={20} aria-hidden />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="mx-auto w-full max-w-4xl px-4 pb-10 md:px-10"
          >
            {/* Los controles de arriba van pegados al borde superior: en una
                pagina alta, al desplazarse hacia abajo se perderian de vista
                justo cuando hacen falta. */}
            {total > 1 && (
              <div className="sticky top-0 z-10 -mx-4 mb-4 bg-navy/80 px-4 pt-4 backdrop-blur md:-mx-10 md:px-10">
                <div className="rounded-full border border-white/15 bg-white/5">
                  <Controles pagina={pagina} total={total} ir={ir} vivo={false} oscuro />
                </div>
              </div>
            )}

            {imagen('h-auto w-full rounded-2xl select-none', true)}

            {total > 1 && (
              <div className="mt-4 rounded-full border border-white/15 bg-white/5">
                <Controles pagina={pagina} total={total} ir={ir} vivo={false} oscuro />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
