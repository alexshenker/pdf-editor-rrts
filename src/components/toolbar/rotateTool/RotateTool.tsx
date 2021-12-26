import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from './RotateTool.module.css'
//TypeScript
import { RootState } from '../../../reducers'

//UI
import ToolBtn from '../../../ui/ToolBtn'
import { PDFDocument, degrees } from 'pdf-lib'
//Icons
import { AiOutlineRotateRight } from '@react-icons/all-files/ai/AiOutlineRotateRight'
import { createUInt8Array } from '../../../helpers/createUInt8Array'
//ACTIONS
import { SET_EDITED_FILE } from '../../../actionTypes'

export default function RotateTool() {
  const dispatch = useDispatch()
  //must receive (or get) canvasRef and an imageRef
  const pageNum = useSelector((state: RootState) => state.page)
  const pdf = useSelector((state: RootState) => state.file.pdf)
  const title = useSelector((state: RootState) => state.file.title)

  const rotate = async () => {
    const uInt8Arr = await createUInt8Array(pdf)
    const pdfDoc = await PDFDocument.load(uInt8Arr)

    const page = pdfDoc.getPage(pageNum - 1)
    const currentRotation = page.getRotation().angle
    const rotation = currentRotation === 360 ? 90 : currentRotation + 90

    page.setRotation(degrees(rotation))
    //switch height with width
    pdfDoc.removePage(pageNum - 1)
    pdfDoc.insertPage(pageNum - 1, page)

    const newUint8Arr = await pdfDoc.save({ addDefaultPage: false })

    const newFile = new File([newUint8Arr], title, {
      type: 'application/pdf',
    })

    dispatch({
      type: SET_EDITED_FILE,
      payload: { pdf: newFile, affectedPageNum: pageNum },
    })
  }

  return (
    <div className={styles.rotate_tool}>
      <ToolBtn handleClick={rotate} description="Rotate current page">
        <AiOutlineRotateRight />
      </ToolBtn>
    </div>
  )
}
