import React, { useRef, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../reducers'

import styles from './SplitTool.module.css'

//HELPERS
import { createPreview } from './helpers'

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

  useEffect(() => {
    if (!splitInfo || splitInfo.length === 0) return
    setIsLoading(true)
    ;(async () => {
      const urls = await createPreview(pdf, splitInfo, canvasRef, leftpaneWidth)
      if (urls && urls.length) {
        setJpgUrls(urls)
        return setIsLoading(false)
      }
    })()
  }, [splitInfo, leftpaneWidth, pdf])

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
