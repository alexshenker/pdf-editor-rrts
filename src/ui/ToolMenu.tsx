import React, { FC } from 'react'
import { ToolMenuProps } from '../types'
import styles from './Ui.module.css'

const ToolMenu: FC<ToolMenuProps> = ({ children }) => {
  return <div className={styles.tool_menu}>{children}</div>
}

export default ToolMenu
