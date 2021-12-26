import { combineReducers } from 'redux'

import fileReducer from './fileReducer'
import toolbarReducer from './toolbarReducer'
import zoomReducer from './zoomReducer'
import splitReducer from './splitReducer'
import pageReducer from './pageReducer'
import leftpaneReducer from './leftpaneReducer'

import testReducer from './testReducer'

const rootReducer = combineReducers({
  file: fileReducer,
  toolbar: toolbarReducer,
  zoom: zoomReducer,
  page: pageReducer,
  split: splitReducer,
  leftpane: leftpaneReducer,
  test: testReducer,
})

export default rootReducer

export type RootState = ReturnType<typeof rootReducer>
