import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  role: z.enum(["user", "admin"]),
  isVerified: z.boolean(),
});

export const registerSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  
  email: z.string()
    .email("Invalid email format")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email must be less than 100 characters"),
  
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number"),
  
  role: z.enum(["user", "admin"], {
    errorMap: () => ({ message: "Role must be either 'user' or 'admin'" })
  }),
});

export const loginSchema = z.object({
  email: z.string()
    .email("Invalid email format")
    .min(5, "Email must be at least 5 characters"),
  
  password: z.string()
    .min(1, "Password is required"),
});

export const verifyOtpSchema = z.object({
  email: z.string()
    .email("Invalid email format"),
  
  otp: z.string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

export const resendOtpSchema = z.object({
  email: z.string()
    .email("Invalid email format"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, "Current password is required"),
  
  newPassword: z.string()
    .min(6, "New password must be at least 6 characters")
    .max(100, "New password must be less than 100 characters")
    .regex(/[A-Z]/, "New password must contain at least one uppercase letter")
    .regex(/[a-z]/, "New password must contain at least one lowercase letter")
    .regex(/\d/, "New password must contain at least one number"),
});

export const updateProfileSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
    .optional(),
  
  email: z.string()
    .email("Invalid email format")
    .max(100, "Email must be less than 100 characters")
    .optional(),
});

export const adminUpdateUserSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
    .optional(),
  
  email: z.string()
    .email("Invalid email format")
    .max(100, "Email must be less than 100 characters")
    .optional(),
  
  role: z.enum(["user", "admin"], {
    errorMap: () => ({ message: "Role must be either 'user' or 'admin'" })
  })
  .optional(),
  
  isVerified: z.boolean().optional(),
});

export const manageRoleSchema = z.object({
  newRole: z.enum(["user", "admin"], {
    errorMap: () => ({ message: "Role must be either 'user' or 'admin'" })
  }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;
export type ResendOtpFormData = z.infer<typeof resendOtpSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type AdminUpdateUserFormData = z.infer<typeof adminUpdateUserSchema>;
export type ManageRoleFormData = z.infer<typeof manageRoleSchema>;
