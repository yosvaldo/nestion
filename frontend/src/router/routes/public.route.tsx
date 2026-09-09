import type IRoute from "@/models/route.model";
import HomePage from "@/pages/home/home.page";
import LoginPage from "@/pages/auth/login.page";
import RegisterPage from "@/pages/auth/register.page";
import TenantRegisterPage from "@/pages/tenant/register.page";

const publicRoutes: IRoute[] = [
  {
    index: true,
    element: <HomePage />,
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "register",
    element: <RegisterPage />,
  },
  {
    path: "tenant/register",
    element: <TenantRegisterPage />,
  },
];

export default publicRoutes;