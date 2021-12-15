import React, { FC } from 'react'
import styles from './Ui.module.css'
import { ErrorProps } from '../types'

import { VscError } from '@react-icons/all-files/vsc/VscError'

const Error: FC<ErrorProps> = ({ text }) => {
  return (
    <div className={styles.Error}>
      <div className={styles.Icon}>
        <VscError />
      </div>
      <p>{text}</p>
    </div>
  )
}

export default Error
