import { AnyAction } from 'redux'
import { OPEN_LEFT_PANE, CLOSE_LEFT_PANE } from '../actionTypes'

const initialState: { width: number; isOpen: boolean } = {
  width: 125,
  isOpen: false,
}

export default function leftpaneReducer(
  state = initialState,
  action: AnyAction
) {
  switch (action.type) {
    case OPEN_LEFT_PANE:
      return {
        ...state,
        isOpen: true,
      }
    case CLOSE_LEFT_PANE:
      return {
        ...state,
        isOpen: false,
      }
    default:
      return state
  }
}
