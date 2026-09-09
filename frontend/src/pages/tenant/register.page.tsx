import SEO from "@/components/seo/seo";

export default function TenantRegisterPage() {
  return (
    <>
      <SEO title="Nestion | Register as Tenant" description="Daftar sebagai penyedia penginapan di Nestion" />
      <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm font-sans">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Register as Tenant</h2>
        <p className="text-sm text-slate-500">Mulai sewakan properti Anda di Nestion.</p>
      </div>
    </>
  );
}