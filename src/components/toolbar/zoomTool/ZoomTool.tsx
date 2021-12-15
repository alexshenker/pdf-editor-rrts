import React, { ChangeEvent, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from './ZoomTool.module.css'
//TypeScript
import { RootState } from '../../../reducers'

//Action types
import { ZOOM_OUT, ZOOM_IN, ZOOM_CUSTOM } from '../../../actionTypes'

//UI
import ToolBtn from '../../../ui/ToolBtn'
import ToolInput from '../../../ui/ToolInput'

//Icons
import { VscZoomOut } from '@react-icons/all-files/vsc/VscZoomOut'
import { VscZoomIn } from '@react-icons/all-files/vsc/VscZoomIn'

export default function ZoomTool() {
  const zoom = useSelector((state: RootState) => state.zoom)

  //helper for custom input
  const [zoomCustomState, setZoomCustomState] = useState(`${zoom}`)

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
  const zoomCustom = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      return setZoomCustomState('')
    }

    const inputValue = Number(e.target.value.replace(/[^0-9]*/g, ''))
    if (inputValue <= 999) {
      setZoomCustomState(String(inputValue))
    }
    if (inputValue >= 25 && inputValue <= 200) {
      dispatch({
        type: ZOOM_CUSTOM,
        payload: inputValue,
      })
    }
  }

  useEffect(() => {
    if (zoom && typeof zoom === 'number') {
      setZoomCustomState(`${zoom}`)
    }
  }, [zoom])

  return (
    <div className={styles.zoom_tool}>
      <ToolBtn handleClick={zoomOut} description="">
        <VscZoomOut />
      </ToolBtn>
      <ToolBtn handleClick={zoomIn} description="">
        <VscZoomIn />
      </ToolBtn>
      <ToolInput
        handleChange={zoomCustom}
        value={`${zoomCustomState}`}
        suffix="%"
        inputType="string"
      />
    </div>
  )
}
