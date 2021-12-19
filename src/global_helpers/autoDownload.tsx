export const autoDownload = (uInt8Array: Uint8Array) => {
  //AUTO DOWNLOAD
  const downloadURL = (data: any, fileName: any) => {
    const a = document.createElement('a')
    a.href = data
    a.download = fileName
    document.body.appendChild(a)
    a.style.display = 'none'
    a.click()
    a.remove()
  }
  const downloadBlob = (data: any, fileName: any, mimeType: any) => {
    const blob = new Blob([data], {
      type: mimeType,
    })
    const url = window.URL.createObjectURL(blob)
    downloadURL(url, fileName)
    setTimeout(() => window.URL.revokeObjectURL(url), 1000)
  }

  downloadBlob(uInt8Array, 'TestFile', 'application/pdf')
}
