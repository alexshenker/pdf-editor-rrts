import React from 'react'

import styles from './App.module.css'
//components
import Toolbar from './toolbar/Toolbar'
import Dropzone from './dropzone/Dropzone'

import LeftPane from './leftpane/LeftPane'
import Viewer from './viewer/Viewer'

function App() {
  return (
    <div>
      <Dropzone />
      <div className={styles.app_body}>
        <div>
          <LeftPane />
        </div>
        <div>
          <Toolbar />
          <Viewer />
        </div>
      </div>
    </div>
  )
}

export default App
