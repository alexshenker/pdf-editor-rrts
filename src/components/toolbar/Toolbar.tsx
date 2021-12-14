import React from 'react'

import styles from './Toolbar.module.css'

//TOOLS
import TurnPageTool from './turnPageTool/TurnPageTool'
import ZoomTool from './zoomTool/ZoomTool'

export default function Toolbar() {
  return (
    <div className={styles.toolbar}>
      <TurnPageTool />
      <ZoomTool />
    </div>
  )
}
