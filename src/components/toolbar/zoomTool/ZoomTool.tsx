import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from './ZoomTool.module.css'
//TypeScript
import { RootState } from '../../../reducers'

//Action types
import { ZOOM_OUT, ZOOM_IN, ZOOM_CUSTOM } from '../../../actionTypes'

//UI
import ToolBtn from '../../../ui/ToolBtn'

//Icons
import { VscZoomOut } from '@react-icons/all-files/vsc/VscZoomOut'
import { VscZoomIn } from '@react-icons/all-files/vsc/VscZoomIn'

export default function ZoomTool() {
  const zoom = useSelector((state: RootState) => state.zoom)
  const dispatch = useDispatch()

  const zoomOut = () => {
    dispatch({
      type: ZOOM_OUT,
    })
  }
  const zoomIn = () => {
    dispatch({
      type: ZOOM_IN,
    })
  }

  return (
    <div className={styles.zoom_tool}>
      <ToolBtn handleClick={zoomOut} text="">
        <VscZoomOut />
      </ToolBtn>
      <ToolBtn handleClick={zoomIn} text="">
        <VscZoomIn />
      </ToolBtn>
      <div>{zoom}%</div>
    </div>
  )
}
