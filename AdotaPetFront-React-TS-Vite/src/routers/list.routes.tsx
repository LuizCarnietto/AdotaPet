import { createBrowserRouter } from "react-router-dom";
import { ROOT_PATH } from "../constants/route.constant";
import { ListaAdotar } from "../screens/listaadotar/ListaAdotar.tsx";
import DetalhesAnimal from "../screens/listaadotar/DetalhesAnimal.tsx";
import EditarAnimal from "../screens/editar/EditarAnimal";
import FormularioAdocao from "../screens/formularios/FormularioAdocao.tsx";
import { Login } from "@/screens/login/Login.tsx";
import HomePage from "@/screens/home/HomePage.tsx";
import CadastroUsuario from "@/screens/cadastros/CadastroUsuario.tsx";
import EsqueceuSenha from "@/screens/login/EsqueceuSenha.tsx";
import CadastroOng from "@/screens/cadastros/CadastroOng.tsx";
import RegistroAnimal from "@/screens/cadastros/RegistroAnimal.tsx";
import AnimaisCadastrados from "@/screens/cadastros/AnimaisCadastrados.tsx";
import Candidaturas from "@/screens/formularios/Candidaturas.tsx";
import MinhasCandidaturas from "@/screens/formularios/MinhasCandidaturas.tsx";
import PerfilOng from "@/screens/perfil/PerfilOng.tsx";
import EditarPerfilOng from "@/screens/editar/EditarPerfilOng.tsx";
import PerfilAdotante from "@/screens/perfil/PerfilAdotante.tsx";
import { ProtectedRoute } from "@/components/ProtectedRoute.tsx";


export const routesList = createBrowserRouter([
  // ---------- PÚBLICAS ----------
  { path: ROOT_PATH, element: <HomePage /> },
  { path: "/login", element: <Login /> },
  { path: "/login/EsqueceuSenha", element: <EsqueceuSenha /> },
  { path: "/cadastros/CadastroUsuario", element: <CadastroUsuario /> },
  { path: "/cadastros/CadastroOng", element: <CadastroOng /> },
  { path: "/listaadotar", element: <ListaAdotar /> },
  { path: "/listaadotar/DetalhesAnimal/:id", element: <DetalhesAnimal /> },
  { path: "/ong/:ongId", element: <PerfilOng /> }, // ✅ pública

  // ---------- SÓ ONG ----------
  {
    element: <ProtectedRoute tiposPermitidos={["ROLE_ONG"]} />,
    children: [
      { path: "/perfil/PerfilOng", element: <PerfilOng /> },
      { path: "/perfil/EditarPerfilOng", element: <EditarPerfilOng /> },
      { path: "/cadastros/RegistroAnimal", element: <RegistroAnimal /> },
      { path: "/cadastros/AnimaisCadastrados", element: <AnimaisCadastrados /> },
      { path: "/editar/animal/:id", element: <EditarAnimal /> },
      { path: "/candidaturas", element: <Candidaturas /> },
    ],
  },

  // ---------- SÓ ADOTANTE ----------
  {
    element: <ProtectedRoute tiposPermitidos={["ROLE_ADOTANTE"]} />,
    children: [
      { path: "/perfil/PerfilAdotante", element: <PerfilAdotante /> },
      { path: "/minhas-candidaturas", element: <MinhasCandidaturas /> },
      { path: "/formularios", element: <FormularioAdocao /> },
    ],
  },
]);