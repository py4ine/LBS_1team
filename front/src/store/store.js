import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

import authReducer from "./slice/authSlice";
import caseReducer from "./slice/caseSlice";
import uiReducer from "./slice/uiSlice";
import mapReducer from "./slice/mapSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "cases"], // 유지하고 싶은 리듀서만 추가
};

const rootReducer = combineReducers({
  auth: authReducer,
  cases: caseReducer,
  ui: uiReducer,
  map: mapReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     cases: caseReducer,
//     ui: uiReducer,
//     map: mapReducer,
//   },
// });

export const persistor = persistStore(store);
