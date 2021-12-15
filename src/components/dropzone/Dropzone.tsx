import React from 'react'
import styles from './Dropzone.module.css'
import { useDispatch } from 'react-redux'
import { ADD_FILE } from '../../actionTypes'

//PDF LOADER
import { PDFDocument } from 'pdf-lib'

export default function Dropzone() {
  const dispatch = useDispatch()

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return

    const file = e.target.files[0]
    file.arrayBuffer().then(async (arrayBuffer) => {
      //creates a PDFDocument instance using arrayBuffer
      const pdfDocument = await PDFDocument.load(new Uint8Array(arrayBuffer))

      const numPages = pdfDocument.getPageCount(),
        page = pdfDocument.getPage(0),
        byteSize = file.size,
        width = page.getMediaBox().width,
        height = page.getMediaBox().height
      dispatch({
        type: ADD_FILE,
        payload: {
          pdf: file,
          numPages,
          byteSize,
          width,
          height,
        },
      })
    })
  }

  return (
    <div className={styles.dropzone}>
      <label className={styles.inputLabel} htmlFor="dropzone">
        <div className={styles.inputBox}>
          <p>Drop or Select</p>
        </div>
      </label>
      <input onChange={handleFile} id="dropzone" type="file" accept=".pdf" />
    </div>
  )
}
