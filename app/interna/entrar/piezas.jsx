/**
 * Piezas comunes de las pantallas de acceso a Interna. Son formularios HTML
 * normales que envían a /api/auth/*: funcionan sin JavaScript y no exponen
 * nada en el cliente.
 */

export function Tarjeta({ titulo, descripcion, children }) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-white p-8 shadow-media">
        <p className="text-xs font-600 tracking-widest text-gold uppercase">Uso interno</p>
        <h1 className="mt-2 font-display text-2xl font-600 text-navy">{titulo}</h1>
        {descripcion ? <p className="mt-2 text-sm leading-relaxed text-slate">{descripcion}</p> : null}
        {children}
      </div>
    </main>
  )
}

export function Aviso({ tono = 'error', children }) {
  const estilo =
    tono === 'ok'
      ? 'border-blue-200 bg-blue-50 text-navy'
      : 'border-signal/30 bg-signal/5 text-signalink'
  return (
    <p role={tono === 'ok' ? 'status' : 'alert'} className={`mt-5 rounded-xl border px-3 py-2 text-sm ${estilo}`}>
      {children}
    </p>
  )
}

export function Campo({ etiqueta, ayuda, ...props }) {
  return (
    <label className="block">
      <span className="block font-body text-[13px] font-semibold text-navy">{etiqueta}</span>
      <input
        {...props}
        className="mt-2 min-h-12 w-full rounded-2xl border border-line bg-white px-4 py-3 font-body text-sm text-navy transition-colors duration-200 placeholder:text-slate-soft focus:border-blue-300 focus:ring-4 focus:ring-blue-100 focus:outline-none"
      />
      {ayuda ? <span className="mt-1.5 block text-xs text-slate">{ayuda}</span> : null}
    </label>
  )
}

export function Boton({ children }) {
  return (
    <button
      type="submit"
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-navy px-4 py-3 text-sm font-500 text-white shadow-boton transition hover:bg-blue-900"
    >
      {children}
    </button>
  )
}
