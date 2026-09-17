import { createBrowserRouter } from "react-router-dom";
import { ROOT_PATH } from "../constants/route.constant";
import { ListaAdotar } from "../screens/listaadotar/LIstaAdotar.tsx";
import EditarAnimal from "../screens/editar/EditarAnimal";
import FormularioAdocao from "../screens/formularios/FormularioAdocao.tsx";
import RegistrarAnimal from "@/screens/cadastros/RegistrarAnimal.tsx";
import { Login } from "@/screens/login/Login.tsx";
import HomePage from "@/screens/home/HomePage.tsx";
import CadastroUsuario from "@/screens/cadastros/CadastroUsuario.tsx";
import EsqueceuSenha from "@/screens/login/EsqueceuSenha.tsx";
import CadastroOng from "@/screens/cadastros/CadastroOng.tsx";
import RegistroAnimal from "@/screens/cadastros/RegistroAnimal.tsx";

export const routesList = createBrowserRouter([
  {
    path: ROOT_PATH,
    element: <HomePage />,
  },

  {
    path: "/editar",
    element: <EditarAnimal />,
  },

  {
    path: "/formularios",
    element: <FormularioAdocao />,
  },

  {
    path: "/cadastros",
    element: <RegistrarAnimal/>,
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
      path: "/cadastros/RegistrarAnimal", //apagar depois
      element: <RegistrarAnimal/>,
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
]);
