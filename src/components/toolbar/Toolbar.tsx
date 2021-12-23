import React from 'react'

import styles from './Toolbar.module.css'

//TOOLS
import TurnPageTool from './turnPageTool/TurnPageTool'
import ZoomTool from './zoomTool/ZoomTool'
import SplitTool from './splitTool/SplitTool'
import RotateTool from './rotateTool/RotateTool'
//import CompressTool from './compressTool/CompressTool'

export default function Toolbar() {
  return (
    <div className={styles.toolbar}>
      <TurnPageTool />
      <ZoomTool />
      <SplitTool />
      <RotateTool />
    </div>
  )
}
