import type IRoute from "@/models/route.model";
import HomePage from "@/pages/home/home.page";
import LoginPage from "@/pages/auth/login.page";
import RegisterPage from "@/pages/auth/register.page";

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
];

export default publicRoutes;