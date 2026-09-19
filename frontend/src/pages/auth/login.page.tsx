import SEO from "@/components/seo/seo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "sonner";
import { signInSchema } from "@/validators/auth.validator";
import type { z } from "zod";
import { api } from "@/configs/api.config";
import useAuthStore from "@/stores/authStore";
import type { AxiosError } from "axios";
import SubmitButton from "@/components/buttons/submit-button";

type SignInValues = z.infer<typeof signInSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInValues) => {
    try {
      const response = await api.post("/auth/sign-in", data);
      const { user, accessToken } = response.data.data;

      setAuth(user, accessToken);
      toast.success("Berhasil masuk!");

      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else {
        navigate(user.role === "TENANT" ? "/tenant/dashboard" : "/");
      }
    } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        toast.error(error?.response?.data?.message || "Gagal masuk. Cek email & password Anda.");
    }
  };

  return (
    <>
      <SEO title="Login - Nestion" description="Log in to your Nestion account"/>
      <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm font-sans">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Masuk ke Nestion</h2>
        <p className="text-sm text-slate-500 mb-6">Silahkan masuk menggunakan account Anda</p>
      
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              {...register("email")}
              placeholder="nama@email.com"
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <Link to="/reset-password" className="text-xs text-amber-600 font-semibold hover:underline">
                Lupa password?
              </Link>
            </div>
            <input
              type="password"
              {...register("password")}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>
          <SubmitButton label="Masuk" process="Memproses..." disabled={isSubmitting} />
        </form>

        <p className="text-xs text-center text-slate-500 mt-6">
          Belum punya account?{" "}
          <Link to="/register" className="text-amber-600 font-semibold hover:underline">
            Daftar sebagai User
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