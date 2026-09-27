import { useState, useEffect } from "react";
import api from "@/configs/api.config";
import SEO from "@/components/seo/seo";
import { Edit, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
}

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await api.get("/tenant/categories");
        setCategories(res.data.data);
        setLoading(false);
      } catch {
        toast.error("Gagal memuat kategori.");
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleRefresh = async () => {
    try {
      const res = await api.get("/tenant/categories");
      setCategories(res.data.data);
    } catch {
      toast.error("Gagal memperbarui daftar kategori.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Nama kategori wajib diisi.");
    
    try {
      if (editingId) {
        await api.put(`/tenant/categories/${editingId}`, { name });
        toast.success("Kategori berhasil diperbarui.");
      } else {
        await api.post("/tenant/categories", { name });
        toast.success("Kategori berhasil dibuat.");
      }
      setName("");
      setEditingId(null);
      handleRefresh();
    } catch {
      toast.error("Gagal menyimpan kategori.");
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await api.delete(`/tenant/categories/${categoryToDelete}`);
      toast.success("Kategori berhasil dihapus.");
      setCategoryToDelete(null);
      handleRefresh();
    } catch {
      toast.error("Gagal menghapus kategori.");
    }
  };

  return (
    <>
      <SEO title="Kelola Kategori Properti | Nestion" description="Manajemen kategori properti." />
      <main className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Kelola Kategori Properti</h1>
            <p className="text-sm text-slate-500">Buat, perbarui, dan hapus kategori properti sewaan Anda.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <form onSubmit={handleSubmit} className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-xs font-semibold text-slate-600 block mb-1">Nama Kategori</label>
                <input
                  type="text"
                  placeholder="Contoh: Villa, Resort, Hotel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-5 py-2 rounded-xl flex items-center gap-2 text-sm transition-colors"
              >
                <Save className="w-4 h-4" /> {editingId ? "Perbarui" : "Tambah"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => { setEditingId(null); setName(""); }}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-xl text-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-700">
                <tr>
                  <th className="px-6 py-4 font-semibold">Nama Kategori</th>
                  <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={2} className="text-center py-10">Memuat...</td></tr>
                ) : categories.length === 0 ? (
                  <tr><td colSpan={2} className="text-center py-10 text-slate-500">Belum ada kategori.</td></tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-bold text-slate-900">{cat.name}</td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button onClick={() => { setEditingId(cat.id); setName(cat.name); }} className="p-2 text-slate-400 hover:text-amber-600">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => setCategoryToDelete(cat.id)} className="p-2 text-slate-400 hover:text-rose-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {categoryToDelete && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold mb-2">Hapus Kategori?</h3>
            <p className="text-sm text-slate-500 mb-6">Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setCategoryToDelete(null)} className="px-4 py-2 text-sm font-semibold rounded-xl bg-slate-100 hover:bg-slate-200">Batal</button>
              <button onClick={handleDelete} className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}