import { AlertCircle, Mail } from "lucide-react";
import { toast } from "sonner";
import useAuthStore from "@/stores/authStore";
import { api } from "@/configs/api.config";

export default function VerificationBanner() {
  const { user } = useAuthStore();

  if (!user || user.isVerified) return null;

  const handleResendEmail = async () => {
    try {
      await api.post("/auth/resend-verification", { email: user.email });
      toast.success("Email verifikasi telah dikirim ulang. Silakan cek inbox Anda.");
    } catch {
      toast.error("Gagal mengirim ulang email verifikasi.");
    }
  };

  return (
    <div className="bg-amber-500 text-slate-950 px-4 py-2.5 text-xs sm:text-sm font-semibold flex items-center justify-between font-sans shadow-inner">
      <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-slate-950" />
          <span>
            Akun Anda belum terverifikasi. Silakan periksa email Anda untuk memverifikasi akun agar dapat menggunakan fitur pemesanan.
          </span>
        </div>
        <button
          onClick={handleResendEmail}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-950 text-white rounded-full text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
        >
          <Mail className="w-3.5 h-3.5" />
          Kirim Ulang Email
        </button>
      </div>
    </div>
  );
}