import { isDashValid, isNum } from './'

export function isCustomValid(str: string, lastChar: string) {
  if (lastChar === ' ') return false
  if (str.length <= 1) {
    //1st char is number. No char means empty str
    return str.length === 1 ? isNum(lastChar) : str === ''
  }
  const prevChar = str.charAt(str.length - 2)
  if (isNum(lastChar)) {
    if (lastChar === '0') {
      return prevChar !== ','
    }
    return true
  }
  if (lastChar === '-') {
    return isNum(prevChar) && isDashValid(str, str.length)
  }
  if (lastChar === ',') {
    return isNum(prevChar)
  }
  if (prevChar === '-' || prevChar === ',') {
    return isNum(lastChar)
  }
}
