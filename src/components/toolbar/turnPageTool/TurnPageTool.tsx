import React, { ChangeEvent, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../reducers'
import styles from './TurnPageTool.module.css'

//action types
import { PAGE_DOWN, PAGE_UP, PAGE_CUSTOM } from '../../../actionTypes'

//UI
import ToolBtn from '../../../ui/ToolBtn'
import ToolInput from '../../../ui/ToolInput'
//Icons
import { VscTriangleLeft } from '@react-icons/all-files/vsc/VscTriangleLeft'
import { VscTriangleRight } from '@react-icons/all-files/vsc/VscTriangleRight'

export default function TurnPageTool() {
  const numPages = useSelector((state: RootState) => state.file.numPages)
  const pageNum = useSelector((state: RootState) => state.page)
  const dispatch = useDispatch()

  //helper for custom input
  const [pageCustomState, setPageCustomState] = useState(`${pageNum}`)

  const pageDown = () => {
    dispatch({
      type: PAGE_DOWN,
    })
  }
  const pageUp = () => {
    dispatch({
      type: PAGE_UP,
      payload: numPages,
    })
  }
  const pageCustom = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      return setPageCustomState('')
    }

    const inputValue = Number(e.target.value)

    if (typeof inputValue === 'number' && Number.isInteger(inputValue)) {
      setPageCustomState(String(inputValue))

      if (inputValue >= 1 && inputValue <= numPages) {
        dispatch({
          type: PAGE_CUSTOM,
          payload: inputValue,
        })
      }
    }
  }

  useEffect(() => {
    if (pageNum && typeof pageNum === 'number') {
      setPageCustomState(`${pageNum}`)
    }
  }, [pageNum])
  return (
    <div className={styles.turn_page_tool}>
      <ToolBtn handleClick={pageDown} description="">
        <VscTriangleLeft />
      </ToolBtn>
      <ToolBtn handleClick={pageUp} description="">
        <VscTriangleRight />
      </ToolBtn>
      <ToolInput
        handleChange={pageCustom}
        value={pageCustomState}
        suffix={`/ ${numPages}`}
        inputType="text"
      />
    </div>
  )
}
