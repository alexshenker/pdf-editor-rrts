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
  const className = checked
    ? `${styles.radio_input} ${styles.radio_input_checked}`
    : styles.radio_input

  return (
    <div onClick={handleChange} className={className}>
      <input
        type="radio"
        name={name}
        value={labelFor}
        onChange={handleChange}
        checked={checked}
      />
      {labelText && <label htmlFor={labelFor}>{labelText}</label>}
    </div>
  )
}

export default RadioInput
