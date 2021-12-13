import React from 'react'

//TOOLS
import TurnPageTool from './turnPageTool/TurnPageTool'
import ZoomTool from './zoomTool/ZoomTool'

export default function Toolbar() {
  return (
    <div>
      <TurnPageTool />
      <ZoomTool />
    </div>
  )
}
