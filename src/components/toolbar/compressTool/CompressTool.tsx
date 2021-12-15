import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../reducers'
import styles from './CompressTool.module.css'

//UI
import ToolBtn from '../../../ui/ToolBtn'
import ToolInput from '../../../ui/ToolInput'

//Icons
import { CgCompressRight } from '@react-icons/all-files/cg/CgCompressRight'
import ToolMenu from '../../../ui/ToolMenu'
import Button from '../../../ui/Button'
/*
? small menu? / modal?
- preview image (on viewer?)
- current size
Larger number = more compression / lower quality
- compression options (1-10, 1-100, low-medium-high)
*/

/*
byte = 1
KB = byte * 1024
MB = byte * 1024 * 1000
GB = byte * 1024 * 1000 * 1000
*/

const sizeChart: { [key: string]: number } = {
  bytes: 1,
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
}

export default function CompressTool() {
  const byteSize = useSelector((state: RootState) => state.file.byteSize)

  const [active, setActive] = useState(true)
  const [size, setSize] = useState(0)
  const [sizeUnit, setSizeUnit] = useState('KB')

  useEffect(() => {
    unitConverter(byteSize)
  }, [byteSize])

  const unitConverter = (bytes: number): void => {
    const desiredUnit =
      bytes < sizeChart.KB
        ? 'bytes'
        : bytes < sizeChart.MB
        ? 'KB'
        : bytes < sizeChart.GB
        ? 'MB'
        : 'GB'
    const sizeNum = sizeConverter(bytes, desiredUnit)
    setSizeUnit(desiredUnit)
    setSize(sizeNum)
  }

  const sizeConverter = (bytes: number, desiredUnit: string): number => {
    return (
      Math.round((bytes / sizeChart[desiredUnit] + Number.EPSILON) * 100) / 100
    )
  }

  const toggleMenu = () => {
    setActive(!active)
  }

  return (
    <div className={styles.compress_tool}>
      <ToolBtn handleClick={toggleMenu} description="Compress File">
        <CgCompressRight />
      </ToolBtn>
      <ToolMenu>
        <div className={styles.menu_content}>
          <p>
            {size}
            <span>{` ${sizeUnit}`}</span>
          </p>
          <Button text="Compress" />
        </div>
      </ToolMenu>
    </div>
  )
}
