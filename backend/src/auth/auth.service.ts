import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "./auth.models";
import { IUser } from "./auth.types";

// Small DB interaction functions
export const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

export const findUserById = async (id: string) => {
  return await User.findById(id);
};

export const findUserByIdSelect = async (id: string, select: string) => {
  return await User.findById(id).select(select);
};

export const createUser = async (userData: Partial<IUser> & { otp: string; otpExpires: Date }) => {
  return await User.create(userData);
};

export const updateUserById = async (id: mongoose.Types.ObjectId | string, updateData: Partial<IUser>) => {
  return await User.findByIdAndUpdate(id, updateData, { new: true });
};

export const updateUserRefreshToken = async (id: mongoose.Types.ObjectId | string, refreshToken: string | null) => {
  return await User.findByIdAndUpdate(id, { refreshToken });
};

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};