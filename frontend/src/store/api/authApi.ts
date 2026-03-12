import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseApi";

// Types for API requests/responses
interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface VerifyOtpRequest {
  email: string;
  otp: string;
}

interface ResendOtpRequest {
  email: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

interface AuthResponse {
  accessToken: string;
}

interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // Register user
    register: builder.mutation<void, RegisterRequest>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),

    // Login user
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // Logout user
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    // Refresh token
    refreshToken: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
    }),

    // Verify OTP
    verifyOtp: builder.mutation<void, VerifyOtpRequest>({
      query: (otpData) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: otpData,
      }),
    }),

    // Resend OTP
    resendOtp: builder.mutation<void, ResendOtpRequest>({
      query: (emailData) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: emailData,
      }),
    }),

    // Get current user
    getMe: builder.query<UserResponse, void>({
      query: () => "/auth/me",
    }),

    // Change password
    changePassword: builder.mutation<void, ChangePasswordRequest>({
      query: (passwordData) => ({
        url: "/auth/change-password",
        method: "POST",
        body: passwordData,
      }),
    }),
  }),
});

// Export hooks for all endpoints
export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useGetMeQuery,
  useChangePasswordMutation,
} = authApi;