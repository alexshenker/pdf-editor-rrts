import React, { FC } from 'react'
import styles from './Ui.module.css'

//Type
import { ToolBtnProps } from '../types'

const ToolBtn: FC<ToolBtnProps> = ({ handleClick, text, children }) => {
  return (
    <button className={styles.tool_btn} onClick={handleClick}>
      <div className={styles.icon_container}>{children}</div>
    </button>
  )
}

export default ToolBtn
