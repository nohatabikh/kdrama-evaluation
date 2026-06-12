import { configureStore } from "@reduxjs/toolkit";
import dramaReducer from "../features/dramas/store/dramaSlice";
import authReducer from "../features/auth/store/authSlice";
import { dramaListenerMiddleware } from "../features/dramas/store/dramaListenerMiddleware";

export const store = configureStore({
    reducer: {
      dramas: dramaReducer,
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(dramaListenerMiddleware.middleware),
  });


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;