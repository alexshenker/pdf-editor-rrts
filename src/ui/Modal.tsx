import React, { FC, Fragment, useState, useEffect } from 'react'
import styles from './Ui.module.css'

import { ModalProps } from '../types'
import { VscClose } from '@react-icons/all-files/vsc/VscClose'

const Modal: FC<ModalProps> = ({
  children,
  handleClose,
  titleText,
  titleElement,
  open,
  modalRef,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(open)

  useEffect(() => {
    setIsOpen(open)
  }, [open])

  return (
    <Fragment>
      {isOpen && (
        <div ref={modalRef} className={styles.modal}>
          <div className={styles.header}>
            {titleText ? (
              <div>{titleText}</div>
            ) : titleElement ? (
              <div>{titleElement}</div>
            ) : (
              <div></div>
            )}
            <button onClick={handleClose}>
              <div>
                <VscClose />
              </div>
            </button>
          </div>
          <div className={styles.body}>{children}</div>
          <div className={styles.footer}></div>
        </div>
      )}
    </Fragment>
  )
}

export default Modal
