import { configureStore } from "@reduxjs/toolkit";
import interviewReducer from "./interviewSlice";
import { persistStore } from "redux-persist";

export const store = configureStore({
  reducer: {
    interviews: interviewReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
