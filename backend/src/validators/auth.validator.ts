import { z } from "zod";
import { Role } from "../generated/prisma/enums.js";

const emailSchema = z.email("Format email invalid")
    .min(5, "Email paling sedikit 5 karakter")
    .max(255, "Email paling banyak 255 karakter");

const passwordSchema = z
    .string()
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
      "Password paling sedikit 6 karakter dan mengandung paling sedikit 1 huruf dan 1 angka"
    );

const bankDetailsSchema = z.object({
  bankName: z.string().min(2, "Nama bank dibutuhkan").max(100),
  bankAccountName: z.string().min(2, "Nama pemilik rekening dibutuhkan").max(100),
  bankAccountNumber: z
    .string()
    .regex(/^\d{6,20}$/, "Nomor rekening harus 6-20 digit"),
});

export const signUpSchema = z
  .object({
    email: emailSchema,
    role: z.enum(Role, { message: "Role harus USER atau TENANT" }),
    bankDetails: bankDetailsSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "TENANT" && !data.bankDetails) {
      ctx.addIssue({
        code: "custom",
        path: ["bankDetails"],
        message: "Detail bank dibutuhkan untuk pendaftaran Tenant",
      });
    }
  });

export const verifyEmailSchema = z
  .object({
    token: z.string().min(1, "Verification token dibutuhkan"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak sesuai",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password dibutuhkan"),
});

export const resendVerificationSchema = z.object({ email: emailSchema });

export const requestResetPasswordSchema = z.object({ email: emailSchema });

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token dibutuhkan"),
    newPassword: passwordSchema,
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Password tidak sesuai",
    path: ["confirmNewPassword"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Password saat ini dibutuhkan"),
    newPassword: passwordSchema,
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Password tidak sesuai",
    path: ["confirmNewPassword"],
  });

export const updateProfileSchema = z.object({
  fullName: z.string().min(2, "Nama paling sedikit 2 karakter").optional(),
});

export const updateEmailSchema = z.object({ email: emailSchema });