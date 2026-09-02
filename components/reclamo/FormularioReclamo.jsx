'use client'

import { useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react'
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

const HOY = () => new Date().toISOString().slice(0, 10)

/**
 * Mensajes de error: cada uno dice qué falta Y cómo resolverlo. «Campo
 * obligatorio» obliga al usuario a deducir qué esperábamos; eso es trabajo que
 * nos toca a nosotros, no a quien reporta un siniestro a las 2 de la mañana.
 */
function validar(d) {
  const e = {}

  if (!d.aseguradora) e.aseguradora = 'Elija la compañía que reporta el siniestro.'
  if (d.aseguradora === OTRA_ASEGURADORA && !d.aseguradoraOtra.trim()) {
    e.aseguradoraOtra = 'Escriba el nombre de la compañía.'
  }
  if (!d.ejecutivo.trim()) e.ejecutivo = 'Indique quién reporta, para saber a quién dirigirnos.'

  if (!d.correo.trim()) e.correo = 'Necesitamos un correo para enviarle el acuse de recibo.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.correo)) {
    e.correo = 'El correo no tiene formato válido. Ejemplo: nombre@empresa.com'
  }

  if (!d.telefono.trim()) e.telefono = 'Un teléfono directo agiliza la primera llamada.'
  if (!d.numeroReclamo.trim()) e.numeroReclamo = 'Indique el número que asignó su sistema al reclamo.'
  if (!d.ramo) e.ramo = 'Elija el ramo: determina qué ajustador se asigna.'

  if (!d.fechaSiniestro) e.fechaSiniestro = 'Indique cuándo ocurrió el siniestro.'
  else if (d.fechaSiniestro > HOY()) e.fechaSiniestro = 'La fecha no puede ser futura.'

  if (!d.provincia) e.provincia = 'Elija la provincia: determina qué oficina atiende el caso.'
  if (!d.direccion.trim()) e.direccion = 'Sin dirección no podemos movilizar al perito.'

  if (!d.descripcion.trim()) e.descripcion = 'Describa lo ocurrido, aunque sea brevemente.'
  else if (d.descripcion.trim().length < 15) {
    e.descripcion = 'Amplíe un poco más: al menos 15 caracteres.'
  }

  if (!d.asegurado.trim()) e.asegurado = 'Indique a nombre de quién está la póliza.'

  return e
}

const etiqueta = 'block font-body text-[13px] font-semibold text-navy'
const base =
  'mt-2 min-h-12 w-full scroll-mt-32 rounded-2xl border bg-white px-4 py-3 font-body text-sm text-navy transition-colors duration-200 placeholder:text-slate-soft focus:outline-none focus:ring-4'
const normal = 'border-line focus:border-blue-300 focus:ring-blue-100'
/* El rojo del borde no basta: por eso además va el texto del error debajo y el
   resumen enlazado arriba. El color solo nunca comunica el estado. */
const malo = 'border-signal focus:border-signal focus:ring-signal/15'

function Requerido() {
  return (
    <>
      <span aria-hidden className="text-blue-700"> *</span>
      <span className="sr-only"> (obligatorio)</span>
    </>
  )
}

/**
 * Envuelve etiqueta, control y error, y cablea `aria-describedby` /
 * `aria-invalid` una sola vez. Repetir ese cableado en doce campos garantiza
 * que alguno se quede sin él.
 */
function Campo({ id, label, requerido, error, ayuda, ancho = '', children }) {
  const idError = `${id}-error`
  const idAyuda = `${id}-ayuda`
  const describe = [error && idError, ayuda && idAyuda].filter(Boolean).join(' ')

  return (
    <div className={ancho}>
      <label htmlFor={id} className={etiqueta}>
        {label}
        {requerido && <Requerido />}
      </label>

      {children({
        id,
        'aria-invalid': error ? 'true' : undefined,
        'aria-describedby': describe || undefined,
        className: `${base} ${error ? malo : normal}`,
      })}

      {ayuda && (
        <p id={idAyuda} className="mt-1.5 font-body text-xs text-slate">
          {ayuda}
        </p>
      )}

      {error && (
        <p id={idError} className="mt-1.5 flex items-start gap-1.5 font-body text-xs text-signalink">
          <AlertCircle size={13} aria-hidden className="mt-px shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}

export default function FormularioReclamo({ inicial = {} }) {
  const [datos, setDatos] = useState({ ...VACIO, ...inicial })
  const [errores, setErrores] = useState({})
  const [tocados, setTocados] = useState({})
  const [archivos, setArchivos] = useState([])
  const [estado, setEstado] = useState('reposo') // reposo | enviando | listo | error
  const [error, setError] = useState('')
  const [referencia, setReferencia] = useState('')
  const resumenRef = useRef(null)

  /* Se valida al salir del campo, no en cada tecla: marcar «correo inválido»
     mientras alguien escribe la primera letra es hostil. Una vez que el campo
     YA tiene error, sí se revalida al escribir, para que el aviso desaparezca
     en cuanto se corrige. */
  const set = (k) => (e) => {
    const nuevos = { ...datos, [k]: e.target.value }
    setDatos(nuevos)
    if (errores[k]) setErrores(validar(nuevos))
  }

  const alSalir = (k) => () => {
    setTocados((t) => ({ ...t, [k]: true }))
    const todos = validar(datos)
    setErrores((e) => ({ ...e, [k]: todos[k] }))
  }

  const err = (k) => (tocados[k] ? errores[k] : undefined)

  async function enviar(e) {
    e.preventDefault()

    const errs = validar(datos)
    const claves = Object.keys(errs)
    if (claves.length) {
      setErrores(errs)
      setTocados(Object.fromEntries(claves.map((k) => [k, true])))
      /* Con varios errores el foco va al resumen: saltar al primer campo
         esconde que hay otros nueve esperando. Con uno solo, al campo. */
      requestAnimationFrame(() => {
        if (claves.length > 1) resumenRef.current?.focus()
        else document.getElementById(claves[0])?.focus()
      })
      return
    }

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
        <h2 className="mt-5 font-display text-2xl font-medium text-navy">Reclamo recibido</h2>
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

  const lista = Object.entries(errores).filter(([, m]) => m)

  return (
    /* noValidate: las burbujas nativas del navegador muestran un error a la vez,
       se cierran solas y no se pueden enlazar desde un resumen. La validación
       propia sí. El servidor repite la suya de todos modos. */
    <form onSubmit={enviar} noValidate className="tarjeta p-6 sm:p-9">
      {lista.length > 1 && (
        <div
          ref={resumenRef}
          tabIndex={-1}
          role="alert"
          aria-labelledby="titulo-errores"
          className="mb-9 scroll-mt-28 rounded-2xl border border-signal/30 bg-signal/5 p-5 focus:outline-none focus:ring-4 focus:ring-signal/15"
        >
          <p id="titulo-errores" className="flex items-center gap-2 font-display font-semibold text-navy">
            <AlertCircle size={18} aria-hidden className="text-signal" />
            Revise {lista.length} campos antes de enviar
          </p>
          <ul className="mt-3 space-y-1 pl-6 font-body text-sm text-slate">
            {lista.map(([campo, msg]) => (
              <li key={campo} className="list-disc">
                <a href={`#${campo}`} className="underline underline-offset-2 hover:text-blue-700">
                  {msg}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ---------- Quién reporta ---------- */}
      <fieldset className="border-0 p-0">
        <legend className="font-display text-lg font-medium text-navy">Quién reporta</legend>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Campo id="aseguradora" label="Aseguradora" requerido error={err('aseguradora')}>
            {(p) => (
              <select {...p} value={datos.aseguradora} onChange={set('aseguradora')} onBlur={alSalir('aseguradora')}>
                <option value="">Seleccione…</option>
                {aseguradoras.map((a) => (
                  <option key={a.slug} value={a.nombre}>{a.nombre}</option>
                ))}
                <option value={OTRA_ASEGURADORA}>{OTRA_ASEGURADORA}</option>
              </select>
            )}
          </Campo>

          <Campo id="ejecutivo" label="Ejecutivo que reporta" requerido error={err('ejecutivo')}>
            {(p) => (
              <input {...p} autoComplete="name" value={datos.ejecutivo} onChange={set('ejecutivo')} onBlur={alSalir('ejecutivo')} />
            )}
          </Campo>

          {/* Solo aparece si la lista no cubre la compañía: pedir siempre el
              nombre libre duplicaría el dato del desplegable. */}
          {datos.aseguradora === OTRA_ASEGURADORA && (
            <Campo id="aseguradoraOtra" label="Nombre de la aseguradora" requerido error={err('aseguradoraOtra')} ancho="sm:col-span-2">
              {(p) => (
                <input {...p} autoComplete="organization" value={datos.aseguradoraOtra} onChange={set('aseguradoraOtra')} onBlur={alSalir('aseguradoraOtra')} />
              )}
            </Campo>
          )}

          <Campo id="correo" label="Correo" requerido error={err('correo')} ayuda="Ahí llega el acuse con el número de referencia.">
            {(p) => (
              <input {...p} type="email" inputMode="email" autoComplete="email" value={datos.correo} onChange={set('correo')} onBlur={alSalir('correo')} />
            )}
          </Campo>

          <Campo id="telefono" label="Teléfono" requerido error={err('telefono')}>
            {(p) => (
              <input {...p} type="tel" inputMode="tel" autoComplete="tel" placeholder="809-000-0000" value={datos.telefono} onChange={set('telefono')} onBlur={alSalir('telefono')} />
            )}
          </Campo>
        </div>
      </fieldset>

      {/* ---------- El siniestro ---------- */}
      <fieldset className="mt-10 border-0 p-0">
        <legend className="font-display text-lg font-medium text-navy">El siniestro</legend>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Campo id="numeroReclamo" label="Nº de reclamo" requerido error={err('numeroReclamo')} ayuda="El que asignó el sistema de su compañía.">
            {(p) => (
              <input {...p} value={datos.numeroReclamo} onChange={set('numeroReclamo')} onBlur={alSalir('numeroReclamo')} />
            )}
          </Campo>

          <Campo id="ramo" label="Ramo" requerido error={err('ramo')}>
            {(p) => (
              <select {...p} value={datos.ramo} onChange={set('ramo')} onBlur={alSalir('ramo')}>
                <option value="">Seleccione…</option>
                {nombresRamos.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            )}
          </Campo>

          <Campo id="fechaSiniestro" label="Fecha del siniestro" requerido error={err('fechaSiniestro')}>
            {(p) => (
              <input {...p} type="date" max={HOY()} value={datos.fechaSiniestro} onChange={set('fechaSiniestro')} onBlur={alSalir('fechaSiniestro')} />
            )}
          </Campo>

          <Campo id="provincia" label="Provincia" requerido error={err('provincia')}>
            {(p) => (
              <select {...p} value={datos.provincia} onChange={set('provincia')} onBlur={alSalir('provincia')}>
                <option value="">Seleccione…</option>
                {provincias.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            )}
          </Campo>

          <Campo id="direccion" label="Dirección del riesgo" requerido error={err('direccion')} ancho="sm:col-span-2" ayuda="Calle, número, sector y un punto de referencia cercano.">
            {(p) => (
              <input {...p} autoComplete="street-address" value={datos.direccion} onChange={set('direccion')} onBlur={alSalir('direccion')} />
            )}
          </Campo>

          <Campo id="descripcion" label="Qué ocurrió" requerido error={err('descripcion')} ancho="sm:col-span-2" ayuda="Causa aparente, bienes afectados y estado actual del riesgo.">
            {(p) => (
              <textarea {...p} rows={5} className={`${p.className} resize-y`} value={datos.descripcion} onChange={set('descripcion')} onBlur={alSalir('descripcion')} />
            )}
          </Campo>
        </div>
      </fieldset>

      {/* ---------- Asegurado y documentos ---------- */}
      <fieldset className="mt-10 border-0 p-0">
        <legend className="font-display text-lg font-medium text-navy">Asegurado y documentos</legend>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Campo id="asegurado" label="Nombre del asegurado" requerido error={err('asegurado')}>
            {(p) => (
              <input {...p} value={datos.asegurado} onChange={set('asegurado')} onBlur={alSalir('asegurado')} />
            )}
          </Campo>

          <Campo id="telefonoAsegurado" label="Teléfono del asegurado" ayuda="Opcional. Nos permite coordinar la inspección directamente.">
            {(p) => (
              <input {...p} type="tel" inputMode="tel" value={datos.telefonoAsegurado} onChange={set('telefonoAsegurado')} />
            )}
          </Campo>
        </div>

        <div className="mt-6">
          <p className={etiqueta}>Adjuntos</p>
          <div className="mt-2">
            <ZonaAdjuntos archivos={archivos} onCambio={setArchivos} />
          </div>
        </div>
      </fieldset>

      {/* Trampa anti-bot: fuera de pantalla y fuera del árbol de accesibilidad,
          pero rellenable por un script automatizado. */}
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

        <p className="font-body text-xs text-slate">
          Los campos con <span className="text-blue-700">*</span> son obligatorios.
        </p>
      </div>

      {estado === 'error' && (
        <div role="alert" className="mt-5 rounded-2xl border border-signal/30 bg-signal/5 p-5">
          <p className="flex items-start gap-2 font-body text-sm font-semibold text-navy">
            <AlertCircle size={16} aria-hidden className="mt-0.5 shrink-0 text-signal" />
            {error}
          </p>
          {/* Toda salida de error necesita camino de salida: aquí, dos. */}
          <p className="mt-2 pl-6 font-body text-sm text-slate">
            Reporte el siniestro al{' '}
            <a href="tel:+18097929384" className="font-semibold text-blue-700 underline underline-offset-2">809-792-9384</a>{' '}
            o a{' '}
            <a href="mailto:recepcion@assanch.com" className="font-semibold text-blue-700 underline underline-offset-2">recepcion@assanch.com</a>.
          </p>
        </div>
      )}
    </form>
  )
}
