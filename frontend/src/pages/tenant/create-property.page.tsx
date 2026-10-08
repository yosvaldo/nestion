import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, Save, ImagePlus, Plus, Trash2 } from "lucide-react";
import api from "@/configs/api.config";
import SEO from "@/components/seo/seo";
import { isAxiosError } from "axios";
import { createPropertySchema, type CreatePropertyFormValues } from "@/models/property.model";

export default function CreatePropertyPage() {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreatePropertyFormValues>({
    resolver: zodResolver(createPropertySchema),
    defaultValues: { 
      name: "", city: "", category: "", description: "", 
      rooms: [{ name: "", basePrice: 0, guestCapacity: 2, description: "" }] 
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "rooms",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories"); 
        setCategories(res.data.data);
      } catch {
        toast.error("Gagal memuat daftar kategori.");
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) return toast.error("Ukuran gambar maksimal 1MB");    
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data: CreatePropertyFormValues) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("city", data.city);
      formData.append("categoryId", data.category);
      formData.append("description", data.description);
      formData.append("rooms", JSON.stringify(data.rooms));
      if (imageFile) formData.append("picture", imageFile);
      await api.post("/properties", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Properti dan kamar berhasil ditambahkan!");
      navigate("/tenant");
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Gagal menambahkan properti.");
      } else {
        toast.error("Gagal menambahkan properti.");
      }
    }
  };

  const inputClass = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50";

  return (
    <>
      <SEO title="Create Property | Nestion" description="Tambahkan properti baru" />
      <main className="p-6 md:p-10 font-sans max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate("/tenant")} className="p-2 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Tambah Properti Baru</h1>
            <p className="text-sm text-slate-500">Mohon isi detail properti beserta kamar yang disewakan.</p>
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <section className="space-y-6">
              <h2 className="text-lg font-bold text-slate-800 border-b pb-2">Informasi Properti</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Properti</label>
                  <input {...register("name")} placeholder="Misal: Villa Indah Kapuk" className={inputClass} />
                  {errors.name && <p className="text-xs text-rose-500 mt-1.5">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kota</label>
                  <input {...register("city")} placeholder="Misal: Surabaya" className={inputClass} />
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
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deskripsi Properti</label>
                <textarea {...register("description")} rows={4} className={`${inputClass} resize-none`}></textarea>
                {errors.description && <p className="text-xs text-rose-500 mt-1.5">{errors.description.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Foto Utama (Maks 1MB)</label>
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
              </div>
            </section>

            <section className="space-y-6 pt-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h2 className="text-lg font-bold text-slate-800">Tipe Kamar / Ruangan</h2>
                <button 
                  type="button" 
                  onClick={() => append({ name: "", basePrice: 0, guestCapacity: 2, description: "" })}
                  className="flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700"
                >
                  <Plus className="w-4 h-4" /> Tambah Kamar
                </button>
              </div>

              {errors.rooms?.root && <p className="text-xs text-rose-500">{errors.rooms.root.message}</p>}

              {fields.map((item, index) => (
                <div key={item.id} className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 space-y-4 relative group">
                  {fields.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => remove(index)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tipe/Nama Kamar</label>
                      <input {...register(`rooms.${index}.name`)} placeholder="Misal: Deluxe Room" className={inputClass} />
                      {errors.rooms?.[index]?.name && <p className="text-xs text-rose-500 mt-1.5">{errors.rooms[index].name?.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Harga Dasar (Rp)</label>
                      <input type="number" {...register(`rooms.${index}.basePrice`, { valueAsNumber: true })} placeholder="Misal: 500000" className={inputClass} />
                      {errors.rooms?.[index]?.basePrice && <p className="text-xs text-rose-500 mt-1.5">{errors.rooms[index].basePrice?.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kapasitas Tamu</label>
                      <input type="number" {...register(`rooms.${index}.guestCapacity`, { valueAsNumber: true })} placeholder="Misal: 2" className={inputClass} />
                      {errors.rooms?.[index]?.guestCapacity && <p className="text-xs text-rose-500 mt-1.5">{errors.rooms[index].guestCapacity?.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deskripsi Kamar</label>
                    <textarea {...register(`rooms.${index}.description`)} rows={2} placeholder="Fasilitas kamar (AC, WiFi, dll)" className={`${inputClass} resize-none`}></textarea>
                  </div>
                </div>
              ))}
            </section>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button type="button" onClick={() => navigate("/tenant")} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                Batal
              </button>
              <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 transition-colors flex items-center gap-2 disabled:opacity-50">
                <Save className="w-4 h-4" />
                {isSubmitting ? "Menyimpan..." : "Simpan Data"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}