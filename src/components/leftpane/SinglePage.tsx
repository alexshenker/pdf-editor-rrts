import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from './LeftPane.module.css'

import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api'
import { RootState } from '../../reducers'
import { createUInt8Array } from '../../helpers/createUInt8Array'
import { RESET_AFFECTED_PAGE_NUM } from '../../actionTypes'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js'
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js'

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
  const [rerenderPdf, setRerenderPdf] = useState(null)
  const pdf = useSelector((state: RootState) => state.file.pdf)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const affectedPageNum = useSelector(
    (state: RootState) => state.file.affectedPageNum
  )
  const dispatch = useDispatch()
  const [storedRef, setStoredRef] = useState<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (affectedPageNum === pageNum) {
      setRerenderPdf(pdf)
    }
  }, [affectedPageNum])

  const getUrl = useCallback(async () => {
    if ((canvasRef && canvasRef.current) || rerenderPdf) {
      const ref = rerenderPdf
        ? storedRef
        : canvasRef.current
        ? canvasRef.current
        : null
      if (!ref) return
      if (canvasRef && canvasRef.current) {
        setStoredRef(canvasRef.current)
      }

      const canvas = ref
      const ctx = canvas.getContext('2d')
      if (!ctx || !(ctx instanceof CanvasRenderingContext2D)) return null
      let page
      if (rerenderPdf) {
        const arr = await createUInt8Array(rerenderPdf)
        const customDoc = await pdfjsLib
          .getDocument(arr)
          .promise.then((document) => document)
        page = await customDoc.getPage(pageNum)
        setRerenderPdf(null)
        dispatch({
          type: RESET_AFFECTED_PAGE_NUM,
        })
      } else {
        page = await doc.getPage(pageNum)
      }

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
    }
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
