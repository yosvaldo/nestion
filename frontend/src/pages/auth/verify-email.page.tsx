import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { verifyEmailSchema } from "@/validators/auth.validator";
import type { z } from "zod";
import { api } from "@/configs/api.config";
import SEO from "@/components/seo/seo";
import type { AxiosError } from "axios";
import SubmitButton from "@/components/buttons/submit-button";

type VerifyValues = z.infer<typeof verifyEmailSchema>;

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { token, password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: VerifyValues) => {
    try {
      await api.post("/auth/verify-email", data);
      toast.success("Account berhasil terverifikasi! Mohon log in.");
      navigate("/login");
    } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        toast.error(
            error?.response?.data?.message || "Verifikasi gagal atau token expired."
      );
    }
  };

  return (
    <>
      <SEO title="Verify Account - Nestion" description="Verifikasi account Anda" />
      <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm font-sans">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Verifikasi dan buat password</h2>
        <p className="text-sm text-slate-500 mb-6">
          Buat password untuk melengkapi registrasi account Anda.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register("token")} value={token} />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password baru
            </label>
            <input
              type="password"
              {...register("password")}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Konfirmasi password
            </label>
            <input
              type="password"
              {...register("confirmPassword")}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <SubmitButton label="Verifikasi Account" process="Memproses..." disabled={isSubmitting} />
        </form>
      </div>
    </>
  );
}