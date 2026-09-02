'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2, Send } from 'lucide-react'
import { OTRA_ASEGURADORA, aseguradoras } from '@/lib/contenido/aseguradoras'
import { provincias } from '@/lib/contenido/provincias'
import { nombresRamos } from '@/lib/contenido/ramos'
import ZonaAdjuntos from './ZonaAdjuntos'

/* Campos deliberadamente FUERA del formulario: número de póliza, estimado de
   pérdida, moneda y permiso de contacto. Todo eso viene en la póliza adjunta o
   se resuelve en la primera llamada; pedirlo aquí alarga el envío sin adelantar
   el trabajo del ajustador. Lo que queda es lo mínimo para movilizar a un perito
   y abrir expediente. */

const VACIO = {
  aseguradora: '',
  aseguradoraOtra: '',
  ejecutivo: '',
  correo: '',
  telefono: '',
  numeroReclamo: '',
  ramo: '',
  fechaSiniestro: '',
  provincia: '',
  direccion: '',
  descripcion: '',
  asegurado: '',
  telefonoAsegurado: '',
  sitioWeb: '', // trampa anti-bot
}

const etiqueta =
  'block font-body text-[13px] font-semibold text-navy'
const campo =
  'mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 font-body text-sm text-navy transition-colors duration-200 placeholder:text-slate-soft focus:border-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-100'

function Requerido() {
  return (
    <>
      <span aria-hidden className="text-signal"> *</span>
      <span className="sr-only"> (obligatorio)</span>
    </>
  )
}

export default function FormularioReclamo({ inicial = {} }) {
  const [datos, setDatos] = useState({ ...VACIO, ...inicial })
  const [archivos, setArchivos] = useState([])
  const [estado, setEstado] = useState('reposo') // reposo | enviando | listo | error
  const [error, setError] = useState('')
  const [referencia, setReferencia] = useState('')

  const set = (k) => (e) => setDatos((d) => ({ ...d, [k]: e.target.value }))

  async function enviar(e) {
    e.preventDefault()
    setEstado('enviando')
    setError('')

    /* multipart y no JSON: los archivos viajan en el mismo envío.
       Tope real ~4,5 MB por petición en una función serverless de Vercel; el
       cliente ya recorta a 4 MB antes de llegar aquí. */
    const cuerpo = new FormData()
    for (const [k, v] of Object.entries(datos)) cuerpo.append(k, v)
    for (const a of archivos) cuerpo.append('archivos', a, a.name)

    try {
      const res = await fetch('/api/reclamo', { method: 'POST', body: cuerpo })
      const json = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(json.error || 'No se pudo registrar el reclamo.')
        setEstado('error')
        return
      }
      setReferencia(json.referencia || '')
      setEstado('listo')
    } catch {
      setError('No se pudo conectar con el servidor.')
      setEstado('error')
    }
  }

  if (estado === 'listo') {
    return (
      <div className="tarjeta p-10 text-center" role="status">
        <CheckCircle2 size={40} aria-hidden className="mx-auto text-blue-500" />
        <h2 className="mt-5 font-display text-2xl font-medium text-navy">
          Reclamo recibido
        </h2>
        {referencia && (
          <p className="mt-3 font-body text-sm text-slate">
            Número de referencia:{' '}
            <strong className="font-mono tracking-wide text-navy">{referencia}</strong>
          </p>
        )}
        <p className="mx-auto mt-4 max-w-md text-center font-body text-sm leading-relaxed text-slate">
          Un ajustador se comunicará con usted. Para cualquier consulta llame al{' '}
          <a href="tel:+18097929384" className="font-semibold text-blue-700">809-792-9384</a>{' '}
          citando la referencia.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={enviar} noValidate={false} className="tarjeta p-6 sm:p-9">
      {/* ---------- Quién reporta ---------- */}
      <fieldset className="border-0 p-0">
        <legend className="font-display text-lg font-medium text-navy">
          Quién reporta
        </legend>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="aseguradora" className={etiqueta}>
              Aseguradora<Requerido />
            </label>
            <select id="aseguradora" required value={datos.aseguradora} onChange={set('aseguradora')} className={campo}>
              <option value="">Seleccione…</option>
              {aseguradoras.map((a) => (
                <option key={a.slug} value={a.nombre}>{a.nombre}</option>
              ))}
              <option value={OTRA_ASEGURADORA}>{OTRA_ASEGURADORA}</option>
            </select>
          </div>

          <div>
            <label htmlFor="ejecutivo" className={etiqueta}>
              Ejecutivo que reporta<Requerido />
            </label>
            <input id="ejecutivo" required autoComplete="name" value={datos.ejecutivo} onChange={set('ejecutivo')} className={campo} />
          </div>

          {/* Solo aparece si la lista no cubre la compania: pedir siempre el
              nombre libre duplicaria el dato del desplegable. */}
          {datos.aseguradora === OTRA_ASEGURADORA && (
            <div className="sm:col-span-2">
              <label htmlFor="aseguradoraOtra" className={etiqueta}>
                Nombre de la aseguradora<Requerido />
              </label>
              <input id="aseguradoraOtra" required value={datos.aseguradoraOtra} onChange={set('aseguradoraOtra')} className={campo} />
            </div>
          )}

          <div>
            <label htmlFor="correo" className={etiqueta}>
              Correo<Requerido />
            </label>
            <input id="correo" type="email" required autoComplete="email" value={datos.correo} onChange={set('correo')} className={campo} />
          </div>

          <div>
            <label htmlFor="telefono" className={etiqueta}>
              Teléfono<Requerido />
            </label>
            <input id="telefono" type="tel" required autoComplete="tel" placeholder="809-000-0000" value={datos.telefono} onChange={set('telefono')} className={campo} />
          </div>
        </div>
      </fieldset>

      {/* ---------- El siniestro ---------- */}
      <fieldset className="mt-10 border-0 p-0">
        <legend className="font-display text-lg font-medium text-navy">El siniestro</legend>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="numeroReclamo" className={etiqueta}>
              Nº de reclamo de la aseguradora<Requerido />
            </label>
            <input id="numeroReclamo" required value={datos.numeroReclamo} onChange={set('numeroReclamo')} className={campo} />
          </div>

          <div>
            <label htmlFor="ramo" className={etiqueta}>
              Ramo<Requerido />
            </label>
            <select id="ramo" required value={datos.ramo} onChange={set('ramo')} className={campo}>
              <option value="">Seleccione…</option>
              {nombresRamos.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="fechaSiniestro" className={etiqueta}>
              Fecha del siniestro<Requerido />
            </label>
            <input id="fechaSiniestro" type="date" required max={new Date().toISOString().slice(0, 10)} value={datos.fechaSiniestro} onChange={set('fechaSiniestro')} className={campo} />
          </div>

          <div>
            <label htmlFor="provincia" className={etiqueta}>
              Provincia<Requerido />
            </label>
            <select id="provincia" required value={datos.provincia} onChange={set('provincia')} className={campo}>
              <option value="">Seleccione…</option>
              {provincias.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="direccion" className={etiqueta}>
              Dirección del riesgo<Requerido />
            </label>
            <input id="direccion" required placeholder="Calle, número, sector, referencia" value={datos.direccion} onChange={set('direccion')} className={campo} />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="descripcion" className={etiqueta}>
              Qué ocurrió<Requerido />
            </label>
            <textarea id="descripcion" required minLength={15} rows={5} value={datos.descripcion} onChange={set('descripcion')} className={`${campo} resize-y`} placeholder="Causa aparente, bienes afectados y estado actual del riesgo." />
          </div>
        </div>
      </fieldset>

      {/* ---------- Asegurado y documentos ---------- */}
      <fieldset className="mt-10 border-0 p-0">
        <legend className="font-display text-lg font-medium text-navy">
          Asegurado y documentos
        </legend>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="asegurado" className={etiqueta}>
              Nombre del asegurado<Requerido />
            </label>
            <input id="asegurado" required value={datos.asegurado} onChange={set('asegurado')} className={campo} />
          </div>

          <div>
            <label htmlFor="telefonoAsegurado" className={etiqueta}>
              Teléfono del asegurado
            </label>
            <input id="telefonoAsegurado" type="tel" placeholder="Opcional — agiliza el contacto" value={datos.telefonoAsegurado} onChange={set('telefonoAsegurado')} className={campo} />
          </div>
        </div>

        <div className="mt-6">
          <p className={etiqueta}>Adjuntos</p>
          <div className="mt-2">
            <ZonaAdjuntos archivos={archivos} onCambio={setArchivos} />
          </div>
        </div>
      </fieldset>

      {/* Trampa anti-bot: oculta a la vista y al lector de pantalla, pero
          rellenable por un script automatizado. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="sitioWeb">Sitio web</label>
        <input id="sitioWeb" tabIndex={-1} autoComplete="off" value={datos.sitioWeb} onChange={set('sitioWeb')} />
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-line pt-7">
        <button type="submit" disabled={estado === 'enviando'} className="btn disabled:opacity-60">
          {estado === 'enviando' ? (
            <>
              <Loader2 size={16} aria-hidden className="animate-spin" /> Enviando…
            </>
          ) : (
            <>
              <Send size={16} aria-hidden /> Someter reclamo
            </>
          )}
        </button>

        <p className="font-body text-xs text-slate-soft">
          Los campos con <span className="text-signal">*</span> son obligatorios.
        </p>
      </div>

      <p aria-live="assertive" className="mt-4 font-body text-sm text-signal">
        {estado === 'error' && error}
      </p>

      {estado === 'error' && (
        <p className="mt-1 font-body text-sm text-slate">
          También puede reportarlo al{' '}
          <a href="tel:+18097929384" className="font-semibold text-blue-700">809-792-9384</a>{' '}
          o a{' '}
          <a href="mailto:recepcion@assanch.com" className="font-semibold text-blue-700">recepcion@assanch.com</a>.
        </p>
      )}
    </form>
  )
}
