export function rangeSplitter(
  from: string,
  to: string,
  numPages: number,
  setError: (err: string) => void,
  errors: { '>numPages': string; 'from>to': string }
) {
  if (from === '' || to === '') return
  const start = Number(from)
  const end = Number(to)
  if (start > numPages || end > numPages) return setError(errors['>numPages'])
  if (start > end) return setError(errors['from>to'])
  const splitInfo: number[] = []
  for (let i = start; i <= end; i++) {
    splitInfo.push(i)
  }
  return splitInfo
}
