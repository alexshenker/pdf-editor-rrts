import React, { useState, useEffect, useMemo, useCallback } from 'react'
//REACT TYPES
import { ChangeEvent } from 'react'
//REDUX
import { useSelector, useDispatch } from 'react-redux'

//ACTION TYPES
import { CREATE_SPLIT_PREVIEW, SET_EDITED_FILE } from '../../../actionTypes'

import styles from './SplitTool.module.css'
//UI
import ToolMenu from '../../../ui/ToolMenu'
import ToolBtn from '../../../ui/ToolBtn'
import Button from '../../../ui/Button'
import Modal from '../../../ui/Modal'
import Error from '../../../ui/Error'
import Input from '../../../ui/Input'
import RadioInput from '../../../ui/RadioInput'
//ICONS
import { GiSplitArrows } from '@react-icons/all-files/gi/GiSplitArrows'
import { RootState } from '../../../reducers'

//PDF LIBRARY
import { PDFDocument } from 'pdf-lib'
//HELPERS
import { rangeSplitter, customSplitter, isNum, isCustomValid } from './helpers'

export default function SplitTool() {
  //STATE
  const [active, setActive] = useState(false)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | false>(false)

  const handleClose = () => {
    setOpen(false)
  }
  //REDUX
  const numPages = useSelector((state: RootState) => state.file.numPages)
  const pdf = useSelector((state: RootState) => state.file.pdf)
  const fileTitle = useSelector((state: RootState) => state.file.title)
  const dispatch = useDispatch()

  //INPUTS
  const [rangeType, setRangeType] = useState<'range' | 'custom'>('range')
  const [rangeFrom, setRangeFrom] = useState('')
  const [rangeTo, setRangeTo] = useState('')
  const [customInput, setCustomInput] = useState('')

  const [pagesToExtract, setPagesToExtract] = useState<number[]>([])

  const errorReset = useCallback(() => {
    if (error) setError(false)
  }, [error])
  const getError = useCallback(() => {
    return error ? true : false
  }, [error])
  const createErrors = useCallback(() => {
    //ERRORS
    const errors = {
      '>numPages': `You have provided a page number that is higher than the total number of pages. Please enter values that are no higher than ${numPages}.`,
      'from>to':
        'The value of "from" must not be greater than the value of "to".',
      incomplete: 'Invalid range in custom input.',
    }
    return errors
  }, [numPages])
  //MEMO
  const splitInfo = useMemo(() => {
    errorReset()
    if (rangeType === 'range') {
      const info = rangeSplitter(
        rangeFrom,
        rangeTo,
        numPages,
        setError,
        createErrors()
      )
      return getError() ? null : info
    }
    if (rangeType === 'custom') {
      const info = customSplitter(
        customInput,
        numPages,
        setError,
        createErrors()
      )
      return getError() ? null : info
    }
  }, [
    rangeFrom,
    rangeTo,
    numPages,
    customInput,
    rangeType,
    errorReset,
    getError,
    createErrors,
  ])

  useEffect(() => {
    if (splitInfo && splitInfo.length > 0) {
      return setPagesToExtract(splitInfo)
    }
  }, [splitInfo])

  useEffect(() => {
    if (isNaN(pagesToExtract[pagesToExtract.length - 1])) return
    if (!getError() && pagesToExtract.length > 0 && pagesToExtract) {
      dispatch({
        type: CREATE_SPLIT_PREVIEW,
        payload: pagesToExtract,
      })
    }
  }, [pagesToExtract, dispatch, getError])

  const handleType = (type: string) => {
    if (type === 'range' || type === 'custom') {
      setRangeType(type)
    }
  }

  const handleChange = (
    type: 'start' | 'end' | 'custom',
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const val = e.target.value
    const lastChar = val.charAt(val.length - 1)
    switch (type) {
      case 'start':
        return isNum(lastChar) || lastChar === '' ? setRangeFrom(val) : null
      case 'end':
        return isNum(lastChar) || lastChar === '' ? setRangeTo(val) : null
      case 'custom':
        return isCustomValid(val, lastChar) ? setCustomInput(val) : null
      default:
        return
    }
  }

  const toggleMenu = () => {
    setActive(!active)
  }

  const createDoc = async () => {
    const arrBuff = await pdf
      .arrayBuffer()
      .then((arrayBuffer: ArrayBuffer) => arrayBuffer)
    const pdfDoc = await PDFDocument.load(arrBuff)
    return pdfDoc
  }

  const split = async () => {
    if (!pdf) return
    if (error) return setOpen(true)
    setActive(false)
    const pdfDoc = await createDoc()
    const newDoc = await PDFDocument.create()
    const createSplitDoc = async () => {
      for (let i = 0; i < pagesToExtract.length; i++) {
        const [newPage] = await newDoc.copyPages(pdfDoc, [
          pagesToExtract[i] - 1,
        ])
        newDoc.addPage(newPage)
      }
      return newDoc
    }

    const splitDoc = await createSplitDoc()
    if (splitDoc && splitDoc instanceof PDFDocument) {
      const uInt8Array = await splitDoc.save({ addDefaultPage: false })
      const newFile = new File([uInt8Array], fileTitle, {
        type: 'application/pdf',
      })

      const numPages = pagesToExtract.length,
        byteSize = newFile.size

      dispatch({
        type: SET_EDITED_FILE,
        payload: {
          pdf: newFile,
          numPages,
          byteSize,
        },
      })
    }
    return
  }

  return (
    <div className={styles.split_tool}>
      <ToolBtn handleClick={toggleMenu} description="Split File">
        <GiSplitArrows />
      </ToolBtn>
      {active && (
        <ToolMenu>
          <div className={styles.menu_content}>
            <div className={styles.menu_rangetype}>
              <RadioInput
                name="rangeType"
                labelFor="range"
                handleChange={() => handleType('range')}
                labelText="Range"
                checked={rangeType === 'range'}
              />
              <RadioInput
                name="rangeType"
                labelFor="custom"
                handleChange={() => handleType('custom')}
                labelText="Custom"
                checked={rangeType === 'custom'}
              />
            </div>
            {rangeType === 'range' ? (
              <div className={styles.menu_inputs}>
                <Input
                  handleChange={(e) => handleChange('start', e)}
                  value={rangeFrom}
                  inputType="text"
                  labelFor="split_range_from"
                  labelText="From"
                  placeholder="1"
                />
                <Input
                  handleChange={(e) => handleChange('end', e)}
                  value={rangeTo}
                  inputType="text"
                  labelText="To"
                  labelFor="split_range_to"
                  placeholder={numPages}
                />
              </div>
            ) : (
              <div>
                <Input
                  handleChange={(e) => handleChange('custom', e)}
                  value={customInput}
                  inputType="text"
                  labelFor="split_custom"
                  labelText="Custom"
                  placeholder="Ex: 3,6-8,12,13"
                  inputWidth="100%"
                />
              </div>
            )}
            <Button handleClick={split} text="Split" />
          </div>
        </ToolMenu>
      )}
      <Modal
        open={open}
        handleClose={handleClose}
        titleElement={error ? <Error /> : <></>}
      >
        <div>{error ? <>{error}</> : ''}</div>
      </Modal>
    </div>
  )
}
