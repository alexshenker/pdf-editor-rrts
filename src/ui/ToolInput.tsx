import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import styles from './Ui.module.css'

//Type
import { ToolInputProps } from '../types'
import { RootState } from '../reducers'

const ToolInput: FC<ToolInputProps> = ({
  handleChange,
  value,
  suffix,
  inputType,
}) => {
  const enabled = useSelector((state: RootState) => state.toolbar)

  return (
    <div className={styles.tool_input}>
      <input
        disabled={!enabled}
        onChange={handleChange}
        className={styles.tool_input_input}
        type={inputType}
        value={value}
      />
      <span>{suffix}</span>
    </div>
  )
}

export default ToolInput
