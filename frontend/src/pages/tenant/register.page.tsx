import SEO from "@/components/seo/seo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/validators/auth.validator";
import type { z } from "zod";
import { api } from "@/configs/api.config";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import type { AxiosError } from "axios";
import SubmitButton from "@/components/buttons/submit-button";

type RegisterValues = z.infer<typeof signUpSchema>;

const inputClass = "w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500";

export default function TenantRegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      role: "TENANT",
      bankDetails: { bankName: "", bankAccountName: "", bankAccountNumber: "" },
    },
  });

  const onSubmit = async (data: RegisterValues) => {
    try {
      await api.post("/auth/sign-up", { ...data, role: "TENANT" });
      toast.success("Link verifikasi Tenant telah dikirim ke email Anda!");
      reset();
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || "Gagal mendaftar sebagai Tenant.");
    }
  };

  return (
    <>
      <SEO title="Nestion | Register as Tenant" description="Daftar sebagai penyedia penginapan di Nestion" />
      <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm font-sans">
        <span className="inline-block px-2.5 py-1 mb-3 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
          Partner Tenant
        </span>        
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Daftar sebagai Tenant</h2>
        <p className="text-sm text-slate-500 mb-6">Mulai sewakan properti Anda.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email bisnis / properti</label>
            <input
              type="email"
              placeholder="tenant@properti.com"
              {...register("email")}
              className={inputClass}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Data Bank</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama bank</label>
            <input placeholder="contoh: BCA, Mandiri" {...register("bankDetails.bankName")} className={inputClass} />
            {errors.bankDetails?.bankName && (
              <p className="text-xs text-red-500 mt-1">{errors.bankDetails.bankName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama pemilik rekening</label>
            <input placeholder="Sesuai buku tabungan" {...register("bankDetails.bankAccountName")} className={inputClass} />
            {errors.bankDetails?.bankAccountName && (
              <p className="text-xs text-red-500 mt-1">{errors.bankDetails.bankAccountName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nomor rekening</label>
            <input
              inputMode="numeric"
              placeholder="contoh: 1234567890"
              {...register("bankDetails.bankAccountNumber")}
              className={inputClass}
            />
            {errors.bankDetails?.bankAccountNumber && (
              <p className="text-xs text-red-500 mt-1">{errors.bankDetails.bankAccountNumber.message}</p>
            )}
          </div>
          <SubmitButton label="Daftar menjadi Tenant" process="Mengirim Email..." disabled={isSubmitting} />
        </form>

        <p className="text-xs text-center text-slate-500 mt-6">
          Ingin memesan penginapan?{" "}
          <Link to="/register" className="text-amber-600 font-semibold hover:underline">
            Daftar sebagai User
          </Link>
        </p>
      </div>
    </>
  );
}