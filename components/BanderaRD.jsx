/**
 * Bandera de la República Dominicana.
 *
 * Colores oficiales: ultramar #002D62, rojo #CE1126, cruz blanca.
 *
 * Se omite el escudo central a propósito: a los tamaños en que se usa aquí
 * (16-20 px de alto) sería una mancha ilegible, y dibujar mal un símbolo
 * nacional es peor que no dibujarlo. Los cuatro cuarteles y la cruz identifican
 * la bandera sin ambigüedad a ese tamaño.
 */
export default function BanderaRD({ height = 16, className = '', titulo = 'República Dominicana' }) {
  const w = height * 1.5 // proporción oficial 3:2

  return (
    <svg
      viewBox="0 0 30 20"
      width={w}
      height={height}
      className={className}
      role="img"
      aria-label={titulo}
      focusable="false"
    >
      <rect width="30" height="20" rx="2.4" fill="#FFFFFF" />
      <g clipPath="url(#recorte-bandera-rd)">
        <rect x="0" y="0" width="13" height="8.5" fill="#002D62" />
        <rect x="17" y="0" width="13" height="8.5" fill="#CE1126" />
        <rect x="0" y="11.5" width="13" height="8.5" fill="#CE1126" />
        <rect x="17" y="11.5" width="13" height="8.5" fill="#002D62" />
      </g>
      <rect
        width="30"
        height="20"
        rx="2.4"
        fill="none"
        stroke="rgba(19,27,33,0.16)"
        strokeWidth="1"
      />
      <defs>
        <clipPath id="recorte-bandera-rd">
          <rect width="30" height="20" rx="2.4" />
        </clipPath>
      </defs>
    </svg>
  )
}
