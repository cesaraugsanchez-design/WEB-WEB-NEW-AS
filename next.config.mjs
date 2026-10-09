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
   */
  async redirects() {
    return [
      {
        source: '/:ruta*',
        has: [{ type: 'host', value: 'www.assanchconsultores.com' }],
        destination: 'https://assanchconsultores.com/:ruta*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
