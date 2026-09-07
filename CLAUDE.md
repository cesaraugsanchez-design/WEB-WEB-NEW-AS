@AGENTS.md

# Reglas del proyecto ASSANCH

## La Semanal — qué se quita antes de publicar

El informe se publica en un sitio web abierto y debe poder compartirse con
personal externo. Antes de convertir el PDF hay que retirar dos cosas:

**1. El apartado «Implicaciones para Assanch».** Es la lectura estratégica
interna de la firma.

**2. Cifras e información confidencial de la firma.** Volumen de expedientes,
tasas de cierre, puntos ciegos operativos y —sobre todo— el rendimiento
individual de cada ajustador con nombre y apellido. En SEM36 eso vivía en el
apartado «Balance de medio año · Workshop Assanch».

**El balance de medio año se queda, pero sin números:** solo como información
de la reunión y visión de cara al cliente. Las páginas de cifras —volumen de
expedientes, tasas de cierre, reparto de carga por ajustador— se excluyen
enteras.

**Lo que SÍ se mantiene:** proyectos e iniciativas que fortalecen la relación con
los clientes. La implementación de IA en las operaciones es el ejemplo: se
publica. La regla no es «fuera todo lo que hable de la firma», es «fuera lo que
un cliente o un competidor no debería ver».

Ante la duda: si la página nombra a una persona del equipo junto a una métrica de
su desempeño, o revela una debilidad operativa, no se publica.

### Cómo hacerlo

```bash
# 1. Localizar el apartado interno (aparece en el índice y en la sección;
#    solo importa la sección).
swift herramientas/buscar-apartado.swift informe.pdf "Implicaciones para Assanch"

# 2. Revisar a ojo las páginas del bloque de balance interno, si lo hay.
#    El script imprime el texto de una página:
swift herramientas/pdf-a-imagenes.swift  # ver también buscar-apartado.swift

# 3. Convertir excluyendo todas las páginas afectadas, separadas por comas.
swift herramientas/pdf-a-imagenes.swift informe.pdf public/informes/AAAA-MM-DD 2.0 10,11,13,14
```

### El apartado de balance se recompone, no se recorta

En SEM36 el balance ocupaba tres páginas y mezclaba lo publicable con lo que no
lo es. En vez de recortar, se genera una página nueva sin datos:

```bash
# 1. Convertir el PDF entero a una carpeta temporal (hace falta la página
#    original del balance para recortar sus miniaturas).
swift herramientas/pdf-a-imagenes.swift informe.pdf /tmp/orig 2.0

# 2. Convertir el informe excluyendo TODO el balance y la lectura estratégica.
swift herramientas/pdf-a-imagenes.swift informe.pdf public/informes/AAAA-MM-DD 2.0 10,11,12,13,14

# 3. Componer la página de balance y colocarla en su sitio, corriendo las
#    posteriores.
python3 herramientas/pagina-balance.py /tmp/orig /tmp/balance.png
```

`pagina-balance.py` sólo usa las cuatro miniaturas limpias —portada, agenda,
estudio de caso y portal web—. Las de «ciclo del expediente» y «casos y
auditoría» quedan fuera: llevan métricas internas, números de expediente y
nombres de clientes.

**Esto es un parche.** Lo correcto es que la plantilla del informe genere ese
apartado ya sin datos; mientras no lo haga, hay que repetirlo cada semana que el
informe traiga balance.

### Páginas mixtas: recortar en vez de excluir

A veces una página trae contenido publicable y confidencial a la vez. En SEM36,
la página de la IA llevaba debajo las seis diapositivas del workshop en
miniatura, y en ellas se leen números de expediente, nombres de clientes y de
ajustadores. Excluir la página entera habría tirado también la parte que sí se
publica.

En ese caso se convierte la página y se recorta después, con Pillow:

```python
from PIL import Image
p = 'public/informes/AAAA-MM-DD/10.png'
im = Image.open(p)
im.crop((0, 0, im.width, 660)).save(p)   # conserva solo la banda superior
```

La página queda más corta que las demás. Es una inconsistencia visual menor y
asumida: preferible a publicar los datos o a perder el contenido bueno.

Se excluye **al convertir**, no borrando el PNG después: si la página llega a
`public/`, ya es pública aunque nadie la enlace — basta con adivinar la URL. Las
páginas restantes se renumeran seguidas para que el visor no muestre huecos.

Comprobar después:

- El número de páginas en `lib/contenido/informes.js` es el **resultante**, no el
  del PDF original.
- El PDF original **no** entra al repositorio.

Dos efectos conocidos de recortar páginas:

- **Páginas mixtas.** En SEM36 el apartado estratégico terminaba en la misma
  página que el pronóstico del tiempo, así que se pierde también el pronóstico.
  La exposición pesa más que el recuadro del tiempo.
- **Encabezados huérfanos.** Al quitar las primeras páginas de un apartado, la
  que se conserva aparece sin su título de sección. Se asume mientras el
  contenido se explique solo.
- **El índice de la página 2 sigue listando lo retirado.** Eso se arregla en la
  plantilla del informe, no aquí.

## Otras reglas ya asentadas

- **Los PDF de los informes no se publican.** Solo imágenes de sus páginas. Eso
  no impide una captura de pantalla; nada lo impide. Lo que evita es que alguien
  se lleve el documento original.
- **No se inventa contenido de cliente.** Casos de éxito, notas de prensa, cifras
  de mercado o listas de aseguradoras se piden; no se rellenan por aproximación.
  Lo pendiente se marca con `TODO(cliente):`.
- **El orden de los aliados lo fija ASSANCH** y no se reordena por criterio
  estético: refleja el peso de cada relación.
