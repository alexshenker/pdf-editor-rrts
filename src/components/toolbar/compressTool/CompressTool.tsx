import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../reducers'
import styles from './CompressTool.module.css'

//
import {
  PDFDocumentProxy,
  PDFPageProxy,
} from 'pdfjs-dist/types/src/display/api'
//Only the legacy build can be included via import
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js'

import jsPDF from 'jspdf'

import * as pdfLib from 'pdf-lib'
import { PDFDocument } from 'pdf-lib'

//UI
import ToolBtn from '../../../ui/ToolBtn'

//Icons
import { CgCompressRight } from '@react-icons/all-files/cg/CgCompressRight'
import ToolMenu from '../../../ui/ToolMenu'
import Button from '../../../ui/Button'
/*
- preview image (on viewer?)
- preview size estimate
- current size
Larger number = more compression / lower quality
- compression options (1-10, 1-100, low-medium-high)
*/

/**
byte = 1
KB = byte * 1024
MB = byte * 1024 * 1000
GB = byte * 1024 * 1000 * 1000
*/

const sizeChart: { [key: string]: number } = {
  bytes: 1,
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
}

export default function CompressTool() {
  const dispatch = useDispatch()
  const { byteSize, pdf, numPages } = useSelector(
    (state: RootState) => state.file
  )

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [dataUri, setDataUri] = useState('')

  const [active, setActive] = useState(true)
  const [size, setSize] = useState(0)
  const [sizeUnit, setSizeUnit] = useState('KB')

  useEffect(() => {
    unitConverter(byteSize)
  }, [byteSize])

  const unitConverter = (bytes: number): void => {
    const desiredUnit =
      bytes < sizeChart.KB
        ? 'bytes'
        : bytes < sizeChart.MB
        ? 'KB'
        : bytes < sizeChart.GB
        ? 'MB'
        : 'GB'
    const sizeNum = sizeConverter(bytes, desiredUnit)
    setSizeUnit(desiredUnit)
    setSize(sizeNum)
  }

  const sizeConverter = (bytes: number, desiredUnit: string): number => {
    return (
      Math.round((bytes / sizeChart[desiredUnit] + Number.EPSILON) * 100) / 100
    )
  }

  const toggleMenu = () => {
    setActive(!active)
  }

  const compress = async () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx || !(ctx instanceof CanvasRenderingContext2D)) return

    const arrBuff = await pdf
      .arrayBuffer()
      .then((arrayBuffer: ArrayBuffer) => arrayBuffer)

    const reducedPdf = await PDFDocument.create()

    pdfjsLib.getDocument(arrBuff).promise.then(async (doc) => {
      for (let pgNum = 1; pgNum <= numPages; pgNum++) {
        await doc.getPage(pgNum).then(async (page) => {
          const viewport = page.getViewport({ scale: 1 }),
            width = viewport.width,
            height = viewport.height,
            // 2.83465 (pt to px)
            outputScale = 2.83465,
            transform = [outputScale, 0, 0, outputScale, 0, 0]
          canvas.width = Math.floor(width * outputScale)
          canvas.height = Math.floor(height * outputScale)
          const renderCtx = {
            canvasContext: ctx,
            transform,
            viewport,
          }
          await page.render(renderCtx).promise.then(async () => {
            const jpgUrl = canvas.toDataURL('image/jpeg', 1)

            const toPdf = new jsPDF({
              orientation: 'p',
              unit: 'pt',
              format: 'a4',
              putOnlyUsedFonts: true,
              floatPrecision: 16,
              compress: true,
            })
            //Height was chosen randomly
            toPdf.addImage({
              imageData: jpgUrl,
              x: 0,
              y: 0,
              width: 595.28,
              height: height * (595.28 / width),
              alias: undefined,
              compression: 'FAST',
            })
            const newArrBuff = toPdf.output('arraybuffer')
            const uInt8Array = new Uint8Array(newArrBuff)

            const page = await PDFDocument.load(uInt8Array)

            const [copied] = await reducedPdf.copyPages(page, [0])
            reducedPdf.addPage(copied)
          })
        })
      }

      const uInt8Array = await reducedPdf.save()

      //AUTO DOWNLOAD
      const downloadURL = (data: any, fileName: any) => {
        const a = document.createElement('a')
        a.href = data
        a.download = fileName
        document.body.appendChild(a)
        a.style.display = 'none'
        a.click()
        a.remove()
      }
      const downloadBlob = (data: any, fileName: any, mimeType: any) => {
        const blob = new Blob([data], {
          type: mimeType,
        })
        const url = window.URL.createObjectURL(blob)
        downloadURL(url, fileName)
        setTimeout(() => window.URL.revokeObjectURL(url), 1000)
      }

      downloadBlob(uInt8Array, 'TestFile', 'application/pdf')

      const pdfFile = new File([uInt8Array], `Test`, {
        type: 'application/pdf',
      })
      dispatch({
        type: 'ADD_FILE',
        payload: {
          pdf: pdfFile,
          numPages,
          byteSize,
          width: 700,
          height: 700,
        },
      })
    })
  }

  return (
    <div className={styles.compress_tool}>
      <ToolBtn handleClick={toggleMenu} description="Compress File">
        <CgCompressRight />
      </ToolBtn>
      <ToolMenu>
        <div className={styles.menu_content}>
          <p>
            {size}
            <span>{` ${sizeUnit}`}</span>
          </p>
          <a target={'_blank'} href={dataUri}>
            TRY THIS
          </a>
          <Button handleClick={compress} text="Compress" />
        </div>
      </ToolMenu>
      <canvas ref={canvasRef} />
    </div>
  )
}
