import { AnyAction } from 'redux'
import { ADD_FILE } from '../actionTypes'

//Type
import { FileStateType } from '../types'

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
    case ADD_FILE:
      return action.payload
    default:
      return state
  }
}
