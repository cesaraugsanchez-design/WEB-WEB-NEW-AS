@AGENTS.md

# Reglas del proyecto ASSANCH

## La Semanal — antes de publicar cualquier informe

**Elimina el apartado «Implicaciones para Assanch» antes de convertir el PDF.**

Es la lectura estratégica interna de la firma. El informe se publica en un sitio
web abierto y debe poder compartirse con personal externo, así que esa sección no
sale. Se quita **al convertir**, no después: si la página llega a `public/`, ya es
pública, aunque nadie la enlace.

```bash
# 1. Localizar la sección (aparece dos veces: índice y sección; solo importa la sección)
swift herramientas/buscar-apartado.swift informe.pdf "Implicaciones para Assanch"

# 2. Convertir excluyéndola. Si continúa en la página siguiente, excluir ambas.
swift herramientas/pdf-a-imagenes.swift informe.pdf public/informes/AAAA-MM-DD 2.0 7
```

Comprobar después:

- El número de páginas en `lib/contenido/informes.js` es el **resultante**, no el
  del PDF original.
- Ninguna página publicada menciona «Implicaciones para Assanch».
- El PDF original **no** entra al repositorio.

Ojo con las páginas mixtas: en SEM36 la sección terminaba en la misma página que
el pronóstico del tiempo, así que al excluirla se pierde también el pronóstico.
Es el precio correcto — la exposición pesa más que el recuadro del tiempo.

## Otras reglas ya asentadas

- **Los PDF de los informes no se publican.** Solo imágenes de sus páginas. Eso
  no impide una captura de pantalla; nada lo impide. Lo que evita es que alguien
  se lleve el documento original.
- **No se inventa contenido de cliente.** Casos de éxito, notas de prensa, cifras
  de mercado o listas de aseguradoras se piden; no se rellenan por aproximación.
  Lo pendiente se marca con `TODO(cliente):`.
- **El orden de los aliados lo fija ASSANCH** y no se reordena por criterio
  estético: refleja el peso de cada relación.
