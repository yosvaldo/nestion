import { Link } from "react-router-dom";
import logoImg from "@/assets/logo.png";

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <img
        src={logoImg}
        alt="Nestion Logo"
        className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
      />
      <span className="font-sans text-xl tracking-tight text-slate-900 font-bold">
        Nestion
      </span>
    </Link>
  );
}