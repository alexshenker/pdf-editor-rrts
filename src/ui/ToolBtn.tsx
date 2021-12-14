import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import styles from './Ui.module.css'

//Type
import { ToolBtnProps } from '../types'
import { RootState } from '../reducers'

const ToolBtn: FC<ToolBtnProps> = ({ handleClick, text, children }) => {
  const enabled = useSelector((state: RootState) => state.toolbar)
  return (
    <button
      disabled={!enabled}
      className={styles.tool_btn}
      onClick={handleClick}
    >
      <div className={styles.icon_container}>{children}</div>
    </button>
  )
}

export default ToolBtn
