import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../reducers'
import styles from './TurnPageTool.module.css'

//action types
import {PAGE_DOWN, PAGE_UP, PAGE_CUSTOM} from '../../../types'

//UI
import ToolBtn from '../../../ui/ToolBtn'
//Icons

export default function TurnPageTool() {

  const numPages = useSelector((state: RootState) => state.file.numPages)
  const pageNum = useSelector((state: RootState) => state.page)
  const dispatch = useDispatch()

  const pageDown = () => {
    dispatch({
      type: PAGE_DOWN 
    })
  }
  const pageUp = () => {
    dispatch({
      type: PAGE_UP,
      payload: numPages
    })
  }
  return (
    <div className={styles.turn_page_tool}>
    <ToolBtn handleClick={pageDown} text=''>
      <div></div>
    </ToolBtn>
    <ToolBtn handleClick={pageUp} text=''>
    <div></div>
    </ToolBtn>
    <div>{pageNum} / {numPages}</div>
    </div>
  )
}
