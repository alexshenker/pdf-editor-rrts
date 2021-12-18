import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'

//REDUX
import { useSelector } from 'react-redux'

//HELPER
import { autoDownload } from '../../../helpers/autoDownload'

import styles from './SplitTool.module.css'
//UI
import ToolMenu from '../../../ui/ToolMenu'
import ToolBtn from '../../../ui/ToolBtn'
import Button from '../../../ui/Button'
import Modal from '../../../ui/Modal'
import Error from '../../../ui/Error'
//ICONS
import { GiSplitArrows } from '@react-icons/all-files/gi/GiSplitArrows'
import { RootState } from '../../../reducers'

//PDF LIBRARY
import { PDFDocument } from 'pdf-lib'

export default function SplitTool() {
  const [active, setActive] = useState(true)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | false>(false)

  const handleClose = () => {
    setOpen(false)
  }

  const numPages = useSelector((state: RootState) => state.file.numPages)
  const pdf = useSelector((state: RootState) => state.file.pdf)

  //ERRORS
  const errors = {
    '>numPages': `You have provided a page number that is higher than the total number of pages. Please enter values that are no higher than ${numPages}.`,
    'from>to':
      'The value of "from" must not be greater than the value of "to".',
    incomplete: 'Invalid range in custom input.',
  }

  //INPUTS
  const [rangeType, setRangeType] = useState<'range' | 'custom'>('range')
  const [rangeFrom, setRangeFrom] = useState('')
  const [rangeTo, setRangeTo] = useState('')
  const [customInput, setCustomInput] = useState('')

  const [pagesToExtract, setPagesToExtract] = useState<number[]>([])

  const splitters = {
    range() {
      if (rangeFrom === '' || rangeTo === '') return
      const start = Number(rangeFrom)
      const end = Number(rangeTo)
      if (start > numPages || end > numPages)
        return setError(errors['>numPages'])
      if (start > end) return setError(errors['from>to'])
      const splitInfo: number[] = []
      for (let i = start; i <= end; i++) {
        splitInfo.push(i)
      }
      return splitInfo
    },
    custom() {
      if (customInput === '') return
      const inputArray = customInput.split(',')
      const splitInfo: number[] = []

      inputArray.forEach((p) => {
        if (p.includes('-')) {
          const range = p.split('-')
          //validate: length of 'range' Array is 2
          if (range.length !== 2) return setError(errors['incomplete'])

          const start = Number(range[0])
          const end = Number(range[1])
          //validate: start or end !> numPages
          if (start > numPages || end > numPages)
            return setError(errors['>numPages'])
          //validate: start <= end
          if (start > end) return setError(errors['from>to'])
          for (let i = start; i <= end; i++) {
            splitInfo.push(i)
          }
        } else {
          //validate Number(p) <= numPages
          if (Number(p) > numPages) return setError(errors['>numPages'])
          splitInfo.push(Number(p))
        }
      })
      return splitInfo
    },
  }

  useEffect(() => {
    setError(false)
    const splitInfo = splitters[rangeType]()
    if (splitInfo) {
      return setPagesToExtract(splitInfo)
    }
  }, [rangeType, rangeFrom, rangeTo, customInput])

  const handleType = (e: ChangeEvent<HTMLInputElement>) => {
    const type = e.target.value
    if (type === 'range' || type === 'custom') {
      setRangeType(type)
    }
  }

  const isNum = (val: string) => val.match(/^[0-9]+$/)
  const isDashValid = (str: string, idx: number) => {
    for (let i = idx - 2; i >= 0; i--) {
      if (str[i] === '-') return false
      if (str[i] === ',') return true
    }
    return true
  }

  const isCustomValid = (str: string, lastChar: string) => {
    if (isNum(lastChar)) return true
    if (lastChar === ' ') return false
    if (str.length <= 1) {
      //1st char is number. No char means empty str
      return str.length === 1 ? isNum(lastChar) : str === ''
    }
    const prevChar = str.charAt(str.length - 2)
    if (lastChar === '-') {
      return isNum(prevChar) && isDashValid(str, str.length)
    }
    if (lastChar === ',') {
      return isNum(prevChar)
    }
    if (prevChar === '-' || prevChar === ',') {
      return isNum(lastChar)
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
      return autoDownload(uInt8Array)
    }
    return
  }

  return (
    <div className={styles.split_tool}>
      <ToolBtn handleClick={toggleMenu} description="Split File">
        <GiSplitArrows />
      </ToolBtn>
      <ToolMenu>
        <div className={styles.menu_content}>
          <div onChange={handleType}>
            <label htmlFor="range">Range</label>
            <input
              type="radio"
              name="rangeType"
              value="range"
              checked={rangeType === 'range'}
            />
            <label htmlFor="custom">Custom</label>
            <input
              type="radio"
              name="rangeType"
              value="custom"
              checked={rangeType === 'custom'}
            />
          </div>
          {rangeType === 'range' ? (
            <div>
              <label htmlFor="split_range_from">From</label>
              <input
                onChange={(e) => handleChange('start', e)}
                value={rangeFrom}
                type="text"
                name="split_range_from"
                placeholder="1"
              />

              <label htmlFor="split_range_to">To</label>
              <input
                onChange={(e) => handleChange('end', e)}
                value={rangeTo}
                type="text"
                name="split_range_to"
                placeholder={numPages}
              />
            </div>
          ) : (
            <div>
              <label htmlFor="split_custom">Custom</label>
              <input
                onChange={(e) => handleChange('custom', e)}
                value={customInput}
                type="text"
                name="split_custom"
                placeholder="Ex: 3,6-8,12,13"
              />
            </div>
          )}
          <Button handleClick={split} text="Split" />
        </div>
      </ToolMenu>
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
