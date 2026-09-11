import { z } from "zod";

export const signUpSchema = z.object({
  email: z.email("Invalid email format"),
  role: z.enum(["USER", "TENANT"], {
    message: "Role must be USER or TENANT",
  }),
});

export const verifyEmailSchema = z
  .object({
    token: z.string().min(1, "Verification token is required"),
    password: z
      .string()
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
        "Password must be at least 6 characters with at least one letter and one number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const requestResetPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    newPassword: z
      .string()
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
        "Password must be at least 6 characters with at least one letter and one number"
      ),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });