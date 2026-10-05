'use client'

import { useState } from 'react'
import { Mail, RotateCcw, RotateCw } from 'lucide-react'

/**
 * Equipo.
 *
 * El orden del array es el que se ve en pantalla: socios, ajustadores de campo
 * y administracion.
 *
 * CORREOS: normalizados a minusculas. El usuario los facilito con mayuscula
 * inicial en varios casos («Csanchez», «Recepcion»); la parte local de un
 * correo es tecnicamente sensible a mayusculas, pero ningun proveedor de uso
 * comun lo aplica, y mostrarlos mezclados se lee como una errata. El `mailto`
 * funciona igual en ambos casos.
 *
 * FOTOGRAFIAS: la cara de atras las muestra a sangre, encuadradas de cintura
 * hacia arriba. NO se entregan enteras: se pasan antes por
 *
 *   python3 herramientas/foto-equipo.py retrato.jpg public/equipo/nombre.jpg
 *
 * que recorta la banda correcta en la proporcion 7:10 de la tarjeta. El retrato
 * original se guarda fuera del repositorio. Mientras `foto` este a `null` la
 * ficha muestra el monograma, que identifica sin fingir un retrato.
 *
 * Los cortes se anotan aqui porque el original no esta en el repositorio: si
 * hay que rehacer el recorte, sin estos numeros hay que volver a medirlos a ojo.
 * Los retratos de estudio entregados se cortaron asi:
 *
 *   carlos-sanchez.jpg   4000x6000   --techo 0.045 --cintura 0.68
 *   jose-r-sanchez.jpg   4000x6000   --techo 0.07  --cintura 0.80
 *   jose-f-sanchez.jpg   1435x2000   --techo 0.035 --cintura 0.64
 *   cesar-a-sanchez.jpg  1333x2000   --techo 0.055 --cintura 0.64
 *
 * No coinciden porque las tomas no encuadran igual —la cabeza empieza a distinta
 * altura en cada una—. El corte se mide por foto, no se hereda. Lo que si se
 * iguala es el resultado: en las tres la cabeza ocupa aproximadamente el mismo
 * tercio superior, porque las fichas se ven juntas en la misma rejilla y un
 * encuadre suelto canta.
 *
 * SEMBLANZAS: las de Jose F., Carlos, Jose R. y Cesar A. las dicto ASSANCH.
 * Por eso son las unicas que salen del cargo hacia afuera —antiguedad,
 * trayectoria, de que responde cada quien—: nada de eso se deduce de un titulo.
 *
 * Las cuatro restantes —Julio, Betzaira, Patricio y Katherine— siguen siendo
 * TODO(cliente): estan redactadas solo a partir del cargo que la firma
 * facilito, describen la funcion y nada mas, y no llevan anos ni cifras.
 *
 * El texto es ejecutivo a proposito: tres lineas, unas 90 letras medidas en la
 * rejilla de escritorio, que es la mas estrecha —cuatro columnas de 315 px—.
 * La caja admitiria cinco, pero cada linea de texto es una banda de velo que
 * tapa el retrato, y se prefiere ver a la persona. Pasarse de tres rompe la
 * alineacion entre fichas, que es lo que sostiene `min-h-[4lh]`.
 */
const equipo = [
  {
    nombre: 'José F. Sánchez',
    cargo: 'Presidente',
    correo: 'jf.sanchez@assanch.com',
    socio: true,
    foto: '/equipo/jose-f-sanchez.jpg',
    semblanza:
      'Preside la firma. Más de 25 años como consultor y ajustador, y perito en siniestros catastróficos del país y el Caribe.',
  },
  {
    nombre: 'Carlos Sánchez',
    cargo: 'Gerente general · Líder de automóvil',
    correo: 'csanchez@assanch.com',
    socio: true,
    foto: '/equipo/carlos-sanchez.jpg',
    semblanza:
      'Dirige la firma y la práctica de automóvil. Fija el criterio de ajuste que sigue el área de operaciones e inspectores.',
  },
  {
    nombre: 'José R. Sánchez',
    cargo: 'Perito especialista · Ajustador de riesgos generales',
    correo: 'jr.sanchez@assanch.com',
    socio: true,
    foto: '/equipo/jose-r-sanchez.jpg',
    semblanza:
      'Más de 15 años en riesgos generales. Ha ocupado cargos importantes en el sector seguros a nivel local y regional.',
  },
  {
    nombre: 'Julio Medina',
    cargo: 'Ajustador de riesgos generales y automóvil · Zona Norte',
    correo: 'reclamos.zonanorte@assanch.com',
    foto: null,
    semblanza:
      'Cubre la Zona Norte en riesgos generales y automóvil. Acude al siniestro, levanta la evidencia y cierra el expediente.',
  },
  {
    nombre: 'Betzaira Amparo',
    cargo: 'Oficial de seguimiento de automóvil',
    correo: 'oficialdeseguimiento@assanch.com',
    foto: null,
    semblanza:
      'Sigue cada expediente de automóvil del aviso al cierre. Mantiene informados al asegurado y a la compañía.',
  },
  {
    nombre: 'Patricio Martínez',
    cargo: 'Ajustador de automóvil · Distrito Nacional, Este y Sur',
    correo: 'pmartinez@assanch.com',
    foto: null,
    semblanza:
      'Ajusta automóvil en el Distrito Nacional, Este y Sur. Inspecciona el vehículo y cuantifica la pérdida sobre lo verificado.',
  },
  {
    nombre: 'Katherine Medina',
    cargo: 'Asistente administrativa',
    correo: 'recepcion@assanch.com',
    foto: null,
    semblanza:
      'Primera voz de la firma: recibe el aviso, abre el expediente y encamina cada caso al ajustador que corresponde.',
  },
  {
    nombre: 'César A. Sánchez',
    cargo: 'Marketing y desarrollo de negocios',
    correo: 'ca.sanchez@assanch.com',
    foto: '/equipo/cesar-a-sanchez.jpg',
    semblanza:
      'Abre nuevos negocios y la confianza de aliados y clientes comerciales. Mantiene las métricas de operaciones y la mejora tecnológica.',
  },
]

function iniciales(nombre) {
  /* Se conserva la inicial intermedia: sin ella «José F. Sánchez» y
     «José R. Sánchez» compartirian monograma, igual que «Carlos Sánchez» y
     «César A. Sánchez». */
  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 3)
}

/* El canto y la sombra se escriben a mano en vez de reutilizar `.tarjeta`: esa
   clase levanta la ficha con `transform` al pasar el raton, y aqui el transform
   es el giro. Una regla de hover que pise el `rotateY` deja la cara de atras
   mirando al reves. El levantamiento se hace en el envoltorio, que no gira.

   LA CARA OCULTA NO SE FIA DE `backface-visibility`. En Safari —iPhone y
   iPad— esa propiedad deja de descartar la cara que mira al reves cuando el
   elemento recorta con `overflow: hidden` y esquinas redondeadas, que es
   justo lo que hace falta aqui para que la foto siga el canto de la ficha. El
   resultado es que se ve la otra cara del reves, texto espejado incluido.

   Asi que la cara que no toca se apaga ademas con `visibility`, que ningun
   motor interpreta a su manera. El apagado se retrasa 350 ms —la mitad del
   giro—: en ese instante la ficha esta de canto y no se ve, de modo que el
   cambio es invisible venga de donde venga. Se elige `visibility` y no
   `opacity` porque una opacidad distinta de 1 aplana el contexto 3D en
   algunos motores, que es el mismo problema por otra puerta.

   `backface-visibility` se queda: donde funciona, el descarte es exacto
   fotograma a fotograma y esto solo lo respalda. */
const CARA =
  'absolute inset-0 overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-suave [backface-visibility:hidden] [-webkit-backface-visibility:hidden] transition-[visibility] delay-[350ms] duration-0 motion-reduce:delay-0'

function Ficha({ p }) {
  const [vuelta, setVuelta] = useState(false)
  const girar = () => setVuelta((v) => !v)

  return (
    /* La perspectiva vive en el envoltorio y no en la tarjeta: aplicada sobre el
       propio elemento que gira, el punto de fuga se mueve con el y el giro se ve
       plano. Aqui cada ficha tiene el suyo, asi que gira sobre si misma aunque
       este en la esquina de la rejilla. */
    <li className={`h-100 [perspective:1400px] ${vuelta ? 'relative z-10' : ''}`}>
      {/* La ficha girada crece un 6 %. Es poco a proposito: lo justo para que
          se despegue de las hermanas y para que el retrato gane tamano, sin que
          la rejilla parezca descuadrada. El aumento viaja en el MISMO transform
          que el giro —`rotateY(180deg) scale(1.06)`— porque dos transforms
          sobre el mismo elemento no se suman: el ultimo pisa al anterior, y
          separarlos dejaria la ficha sin girar o sin crecer.

          El `z-10` del <li> no es decorativo: al crecer, la ficha invade unos
          9 px por lado y sin el quedaria por debajo de la siguiente de la fila,
          recortada justo por el borde que acaba de rebasar. */}
      <div
        className={`relative h-full transition-transform duration-[700ms] [transform-style:preserve-3d] motion-reduce:duration-0 ${
          vuelta ? '[transform:rotateY(180deg)_scale(1.06)]' : ''
        }`}
      >
        {/* ---------- Cara delantera ----------
            `pointer-events-none` va sin retraso y `invisible` con el: el raton
            y el teclado tienen que soltar la cara saliente en el acto —si no,
            durante el giro se puede abrir el correo de la cara que ya se va—,
            mientras que apagarla a la vista antes de que la ficha se ponga de
            canto se veria como un parpadeo. */}
        <article
          className={`${CARA} ${vuelta ? 'invisible pointer-events-none' : ''}`}
          aria-hidden={vuelta}
        >
          {/* El boton cubre la ficha entera para que valga pulsar en cualquier
              sitio, y va DEBAJO del contenido en el orden del DOM: asi el enlace
              del correo, que es lo unico con `pointer-events` activos arriba,
              sigue siendo pulsable sin anidar un enlace dentro de un boton
              —que no es HTML valido y rompe el teclado—. */}
          <button
            type="button"
            onClick={girar}
            tabIndex={vuelta ? -1 : 0}
            aria-label={`Ver las funciones de ${p.nombre}`}
            className="absolute inset-0 z-0 cursor-pointer rounded-[1.75rem] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          />

          <div className="pointer-events-none relative z-10 flex h-full flex-col p-6 text-left">
            <span
              className={`flex h-20 w-20 items-center justify-center overflow-hidden rounded-full ring-2 ring-offset-2 ring-offset-white transition-colors duration-500 ${
                p.socio
                  ? 'bg-gradient-to-br from-blue-700 to-blue-500 text-white ring-gold/70'
                  : 'bg-blue-50 text-blue-700 ring-gold/45'
              }`}
            >
              {p.foto ? (
                <img
                  src={p.foto}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover object-top"
                />
              ) : (
                <span aria-hidden className="font-display text-lg font-semibold tracking-wide">
                  {iniciales(p.nombre)}
                </span>
              )}
            </span>

            <h3 className="mt-5 font-display text-base leading-snug font-semibold tracking-[-0.01em] text-navy">
              {p.nombre}
            </h3>
            <p className="mt-1.5 font-body text-[13px] leading-relaxed text-slate">{p.cargo}</p>

            <a
              href={`mailto:${p.correo}`}
              tabIndex={vuelta ? -1 : 0}
              className="pointer-events-auto mt-auto flex min-h-9 items-start gap-2 pt-4 font-body text-[13px] break-all text-blue-700 transition-colors hover:text-navy"
            >
              <Mail size={14} aria-hidden className="mt-[3px] shrink-0" />
              {p.correo}
            </a>

            {/* La pista de que la ficha gira: sin ella nadie descubre el reverso
                —no hay nada en una tarjeta quieta que anuncie que se le puede dar
                la vuelta—. */}
            <span
              aria-hidden
              className="mt-3 flex items-center gap-1.5 border-t border-line-soft pt-3 font-body text-[11px] font-semibold tracking-[0.08em] text-goldink uppercase"
            >
              <RotateCw size={12} />
              Ver funciones
            </span>
          </div>
        </article>

        {/* ---------- Cara trasera ----------
            `banda-oscura` no es decoracion: la regla base del proyecto tine
            h1-h4 con `--color-tinta`, y como el grupo del selector incluye
            `.text-navy` esa regla pesa lo mismo que una clase, asi que le gana
            a `text-white` por orden y el nombre sale oscuro sobre el navy.
            `banda-oscura` es la salida que el propio globals.css ya tiene
            prevista para superficies oscuras —solo color, sin fondo—. */}
        <article
          className={`${CARA} banda-oscura [transform:rotateY(180deg)] ${
            p.foto ? 'bg-navy' : 'bg-gradient-to-br from-blue-700 to-navy'
          } ${vuelta ? '' : 'invisible pointer-events-none'}`}
          aria-hidden={!vuelta}
        >
          {p.foto ? (
            <img
              src={p.foto}
              alt={`Retrato de ${p.nombre}`}
              loading="lazy"
              /* `brightness` y `contrast` son de la foto, no del velo: el velo
                 tiene que seguir siendo opaco donde va el texto o el nombre se
                 pierde contra una camisa blanca. Lo que se aclara es la imagen
                 debajo, que es lo que se pedia ver mejor. */
              className="absolute inset-0 h-full w-full object-cover object-top brightness-[1.12] contrast-[1.04]"
            />
          ) : (
            <span
              aria-hidden
              className="absolute inset-x-0 top-14 text-center font-display text-6xl font-semibold tracking-wide text-white/20"
            >
              {iniciales(p.nombre)}
            </span>
          )}

          {/* Velo de abajo arriba: el texto va sobre la foto y sin el se pierde
              contra una camisa clara.

              Los topes estan medidos contra el texto, no puestos a ojo, y se
              mueven con el: entre bajar las semblanzas a cuatro lineas y cerrar
              los interlineados, el bloque encogio unos 57 px y el velo sube
              bastante menos. Medido, el texto arranca al 47,5 % contando desde
              abajo; de ahi navy macizo hasta el 45 %, apagandose hasta el 66 %,
              y el tercio superior de la ficha sin velo ninguno.

              El reparto importa. Con el velo original —que moria al 100 %— el
              nombre caia sobre un 54 % de navy y la cara arrastraba un 28 %
              inutil. Un intento de aclarar moviendo el final al 72 % dejo el
              nombre en un 27 % y volvio ilegible el cargo dorado de quien lleva
              camisa blanca. Con estos topes el nombre tiene un 78 % debajo y el
              tercio superior de la ficha queda limpio. */}
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-navy via-navy/88 via-45% to-transparent to-66%"
          />

          <button
            type="button"
            onClick={girar}
            tabIndex={vuelta ? 0 : -1}
            aria-label={`Volver a la ficha de ${p.nombre}`}
            className="absolute inset-0 z-0 cursor-pointer rounded-[1.75rem] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-gold"
          />

          {/* El bloque va anclado abajo, asi que mientras el cargo ocupe una o
              dos lineas y la semblanza cuatro o cinco, el nombre cae a distinta
              altura en cada ficha y la fila se lee desordenada. Se reserva la
              altura del caso mayor en las dos piezas que varian —dos lineas de
              cargo y cinco de semblanza—, y con eso todas las fichas tienen el
              mismo alto de texto y arrancan al mismo nivel.

              La unidad es `lh`, una linea de ESE elemento: escrito en pixeles
              habria que recalcularlo a mano en cuanto cambie el cuerpo o el
              interlineado, y nadie se acuerda de hacerlo.

              EL BLOQUE VA APRETADO A PROPOSITO, y lo que se aprieta es el aire,
              no el texto: interlineados mas cerrados —`snug` en la semblanza,
              `tight` en el cargo—, margenes menores entre piezas y un paso de
              `p-6` a `p-5`. Son unos 33 px que dejan de tapar el retrato sin
              quitar ni una palabra. El cargo se queda en dos lineas reservadas
              porque hay tres que no caben en una y son titulos de la firma, que
              no se recortan por conveniencia de maquetacion. */}
          <div className="pointer-events-none relative z-10 flex h-full flex-col justify-end p-5 text-left">
            <h3 className="font-display text-[15px] leading-tight font-semibold tracking-[-0.01em] text-white">
              {p.nombre}
            </h3>
            <p className="mt-1 min-h-[2lh] font-body text-[11px] leading-tight font-semibold tracking-[0.06em] text-gold uppercase">
              {p.cargo}
            </p>
            <p className="mt-2 min-h-[4lh] font-body text-[13px] leading-snug text-white/85">
              {p.semblanza}
            </p>

            <span
              aria-hidden
              className="mt-3 flex items-center gap-1.5 border-t border-white/15 pt-2.5 font-body text-[11px] font-semibold tracking-[0.08em] text-white/60 uppercase"
            >
              <RotateCcw size={12} />
              Volver
            </span>
          </div>
        </article>
      </div>
    </li>
  )
}

export default function Equipo() {
  return (
    <section id="equipo" className="scroll-mt-28 py-24 md:py-32" data-reveal-group>
      <div className="section">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="pildora">Equipo</p>
          <h2 className="mt-6 font-display text-4xl leading-[1.08] font-medium tracking-[-0.03em] text-navy md:text-5xl">
            Quien firma el informe{' '}
            <span className="texto-degradado font-semibold">tiene nombre</span>.
          </h2>
          <p className="mt-6 font-body text-lg leading-relaxed text-slate">
            Cada expediente lo lleva un ajustador identificable, con línea directa. Sin
            intermediarios entre usted y quien evalúa el siniestro.
          </p>
          <p className="mt-4 font-body text-sm text-slate-soft">
            Pulse una ficha para ver de qué responde cada quien.
          </p>
        </div>

        {/* Sin `rejilla-flotante`: esa clase apaga las fichas hermanas al pasar
            el raton actuando sobre `.tarjeta`, que aqui ya no se usa, y ademas
            atenuar una ficha mientras esta girada esconde justo lo que se acaba
            de abrir. */}
        <ul className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {equipo.map((p) => (
            <Ficha key={p.correo} p={p} />
          ))}
        </ul>

        <p className="reveal mt-10 text-center font-body text-sm text-slate">
          Central telefónica{' '}
          <a
            href="tel:+18097929384"
            className="inline-flex min-h-11 items-center font-semibold text-blue-700 underline underline-offset-4"
          >
            809-792-9384
          </a>
        </p>
      </div>
    </section>
  )
}
