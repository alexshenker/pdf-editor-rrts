import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import styles from './ZoomTool.module.css'
//TypeScript
import { RootState } from '../../../reducers'

//Action types
import { ZOOM_IN, ZOOM_OUT, ZOOM_CUSTOM } from '../../../types'

//UI
import ToolBtn from '../../../ui/ToolBtn'

//Icons
import {VscZoomIn} from '@react-icons/all-files/vsc/VscZoomIn'
import {VscZoomOut} from '@react-icons/all-files/vsc/VscZoomOut'

export default function ZoomTool() {

  const zoom = useSelector((state: RootState) => state.zoom)
  const dispatch = useDispatch()

  const zoomIn = () => {
  dispatch({
    type: ZOOM_IN
  })    
  }
  const zoomOut = () => {
    dispatch({
      type: ZOOM_OUT
    })
  }

  return (
    <div className={styles.zoom_tool}>
    <ToolBtn handleClick={zoomIn} text=''>
      <VscZoomIn />
    </ToolBtn>
    <ToolBtn handleClick={zoomOut} text=''>
      <VscZoomOut />
    </ToolBtn>
    <div>{zoom}%</div>
    </div>
  )
}
