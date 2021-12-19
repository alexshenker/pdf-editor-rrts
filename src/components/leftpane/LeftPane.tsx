import React, { FC, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './LeftPane.module.css'

import { SET_LOADING_FALSE } from '../../actionTypes'
import SplitPreview from '../toolbar/splitTool/SplitPreview'
import { RootState } from '../../reducers'

const LeftPane: FC = () => {
  const dispatch = useDispatch()
  const leftpaneWidth = useSelector((state: RootState) => state.leftpane.width)

  useEffect(() => {
    dispatch({
      type: SET_LOADING_FALSE,
    })
  })

  return (
    <div style={{ width: leftpaneWidth }} className={styles.leftpane}>
      <SplitPreview />
    </div>
  )
}

export default LeftPane
