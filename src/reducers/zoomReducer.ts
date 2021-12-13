import { AnyAction } from "redux";
import * as actionTypes from '../types'

export default function zoomReducer(state: number = 100, action: AnyAction) {
  switch(action.type) {
    case actionTypes.ZOOM_IN:
      return state < 200 ? state + 25 : 200;
      case actionTypes.ZOOM_OUT:
      return state > 25 ? state - 25 : 25;
      case actionTypes.ZOOM_CUSTOM: {
        const zoomValue = action.payload >= 25 && action.payload <= 200 ? action.payload : action.payload < 25 ? 25 : 200;
        return zoomValue
      }
    default:
      return state
  }
}