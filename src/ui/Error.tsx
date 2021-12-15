import React, { FC } from 'react'
import styles from './Ui.module.css'
import { ErrorProps } from '../types'

const Error: FC<ErrorProps> = ({ text }) => {
  return (
    <div className={styles.Error}>
      <p>{text}</p>
    </div>
  )
}

export default Error
