import { AnyAction } from 'redux'
import {
  ADD_FILE,
  SET_SPLIT_FILE,
  SET_EDITED_FILE,
  RESET_AFFECTED_PAGE_NUM,
} from '../actionTypes'

//Type
import { FileStateType } from '../types'

const initialState = {
  pdf: null,
  title: '',
  numPages: 0,
  byteSize: 0,
  width: 0,
  height: 0,
  wByHRatio: null,
  affectedPageNum: null,
}

export default function fileReducer(
  state: FileStateType = initialState,
  action: AnyAction
) {
  switch (action.type) {
    case ADD_FILE:
      return action.payload
    case SET_EDITED_FILE:
      const editedState = state
      editedState.pdf = action.payload.pdf
      editedState.affectedPageNum = action.payload.affectedPageNum
      return editedState
    case SET_SPLIT_FILE:
      const { pdf, numPages, byteSize } = action.payload
      const splitState = state
      splitState.pdf = pdf
      splitState.numPages = numPages
      splitState.byteSize = byteSize
      return splitState
    case RESET_AFFECTED_PAGE_NUM:
      const resetState = state
      resetState.affectedPageNum = null
      return resetState
    default:
      return state
  }
}
