import React, { FC } from 'react'
import styles from './Ui.module.css'

import { VscWarning } from '@react-icons/all-files/vsc/VscWarning'

const Warning: FC = () => {
  return (
    <div className={styles.Warning}>
      <div className={styles.Icon}>
        <VscWarning />
      </div>
      <p>Warning</p>
    </div>
  )
}

export default Warning
