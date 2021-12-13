import { AnyAction } from "redux";
import * as actionTypes from '../types'

export default function fileReducer(state: FileList | null = null, action: AnyAction) {
  switch(action.type) {
    case actionTypes.ADD_FILE:
      return action.payload
    default:
      return state
  }
}