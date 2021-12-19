import { AnyAction } from 'redux'
import { CREATE_SPLIT_PREVIEW } from '../actionTypes'

const initialState = {
  splitInfo: [],
  createPreviewLoading: false,
}

export default function splitReducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    case CREATE_SPLIT_PREVIEW:
      return { ...state, splitInfo: action.payload, createPreviewLoading: true }
    default:
      return state
  }
}
