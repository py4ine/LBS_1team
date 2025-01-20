import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import caseReducer from "./slice/caseSlice";
import uiReducer from "./slice/uiSlice";
import mapReducer from "./slice/mapSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cases: caseReducer,
    ui: uiReducer,
    map: mapReducer,
  },
});
