import { useParams } from "react-router-dom";
import SEO from "@/components/seo/seo";
import { ArrowLeft, Save, ImagePlus, Plus, Trash2, X, ChevronDown, Search, Check } from "lucide-react";
import { useEditProperty } from "@/hooks/use-edit-property";

export default function EditPropertyPage() {
  const { id } = useParams();
  
  const { 
    methods: { register, handleSubmit, setValue, formState: { errors, isSubmitting } },
    fields, append, selectedCity, navigate, loading, property,
    categories, onSubmit, handleImageChange, removeExistingImage, removeNewImage, handleRemoveRoom,
    existingPictures, newPreviews,
    cityRef, isCityOpen, setIsCityOpen, citySearch, setCitySearch, filteredCities, allCities
  } = useEditProperty(id);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div></div>;
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
            <section className="space-y-6 border-b pb-6 border-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Properti</label>
                  <input {...register("name")} className={inputClass} />
                  {errors.name && <p className="text-xs text-rose-500 mt-1.5">{errors.name.message}</p>}
                </div>
                
                <div className="relative" ref={cityRef}>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kota</label>
                  <div 
                    className={`${inputClass} flex justify-between items-center cursor-pointer`}
                    onClick={() => setIsCityOpen(!isCityOpen)}
                  >
                    <span className={selectedCity ? "text-slate-900" : "text-slate-400"}>
                      {selectedCity || "Cari dan pilih kota..."}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isCityOpen ? "rotate-180" : ""}`} />
                  </div>
                  
                  {isCityOpen && (
                    <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col">
                      <div className="p-2 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                        <Search className="w-4 h-4 text-slate-400 ml-1" />
                        <input
                          autoFocus
                          type="text"
                          placeholder="Ketik nama kota..."
                          value={citySearch}
                          onChange={(e) => setCitySearch(e.target.value)}
                          className="w-full bg-transparent text-sm py-1.5 focus:outline-none text-slate-800"
                        />
                      </div>
                      <ul className="max-h-52 overflow-y-auto p-1.5">
                        {allCities.length === 0 ? (
                          <li className="px-3 py-4 text-sm text-slate-500 text-center">Memuat data kota...</li>
                        ) : filteredCities.length === 0 ? (
                          <li className="px-3 py-4 text-sm text-slate-500 text-center">Kota tidak ditemukan.</li>
                        ) : (
                          filteredCities.map(city => (
                            <li
                              key={city}
                              onClick={() => {
                                setValue("city", city, { shouldValidate: true });
                                setIsCityOpen(false);
                                setCitySearch("");
                              }}
                              className="px-3 py-2 text-sm text-slate-700 hover:bg-amber-50 rounded-lg cursor-pointer flex justify-between items-center"
                            >
                              {city}
                              {selectedCity === city && <Check className="w-4 h-4 text-amber-600" />}
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  )}
                  {errors.city && <p className="text-xs text-rose-500 mt-1.5">{errors.city.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kategori</label>
                <select {...register("category")} className={inputClass}>
                  <option value="">-- Pilih Kategori --</option>
                  {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
                {errors.category && <p className="text-xs text-rose-500 mt-1.5">{errors.category.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deskripsi Lengkap</label>
                <textarea {...register("description")} rows={3} className={`${inputClass} resize-none`}></textarea>
                {errors.description && <p className="text-xs text-rose-500 mt-1.5">{errors.description.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Foto Properti (Maks 1MB per file)</label>
                <div className="flex flex-wrap gap-4 mt-2">
                  {existingPictures.map((url, i) => (
                    <div key={`existing-${i}`} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 group">
                      <img src={url} alt={`Existing ${i}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeExistingImage(i)} className="absolute top-1 right-1 bg-rose-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 hover:bg-rose-600 transition-opacity">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {newPreviews.map((url, i) => (
                    <div key={`new-${i}`} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-amber-200">
                      <img src={url} alt={`New ${i}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeNewImage(i)} className="absolute top-1 right-1 bg-rose-500 text-white rounded-full p-1 hover:bg-rose-600">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:bg-slate-50 hover:border-amber-500 bg-slate-50 transition-colors">
                    <ImagePlus className="w-6 h-6 text-slate-400" />
                    <span className="text-[10px] font-medium text-slate-500 mt-1">Tambah Foto</span>
                    <input type="file" multiple accept=".jpg,.jpeg,.png" className="hidden" onChange={handleImageChange} />
                  </label>
                </div>
              </div>
            </section>
            
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">Tipe Kamar / Ruangan</h2>
                <button type="button" onClick={() => append({ name: "", basePrice: 0, guestCapacity: 2, description: "" })} className="flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700">
                  <Plus className="w-4 h-4" /> Tambah Kamar
                </button>
              </div>
              {errors.rooms?.root && <p className="text-xs text-rose-500">{errors.rooms.root.message}</p>}
              {fields.map((item, index) => (
                <div key={item.id} className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 space-y-4 relative group">
                  {fields.length > 1 && (
                    <button type="button" onClick={() => handleRemoveRoom(index)} className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Kamar</label>
                      <input {...register(`rooms.${index}.name`)} className={inputClass} />
                      {errors.rooms?.[index]?.name && <p className="text-xs text-rose-500 mt-1.5">{errors.rooms[index].name?.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Harga Dasar (Rp)</label>
                      <input type="number" {...register(`rooms.${index}.basePrice`, { valueAsNumber: true })} className={inputClass} />
                      {errors.rooms?.[index]?.basePrice && <p className="text-xs text-rose-500 mt-1.5">{errors.rooms[index].basePrice?.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kapasitas</label>
                      <input type="number" {...register(`rooms.${index}.guestCapacity`, { valueAsNumber: true })} className={inputClass} />
                      {errors.rooms?.[index]?.guestCapacity && <p className="text-xs text-rose-500 mt-1.5">{errors.rooms[index].guestCapacity?.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deskripsi Kamar</label>
                    <textarea {...register(`rooms.${index}.description`)} rows={2} className={`${inputClass} resize-none`}></textarea>
                  </div>
                </div>
              ))}
            </section>
            
            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button type="button" onClick={() => navigate("/tenant")} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">Batal</button>
              <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 transition-colors flex items-center gap-2 disabled:opacity-50">
                <Save className="w-4 h-4" /> {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}