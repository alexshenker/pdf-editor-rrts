import React, { FC } from 'react'
import styles from './Ui.module.css'

import { MdErrorOutline } from '@react-icons/all-files/md/MdErrorOutline'

const Error: FC = () => {
  return (
    <div className={styles.Error}>
      <div className={styles.Icon}>
        <MdErrorOutline />
      </div>
      <p>Error</p>
    </div>
  )
}

export default Error
