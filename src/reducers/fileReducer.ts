import { AnyAction } from 'redux'
import * as actionTypes from '../types'

interface FileStateType {
  pdf: FileList | null
  numPages: number
  width: number
  height: number
}

const initialState = {
  pdf: null,
  numPages: 0,
  width: 0,
  height: 0,
}

export default function fileReducer(
  state: FileStateType = initialState,
  action: AnyAction
) {
  switch (action.type) {
    case actionTypes.ADD_FILE:
      return action.payload
    default:
      return state
  }
}
