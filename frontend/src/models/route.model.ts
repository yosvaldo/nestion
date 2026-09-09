import type { ReactNode } from "react";

export default interface IRoute {
  path?: string;
  index?: boolean;
  element: ReactNode;
}