import { Role } from "../common/rbac";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: Role;

  refreshToken?: string;

  isVerified: boolean;

  
  otp?: string;
  otpExpires?: Date;
}