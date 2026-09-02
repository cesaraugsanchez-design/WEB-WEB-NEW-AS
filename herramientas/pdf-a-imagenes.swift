// Convierte un PDF en una imagen PNG por pagina, usando PDFKit de macOS.
//
// POR QUE EXISTE: el apartado de mercado asegurador debe MOSTRAR los informes
// sin entregar el archivo. Publicar el PDF y esconder el boton de descarga no
// protege nada: la URL del archivo sigue siendo accesible. Convirtiendo a
// imagenes, el PDF nunca sale de aqui.
//
// No protege del todo — quien vea la pantalla puede hacer una captura — pero
// eso no lo evita ninguna tecnologia. Lo que si consigue es que nadie obtenga
// el documento original.
//
// USO:  swift herramientas/pdf-a-imagenes.swift <entrada.pdf> <carpeta-salida> [escala]
//
// La escala 2.0 da el doble de pixeles que el tamano nominal: nitido en
// pantallas de alta densidad sin disparar el peso.

import Foundation
import PDFKit
import AppKit

let args = CommandLine.arguments
guard args.count >= 3 else {
    print("uso: swift pdf-a-imagenes.swift <entrada.pdf> <carpeta-salida> [escala]")
    exit(1)
}

let entrada = URL(fileURLWithPath: args[1])
let salida = URL(fileURLWithPath: args[2])
let escala = args.count > 3 ? (Double(args[3]) ?? 2.0) : 2.0
let MAX_ANCHO = 1600.0

guard let documento = PDFDocument(url: entrada) else {
    print("ERROR: no se pudo abrir \(entrada.path)")
    exit(1)
}

try? FileManager.default.createDirectory(at: salida, withIntermediateDirectories: true)

var total = 0
var bytes = 0

for i in 0..<documento.pageCount {
    guard let pagina = documento.page(at: i) else { continue }

    let caja = pagina.bounds(for: .mediaBox)

    // Tope de ancho. Sin el, un PDF vectorial con mediaBox enorme genera una
    // imagen de 8000 px y varios MB por pagina. 1600 px basta para leer en
    // cualquier pantalla y next/image sirve versiones mas pequenas segun el
    // dispositivo.
    let escalaFinal = min(escala, MAX_ANCHO / Double(caja.width))
    let ancho = Int(caja.width * escalaFinal)
    let alto = Int(caja.height * escalaFinal)

    guard let contexto = CGContext(
        data: nil, width: ancho, height: alto,
        bitsPerComponent: 8, bytesPerRow: 0,
        space: CGColorSpaceCreateDeviceRGB(),
        bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue
    ) else { continue }

    // Fondo blanco: un PDF sin fondo declarado saldria transparente y, sobre la
    // pagina, el texto negro quedaria sobre el degradado del sitio.
    contexto.setFillColor(CGColor(red: 1, green: 1, blue: 1, alpha: 1))
    contexto.fill(CGRect(x: 0, y: 0, width: ancho, height: alto))

    contexto.scaleBy(x: CGFloat(escalaFinal), y: CGFloat(escalaFinal))
    contexto.translateBy(x: -caja.origin.x, y: -caja.origin.y)
    pagina.draw(with: .mediaBox, to: contexto)

    guard let imagen = contexto.makeImage() else { continue }
    let mapa = NSBitmapImageRep(cgImage: imagen)

    guard let datos = mapa.representation(using: .png, properties: [:]) else { continue }

    let nombre = String(format: "%02d.png", i + 1)
    let destino = salida.appendingPathComponent(nombre)
    try? datos.write(to: destino)

    total += 1
    bytes += datos.count
    print("  \(nombre)  \(ancho)x\(alto)  \(datos.count / 1024) KB")
}

print("")
print("paginas: \(total) | total: \(bytes / 1024) KB | carpeta: \(salida.path)")
