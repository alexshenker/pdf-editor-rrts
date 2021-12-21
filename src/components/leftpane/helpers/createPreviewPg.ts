//TYPE
import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api'

export async function createPreviewPg(
  doc: PDFDocumentProxy | undefined,
  canvas: HTMLCanvasElement | undefined,
  ctx: CanvasRenderingContext2D | null | undefined,
  pageNum: number,
  leftpaneWidth: number
) {
  if (!doc || !canvas || !ctx || ctx instanceof CanvasRenderingContext2D) return

  const page = await doc.getPage(pageNum)

  const viewport = page.getViewport({ scale: 0.25 }),
    width = viewport.width,
    height = viewport.height,
    //-15 to support scrollbar
    desiredWidth = leftpaneWidth - 15,
    outputScale = 1 / (width / desiredWidth),
    transform = [outputScale, 0, 0, outputScale, 0, 0]

  canvas.width = Math.floor(width * outputScale)
  canvas.height = Math.floor(height * outputScale)
  const renderCtx = {
    canvasContext: ctx,
    transform,
    viewport,
  }

  const jpgUrl = await page.render(renderCtx).promise.then(() => {
    const jpgUrlInner = canvas.toDataURL('image/jpeg', 0.4)
    return jpgUrlInner
  })
  return jpgUrl
}
