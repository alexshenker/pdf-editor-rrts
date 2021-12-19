export function isDashValid(str: string, idx: number) {
  for (let i = idx - 2; i >= 0; i--) {
    if (str[i] === '-') return false
    if (str[i] === ',') return true
  }
  return true
}
