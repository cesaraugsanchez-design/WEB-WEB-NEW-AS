// Imprime el texto de un rango de páginas de un PDF, usando PDFKit de macOS.
//
// POR QUÉ EXISTE: antes de publicar La Semanal hay que leer cada página y
// decidir si lleva cifras internas de la firma —volumen de expedientes, tasas
// de cierre, rendimiento por ajustador—. `buscar-apartado.swift` solo localiza
// una frase y `mapa-paginas.swift` da la primera línea de cada página; ninguno
// sirve para LEER. Sin esto la revisión acababa siendo un vistazo al mapa, y
// una página con títulos inocentes puede llevar los números en el cuerpo.
//
// USO:  swift herramientas/texto-paginas.swift <informe.pdf> [desde] [hasta]
//
// Sin rango imprime el informe entero. Las páginas se numeran desde 1, igual
// que en el resto de herramientas y en el visor.

import Foundation
import PDFKit

let args = CommandLine.arguments
guard args.count >= 2 else {
    print("uso: swift herramientas/texto-paginas.swift <informe.pdf> [desde] [hasta]")
    exit(1)
}
guard let doc = PDFDocument(url: URL(fileURLWithPath: args[1])) else {
    print("no se pudo abrir el PDF: \(args[1])")
    exit(1)
}

let desde = max(1, args.count > 2 ? (Int(args[2]) ?? 1) : 1)
let hasta = min(doc.pageCount, args.count > 3 ? (Int(args[3]) ?? doc.pageCount) : doc.pageCount)

guard desde <= hasta else {
    print("rango vacío: \(desde)-\(hasta) en un PDF de \(doc.pageCount) páginas")
    exit(1)
}

for i in (desde - 1)..<hasta {
    print("\n========== PÁGINA \(i + 1) de \(doc.pageCount) ==========")
    print(doc.page(at: i)?.string ?? "(sin texto extraíble — revisar la imagen a ojo)")
}
