import { LogoLockup, LogoMarca } from './Marca'
import BanderaRD from './BanderaRD'

export default function Footer() {
  return (
    <footer className="relative overflow-hidden py-16">
      {/* Cierre: la misma marca, mas pequena, sangrando por la izquierda.
          Junto con la de «Quiénes somos» actua como par de apertura y cierre. */}
      <LogoMarca
        mono
        decorativo
        size={340}
        className="marca-agua -bottom-28 -left-24 hidden md:block"
        style={{ '--agua-tiro': '-10px' }}
      />

      <div className="section relative grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <LogoLockup height={34} />
          <p className="mt-3 font-body text-[13px] font-semibold text-slate">
            Ajustadores y Consultores de Seguros
          </p>
          <p className="mt-6 max-w-sm font-body text-sm leading-relaxed text-slate">
            Ajustadores y consultores de seguros especializados en ajuste de pérdidas,
            evaluación de siniestros y consultoría en República Dominicana.
          </p>
        </div>

        <div className="md:col-span-4">
          <p className="font-body text-[11px] font-semibold tracking-[0.12em] text-slate-soft uppercase">
            Contacto
          </p>
          <ul className="mt-4 font-body text-sm text-slate [&_a]:inline-flex [&_a]:min-h-9 [&_a]:items-center">
            <li>
              <a href="tel:+18097929384" className="hover:text-blue-700">
                809-792-9384
              </a>
            </li>
            <li>
              <a href="mailto:recepcion@assanch.com" className="break-all hover:text-blue-700">
                recepcion@assanch.com
              </a>
            </li>
            <li className="mt-2 leading-relaxed">
              Av. San Vicente de Paul, Esq. Activo 20/30, Alma Rosa II, Santo Domingo Este
            </li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <p className="font-body text-[11px] font-semibold tracking-[0.12em] text-slate-soft uppercase">
            En línea
          </p>
          <ul className="mt-4 font-body text-sm text-slate [&_a]:inline-flex [&_a]:min-h-9 [&_a]:items-center">
            <li className="flex min-h-9 items-center">@assanchadsrd</li>
            <li>
              <a
                href="https://www.assanchconsultores.com"
                className="hover:text-blue-700"
                rel="noopener noreferrer"
              >
                assanchconsultores.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="section mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-line pt-6">
        <BanderaRD height={13} className="shrink-0" />
        <p className="font-body text-xs text-slate-soft">
          © {new Date().getFullYear()} ASSANCH. Todos los derechos reservados. Santo
          Domingo, República Dominicana.
        </p>
      </div>
    </footer>
  )
}
