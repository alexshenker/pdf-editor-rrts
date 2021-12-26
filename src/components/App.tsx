import React from 'react'

import styles from './App.module.css'
//components
import Toolbar from './toolbar/Toolbar'
import Dropzone from './dropzone/Dropzone'

import LeftPane from './leftpane/LeftPane'
import Viewer from './viewer/Viewer'

//TEST BUTTON
import TestButton from './tests/TestButton'

function App() {
  return (
    <div>
      <TestButton />
      <Dropzone />
      <div className={styles.app_body}>
        <div>
          <LeftPane />
        </div>
        <div className={styles.app_viewer_container}>
          <Toolbar />
          <Viewer />
        </div>
      </div>
    </div>
  )
}

export default App
