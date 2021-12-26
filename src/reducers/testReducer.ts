import { AnyAction } from 'redux'
import { SET_TEST_PDF_DATA } from '../actionTypes'

const initialState = {
  testPdf: null,
}

export default function testReducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    case SET_TEST_PDF_DATA:
      return {
        ...state,
        testPdf: action.payload,
      }
    default:
      return state
  }
}
