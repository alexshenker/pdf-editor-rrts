import React from 'react'

import { useDispatch } from 'react-redux'
import { SET_TEST_PDF_DATA } from '../../actionTypes'

import mendelssohn from './assets/mendelssohn_50pg.pdf'
import tchaikovsky from './assets/tchaikovsky_28pg.pdf'

import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js'
//When loading using pdfjs-dist, we must set a globalworker for pdfjsLib
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js'

export default function TestButton() {
  const dispatch = useDispatch()

  const handleClick = async (file: string, title: string) => {
    await pdfjsLib.getDocument(file).promise.then((doc) =>
      doc.getData().then((data) => {
        const pdfFile = new File([data], title, { type: 'application/pdf' })

        dispatch({
          type: SET_TEST_PDF_DATA,
          payload: pdfFile,
        })
      })
    )
  }

  return (
    <div>
      <button onClick={() => handleClick(tchaikovsky, 'test_tchaikovsky')}>
        Add Tchaikovsky
      </button>
      <button onClick={() => handleClick(mendelssohn, 'test_mendelssohn')}>
        Add Mendelssohn
      </button>
    </div>
  )
}
