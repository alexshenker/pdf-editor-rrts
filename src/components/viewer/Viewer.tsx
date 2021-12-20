import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'
//TYPE
import { MouseEvent } from 'react'
//Action types
import { ENABLE_TOOLBAR, DISABLE_TOOLBAR } from '../../actionTypes'

import { useSelector, useDispatch } from 'react-redux'
import styles from './Viewer.module.css'
import { RootState } from '../../reducers'

//Debounce allows to easily set back the handling of resize events.
import debounce from 'lodash.debounce'
//PDF VIEWER/LOADER
/**
 * Originally used React-Pdf to access the pdfjs library
 * Under the hood it utilizes pdfjs-dist so the benefit of using it outside of its components is not obvious to me.
 */
//pdfjs-dist TYPES
/** note: these are likely unmaintained */
import {
  PDFDocumentProxy,
  PDFPageProxy,
} from 'pdfjs-dist/types/src/display/api'
//Only the legacy build can be included via import
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js'
//When loading using pdfjs-dist, we must set a globalworker for pdfjsLib
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js'
//this worker was copied from pdfjs-dist

export default function Viewer() {
  const dispatch = useDispatch()

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)

  const filePdf = useSelector((state: RootState) => state.file.pdf)
  const zoom: Number = useSelector((state: RootState) => state.zoom)
  const pageNum: number = useSelector((state: RootState) => state.page)
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null)
  const wByHRatio = useSelector((state: RootState) => state.file.wByHRatio)
  const pdfHeight = useSelector((state: RootState) => state.file.height)

  const resizeHandler = useCallback(() => {
    //ensures pdf ratio is correct
    if (!canvasRef.current || !wByHRatio) return
    canvasRef.current.style.height = `${
      canvasRef.current.offsetWidth / wByHRatio
    }px`
  }, [wByHRatio])

  //allows postponing handler to avoid overuse
  const debouncedResizeHandler = useMemo(
    () => debounce(resizeHandler, 50),
    [resizeHandler]
  )

  useEffect(() => {
    window.addEventListener('resize', debouncedResizeHandler)
  }, [debouncedResizeHandler])

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.style.width = `${zoom}%`
      canvasRef.current.style.height = `${zoom}%`
    }
  }, [zoom])

  useEffect(() => {
    if (filePdf && canvasRef.current && filePdf instanceof File) {
      const renderPdf = async () => {
        const arrBuff = await filePdf
          .arrayBuffer()
          .then((arrayBuffer: ArrayBuffer) => new Uint8Array(arrayBuffer))

        const doc = pdfjsLib.getDocument(arrBuff)
        doc.promise.then((pdfDoc: any) => {
          //make pdf reusable for rendering pages
          setPdf(pdfDoc)
        })
      }

      renderPdf()
    }
  }, [filePdf])

  useEffect(() => {
    //turning too soon may break render
    dispatch({
      type: DISABLE_TOOLBAR,
    })
    const renderPage = () => {
      if (!pdf) return
      pdf.getPage(pageNum).then(async (pageDoc: PDFPageProxy) => {
        if (!canvasRef.current) return
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        //must check that ctx exists
        if (!ctx || !(ctx instanceof CanvasRenderingContext2D)) return
        //scale exaggerated for quality
        const viewport = pageDoc.getViewport({ scale: 4 })
        canvas.width = viewport.width
        canvas.height = viewport.height
        const renderCtx = {
          canvasContext: ctx,
          viewport,
        }
        pageDoc.render(renderCtx).promise.then(() =>
          dispatch({
            type: ENABLE_TOOLBAR,
          })
        )
      })
    }
    renderPage()
  }, [pageNum, pdf, dispatch])

  //DRAG SCROLL
  const [isDrag, setIsDrag] = useState(false)

  const mouseDown = () => {
    setIsDrag(true)
  }
  const mouseUp = () => {
    setIsDrag(false)
  }
  const mouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    const x = e.movementX * -1
    const y = e.movementY * -1
    canvasContainerRef.current?.scrollBy(x, y)
  }

  return (
    <div
      ref={canvasContainerRef}
      style={{ height: pdfHeight || 'auto' }}
      className={styles.viewer}
    >
      <canvas
        onMouseDown={mouseDown}
        onMouseUp={mouseUp}
        onMouseLeave={mouseUp}
        {...(isDrag && { onMouseMove: (e) => mouseMove(e) })}
        ref={canvasRef}
      />
    </div>
  )
}
//canvasContainerRef.current?.scrollBy(0, 200)
