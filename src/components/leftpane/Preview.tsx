import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../reducers'

import styles from './LeftPane.module.css'
//PDF LOADER
import { createUInt8Array } from '../../helpers/createUInt8Array'
import { PAGE_CUSTOM } from '../../actionTypes'

import SinglePage from './SinglePage'
import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js'
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js'
//HELPERS

//COMPONENT

export default function Preview() {
  const dispatch = useDispatch()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const splitInfo: number[] = useSelector(
    (state: RootState) => state.split.splitInfo
  )
  const pdf = useSelector((state: RootState) => state.file.pdf)
  const numPages = useSelector((state: RootState) => state.file.numPages)
  //Desired Width should directly relate to width of left pane
  const leftpaneWidth = useSelector((state: RootState) => state.leftpane.width)

  const [prevInfo, setPrevInfo] = useState<{
    doc: PDFDocumentProxy
    initialPgInfo: number[]
    splitInfo: number[]
  } | null>(null)

  const initialPageInfo = useCallback(() => {
    const numberInfo = []
    for (let i = 1; i <= numPages; i++) {
      numberInfo.push(i)
    }
    return numberInfo
  }, [numPages])

  const createPreviewInfo = useCallback(async () => {
    //remove current preview display
    if (!pdf) return null
    const uInt8Array = await createUInt8Array(pdf)
    const doc = await pdfjsLib
      .getDocument(uInt8Array)
      .promise.then((document) => document)
    const initialPgInfo = initialPageInfo()
    const splitInfoInner = splitInfo ? splitInfo : []
    setPrevInfo({
      doc,
      initialPgInfo,
      splitInfo: splitInfoInner,
    })
  }, [pdf, initialPageInfo, splitInfo])

  const setPageNum = (pgNum: number) => {
    dispatch({
      type: PAGE_CUSTOM,
      payload: pgNum,
    })
  }

  useEffect(() => {
    ;(async () => {
      await createPreviewInfo()
    })()
  }, [createPreviewInfo])

  return (
    <div className={styles.preview}>
      <canvas ref={canvasRef}></canvas>
      <div>
        {splitInfo && splitInfo.length > 0
          ? prevInfo &&
            prevInfo.splitInfo.map((pageNum, idx) => {
              return (
                <SinglePage
                  key={`page_${idx}`}
                  doc={prevInfo.doc}
                  pageNum={pageNum}
                  setPageNum={setPageNum}
                  idx={idx}
                  leftpaneWidth={leftpaneWidth}
                />
              )
            })
          : prevInfo &&
            prevInfo.initialPgInfo.map((pageNum, idx) => {
              return (
                <SinglePage
                  key={`page_${idx}`}
                  doc={prevInfo.doc}
                  pageNum={pageNum}
                  setPageNum={setPageNum}
                  idx={idx}
                  leftpaneWidth={leftpaneWidth}
                />
              )
            })}
      </div>
    </div>
  )
}

// src={
//   await createPreviewPg(
//     prevInfo.doc,
//     prevInfo.canvas,
//     prevInfo.ctx,
//     pageNum,
//     leftpaneWidth
//   )
// }
// alt={`page ${idx}`}
// src={
//   await createPreviewPg(
//     prevInfo.doc,
//     prevInfo.canvas,
//     prevInfo.ctx,
//     pageNum,
//     leftpaneWidth
//   )
// }
