import React from 'react'

import styles from './RotateTool.module.css'
//TypeScript
import { RootState } from '../../../reducers'

//UI
import ToolBtn from '../../../ui/ToolBtn'

//Icons
import { AiOutlineRotateRight } from '@react-icons/all-files/ai/AiOutlineRotateRight'

/**
 * should just rotate the canvas and preview
  of the same page.
 * rotation information should be stored somewhere for 
  when the user decides to save the document.
 */

export default function RotateTool() {
  //must receive (or get) canvasRef and an imageRef
  const rotate = () => {}

  return (
    <div className={styles.rotate_tool}>
      <ToolBtn handleClick={rotate} description="">
        <AiOutlineRotateRight />
      </ToolBtn>
    </div>
  )
}
