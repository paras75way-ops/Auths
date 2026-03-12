import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
}

interface IAuthState {
  isAuthenticated: boolean;
  user: IUser | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: IAuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    
    loginSuccess(
      state,
      action: PayloadAction<{ user: IUser; accessToken: string }>
    ) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isLoading = false;
      state.error = null;
    },

    loginFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },

    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },

    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.isLoading = false;
      state.error = null;
    },

    clearError(state) {
      state.error = null;
    },

    setUser(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setAccessToken,
  clearError,
  setUser,
} = authSlice.actions;

export default authSlice.reducer;