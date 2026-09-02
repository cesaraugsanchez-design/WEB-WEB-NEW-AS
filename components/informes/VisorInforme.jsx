'use client'

import { useState } from 'react'
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
export default function VisorInforme({ informe }) {
  const [pagina, setPagina] = useState(0)
  const [ampliado, setAmpliado] = useState(false)
  const total = informe.paginas.length

  const ir = (n) => setPagina(Math.min(Math.max(n, 0), total - 1))

  const imagen = (clase, prioridad) => (
    <Image
      src={informe.paginas[pagina]}
      alt={`Pagina ${pagina + 1} de ${total} del ${informe.titulo}`}
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
        <div className="relative bg-canvas">
          {imagen('h-auto w-full select-none', pagina === 0)}

          <button
            type="button"
            onClick={() => setAmpliado(true)}
            aria-label="Ver la pagina a pantalla completa"
            className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/90 text-navy shadow-suave backdrop-blur transition-colors hover:bg-white"
          >
            <Maximize2 size={17} aria-hidden />
          </button>
        </div>

        {total > 1 && (
          <div className="flex items-center justify-between gap-4 border-t border-line px-5 py-3">
            <button
              type="button"
              onClick={() => ir(pagina - 1)}
              disabled={pagina === 0}
              className="flex min-h-11 items-center gap-1.5 rounded-full px-4 font-body text-sm font-medium text-slate transition-colors hover:bg-blue-50 hover:text-navy disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <ChevronLeft size={16} aria-hidden />
              Anterior
            </button>

            <p aria-live="polite" className="font-body text-sm text-slate">
              Pagina {pagina + 1} de {total}
            </p>

            <button
              type="button"
              onClick={() => ir(pagina + 1)}
              disabled={pagina === total - 1}
              className="flex min-h-11 items-center gap-1.5 rounded-full px-4 font-body text-sm font-medium text-slate transition-colors hover:bg-blue-50 hover:text-navy disabled:opacity-40 disabled:hover:bg-transparent"
            >
              Siguiente
              <ChevronRight size={16} aria-hidden />
            </button>
          </div>
        )}
      </div>

      {ampliado && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${informe.titulo}, pagina ${pagina + 1}`}
          onClick={() => setAmpliado(false)}
          onKeyDown={(e) => e.key === 'Escape' && setAmpliado(false)}
          className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-navy/90 p-4 backdrop-blur-sm md:p-10"
        >
          <button
            type="button"
            onClick={() => setAmpliado(false)}
            aria-label="Cerrar"
            autoFocus
            className="fixed top-5 right-5 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
          >
            <X size={20} aria-hidden />
          </button>

          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-4xl">
            {imagen('h-auto w-full rounded-2xl select-none', true)}
          </div>
        </div>
      )}
    </>
  )
}
