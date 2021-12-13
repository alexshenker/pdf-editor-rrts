import { combineReducers, AnyAction } from "redux";
import * as actionTypes from '../types'

const fileReducer = (state: FileList | null = null, action: AnyAction) => {
  switch(action.type) {
    case actionTypes.ADD_FILE:
      return action.payload
    default:
      return state
  }
}

const rootReducer = combineReducers({
  file: fileReducer
})

export default rootReducer

export type RootState = ReturnType<typeof rootReducer>