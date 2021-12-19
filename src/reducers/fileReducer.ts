import { AnyAction } from 'redux'
import { ADD_FILE, SET_EDITED_FILE } from '../actionTypes'

//Type
import { FileStateType } from '../types'

const initialState = {
  pdf: null,
  title: '',
  numPages: 0,
  byteSize: 0,
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
    case SET_EDITED_FILE:
      const newState = state
      newState.pdf = action.payload.pdf
      newState.numPages = action.payload.numPages
      newState.byteSize = action.payload.byteSize
      return newState
    default:
      return state
  }
}
