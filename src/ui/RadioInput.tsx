import React, { FC } from 'react'
import styles from './Ui.module.css'

//Type
import { RadioInputProps } from '../types'

const RadioInput: FC<RadioInputProps> = ({
  handleChange,
  labelFor,
  labelText,
  checked,
  name,
}) => {
  return (
    <div className={styles.radio_input}>
      {labelText && <label htmlFor={labelFor}>{labelText}</label>}
      <input
        type="radio"
        name={name}
        value={labelFor}
        onChange={handleChange}
        checked={checked}
      />
    </div>
  )
}

export default RadioInput
