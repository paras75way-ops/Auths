// auth.routes.ts
import express from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  verifyOtp,
  resendOtp,
  changePassword,
} from "./auth.controller";
import { protect } from "../common/middleware/auth.middleware";
import { validate } from "../common";
import {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  resendOtpSchema,
  changePasswordSchema,
} from "./auth.validation";
import {
  authLimiter,
  otpLimiter,
  generalLimiter,
  passwordResetLimiter
} from "../common";

const router = express.Router();
 
// Apply authentication rate limiting to auth routes
router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/refresh", generalLimiter, refreshToken);
router.post("/logout", generalLimiter, logout);

 
// Apply OTP rate limiting
router.post("/verify-otp", otpLimiter, validate(verifyOtpSchema), verifyOtp);
router.post("/resend-otp", otpLimiter, validate(resendOtpSchema), resendOtp);

 
// Apply general rate limiting to protected routes
router.get("/me", generalLimiter, protect, getMe);
router.post("/change-password", passwordResetLimiter, protect, validate(changePasswordSchema), changePassword);

export default router;