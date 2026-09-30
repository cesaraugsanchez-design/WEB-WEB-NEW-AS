"""
Recorta un retrato de estudio al encuadre de cintura hacia arriba que pide la
tarjeta del equipo.

POR QUE EXISTE. Las fotos llegan de cuerpo entero y verticales (del orden de
1333x2000). La tarjeta las muestra en una caja de proporcion 7:10, asi que si se
entregan enteras el navegador las ajusta a lo ancho y deja ver casi todo el
cuerpo: la cara queda pequena y el encuadre no es el que se pidio. Forzar el
recorte con CSS —object-position mas un scale— funciona, pero el numero hay que
adivinarlo por foto y se rompe en cuanto llega una tomada a otra distancia.

Se recorta el archivo, no la vista: el resultado pesa menos, se ve igual en todos
los navegadores y el componente se queda con un `object-cover` y nada mas.

QUE HACE. Toma una banda vertical desde un poco por encima de la cabeza hasta la
cintura, centrada en horizontal, y la ajusta a la proporcion de la tarjeta. Los
dos cortes se dan en fraccion de la altura de la foto, que es lo unico que no
cambia cuando cambia la resolucion:

    --techo    donde empieza (0.04 = deja un 4 % de aire sobre la cabeza)
    --cintura  donde termina (0.70 = corta a la altura de los brazos cruzados)

Si el encuadre sale alto o bajo, se mueve `--cintura` y se vuelve a ejecutar
sobre el ORIGINAL; el original se guarda fuera del repositorio, como los PDF de
La Semanal.

USO
    python3 herramientas/foto-equipo.py retrato.jpg public/equipo/nombre.jpg
    python3 herramientas/foto-equipo.py retrato.jpg salida.jpg --cintura 0.66
"""

import argparse
import pathlib
from PIL import Image, ImageOps

# Proporcion del recorte. Medida en el navegador: en escritorio la ficha cae en
# 315x400 px (0.787) y en tablet en 340x400 (0.85); no hay un numero que sirva
# para las tres rejillas, asi que se corta a 0.78 —el caso de escritorio, que es
# donde se ve el equipo— y el `object-cover` resuelve el resto. Como la foto se
# ancla arriba, lo que sobra se va SIEMPRE por abajo: la cabeza no se corta en
# ningun ancho, que es la unica garantia que hace falta.
PROPORCION = 0.78

# 720 px de ancho para una tarjeta que en el peor caso mide 360 CSS: da el doble
# de densidad sin que el archivo se vaya de tamano.
ANCHO = 720


def recortar(origen, destino, techo, cintura, calidad):
    im = Image.open(origen)
    # Las fotos de movil y de camara traen la orientacion en EXIF; sin esto,
    # algunas entran giradas y el recorte cae donde no es.
    im = ImageOps.exif_transpose(im).convert('RGB')
    ancho, alto = im.size

    arriba = round(alto * techo)
    abajo = round(alto * cintura)
    if abajo <= arriba:
        raise SystemExit('--cintura tiene que ser mayor que --techo')

    altura = abajo - arriba
    anchura = round(altura * PROPORCION)

    # Si la banda pedida es mas ancha que la foto, manda la foto y se recorta por
    # arriba y por abajo en vez de inventar pixeles a los lados.
    if anchura > ancho:
        anchura = ancho
        altura = round(anchura / PROPORCION)
        centro = (arriba + abajo) // 2
        arriba = max(0, centro - altura // 2)
        abajo = min(alto, arriba + altura)
        arriba = max(0, abajo - altura)

    izquierda = max(0, (ancho - anchura) // 2)
    corte = im.crop((izquierda, arriba, izquierda + anchura, abajo))
    corte = corte.resize((ANCHO, round(ANCHO / PROPORCION)), Image.LANCZOS)

    destino = pathlib.Path(destino)
    destino.parent.mkdir(parents=True, exist_ok=True)
    corte.save(destino, 'JPEG', quality=calidad, optimize=True, progressive=True)

    kb = destino.stat().st_size / 1024
    print(f'{destino}  {corte.width}x{corte.height}  {kb:.0f} KB')
    print(f'  origen {ancho}x{alto} · banda y {arriba}-{abajo} · x {izquierda}-{izquierda + anchura}')


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument('origen')
    p.add_argument('destino')
    p.add_argument('--techo', type=float, default=0.04, help='inicio del recorte (fraccion de la altura)')
    p.add_argument('--cintura', type=float, default=0.70, help='final del recorte (fraccion de la altura)')
    p.add_argument('--calidad', type=int, default=86)
    a = p.parse_args()
    recortar(a.origen, a.destino, a.techo, a.cintura, a.calidad)


if __name__ == '__main__':
    main()
