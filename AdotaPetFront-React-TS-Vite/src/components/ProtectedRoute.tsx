import { Navigate, Outlet } from "react-router-dom";

type TipoPerfil = "ADOTANTE" | "ONG";

interface ProtectedRouteProps {
  tiposPermitidos?: TipoPerfil[];
}

export function ProtectedRoute({ tiposPermitidos }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  const tipoUsuario = localStorage.getItem("tipoUsuario") as TipoPerfil | null;

  if (!token) return <Navigate to="/login" replace />;

  if (tiposPermitidos && (!tipoUsuario || !tiposPermitidos.includes(tipoUsuario))) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}