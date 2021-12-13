import React from 'react'
import styles from './Dropzone.module.css'
import { useDispatch } from 'react-redux'
import { ADD_FILE } from '../../types';

export default function Dropzone() {

  const dispatch = useDispatch();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return; 
    
    dispatch({
      type: ADD_FILE,
      payload: e.target.files[0]
    })
  }

  return (
    <div className={styles.dropzone}>
      <label className={styles.inputLabel} htmlFor="dropzone">
        <div className={styles.inputBox}>
          <p>Drop or Select</p>
        </div>
      </label>
      <input onChange={handleFile} id='dropzone' type='file' accept='.pdf' />
    </div>
  )
}
