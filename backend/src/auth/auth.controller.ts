import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { AuthRequest } from "../common/middleware/auth.middleware";
import { generateAccessToken, generateRefreshToken } from "../common/utils/token";
import { sendOtpEmail } from "../common/utils/email";
import { asyncHandler, AppError } from "../common";
import * as authService from "./auth.service";
import { RegisterInput, LoginInput, VerifyOtpInput, ResendOtpInput, ChangePasswordInput } from "./auth.validation";

interface RefreshTokenPayload {
  id: string;
  role: string;
  iat?: number;
  exp?: number;
}

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

 
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role }: RegisterInput = req.body;

  // Business logic: Check if user already exists
  const existingUser = await authService.findUserByEmail(email);
  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  // Business logic: Hash password and generate OTP
  const hashedPassword = await authService.hashPassword(password);
  const otp = generateOtp();

  // Create user with DB function
  const user = await authService.createUser({
    name,
    email,
    password: hashedPassword,
    role,
    otp,
    otpExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
    isVerified: false,
  });

  // Business logic: Send OTP email
  await sendOtpEmail(email, otp);

  return res.status(201).json({
    message: "OTP sent to email",
  });
});

 
export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp }: VerifyOtpInput = req.body;

  // Get user from DB
  const user = await authService.findUserByEmail(email);
  if (!user) throw new AppError("User not found", 404);

  // Business logic: Validation checks
  if (user.isVerified) throw new AppError("User already verified", 400);

  if (user.otp !== otp || !user.otpExpires || user.otpExpires < new Date()) {
    throw new AppError("Invalid or expired OTP", 400);
  }

  // Update user with DB function
  await authService.updateUserById(user._id.toString(), {
    isVerified: true,
    otp: undefined,
    otpExpires: undefined,
  });

  return res.json({ message: "Email verified successfully" });
});

 
export const resendOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email }: ResendOtpInput = req.body;

  // Get user from DB
  const user = await authService.findUserByEmail(email);
  if (!user) throw new AppError("User not found", 404);

  // Business logic: Validation checks
  if (user.isVerified) throw new AppError("Email already verified", 400);

  // Business logic: Generate new OTP
  const otp = generateOtp();
  
  // Update user with DB function
  await authService.updateUserById(user._id.toString(), {
    otp,
    otpExpires: new Date(Date.now() + 10 * 60 * 1000),
  });

  // Business logic: Send OTP email
  await sendOtpEmail(email, otp);

  return res.json({ message: "OTP resent successfully" });
});

 
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: LoginInput = req.body;

  // Business logic: Get user and validate
  const user = await authService.findUserByEmail(email);
  if (!user) throw new AppError("Invalid credentials", 400);

  // Business logic: Check password
  const isMatch = await authService.comparePassword(password, user.password);
  if (!isMatch) throw new AppError("Invalid credentials", 400);

  // Business logic: Check verification
  if (!user.isVerified) throw new AppError("Please verify your email first", 400);

  // Business logic: Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Update user refresh token with DB function
  await authService.updateUserById(user._id.toString(), { refreshToken });

  // Set cookie and respond
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,  
    sameSite: "lax",
  });

  return res.json({ accessToken });
});

 
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  // Business logic: Validation
  if (!token) {
    throw new AppError("No refresh token", 401);
  }

  // Business logic: Verify JWT
  const decoded = jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET!
  ) as RefreshTokenPayload;

  // Get user from DB
  const user = await authService.findUserById(decoded.id);

  // Business logic: Validate user and token
  if (!user || user.refreshToken !== token) {
    throw new AppError("Invalid refresh token", 403);
  }

  // Business logic: Generate new access token
  const newAccessToken = generateAccessToken(user);

  return res.json({ accessToken: newAccessToken });
});

 
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (token) {
    try {
      // Business logic: Verify JWT and get user ID
      const decoded = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET!
      ) as RefreshTokenPayload;

      // Clear refresh token in DB
      await authService.updateUserRefreshToken(decoded.id, null);
    } catch {}
  }

  res.clearCookie("refreshToken");
  return res.json({ message: "Logged out" });
});

 
export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  // Business logic: Validation
  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  // Get user from DB with select
  const user = await authService.findUserByIdSelect(userId, "-password");

  // Business logic: Validation
  if (!user) {
    throw new AppError("User not found", 404);
  }

  return res.json(user);
});

 
export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword }: ChangePasswordInput = req.body;
  const userId = req.user?.id;

  // Business logic: Validation
  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  // Get user from DB
  const user = await authService.findUserById(userId);
  if (!user) throw new AppError("User not found", 404);

  // Business logic: Verify current password
  const isMatch = await authService.comparePassword(currentPassword, user.password);
  if (!isMatch) throw new AppError("Current password is incorrect", 400);

  // Business logic: Hash new password
  const hashedPassword = await authService.hashPassword(newPassword);
  
  // Update password in DB
  await authService.updateUserById(userId, { password: hashedPassword });

  return res.json({ message: "Password changed successfully" });
});