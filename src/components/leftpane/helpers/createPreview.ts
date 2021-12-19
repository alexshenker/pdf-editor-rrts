//TYPE
import { RefObject } from 'react'
//PDF LOADER
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js'
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js'

const createUint8Array = async (pdf: File) => {
  const uInt8Array = await pdf
    .arrayBuffer()
    .then((arrayBuffer: ArrayBuffer) => new Uint8Array(arrayBuffer))
  return uInt8Array
}

export async function createPreview(
  pdf: File,
  splitInfo: number[],
  canvasRef: RefObject<HTMLCanvasElement>,
  leftpaneWidth: number
) {
  const uInt8Array: Uint8Array = await createUint8Array(pdf)
  const doc = await pdfjsLib.getDocument(uInt8Array).promise.then((doc) => doc)

  const jpgUrlArr: string[] = []

  for (let i = 0; i < splitInfo.length; i++) {
    if (!canvasRef.current) return
    const page = await doc.getPage(splitInfo[i]),
      canvas = canvasRef.current,
      ctx = canvas.getContext('2d')
    if (!ctx || !(ctx instanceof CanvasRenderingContext2D)) return

    const viewport = page.getViewport({ scale: 0.25 }),
      width = viewport.width,
      height = viewport.height,
      desiredWidth = leftpaneWidth,
      outputScale = 1 / (width / desiredWidth),
      transform = [outputScale, 0, 0, outputScale, 0, 0]

    canvas.width = Math.floor(width * outputScale)
    canvas.height = Math.floor(height * outputScale)
    const renderCtx = {
      canvasContext: ctx,
      transform,
      viewport,
    }
    const jpg = await page.render(renderCtx).promise.then(() => {
      const jpgUrl = canvas.toDataURL('image/jpeg', 0.4)
      return jpgUrl
    })
    jpgUrlArr.push(jpg)
  }
  return jpgUrlArr
}
