import { AnyAction } from 'redux'
import { ZOOM_OUT, ZOOM_IN, ZOOM_CUSTOM } from '../actionTypes'

export default function zoomReducer(state: number = 100, action: AnyAction) {
  switch (action.type) {
    case ZOOM_OUT:
      return state > 25 ? state - 25 : 25
    case ZOOM_IN:
      return state < 200 ? state + 25 : 200
    case ZOOM_CUSTOM:
      return action.payload >= 25 && action.payload <= 200
        ? action.payload
        : state
    default:
      return state
  }
}
