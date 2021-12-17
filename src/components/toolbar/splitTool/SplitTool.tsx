import React, { useState, ChangeEvent, FormEvent } from 'react'

//REDUX
import { useSelector } from 'react-redux'

import styles from './SplitTool.module.css'
//UI
import ToolMenu from '../../../ui/ToolMenu'
import ToolBtn from '../../../ui/ToolBtn'
import Button from '../../../ui/Button'
//ICONS
import { GiSplitArrows } from '@react-icons/all-files/gi/GiSplitArrows'
import { RootState } from '../../../reducers'

export default function SplitTool() {
  const [active, setActive] = useState(true)

  const numPages = useSelector((state: RootState) => state.file.numPages)
  //INPUTS
  const [rangeType, setRangeType] = useState<'range' | 'custom'>('range')
  const [rangeStart, setRangeStart] = useState('')
  const [rangeEnd, setRangeEnd] = useState('')
  const [customInput, setCustomInput] = useState('')

  const handleType = (e: ChangeEvent<HTMLInputElement>) => {
    const type = e.target.value
    if (type === 'range' || type === 'custom') {
      setRangeType(type)
    }
  }

  const handleChange = (
    type: 'start' | 'end' | 'custom',
    e: ChangeEvent<HTMLInputElement>
  ) => {
    switch (type) {
      case 'start':
        return setRangeStart(e.target.value)
      case 'end':
        return setRangeEnd(e.target.value)
      case 'custom':
        return setCustomInput(e.target.value)
      default:
        return
    }
  }

  const toggleMenu = () => {
    setActive(!active)
  }

  const split = () => {}

  return (
    <div className={styles.split_tool}>
      <ToolBtn handleClick={toggleMenu} description="Split File">
        <GiSplitArrows />
      </ToolBtn>
      <ToolMenu>
        <div className={styles.menu_content}>
          <div onChange={handleType}>
            <label htmlFor="range">Range</label>
            <input
              type="radio"
              name="rangeType"
              value="range"
              checked={rangeType === 'range'}
            />
            <label htmlFor="custom">Custom</label>
            <input
              type="radio"
              name="rangeType"
              value="custom"
              checked={rangeType === 'custom'}
            />
          </div>
          {rangeType === 'range' ? (
            <div>
              <label htmlFor="split_range_from">From</label>
              <input
                onChange={(e) => handleChange('start', e)}
                value={rangeStart}
                type="text"
                name="split_range_from"
                placeholder="1"
              />

              <label htmlFor="split_range_to">To</label>
              <input
                onChange={(e) => handleChange('end', e)}
                value={rangeEnd}
                type="text"
                name="split_range_to"
                placeholder={numPages}
              />
            </div>
          ) : (
            <div>
              <label htmlFor="split_custom">Custom</label>
              <input
                onChange={(e) => handleChange('custom', e)}
                value={customInput}
                type="text"
                name="split_custom"
                placeholder="Ex: 3, 6-8, 12, 13"
              />
            </div>
          )}
          <Button handleClick={split} text="Split" />
        </div>
      </ToolMenu>
    </div>
  )
}
