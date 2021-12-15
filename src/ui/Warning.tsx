import React, { FC } from 'react'
import styles from './Ui.module.css'
import { WarningProps } from '../types'

const Warning: FC<WarningProps> = ({ text }) => {
  return (
    <div className={styles.Warning}>
      <p>{text}</p>
    </div>
  )
}

export default Warning
