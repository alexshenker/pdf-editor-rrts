import React, { useEffect, useRef, useState } from 'react'

//pdfjs TYPES /** note: these are likely unsupported */
import {
  PDFDocumentProxy,
  PDFPageProxy,
} from 'pdfjs-dist/types/src/display/api'

import { useSelector } from 'react-redux'
import styles from './Viewer.module.css'
import { RootState } from '../../reducers'

//PDF VIEWER/LOADER
import { Document, Page, pdfjs } from 'react-pdf/dist/esm/entry.webpack'
// pdfjs.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js'

export default function Viewer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const file = useSelector((state: RootState) => state.file)
  const zoom: Number = useSelector((state: RootState) => state.zoom)
  const pageNum: number = useSelector((state: RootState) => state.page)
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null)

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.style.width = `${zoom}%`
    }
  }, [zoom])

  useEffect(() => {
    if (file.pdf && canvasRef.current) {
      renderPdf()
    }
  }, [file])

  useEffect(() => {
    renderPage()
  }, [pageNum, pdf])

  const renderPdf = async () => {
    const arrBuff = await file.pdf
      .arrayBuffer()
      .then((arrayBuffer: ArrayBuffer) => arrayBuffer)

    const doc = pdfjs.getDocument(arrBuff)
    doc.promise.then((pdfDoc) => {
      //make pdf reusable for rendering pages
      setPdf(pdfDoc)
    })
  }

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
      pageDoc.render(renderCtx).promise.then(() => console.log('rendered'))
    })
  }

  return (
    <div className={styles.viewer}>
      <canvas ref={canvasRef} />
    </div>
  )
}
