import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Camera } from "lucide-react";
import { updateProfileSchema, avatarFileSchema } from "@/validators/auth.validator";
import type { z } from "zod";
import { api } from "@/configs/api.config";
import type { User } from "@/stores/authStore";
import SubmitButton from "../buttons/submit-button";


type ProfileValues = z.infer<typeof updateProfileSchema>;

interface ProfileInfoCardProps {
  user: User;
  onUpdated: (user: User) => void;
}

const inputClass =
  "w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500";

export default function ProfileInfoCard({ user, onUpdated }: ProfileInfoCardProps) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { fullName: user.fullName ?? "" },
  });

  useEffect(() => {
    return () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleAvatarChange = (file: File | undefined) => {
    if (!file) return;
    const result = avatarFileSchema.safeParse(file);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setAvatarFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const onSubmit = async (data: ProfileValues) => {
    try {
      const formData = new FormData();
      if (data.fullName) formData.append("fullName", data.fullName);
      if (avatarFile) formData.append("avatar", avatarFile);

      const response = await api.patch("/auth/profile", formData);
      onUpdated(response.data.data as User);
      setAvatarFile(null);
      setPreviewUrl(null);
      toast.success("Profil berhasil diperbarui.");
    } catch {
      toast.error("Gagal memperbarui profil.");
    }
  };

  const displayedAvatar = previewUrl || user.avatarUrl;

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-1">Informasi Profil</h2>
      <p className="text-xs text-slate-500 mb-5">Foto profil (max 1MB, .jpg/.jpeg/.png/.gif) dan nama Anda.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center">
              {displayedAvatar ? (
                <img src={displayedAvatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-slate-500">
                  {(user.fullName || user.email).charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <label
              htmlFor="avatar-input"
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-amber-600 transition-colors"
            >
              <Camera className="w-3.5 h-3.5 text-slate-950" />
            </label>
            <input
              id="avatar-input"
              type="file"
              accept=".jpg,.jpeg,.png,.gif"
              className="hidden"
              onChange={(e) => handleAvatarChange(e.target.files?.[0])}
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{user.email}</p>
            <p className="text-xs text-slate-500 capitalize">{user.role.toLowerCase()}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nama lengkap</label>
          <input placeholder="Nama Anda" {...register("fullName")} className={inputClass} />
          {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
        </div>

        <SubmitButton label="Simpan Perubahana" process="Menyimpan..." disabled={isSubmitting} />
        {/* <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-lg text-sm transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
        </button> */}
      </form>
    </section>
  );
}