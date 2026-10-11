/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  /**
   * El sitio vive en assanchconsultores.com, sin www. La variante con www
   * tambien apunta a Vercel —hay que tenerla, porque mucha gente la teclea por
   * costumbre— pero no puede SERVIR el sitio: dos direcciones con el mismo
   * contenido se reparten el posicionamiento y los buscadores eligen una por su
   * cuenta. Asi que www redirige, no sirve.
   *
   * Va aqui y no en `proxy.js` por dos razones: ese archivo existe para cerrar
   * el acceso a Interna y su `matcher` solo cubre esa ruta, asi que habria que
   * abrirlo a todo el sitio para esto; y las redirecciones declaradas aqui las
   * resuelve Vercel en el borde, antes de ejecutar ninguna funcion.
   *
   * `permanent` emite un 308, que es lo que le dice a Google que traslade el
   * posicionamiento en vez de repartirlo.
   *
   * Lo mismo con assanch.vercel.app, que servia el sitio entero mientras no
   * hubo dominio propio y se queda como tercera direccion con el mismo
   * contenido. Puede haber enlaces repartidos apuntando ahi, asi que redirige
   * en vez de dejar de responder.
   *
   * Los hosts se enumeran uno a uno en vez de redirigir «todo lo que no sea el
   * dominio bueno». Esa regla en negativo alcanzaria tambien a localhost y a
   * las previsualizaciones de rama, que dejarian de poder abrirse: cada una
   * vive en su propio *.vercel.app y se quedaria rebotando al dominio de
   * produccion. Anadir un host aqui es una linea; depurar eso, no.
   */
  async redirects() {
    const redirigir = (host) => ({
      source: '/:ruta*',
      has: [{ type: 'host', value: host }],
      destination: 'https://assanchconsultores.com/:ruta*',
      permanent: true,
    })

    return [redirigir('www.assanchconsultores.com'), redirigir('assanch.vercel.app')]
  },
}

export default nextConfig
