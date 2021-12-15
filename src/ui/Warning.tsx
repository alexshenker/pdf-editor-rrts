import React, { FC } from 'react'
import styles from './Ui.module.css'
import { WarningProps } from '../types'

import { VscWarning } from '@react-icons/all-files/vsc/VscWarning'

const Warning: FC<WarningProps> = ({ text }) => {
  return (
    <div className={styles.Warning}>
      <div className={styles.Icon}>
        <VscWarning />
      </div>
      <p>{text}</p>
    </div>
  )
}

export default Warning
