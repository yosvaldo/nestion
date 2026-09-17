import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  requestResetPasswordSchema,
  resetPasswordSchema,
} from "@/validators/auth.validator";
import type { z } from "zod";
import { api } from "@/configs/api.config";
import SEO from "@/components/seo/seo";
import type { AxiosError } from "axios";

type RequestValues = z.infer<typeof requestResetPasswordSchema>;
type ResetValues = z.infer<typeof resetPasswordSchema>;

const inputClass =
  "w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500";

const getErrorMessage = (err: unknown, fallback: string) => {
  const error = err as AxiosError<{ message?: string }>;
  return error.response?.data?.message || fallback;
};

function RequestResetForm() {
  const [emailSent, setEmailSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RequestValues>({ resolver: zodResolver(requestResetPasswordSchema) });

  const onSubmit = async (data: RequestValues) => {
    try {
      await api.post("/auth/request-reset-password", data);
      setEmailSent(true);
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal mengirim link reset password."));
    }
  };

  if (emailSent) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm font-sans text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Cek email Anda</h2>
        <p className="text-sm text-slate-500">
          Link reset password telah dikirim. Link berlaku 1 jam dan hanya bisa digunakan sekali.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm font-sans">
      <h2 className="text-2xl font-bold text-slate-900 mb-1">Reset password</h2>
      <p className="text-sm text-slate-500 mb-6">Masukkan email Anda dan kami akan mengirimkan link reset password.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input type="email" placeholder="nama@email.com" {...register("email")} className={inputClass} />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-lg text-sm transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? "Mengirim..." : "Kirim Link Reset"}
        </button>
      </form>

      <p className="text-xs text-center text-slate-500 mt-6">
        Ingat password Anda?{" "}
        <Link to="/login" className="text-amber-600 font-semibold hover:underline">
          Masuk
        </Link>
      </p>
    </div>
  );
}

function ConfirmResetForm({ token }: { token: string }) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, newPassword: "", confirmNewPassword: "" },
  });

  const onSubmit = async (data: ResetValues) => {
    try {
      await api.post("/auth/reset-password", data);
      toast.success("Password berhasil direset. Silahkan masuk.");
      navigate("/login");
    } catch (err) {
      toast.error(getErrorMessage(err, "Link reset invalid atau expired."));
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm font-sans">
      <h2 className="text-2xl font-bold text-slate-900 mb-1">Buat password baru</h2>
      <p className="text-sm text-slate-500 mb-6">Masukkan password baru untuk account Anda.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register("token")} value={token} />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password baru</label>
          <input type="password" placeholder="••••••••" {...register("newPassword")} className={inputClass} />
          {errors.newPassword && <p className="text-xs text-red-500 mt-1">{errors.newPassword.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Konfirmasi password</label>
          <input type="password" placeholder="••••••••" {...register("confirmNewPassword")} className={inputClass} />
          {errors.confirmNewPassword && (
            <p className="text-xs text-red-500 mt-1">{errors.confirmNewPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-lg text-sm transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? "Memproses..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  return (
    <>
      <SEO title="Reset Password - Nestion" description="Reset password account Nestion Anda" />
      {token ? <ConfirmResetForm token={token} /> : <RequestResetForm />}
    </>
  );
}