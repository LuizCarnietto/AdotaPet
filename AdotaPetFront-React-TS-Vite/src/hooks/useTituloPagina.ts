import { useEffect } from "react";

export function useTituloPagina(titulo: string) {
  useEffect(() => {
    document.title = `AdotaPet | ${titulo}`;
  }, [titulo]);
}