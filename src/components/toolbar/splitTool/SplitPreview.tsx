import React, { useRef, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../reducers'

import styles from './SplitTool.module.css'

//PDF LOADER
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js'
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js'

export default function SplitPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const splitInfo: number[] = useSelector(
    (state: RootState) => state.split.splitInfo
  )
  const pdf = useSelector((state: RootState) => state.file.pdf)
  const [jpgUrls, setJpgUrls] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  //Desired Width should directly relate to width of left pane
  const leftpaneWidth = useSelector((state: RootState) => state.leftpane.width)

  const createArrBuff = async () => {
    const arrBuff = await pdf
      .arrayBuffer()
      .then((arrayBuffer: ArrayBuffer) => arrayBuffer)
    return arrBuff
  }

  const createPreview = async () => {
    const ArrBuff = await createArrBuff()
    const doc = await pdfjsLib.getDocument(ArrBuff).promise.then((doc) => doc)

    const jpgUrlArr: string[] = []

    for (let i = 0; i < splitInfo.length; i++) {
      const n = splitInfo[i]
      const idx = i
      if (!canvasRef.current) return
      const page = await doc.getPage(n),
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
      await page.render(renderCtx).promise.then(() => {
        const jpgUrl = canvas.toDataURL('image/jpeg', 0.4)
        jpgUrlArr.push(jpgUrl)
      })
    }
    return jpgUrlArr
  }

  useEffect(() => {
    if (!splitInfo || splitInfo.length === 0) return
    setIsLoading(true)
    ;(async () => {
      const urls = await createPreview()
      if (urls && urls.length) {
        setJpgUrls(urls)
        return setIsLoading(false)
      }
    })()
  }, [splitInfo])

  return (
    <div className={styles.split_preview}>
      <canvas ref={canvasRef}></canvas>
      <>
        {isLoading ? null : (
          <div>
            {jpgUrls.map((url, idx) => {
              return <img key={`page_${idx}`} src={url} alt={`page ${idx}`} />
            })}
          </div>
        )}
      </>
    </div>
  )
}
