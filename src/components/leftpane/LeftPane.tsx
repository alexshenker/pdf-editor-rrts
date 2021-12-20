import React, { FC, useRef, useCallback, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from './LeftPane.module.css'

import Preview from './Preview'
import { RootState } from '../../reducers'

const LeftPane: FC = () => {
  const leftpaneWidth = useSelector((state: RootState) => state.leftpane.width)
  const pdfHeight = useSelector((state: RootState) => state.file.height)
  const isOpen = useSelector((state: RootState) => state.leftpane.isOpen)

  //determine width of scrollbar to set proper leftpane width
  //scroll bar covers part of it (chrome)
  //scrollbars often 15px

  return (
    <div
      style={{
        width: isOpen ? `${leftpaneWidth}px` : '0px',
        height: isOpen ? `${pdfHeight}px` : '0px',
      }}
      className={isOpen ? styles.leftpane_open : styles.leftpane_closed}
    >
      <div className={styles.leftpane_header}>Preview</div>
      <Preview />
    </div>
  )
}

export default LeftPane
