import SEO from "@/components/seo/seo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/validators/auth.validator";
import type { z } from "zod";
import { api } from "@/configs/api.config";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import type { AxiosError } from "axios";

type RegisterValues = z.infer<typeof signUpSchema>;

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", role: "USER" },
  });

  const onSubmit = async (data: RegisterValues) => {
    try {
      await api.post("/auth/sign-up", { ...data, role: "USER" });
      toast.success("Link verifikasi telah dikirim ke email Anda!");
      reset();
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || "Gagal melakukan pendaftaran.");
    }
  };

  return (
    <>
      <SEO title="Daftar User - Nestion" description="Buat account penyewa baru" />
      <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm font-sans">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Daftar Nestion</h2>
        <p className="text-sm text-slate-500 mb-6">Buat account penyewa baru</p>
      
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="nama@email.com"
              {...register("email")}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-lg text-sm transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? "Kirim Email..." : "Kirim Link Verifikasi"}
          </button>
        </form>

        <p className="text-xs text-center text-slate-500 mt-6">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-amber-600 font-semibold hover:underline">
            Masuk
          </Link>{" "}
          atau{" "}
          <Link to="/tenant/register" className="text-amber-600 font-semibold hover:underline">
            Daftar sebagai Tenant
          </Link>
        </p>      
      </div>
    </>
  );
}