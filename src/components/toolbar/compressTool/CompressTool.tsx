import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../reducers'
import styles from './CompressTool.module.css'

//UI
import ToolBtn from '../../../ui/ToolBtn'
import ToolInput from '../../../ui/ToolInput'

/*
? small menu? / modal?
- preview image (on viewer?)
- current size
Larger number = more compression / lower quality
- compression options (1-10, 1-100, low-medium-high)
*/

export default function CompressTool() {
  const byteSize = useSelector((state: RootState) => state.file.byteSize)

  return <div className={styles.compress_tool}></div>
}
