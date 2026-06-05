import { configureStore } from "@reduxjs/toolkit";
import dramaReducer from "../features/dramas/store/dramaSlice";
import authReducer from "../features/auth/store/authSlice";

export const store = configureStore({
  reducer: {
    dramas: dramaReducer,
    auth: authReducer,
  },
});

// RootState = the full shape of all Redux data in my app
// reducer: {
//   dramas: dramaReducer,
//   auth: authReducer,
//   reviews: reviewsReducer,
// }
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;