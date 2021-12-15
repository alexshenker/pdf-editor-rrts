import React, { FC } from 'react'
import styles from './Ui.module.css'
import { ButtonProps } from '../types'

const Button: FC<ButtonProps> = ({ text, children }) => {
  return (
    <button className={styles.Button}>
      {text && <div>{text}</div>}
      {children && <div>{children}</div>}
    </button>
  )
}

export default Button
