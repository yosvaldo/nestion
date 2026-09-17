import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  changePasswordSchema,
  updateEmailSchema,
} from "@/validators/auth.validator";
import type { z } from "zod";
import { api } from "@/configs/api.config";
import type { User } from "@/stores/authStore";

type EmailValues = z.infer<typeof updateEmailSchema>;
type PasswordValues = z.infer<typeof changePasswordSchema>;

interface SecurityCardProps {
  user: User;
  onEmailUpdated: (user: User) => void;
}

const inputClass =
  "w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500";

const buttonClass =
  "px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-sm transition-colors disabled:opacity-50 cursor-pointer";

export default function SecurityCard({ user, onEmailUpdated }: SecurityCardProps) {
  const emailForm = useForm<EmailValues>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: { email: user.email },
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmNewPassword: "" },
  });

  const onEmailSubmit = async (data: EmailValues) => {
    try {
      const response = await api.patch("/auth/email", data);
      onEmailUpdated(response.data.data as User);
      toast.success("Link verifikasi terkirim ke email baru Anda. Verifikasi untuk mengaktifkan kembali fitur pemesanan.");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Gagal memperbarui email.");
    }
  };

  const onPasswordSubmit = async (data: PasswordValues) => {
    try {
      await api.patch("/auth/password", data);
      passwordForm.reset();
      toast.success("Password berhasil diubah.");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Gagal mengubah password.");
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-8">
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Email</h2>
        <p className="text-xs text-slate-500 mb-4">
          Mengganti email akan menonaktifkan verifikasi sementara sampai email baru diverifikasi.
        </p>
        <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" {...emailForm.register("email")} className={inputClass} />
            {emailForm.formState.errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {emailForm.formState.errors.email.message}
              </p>
            )}
          </div>
          <button type="submit" disabled={emailForm.formState.isSubmitting} className={buttonClass}>
            {emailForm.formState.isSubmitting ? "Mengirim..." : "Perbarui Email"}
          </button>
        </form>
      </div>

      <div className="pt-6 border-t border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Password</h2>
        <p className="text-xs text-slate-500 mb-4">Ubah password Anda secara berkala untuk keamanan.</p>
        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password saat ini</label>
            <input type="password" placeholder="••••••••" {...passwordForm.register("currentPassword")} className={inputClass} />
            {passwordForm.formState.errors.currentPassword && (
              <p className="text-xs text-red-500 mt-1">
                {passwordForm.formState.errors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password baru</label>
            <input type="password" placeholder="••••••••" {...passwordForm.register("newPassword")} className={inputClass} />
            {passwordForm.formState.errors.newPassword && (
              <p className="text-xs text-red-500 mt-1">
                {passwordForm.formState.errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Konfirmasi password baru</label>
            <input type="password" placeholder="••••••••" {...passwordForm.register("confirmNewPassword")} className={inputClass} />
            {passwordForm.formState.errors.confirmNewPassword && (
              <p className="text-xs text-red-500 mt-1">
                {passwordForm.formState.errors.confirmNewPassword.message}
              </p>
            )}
          </div>

          <button type="submit" disabled={passwordForm.formState.isSubmitting} className={buttonClass}>
            {passwordForm.formState.isSubmitting ? "Menyimpan..." : "Ubah Password"}
          </button>
        </form>
      </div>
    </section>
  );
}