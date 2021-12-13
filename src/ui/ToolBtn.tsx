import React, { FC } from 'react'
import styles from './Ui.module.css'

interface ToolBtnProps {
  handleClick(): void;
  text: string;
  children: JSX.Element;
}

const ToolBtn: FC<ToolBtnProps> = ({handleClick, text, children}) => {
  return (
    <button className={styles.tool_btn}
    onClick={handleClick}
    ><div className={styles.icon_container}>{children}</div></button>
  )
}

export default ToolBtn