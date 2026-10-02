// Saca un fotograma de un video y lo guarda como JPEG, usando AVFoundation.
//
// POR QUE EXISTE: el video del relanzamiento pesa 28 MB. Se sirve con
// `preload="none"` para que no se descargue ni un byte hasta que alguien le da
// a reproducir, pero un `<video>` sin cargar se pinta como un rectangulo negro.
// El atributo `poster` es lo que ocupa ese hueco: una imagen de 60 KB que se ve
// de inmediato y deja el video quieto hasta que lo pidan.
//
// Se saca con esto y no a mano porque el fotograma hay que poder repetirlo: si
// se cambia el video, se vuelve a ejecutar con el mismo segundo y la portada
// sigue siendo la misma decision, no la captura que alguien acerto a pausar.
//
// AVFoundation ya esta en macOS, asi que no hace falta instalar ffmpeg solo
// para esto.
//
// USO:  swift herramientas/fotograma-video.swift <video.mp4> <salida.jpg> [segundo] [ancho]
//
// `segundo` admite decimales. Conviene evitar el 0: muchas piezas abren en
// negro o con un fundido, y ese fotograma no sirve de portada.

import Foundation
import AVFoundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

let args = CommandLine.arguments
guard args.count >= 3 else {
    print("uso: swift herramientas/fotograma-video.swift <video.mp4> <salida.jpg> [segundo] [ancho]")
    exit(1)
}

let entrada = URL(fileURLWithPath: args[1])
let salida = URL(fileURLWithPath: args[2])
let segundo = args.count > 3 ? Double(args[3]) ?? 1.0 : 1.0
let ancho = args.count > 4 ? Int(args[4]) ?? 1600 : 1600

let activo = AVURLAsset(url: entrada)
let generador = AVAssetImageGenerator(asset: activo)
generador.appliesPreferredTrackTransform = true   // respeta la rotacion del EXIF del video

// Sin tolerancia el generador devuelve el fotograma exacto y no el fotograma
// clave mas cercano, que puede caer segundos antes.
generador.requestedTimeToleranceBefore = .zero
generador.requestedTimeToleranceAfter = .zero

let t = CMTime(seconds: segundo, preferredTimescale: 600)

// El reescalado se hace con CGContext y no con NSImage.draw: dibujar un NSImage
// dentro de un NSBitmapImageRep devolvia el cuadro entero en negro, y aqui no
// hay nada que depurar —se dibuja el CGImage tal cual en un lienzo del tamano
// pedido—. De paso evita AppKit, que no pinta nada en un script sin interfaz.
let semaforo = DispatchSemaphore(value: 0)
var fotograma: CGImage?
var fallo: Error?

generador.generateCGImageAsynchronously(for: t) { imagen, _, error in
    fotograma = imagen
    fallo = error
    semaforo.signal()
}
semaforo.wait()

if let fallo {
    print("no se pudo extraer el fotograma: \(fallo.localizedDescription)")
    exit(1)
}
guard let cg = fotograma else {
    print("no se pudo extraer el fotograma")
    exit(1)
}

let alto = Int((Double(cg.height) * Double(ancho) / Double(cg.width)).rounded())
guard
    let lienzo = CGContext(
        data: nil, width: ancho, height: alto, bitsPerComponent: 8, bytesPerRow: 0,
        space: CGColorSpaceCreateDeviceRGB(),
        bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue)
else {
    print("no se pudo crear el lienzo"); exit(1)
}
lienzo.interpolationQuality = .high
lienzo.draw(cg, in: CGRect(x: 0, y: 0, width: ancho, height: alto))

guard let reducido = lienzo.makeImage() else {
    print("no se pudo reescalar el fotograma"); exit(1)
}

do {
    try FileManager.default.createDirectory(
        at: salida.deletingLastPathComponent(), withIntermediateDirectories: true)
} catch {
    print("no se pudo crear la carpeta: \(error.localizedDescription)"); exit(1)
}

guard
    let destino = CGImageDestinationCreateWithURL(
        salida as CFURL, UTType.jpeg.identifier as CFString, 1, nil)
else {
    print("no se pudo abrir el destino"); exit(1)
}
CGImageDestinationAddImage(
    destino, reducido, [kCGImageDestinationLossyCompressionQuality: 0.82] as CFDictionary)
guard CGImageDestinationFinalize(destino) else {
    print("no se pudo escribir el JPEG"); exit(1)
}

let bytes = (try? FileManager.default.attributesOfItem(atPath: salida.path))?[.size] as? Int ?? 0
print("\(salida.path)  \(ancho)x\(alto)  \(bytes / 1024) KB  (segundo \(segundo))")
