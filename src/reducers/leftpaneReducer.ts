import { AnyAction } from 'redux'

const initialState: { width: number } = {
  width: 125,
}

export default function leftpaneReducer(
  state = initialState,
  action: AnyAction
) {
  switch (action.type) {
    default:
      return state
  }
}
