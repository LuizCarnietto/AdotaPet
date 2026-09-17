import { Header } from "../../components/Header";
import ListarAnimais from "@/components/ListarAnimais";

export const ListaAdotar = (): JSX.Element => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <Header></Header>
      <ListarAnimais></ListarAnimais>
    </div>
  );
};
