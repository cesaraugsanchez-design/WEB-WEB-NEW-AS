// Imprime el inicio del texto de cada pagina de un PDF. Sirve para ubicar los
// apartados internos antes de convertir, sin abrir el documento a mano.
import Foundation
import PDFKit
let a = CommandLine.arguments
guard a.count >= 2, let doc = PDFDocument(url: URL(fileURLWithPath: a[1])) else {
    print("uso: swift herramientas/mapa-paginas.swift <archivo.pdf>"); exit(1)
}
for i in 0..<doc.pageCount {
    let t = (doc.page(at: i)?.string ?? "")
        .replacingOccurrences(of: "\n", with: " ")
        .trimmingCharacters(in: .whitespacesAndNewlines)
    print("  p\(i+1): \(String(t.prefix(95)))")
}
