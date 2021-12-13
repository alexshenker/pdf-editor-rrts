import { combineReducers } from "redux";

import fileReducer from "./fileReducer";
import zoomReducer from "./zoomReducer";


const rootReducer = combineReducers({
  file: fileReducer,
  zoom: zoomReducer
})

export default rootReducer

export type RootState = ReturnType<typeof rootReducer>