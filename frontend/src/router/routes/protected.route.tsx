import type IRoute from "@/models/route.model";

const protectedRoutes: IRoute[] = [
  {
    path: "dashboard",
    element: (
      <div className="p-8 font-sans">
        <h1 className="text-2xl font-bold text-slate-900">User Dashboard</h1>
      </div>
    ),
  },
];

export default protectedRoutes;