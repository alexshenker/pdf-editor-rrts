export const createUint8Array = async (pdf: File) => {
  const uInt8Array = await pdf
    .arrayBuffer()
    .then((arrayBuffer: ArrayBuffer) => new Uint8Array(arrayBuffer))
  return uInt8Array
}
