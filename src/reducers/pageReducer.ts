import { AnyAction } from "redux";
import {PAGE_DOWN, PAGE_UP, PAGE_CUSTOM} from '../actionTypes'

export default function pageReducer(state: number = 1, action: AnyAction) {
  switch(action.type) {
    case PAGE_DOWN:
      return state > 1 ? state - 1 : 1;
    case PAGE_UP:
      return state < action.payload ? state + 1 : action.payload
    case PAGE_CUSTOM: {
        return action.payload.entry >= 1 && action.payload.entry <= action.payload.numPages ? action.payload.entry : state;
      }
    default:
      return state
  }
}