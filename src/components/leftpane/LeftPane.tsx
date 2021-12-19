import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import styles from './LeftPane.module.css'

import Preview from './Preview'
import { RootState } from '../../reducers'

const LeftPane: FC = () => {
  const leftpaneWidth = useSelector((state: RootState) => state.leftpane.width)
  const isOpen = useSelector((state: RootState) => state.leftpane.isOpen)
  return (
    <div
      style={{ width: isOpen ? leftpaneWidth : '0px' }}
      className={isOpen ? styles.leftpane_open : styles.leftpane_closed}
    >
      <Preview />
    </div>
  )
}

export default LeftPane
