import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../reducers'

import styles from './LeftPane.module.css'

//HELPERS
import { createPreview } from './helpers'
import { OPEN_LEFT_PANE } from '../../actionTypes'
import { PAGE_CUSTOM } from '../../actionTypes'

export default function Preview() {
  const dispatch = useDispatch()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const splitInfo: number[] = useSelector(
    (state: RootState) => state.split.splitInfo
  )
  const pdf = useSelector((state: RootState) => state.file.pdf)
  const numPages = useSelector((state: RootState) => state.file.numPages)
  const [jpgUrls, setJpgUrls] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  //Desired Width should directly relate to width of left pane
  const leftpaneWidth = useSelector((state: RootState) => state.leftpane.width)

  const initialPageInfo = useCallback(() => {
    const numberInfo = []
    for (let i = 1; i <= numPages; i++) {
      numberInfo.push(i)
    }
    return numberInfo
  }, [numPages])

  //INITIAL LOAD
  useEffect(() => {
    setIsLoading(true)
    ;(async () => {
      const urls = await createPreview(
        pdf,
        initialPageInfo(),
        canvasRef,
        leftpaneWidth
      )
      if (urls && urls.length > 0) {
        setJpgUrls(urls)
        dispatch({
          type: OPEN_LEFT_PANE,
        })
        return setIsLoading(false)
      }
    })()
  }, [pdf, initialPageInfo, dispatch, leftpaneWidth])

  //SPLITTING
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

  const setPageNum = (pgNum: number) => {
    dispatch({
      type: PAGE_CUSTOM,
      payload: pgNum,
    })
  }

  return (
    <div className={styles.preview}>
      <canvas ref={canvasRef}></canvas>
      <>
        {isLoading ? null : (
          <div>
            {jpgUrls.map((url, idx) => {
              return (
                <div
                  className={styles.preview_page}
                  onClick={() => setPageNum(idx + 1)}
                  key={`page_${idx}`}
                >
                  <img src={url} alt={`page ${idx}`} />
                </div>
              )
            })}
          </div>
        )}
      </>
    </div>
  )
}
