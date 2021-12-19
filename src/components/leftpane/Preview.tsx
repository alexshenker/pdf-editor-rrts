import React, { useRef, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../reducers'

import styles from './LeftPane.module.css'

//HELPERS
import { createPreview } from './helpers'
import { OPEN_LEFT_PANE } from '../../actionTypes'

export default function Preview() {
  const dispatch = useDispatch()
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
      if (urls && urls.length > 0) {
        setJpgUrls(urls)
        dispatch({
          type: OPEN_LEFT_PANE,
        })
        return setIsLoading(false)
      }
    })()
  }, [splitInfo, leftpaneWidth, pdf, dispatch])

  return (
    <div className={styles.preview}>
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
