"""
Compone la pagina «05 · Balance de medio ano Assanch» del informe.

POR QUE EXISTE. La pagina original del balance mezclaba lo publicable con lo que
no lo es: cifras de la firma, tasas de cierre y el reparto de carga por ajustador
con nombre y apellido. Excluirla entera tiraba tambien la parte que ASSANCH si
quiere mostrar —la reunion de equipo y las iniciativas de cara al cliente—, asi
que se recompone aqui una version sin datos.

DE DONDE SALE CADA COSA. El texto lo dicta ASSANCH. Las miniaturas se recortan de
la pagina original del PDF, y solo las cuatro que no llevan datos: portada,
agenda, estudio de caso y portal web. Las de «ciclo del expediente» y «casos y
auditoria» quedan fuera porque muestran metricas internas, numeros de expediente
y nombres de clientes.

ESTO ES UN PARCHE, NO LA SOLUCION. Lo correcto es que la plantilla del informe
genere este apartado ya sin datos. Mientras no lo haga, hay que repetir esto cada
semana que el informe traiga balance.

USO:  python3 herramientas/pagina-balance.py <carpeta-paginas-originales> <destino.png>
"""

import sys
import pathlib
from PIL import Image, ImageDraw, ImageFont

ANCHO, ALTO = 1224, 1584
MARGEN = 100

ORO = (245, 197, 66)
ORO_REGLA = (226, 165, 32)
TINTA = (16, 26, 38)
CHIP_TEXTO = (28, 37, 48)
CUERPO = (55, 62, 70)
SUAVE = (130, 137, 145)
LINEA = (222, 226, 230)

F = '/System/Library/Fonts/Supplemental/'
def fuente(peso, tam):
    return ImageFont.truetype(F + ('Arial Bold.ttf' if peso == 'b' else 'Arial.ttf'), tam)


def texto_espaciado(d, xy, txt, fnt, color, espacio=2.2):
    """Arial no tiene letter-spacing; se dibuja caracter a caracter."""
    x, y = xy
    for c in txt:
        d.text((x, y), c, font=fnt, fill=color)
        x += d.textlength(c, font=fnt) + espacio
    return x


def ancho_espaciado(d, txt, fnt, espacio=2.2):
    return sum(d.textlength(c, font=fnt) + espacio for c in txt) - espacio


def parrafo(d, txt, xy, fnt, color, ancho_max, interlinea):
    """Ajuste por palabras. Devuelve la Y tras la ultima linea."""
    x, y = xy
    linea = ''
    for palabra in txt.split():
        prueba = (linea + ' ' + palabra).strip()
        if d.textlength(prueba, font=fnt) <= ancho_max:
            linea = prueba
        else:
            d.text((x, y), linea, font=fnt, fill=color)
            y += interlinea
            linea = palabra
    if linea:
        d.text((x, y), linea, font=fnt, fill=color)
        y += interlinea
    return y


def main(origen, destino):
    orig = pathlib.Path(origen)
    lienzo = Image.new('RGB', (ANCHO, ALTO), 'white')
    d = ImageDraw.Draw(lienzo)

    # ---------- Encabezado ----------
    f_chip = fuente('b', 15)
    rotulo = '05 · BALANCE DE MEDIO AÑO ASSANCH'
    w = ancho_espaciado(d, rotulo, f_chip)
    d.rectangle([MARGEN, 150, MARGEN + w + 36, 150 + 38], fill=ORO)
    texto_espaciado(d, (MARGEN + 18, 160), rotulo, f_chip, CHIP_TEXTO)

    d.text((MARGEN, 205), 'Una parada tipo taller', font=fuente('b', 50), fill=TINTA)
    d.rectangle([MARGEN, 288, MARGEN + 148, 292], fill=ORO_REGLA)

    # ---------- Entradilla ----------
    y = parrafo(
        d,
        'Todo el staff administrativo y operativo se reunió para una mirada estratégica '
        'de nuestros números y la presentación de los resultados de la primera mitad de 2026.',
        (MARGEN, 330), fuente('', 22), CUERPO, ANCHO - 2 * MARGEN - 60, 34,
    )

    # ---------- Temas ----------
    y += 26
    d.text((MARGEN, y), 'Parte de los temas discutidos', font=fuente('b', 20), fill=TINTA)
    y += 42

    temas = [
        'Métricas y balance de la mitad de año 2026',
        'Lecciones aprendidas · Doblete sísmico de Venezuela y terremoto de Colombia',
        'Nuevo agente de IA de ASSANCH — SARAH',
        'Dashboard de seguimiento diario de reclamos',
        'Portal web',
        'Informe de mercado asegurador «La Semanal»',
    ]
    f_num = fuente('b', 17)
    f_tema = fuente('', 20)
    for i, t in enumerate(temas, 1):
        d.text((MARGEN, y + 3), f'{i:02d}', font=f_num, fill=ORO_REGLA)
        d.text((MARGEN + 46, y), t, font=f_tema, fill=CUERPO)
        y += 40

    # ---------- Miniaturas ----------
    y += 22
    d.line([MARGEN, y, ANCHO - MARGEN, y], fill=LINEA, width=1)
    y += 30

    caja = Image.open(orig / '12.png')
    recortes = {
        'Balance de medio año': (100, 640, 437, 832),
        'La agenda del encuentro': (450, 640, 787, 832),
        'Estudio de caso sísmico': (100, 845, 437, 1037),
        'Nuevo portal web': (792, 845, 1129, 1037),
    }

    ancho_t, alto_t = 240, 137
    hueco = 26
    x = MARGEN
    f_pie = fuente('', 14)
    for titulo, c in recortes.items():
        t = caja.crop(c).resize((ancho_t, alto_t), Image.LANCZOS)
        lienzo.paste(t, (x, y))
        d.rectangle([x, y, x + ancho_t - 1, y + alto_t - 1], outline=LINEA, width=1)
        d.text((x, y + alto_t + 12), titulo, font=f_pie, fill=SUAVE)
        x += ancho_t + hueco

    y += alto_t + 58

    # ---------- Bloque de la IA ----------
    # Es lo que ASSANCH quiere mostrar de cara al cliente. Se recompone con el
    # diagrama original y el texto de la firma, sin la rejilla de diapositivas
    # que lo acompanaba y que si llevaba datos.
    caja_y = y
    caja_alto = 300
    d.rounded_rectangle([MARGEN, caja_y, ANCHO - MARGEN, caja_y + caja_alto],
                        radius=10, outline=LINEA, width=1)

    diagrama = Image.open(orig / '12.png').crop((160, 210, 520, 590)).resize((250, 264), Image.LANCZOS)
    lienzo.paste(diagrama, (MARGEN + 40, caja_y + 20))

    tx = MARGEN + 330
    d.text((tx, caja_y + 52), 'La IA como herramienta de productividad',
           font=fuente('b', 23), fill=TINTA)
    parrafo(
        d,
        'Sarah, la asistente de IA de la firma, se presentó en el workshop con un encargo '
        'acotado: no viene a ajustar por nosotros, viene a devolvernos las horas que hoy se '
        'van en escritorio. Documentación, seguimiento y reportería son donde más tiempo se '
        'pierde.',
        (tx, caja_y + 100), fuente('', 20), CUERPO, ANCHO - MARGEN - tx - 40, 32,
    )

    # ---------- Pie ----------
    d.line([MARGEN, ALTO - 110, ANCHO - MARGEN, ALTO - 110], fill=LINEA, width=1)
    f_pp = fuente('', 15)
    d.text((MARGEN, ALTO - 88),
           'Informe Semanal · Assanch Ajustadores y Consultores de Seguros',
           font=f_pp, fill=SUAVE)
    pag = 'Pág. 10'
    d.text((ANCHO - MARGEN - d.textlength(pag, font=f_pp), ALTO - 88), pag, font=f_pp, fill=SUAVE)

    lienzo.save(destino)
    print(f'pagina compuesta: {destino} {lienzo.size}')


if __name__ == '__main__':
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    main(sys.argv[1], sys.argv[2])
