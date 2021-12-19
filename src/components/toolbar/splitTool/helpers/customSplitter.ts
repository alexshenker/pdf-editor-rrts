import { isNum } from './isNum'

export function customSplitter(
  input: string,
  numPages: number,
  setError: (err: string) => void,
  errors: { '>numPages': string; 'from>to': string; incomplete: string }
) {
  if (input === '' || !isNum(input[input.length - 1])) return
  const inputArray = input.split(',')

  const splitInfo: number[] = []

  inputArray.forEach((p) => {
    if (p.includes('-')) {
      const range = p.split('-')
      //validate: length of 'range' Array is 2
      if (range.length !== 2) return setError(errors.incomplete)

      const start = Number(range[0])
      const end = Number(range[1])
      //validate: start or end !> numPages
      if (start > numPages || end > numPages)
        return setError(errors['>numPages'])
      //validate: start <= end
      if (start > end) return setError(errors['from>to'])
      for (let i = start; i <= end; i++) {
        splitInfo.push(i)
      }
    } else {
      //validate Number(p) <= numPages
      if (Number(p) > numPages) return setError(errors['>numPages'])
      splitInfo.push(Number(p))
    }
  })
  return splitInfo
}
