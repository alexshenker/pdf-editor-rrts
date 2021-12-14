import { AnyAction } from 'redux'
import { ENABLE_TOOLBAR, DISABLE_TOOLBAR } from '../actionTypes'

export default function toolbarReducer(
  state: boolean = false,
  action: AnyAction
) {
  switch (action.type) {
    case ENABLE_TOOLBAR:
      return true
    case DISABLE_TOOLBAR:
      return false
    default:
      return state
  }
}
