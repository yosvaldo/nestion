import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import LoadingScreen from "@/pages/loading.screen";
import SEO from "@/components/seo/seo";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function ProtectedLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <>
      <SEO title={`Nestion | Dashboard - ${user.email}`} />
      <SidebarProvider>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}