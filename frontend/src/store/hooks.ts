import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./index";
import { 
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetMeQuery,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useChangePasswordMutation,
} from "./api/authApi";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setAccessToken,
  clearError,
  setUser,
} from "./slices/auth.slice";
import { useErrorHandler, ErrorType } from "../common/errors";

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Custom auth hook that combines RTK Query with Redux state
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const { handleError } = useErrorHandler();

  // RTK Query hooks
  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [registerMutation, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const [logoutMutation] = useLogoutMutation();
  const [verifyOtpMutation] = useVerifyOtpMutation();
  const [resendOtpMutation] = useResendOtpMutation();
  const [changePasswordMutation] = useChangePasswordMutation();
  
  // Get current user data
  const { data: userData, isLoading: isUserLoading } = useGetMeQuery(undefined, {
    skip: !authState.accessToken,
  });

  // Update user data when it's fetched
  useEffect(() => {
    if (userData && authState.accessToken) {
      dispatch(setUser(userData));
    }
  }, [userData, authState.accessToken, dispatch]);

  // Login function
  const login = async (credentials: { email: string; password: string }) => {
    try {
      dispatch(loginStart());
      const result = await loginMutation(credentials).unwrap();
      
      // Get user data after successful login
      if (result.accessToken) {
        dispatch(setAccessToken(result.accessToken));
      }
    } catch (error: any) {
      dispatch(loginFailure(error.data?.message || "Login failed"));
      // Handle error with error handler
      handleError(error, "Login", ErrorType.AUTHENTICATION);
      throw error;
    }
  };

  // Register function
  const register = async (userData: { name: string; email: string; password: string; role?: string }) => {
    try {
      await registerMutation(userData).unwrap();
    } catch (error: any) {
      dispatch(loginFailure(error.data?.message || "Registration failed"));
      handleError(error, "Registration", ErrorType.VALIDATION);
      throw error;
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      // Even if logout API fails, clear local state
      console.error("Logout API error:", error);
    } finally {
      dispatch(logout());
    }
  };

  // Verify OTP function
  const verifyOtp = async (otpData: { email: string; otp: string }) => {
    try {
      await verifyOtpMutation(otpData).unwrap();
    } catch (error: any) {
      dispatch(loginFailure(error.data?.message || "OTP verification failed"));
      handleError(error, "OTP Verification", ErrorType.VALIDATION);
      throw error;
    }
  };

  // Resend OTP function
  const resendOtp = async (emailData: { email: string }) => {
    try {
      await resendOtpMutation(emailData).unwrap();
    } catch (error: any) {
      dispatch(loginFailure(error.data?.message || "Failed to resend OTP"));
      handleError(error, "Resend OTP", ErrorType.NETWORK);
      throw error;
    }
  };

  // Change password function
  const changePassword = async (passwordData: { currentPassword: string; newPassword: string }) => {
    try {
      await changePasswordMutation(passwordData).unwrap();
    } catch (error: any) {
      dispatch(loginFailure(error.data?.message || "Password change failed"));
      handleError(error, "Change Password", ErrorType.VALIDATION);
      throw error;
    }
  };

  // Clear error function
  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    // Auth state
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading || isLoginLoading || isRegisterLoading || isUserLoading,
    error: authState.error,
    
    // Auth functions
    login,
    register,
    logout: handleLogout,
    verifyOtp,
    resendOtp,
    changePassword,
    clearError: clearAuthError,
    
    // Raw RTK Query mutations (if needed for advanced usage)
    loginMutation,
    registerMutation,
    logoutMutation,
    verifyOtpMutation,
    resendOtpMutation,
    changePasswordMutation,
  };
};