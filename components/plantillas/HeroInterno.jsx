/**
 * Cabecera de página interior. Más baja que el hero de portada a propósito: en
 * una página de detalle el visitante ya sabe a qué vino y lo que quiere es
 * llegar al contenido.
 *
 * `resalte` marca una palabra del titular con el degradado de marca; debe
 * aparecer literal dentro de `titulo` o se ignora.
 */
export default function HeroInterno({ pildora, titulo, resalte, entradilla, acciones }) {
  const partes = resalte && titulo.includes(resalte) ? titulo.split(resalte) : null

  return (
    <section className="relative overflow-hidden pt-14 pb-14 md:pt-20 md:pb-20">
      <div
        aria-hidden
        className="orbe h-[46vw] w-[46vw] bg-blue-300/30"
        style={{ top: '-22%', right: '-6%', '--orbe-tiro': '26px' }}
      />

      <div className="section relative">
        <div className="mx-auto max-w-2xl text-center">
          {pildora && <p className="pildora">{pildora}</p>}

          <h1 className="mt-6 font-display text-[clamp(2rem,5.4vw,3.4rem)] leading-[1.08] font-medium tracking-[-0.03em] text-navy">
            {partes ? (
              <>
                {partes[0]}
                <span className="texto-degradado font-semibold">{resalte}</span>
                {partes[1]}
              </>
            ) : (
              titulo
            )}
          </h1>

          {entradilla && (
            <p className="mx-auto mt-6 max-w-xl text-center font-body text-lg leading-relaxed text-slate">
              {entradilla}
            </p>
          )}

          {acciones && (
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">{acciones}</div>
          )}
        </div>
      </div>
    </section>
  )
}
