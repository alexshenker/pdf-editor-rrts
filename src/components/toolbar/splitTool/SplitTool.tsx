import React, { useState, ChangeEvent, FormEvent } from 'react'

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

  const [error, setError] = useState('')

  const handleClose = () => {
    setOpen(false)
  }

  const numPages = useSelector((state: RootState) => state.file.numPages)
  const pdf = useSelector((state: RootState) => state.file.pdf)

  //INPUTS
  const [rangeType, setRangeType] = useState<'range' | 'custom'>('range')
  const [rangeStart, setRangeStart] = useState('')
  const [rangeEnd, setRangeEnd] = useState('')
  const [customInput, setCustomInput] = useState('')

  const handleType = (e: ChangeEvent<HTMLInputElement>) => {
    const type = e.target.value
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
        if (lastChar.match(/^[0-9]+$/) != null || lastChar === '') {
          return setRangeStart(val)
        }
        return
      case 'end':
        if (lastChar.match(/^[0-9]+$/) != null || lastChar === '') {
          return setRangeEnd(val)
        }
        return
      case 'custom':
        if (
          lastChar.match(/^[0-9]+$/) ||
          lastChar === ',' ||
          lastChar === '-' ||
          lastChar === ''
        ) {
          return setCustomInput(val)
        }
        return
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
    if (pdf) {
      const newDocument =
        rangeType === 'range' ? await rangeSplit() : await customSplit()

      if (newDocument && newDocument instanceof PDFDocument) {
        const uInt8Array = await newDocument.save({ addDefaultPage: false })
        return autoDownload(uInt8Array)
      }
    } else {
      return
    }
  }

  const rangeSplit = async () => {
    const start = Number(rangeStart)
    const end = Number(rangeEnd)

    if (start > end) {
      setError('Starting number cannot be greater than the ending number')
      return setOpen(true)
    }

    if (end > numPages) {
      setError(`The highest page number you can enter is ${numPages}`)
      setRangeEnd(`${numPages}`)
      return setOpen(true)
    }
    //range split
    //remove pages that are before and after range
    const pdfDoc = await createDoc()

    const performRangeSplit = async () => {
      const newDoc = await PDFDocument.create()

      for (let i = start; i <= end; i++) {
        const [newPage] = await newDoc.copyPages(pdfDoc, [i - 1])
        newDoc.addPage(newPage)
      }
      return newDoc
    }
    const newDocument = await performRangeSplit()
    return newDocument
  }

  const customSplit = async () => {
    const pdfDoc = await createDoc()

    const performCustomSplit = async () => {
      const newDoc = await PDFDocument.create()
      const inputArray = customInput.split(',')

      const pagesToCopy: number[] = []
      inputArray.forEach((p) => {
        if (p.includes('-')) {
          const range = p.split('-')
          if (range.length !== 2) {
            setError(
              'Incorrect range value provided. The custom input ranges should be two numbers separated by a dash. Ex: 1-8'
            )
            return setOpen(true)
          }
          const rangeS = Number(range[0])
          const rangeE = Number(range[1])
          if (rangeE > numPages || rangeS > numPages) {
            setError(`The highest page number you can enter is ${numPages}`)
            return setOpen(true)
          }
          if (rangeS > rangeE) {
            setError('Starting number cannot be greater than the ending number')
            return setOpen(true)
          }
          for (let i = rangeS; i <= rangeE; i++) {
            pagesToCopy.push(i - 1)
          }
        } else {
          if (Number(p) > numPages) {
            setError(`The highest page number you can enter is ${numPages}`)
            return setOpen(true)
          }
          pagesToCopy.push(Number(p) - 1)
        }
      })

      for (let i = 0; i < pagesToCopy.length; i++) {
        const [newPage] = await newDoc.copyPages(pdfDoc, [pagesToCopy[i]])
        newDoc.addPage(newPage)
      }
      return newDoc
    }
    const newDocument = await performCustomSplit()
    return newDocument
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
                value={rangeStart}
                type="text"
                name="split_range_from"
                placeholder="1"
              />

              <label htmlFor="split_range_to">To</label>
              <input
                onChange={(e) => handleChange('end', e)}
                value={rangeEnd}
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
                placeholder="Ex: 3, 6-8, 12, 13"
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
