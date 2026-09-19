import { z } from "zod";

const emailSchema = z.email("Format email invalid");

const passwordSchema = z
  .string()
  .regex(
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
    "Password minimal 6 karakter dan mengandung huruf & angka"
  );

export const bankDetailsSchema = z.object({
  bankName: z.string().min(2, "Nama bank wajib diisi").max(100),
  bankAccountName: z.string().min(2, "Nama pemilik rekening wajib diisi").max(100),
  bankAccountNumber: z
    .string()
    .regex(/^\d{6,20}$/, "Nomor rekening harus 6-20 digit"),
});

export const signUpSchema = z
  .object({
    email: emailSchema,
    role: z.enum(["USER", "TENANT"], { message: "Role harus USER atau TENANT" }),
    bankDetails: bankDetailsSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "TENANT" && !data.bankDetails) {
      ctx.addIssue({
        code: "custom",
        path: ["bankDetails"],
        message: "Data bank wajib diisi untuk Tenant",
      });
    }
  });

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password wajib diisi"),
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

export const requestResetPasswordSchema = z.object({
  email: emailSchema,
});

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
    currentPassword: z.string().min(1, "Password saat ini wajib diisi"),
    newPassword: passwordSchema,
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Password tidak sesuai",
    path: ["confirmNewPassword"],
  });

export const updateProfileSchema = z.object({
  fullName: z.string().min(2, "Nama minimal 2 karakter").optional(),
});

export const updateEmailSchema = z.object({
  email: emailSchema,
});

export const avatarFileSchema = z
  .instanceof(File)
  .refine(
    (f) => ["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(f.type),
    "Ekstensi yang diperbolehkan: .jpg, .jpeg, .png, .gif"
  )
  .refine((f) => f.size <= 1024 * 1024, "Ukuran file maksimum 1MB");