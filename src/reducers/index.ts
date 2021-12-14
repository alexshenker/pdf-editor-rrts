import { combineReducers } from 'redux'

import fileReducer from './fileReducer'
import toolbarReducer from './toolbarReducer'
import zoomReducer from './zoomReducer'
import pageReducer from './pageReducer'

const rootReducer = combineReducers({
  file: fileReducer,
  toolbar: toolbarReducer,
  zoom: zoomReducer,
  page: pageReducer,
})

export default rootReducer

export type RootState = ReturnType<typeof rootReducer>
