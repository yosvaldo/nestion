import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/configs/api.config";
import SEO from "@/components/seo/seo";
import { ArrowLeft, Save, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { isAxiosError } from "axios";

interface PropertyDetail {
  id: string;
  name: string;
  city: string;
  category: { id: string; name: string };
  description: string;
  pictureUrls?: string[];
}

const formSchema = z.object({
  name: z.string().min(5, "Nama properti minimal 5 karakter").max(250, "Maksimal 250 karakter"),
  city: z.string().min(3, "Kota minimal 3 karakter").max(50, "Maksimal 50 karakter"),
  category: z.string().min(1, "Kategori wajib diisi"), // Menyimpan categoryId
  description: z.string().min(20, "Deskripsi minimal 20 karakter").max(500, "Maksimal 500 karakter"),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditPropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();  
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [propRes, catRes] = await Promise.all([
          api.get(`/properties/${id}`),
          api.get("/categories")
        ]);

        const data = propRes.data.data;
        setProperty(data);
        setCategories(catRes.data.data);
        
        reset({
          name: data.name,
          city: data.city,
          category: data.category?.id || "",
          description: data.description,
        });

        if (data.pictureUrls && data.pictureUrls.length > 0) {
          setPreview(data.pictureUrls[0]);
        }
      } catch (err) {
        if (isAxiosError(err)) {
          toast.error(err.response?.data?.message || "Gagal memuat data properti");
        } else {
          toast.error("Gagal memuat data properti");
        }
        navigate("/tenant");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) return toast.error("Ukuran gambar maksimal 1MB");
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("city", data.city);
      formData.append("categoryId", data.category); // Kirim categoryId ke backend
      formData.append("description", data.description);
      if (imageFile) formData.append("picture", imageFile);

      await api.patch(`/properties/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      toast.success("Properti berhasil diperbarui!");
      navigate("/tenant");
    } catch (err) {
      if (isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Gagal memperbarui properti.");
      } else {
        toast.error("Gagal memperbarui properti.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  const inputClass = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50";

  return (
    <>
      <SEO title="Edit Property | Nestion" description="Edit data properti tenant" />
      <main className="p-6 md:p-10 font-sans max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate("/tenant")} className="p-2 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Edit Property</h1>
            <p className="text-sm text-slate-500">Mengubah data untuk: <strong>{property?.name}</strong></p>
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Properti</label>
                <input {...register("name")} className={inputClass} />
                {errors.name && <p className="text-xs text-rose-500 mt-1.5">{errors.name.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kota</label>
                <input {...register("city")} className={inputClass} />
                {errors.city && <p className="text-xs text-rose-500 mt-1.5">{errors.city.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kategori</label>
              <select {...register("category")} className={inputClass}>
                <option value="">-- Pilih Kategori --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.category && <p className="text-xs text-rose-500 mt-1.5">{errors.category.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deskripsi Lengkap</label>
              <textarea {...register("description")} rows={5} className={`${inputClass} resize-none`}></textarea>
              {errors.description && <p className="text-xs text-rose-500 mt-1.5">{errors.description.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Foto Utama (Maks 1MB)</label>
              <div className="flex items-center gap-4">
                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:bg-slate-50 hover:border-amber-500 transition-colors bg-slate-50 overflow-hidden relative">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-slate-400">
                      <ImagePlus className="w-6 h-6 mb-2" />
                      <span className="text-xs font-medium">Upload</span>
                    </div>
                  )}
                  <input type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={handleImageChange} />
                </label>
                <p className="text-xs text-slate-500">Biarkan kosong jika tidak ingin mengubah foto saat ini.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button type="button" onClick={() => navigate("/tenant")} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                Batal
              </button>
              <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 transition-colors flex items-center gap-2 disabled:opacity-50">
                <Save className="w-4 h-4" />
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}