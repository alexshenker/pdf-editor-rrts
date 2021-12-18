import React, { FC } from 'react'

import styles from './LeftPane.module.css'

const LeftPane: FC = ({ children }) => {
  return <div className={styles.leftpane}>{children}</div>
}

export default LeftPane
