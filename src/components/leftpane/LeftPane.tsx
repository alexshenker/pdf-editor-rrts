import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import styles from './LeftPane.module.css'

import Preview from './Preview'
import { RootState } from '../../reducers'

const LeftPane: FC = () => {
  const leftpaneWidth = useSelector((state: RootState) => state.leftpane.width)
  const pdfHeight = useSelector((state: RootState) => state.file.height)
  const isOpen = useSelector((state: RootState) => state.leftpane.isOpen)
  return (
    <div
      style={{
        width: isOpen ? leftpaneWidth : '0px',
        height: isOpen ? pdfHeight : '0px',
      }}
      className={isOpen ? styles.leftpane_open : styles.leftpane_closed}
    >
      <div className={styles.leftpane_header}>Preview</div>
      <Preview />
    </div>
  )
}

export default LeftPane
