import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import { authApi } from "./api/authApi";
import { adminApi } from "./api/adminApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,

    // RTK Query APIs
    [authApi.reducerPath]: authApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(adminApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;