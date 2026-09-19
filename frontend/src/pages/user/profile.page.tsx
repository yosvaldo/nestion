import { useEffect, useState } from "react";
import { toast } from "sonner";
import SEO from "@/components/seo/seo";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/configs/api.config";
import useAuthStore, { type User } from "@/stores/authStore";
import ProfileInfoCard from "@/components/profile/profile-info-card";
import SecurityCard from "@/components/profile/security-card";

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data.data as User);
      } catch {
        toast.error("Gagal memuat data profil.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [setUser]);

  if (loading && !user) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <SEO title="Profil Saya - Nestion" description="Kelola profil account Anda" />
      <div className="p-6 sm:p-8 my-8 bg-white rounded-2xl border border-slate-100 shadow-sm font-sans max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Profil Saya</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola informasi account dan keamanan Anda.</p>
        </div>

        {user && (
          <div className="space-y-6">
            <ProfileInfoCard user={user} onUpdated={setUser} />
            <SecurityCard user={user} onEmailUpdated={setUser} />
          </div>
        )}
      </div>
    </>
  );
}