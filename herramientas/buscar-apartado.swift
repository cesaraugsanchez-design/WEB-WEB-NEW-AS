// Localiza en que paginas de un PDF aparece un texto dado.
import Foundation
import PDFKit

let args = CommandLine.arguments
guard args.count >= 3, let doc = PDFDocument(url: URL(fileURLWithPath: args[1])) else {
    print("uso: swift buscar.swift <pdf> <texto>"); exit(1)
}
let aguja = args[2].lowercased()
var paginas: [Int] = []
for i in 0..<doc.pageCount {
    let t = (doc.page(at: i)?.string ?? "").lowercased()
    if t.contains(aguja) { paginas.append(i + 1) }
}
print("\(URL(fileURLWithPath: args[1]).lastPathComponent) | \(doc.pageCount) pags | «\(args[2])» en: \(paginas.map(String.init).joined(separator: ", "))")
