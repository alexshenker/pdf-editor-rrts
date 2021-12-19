import { AnyAction } from 'redux'
import { CREATE_SPLIT_PREVIEW, SET_LOADING_FALSE } from '../actionTypes'

const initialState = {
  splitInfo: [],
  createPreviewLoading: false,
}

export default function splitReducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    case CREATE_SPLIT_PREVIEW:
      return { ...state, splitInfo: action.payload, createPreviewLoading: true }
    case SET_LOADING_FALSE:
      return { ...state, createPreviewLoading: false }
    default:
      return state
  }
}
