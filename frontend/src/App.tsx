import RouterProvider from "@/router/provider/router.provider";
import { Toaster } from "sonner";

export default function App() {
  return (
    <>
      <RouterProvider />
      <Toaster position="top-center" richColors />
    </>
  );
}