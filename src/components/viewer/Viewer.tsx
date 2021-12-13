import React, {useEffect, useRef} from 'react'
import { useSelector } from 'react-redux';
import styles from './Viewer.module.css'
import { RootState } from '../../reducers';

//PDF VIEWER/LOADER
import { Document, Page, pdfjs } from 'react-pdf/dist/esm/entry.webpack';
pdfjs.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js';

export default function Viewer() {

  //A4 paper: w:2480px 
  const pageWidth = 2480
  const file = useSelector((state: RootState) => state.file)

  return (
    <div className={styles.viewer}>
      <Document
        file={file}
        options={{
          cMapUrl: `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/cmaps/`,
          cMapPacked: true,
        }}
      >
        <Page width={pageWidth} renderTextLayer={false} pageNumber={1} />
      </Document>
    </div>
  )
}
