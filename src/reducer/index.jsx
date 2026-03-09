import { combineReducers } from "@reduxjs/toolkit"
import filtersReducer from "../slices/filtersSlice"

const rootReducer = combineReducers({
     filters: filtersReducer,
})

export default rootReducer