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

export const routesList = createBrowserRouter([
  {
    path: ROOT_PATH,
    element: <HomePage />,
  },

  {
    path: "/editar/animal/:id",
    element: <EditarAnimal />,
  },

  {
    path: "/formularios",
    element: <FormularioAdocao />,
  },

  {
    path: "/candidaturas",
    element: <Candidaturas />,
  },

  {
    path:  "/minhas-candidaturas",
    element: <MinhasCandidaturas/>,
  },

  {
    path: "/cadastros/CadastroUsuario",
    element: <CadastroUsuario/>,
  },

    {
      path: "/cadastros/CadastroOng",
      element: <CadastroOng/>,
    },

    {
      path: "/cadastros/RegistroAnimal",
      element: <RegistroAnimal/>,
    },

    {
      path: "/cadastros/AnimaisCadastrados",
      element: <AnimaisCadastrados/>,
    },

  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/login/EsqueceuSenha",
    element: <EsqueceuSenha />,
  },

  {
    path: "/listaadotar",
    element: <ListaAdotar />,
  },

  {
    path: "/listaadotar/DetalhesAnimal/:id",
    element: <DetalhesAnimal />,
  },

  {
    path: "/perfil/PerfilOng",
    element: <PerfilOng />,
  },
  {
    path: "/perfil/EditarPerfilOng",
    element: <EditarPerfilOng />,
  },
]);
