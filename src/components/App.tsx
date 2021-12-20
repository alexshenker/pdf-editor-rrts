import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../reducers'
import styles from './App.module.css'
//components
import Toolbar from './toolbar/Toolbar'
import Dropzone from './dropzone/Dropzone'

import LeftPane from './leftpane/LeftPane'
import Viewer from './viewer/Viewer'

function App() {
  const pdfHeight = useSelector((state: RootState) => state.file.height)

  return (
    <div>
      <Dropzone />
      <div className={styles.app_body}>
        <div>
          <LeftPane />
        </div>
        <div>
          <Toolbar />
          <div
            style={{ height: pdfHeight || 'auto' }}
            className={styles.viewer_container}
          >
            <Viewer />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
