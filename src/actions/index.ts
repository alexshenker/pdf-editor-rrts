import * as actionTypes from '../types'

export function addFile(file: any) {
  return {
    type: actionTypes.ADD_FILE,
    payload: file
  }
}