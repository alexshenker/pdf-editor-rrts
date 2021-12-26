import React, { useState, useRef, useEffect, useCallback } from 'react'
import styles from './Dropzone.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { ADD_FILE, SET_TEST_PDF_DATA } from '../../actionTypes'
//COMPONENTS
import Modal from '../../ui/Modal'
import Error from '../../ui/Error'

//PDF LOADER
import { PDFDocument } from 'pdf-lib'
import { OPEN_LEFT_PANE } from '../../actionTypes'
import { RootState } from '../../reducers'

export default function Dropzone() {
  const dispatch = useDispatch()
  const inputRef = useRef<HTMLInputElement>(null)
  //For Modal
  const modalRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  //TESTING
  const testPdf = useSelector((state: RootState) => state.test.testPdf)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e || !e.target.files || !e.target.files[0]) return
    const file = e.target.files[0]
    handleBuffer(file)
  }

  const handleBuffer = (pdfFile: File) => {
    pdfFile.arrayBuffer().then(async (arrayBuffer: ArrayBuffer) => {
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
        title = pdfFile.name.replace(/\s+/g, '_').toLowerCase(),
        byteSize = pdfFile.size,
        width = page.getMediaBox().width,
        height = page.getMediaBox().height,
        wByHRatio = width / height

      dispatch({
        type: OPEN_LEFT_PANE,
      })
      dispatch({
        type: ADD_FILE,
        payload: {
          pdf: pdfFile,
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

  const handleBufferCB = useCallback(handleBuffer, [handleBuffer])

  useEffect(() => {
    if (testPdf) {
      handleBufferCB(testPdf)
    }
    return function cleanup() {
      dispatch({
        type: SET_TEST_PDF_DATA,
        payload: null,
      })
    }
  }, [testPdf, dispatch, handleBufferCB])

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
