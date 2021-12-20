import React, { useState, useRef } from 'react'
import styles from './Dropzone.module.css'
import { useDispatch } from 'react-redux'
import { ADD_FILE } from '../../actionTypes'
//TESTING
import Modal from '../../ui/Modal'
import Error from '../../ui/Error'

//PDF LOADER
import { PDFDocument } from 'pdf-lib'

export default function Dropzone() {
  const dispatch = useDispatch()
  const inputRef = useRef<HTMLInputElement>(null)
  //For Modal
  const modalRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return

    const file = e.target.files[0]
    file.arrayBuffer().then(async (arrayBuffer) => {
      //creates a PDFDocument instance using arrayBuffer

      const pdfDocument = await PDFDocument.load(new Uint8Array(arrayBuffer), {
        ignoreEncryption: true,
      })
      //Check if encrypted
      if (pdfDocument.isEncrypted) {
        setIsModalOpen(true)
        if (inputRef.current) {
          //reset file input
          inputRef.current.value = ''
        }
        return setError('This file is encrypted. Please try a different file.')
      }

      const numPages = pdfDocument.getPageCount(),
        page = pdfDocument.getPage(0),
        title = pdfDocument.getTitle,
        byteSize = file.size,
        width = page.getMediaBox().width,
        height = page.getMediaBox().height,
        wByHRatio = width / height
      dispatch({
        type: ADD_FILE,
        payload: {
          pdf: file,
          title,
          numPages,
          byteSize,
          width,
          height,
          wByHRatio,
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
      <input
        ref={inputRef}
        onChange={handleFile}
        id="dropzone"
        type="file"
        accept=".pdf"
      />
      <Modal
        modalRef={modalRef}
        handleClose={() => setIsModalOpen(false)}
        open={isModalOpen}
        titleElement={error ? <Error /> : <></>}
      >
        <div>{error ? <>{error}</> : ''}</div>
      </Modal>
    </div>
  )
}
