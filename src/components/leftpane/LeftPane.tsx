import React, { FC, useEffect } from 'react'
import { useSelector } from 'react-redux'
import styles from './LeftPane.module.css'

import Preview from './PreviewCreator'
import { RootState } from '../../reducers'

const LeftPane: FC = () => {
  const leftpaneWidth = useSelector((state: RootState) => state.leftpane.width)

  return (
    <div style={{ width: leftpaneWidth }} className={styles.leftpane}>
      <Preview />
    </div>
  )
}

export default LeftPane
