// Authentication-related types

// Login request payload
export interface LoginPayload {
  email: string;
  password: string;
}

// Register request payload
export interface RegisterPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  file: File;
}

// Login response

// Register response
export interface RegisterResponse {
  message: string;
}

// Auth state interface
export interface AuthState {
  user: import("../user/userType").User | null;
}

// API user interface (as received from API)
export interface ApiUser {
  _id: string;
  name: string;
  email: string;
}

// Verify OTP request payload
export interface VerifyOtpPayload {
  token: string;
}

// Verify OTP response
export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data: string;
}

// Resend OTP request payload
export interface ResendOtpPayload {
  email: string;
}

// Resend OTP response
export interface ResendOtpResponse {
  success: boolean;
  message: string;
}
