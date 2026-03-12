import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { Request, Response } from "express";

// Helper function to get IP from request and use ipKeyGenerator
const createIpKeyGenerator = () => {
  return (req: Request) => {
    const ip = req.ip || req.connection.remoteAddress || "unknown";
    return ipKeyGenerator(ip);
  };
};

// General rate limiting configuration
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again after 15 minutes",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: createIpKeyGenerator(),
  skip: (req: Request) => {
    // Skip rate limiting for health checks or certain routes
    return req.path === "/health" || req.path === "/ping";
  },
});

// Strict rate limiting for authentication routes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth requests per windowMs
  message: {
    error: "Too many authentication attempts, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: createIpKeyGenerator(),
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
});

// Password reset rate limiting (very strict)
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  message: {
    error: "Too many password reset attempts, please try again after 1 hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: createIpKeyGenerator(),
});

// OTP verification rate limiting
export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 OTP attempts per windowMs
  message: {
    error: "Too many OTP attempts, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: createIpKeyGenerator(),
});

// Email sending rate limiting
export const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 emails per hour
  message: {
    error: "Too many email requests, please try again after 1 hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: createIpKeyGenerator(),
});

// Admin panel rate limiting (more restrictive)
export const adminLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // Limit each IP to 50 admin requests per windowMs
  message: {
    error: "Too many admin requests, please try again after 5 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: createIpKeyGenerator(),
});

// API endpoint specific rate limiting
export const createApiLimiter = (windowMs: number, max: number, message: string) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: message,
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: createIpKeyGenerator(),
  });
};
