import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import styles from './Viewer.module.css'
import { RootState } from '../../reducers'

//PDF VIEWER/LOADER
import { Document, Page, pdfjs } from 'react-pdf/dist/esm/entry.webpack'
pdfjs.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js'

export default function Viewer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  //A4 paper: w:2480px
  const pageWidth = 2480
  const file = useSelector((state: RootState) => state.file)
  const zoom = useSelector((state: RootState) => state.zoom)

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.style.width = `${zoom}%`
    }
  }, [zoom])

  useEffect(() => {
    renderPdf()
  }, [file])

  const renderPdf = () => {
    const doc = pdfjs.getDocument(file.pdf)
    doc.promise.then((pdf) => {
      pdf.getPage(1).then((page) => {
        //https://stackoverflow.com/questions/15341010/render-pdf-to-single-canvas-using-pdf-js-and-imagedata
      })
    })
  }

  return (
    <div className={styles.viewer}>
      <canvas ref={canvasRef} />
    </div>
  )
}
