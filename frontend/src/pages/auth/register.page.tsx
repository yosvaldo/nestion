import SEO from "@/components/seo/seo";

export default function RegisterPage() {
  return (
    <>
      <SEO
        title="Register - Nestion"
        description="Create a new Nestion account"
      />
      <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm font-sans">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Daftar Nestion</h2>
        <p className="text-sm text-slate-500 mb-6">Buat akun penyewa baru</p>
      </div>
    </>
  );
}