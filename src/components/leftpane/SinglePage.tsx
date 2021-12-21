import React, { useEffect, useState, useCallback, useRef } from 'react'
import styles from './LeftPane.module.css'

import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api'

interface SinglePageProps {
  doc: PDFDocumentProxy
  pageNum: number
  setPageNum: (num: number) => void
  idx: number
  leftpaneWidth: number
}

const SinglePage: React.FC<SinglePageProps> = ({
  doc,
  pageNum,
  setPageNum,
  idx,
  leftpaneWidth,
}) => {
  const [url, setUrl] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const getUrl = useCallback(async () => {
    if (!canvasRef || !canvasRef.current) return null
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx || !(ctx instanceof CanvasRenderingContext2D)) return null

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
    return setUrl(jpgUrl)
  }, [doc, pageNum, leftpaneWidth])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      if (mounted) {
        await getUrl()
      }
    })()
    return function cleanup() {
      mounted = false
      canvasRef.current = null
    }
  }, [getUrl])

  return (
    <div
      className={styles.preview_page}
      onClick={() => setPageNum(idx + 1)}
      key={`page_${idx}`}
    >
      <>{url && <img src={url} alt={`page ${idx}`} />}</>
      <canvas ref={canvasRef} />
    </div>
  )
}

export default SinglePage
