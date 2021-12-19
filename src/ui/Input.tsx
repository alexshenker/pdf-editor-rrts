import React, { FC } from 'react'
import styles from './Ui.module.css'

//Type
import { InputProps } from '../types'

const Input: FC<InputProps> = ({
  handleChange,
  value,
  suffix = null,
  inputType,
  labelFor = '',
  placeholder = '',
  labelText = '',
  inputWidth = '30px',
}) => {
  return (
    <div className={styles.Input}>
      {labelFor !== '' && <label htmlFor={labelFor}>{labelText}</label>}
      <input
        onChange={handleChange}
        name={labelFor}
        className={styles.Input_input}
        type={inputType}
        value={value}
        placeholder={placeholder}
        style={{ width: inputWidth }}
      />
      {suffix && <span>{suffix}</span>}
    </div>
  )
}

export default Input
