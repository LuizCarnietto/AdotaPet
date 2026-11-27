import { Header } from "../../components/Header";
import ListarAnimais from "@/components/ListarAnimais";
import { useTituloPagina } from "../../hooks/useTituloPagina";

export const ListaAdotar = (): JSX.Element => {
  useTituloPagina("Animais");
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <Header></Header>
      <ListarAnimais></ListarAnimais>
    </div>
  );
};
