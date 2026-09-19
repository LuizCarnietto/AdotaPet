import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { apiService } from "@/services/ApiService";

interface AnimalType {
  id: number;
  img: string;
  name: string;
  gender: string;
  porte: string;
  local: string;
}

const obterFoto = (fotos: string | null | undefined): string => {
  if (!fotos) {
    return "";
  }

  try {
    const fotosParseadas = JSON.parse(fotos);

    if (Array.isArray(fotosParseadas)) {
      return fotosParseadas[0] || "";
    }

    return "";
  } catch {
    return fotos;
  }
};

const ListarAnimais = () => {
  const [animais, setAnimais] = useState<AnimalType[]>([]);
  const navigate = useNavigate();

  const [paginaAtual, setPaginaAtual] = useState(1);
  const animaisPorPagina = 16;

  const [estados, setEstados] = useState<any[]>([]);
  const [cidades, setCidades] = useState<any[]>([]);
  const [estadoId, setEstadoId] = useState("");
  const [cidadeId, setCidadeId] = useState("");
  const [racaTexto, setRacaTexto] = useState("");
  const [, setRacaId] = useState("");
  const [racasSugestoes, setRacasSugestoes] = useState<any[]>([]);
  const [buscandoRacas, setBuscandoRacas] = useState(false);

  const [filtro, setFiltro] = useState({
    especie: "",
    raca: "",
    sexo: "",
    cor: "",
    idade: "",
    porte: "",
    possuiChip: "",
    localizacao: "",
    vacinado: "",
  });

  const buscarAnimais = async () => {
    setPaginaAtual(1);
    console.log("Aplicando filtros...");

    try {
      const payload = {
        especie: filtro.especie || null,
        raca: racaTexto || null,
        sexo: filtro.sexo || null,
        cor: filtro.cor || null,
        idade: filtro.idade || null,
        porte: filtro.porte || null,
        possuiChip:
          filtro.possuiChip === "" ? null : filtro.possuiChip === "true",
        cidadeId: cidadeId ? Number(cidadeId) : null,
        vacinado: filtro.vacinado === "" ? null : filtro.vacinado === "true",
      };

      console.log("Payload enviado:", payload);

      const response = await apiService.post("/animal/buscar", payload);

      console.log("Status:", response.status);
      console.log("Resposta:", response.data);

      setAnimais(
        response.data.map((pet: any) => {
          return {
            id: pet.id,
            img: obterFoto(pet.fotos),
            name: pet.nome,
            gender: pet.sexo,
            porte: pet.porte,
            local:
              pet.cidade && pet.estadoSigla
                ? `${pet.cidade} - ${pet.estadoSigla}`
                : pet.cidade || pet.localizacao || "Não informado",
          };
        }),
      );
    } catch (error) {
      console.error("Erro completo:", error);
    }
  };

  const resetarFiltros = () => {
    setPaginaAtual(1);
    setFiltro({
      especie: "",
      raca: "",
      sexo: "",
      cor: "",
      idade: "",
      porte: "",
      possuiChip: "",
      localizacao: "",
      vacinado: "",
    });

    setEstadoId("");
    setCidadeId("");

    setRacaTexto("");
    setRacaId("");
    setRacasSugestoes([]);

    buscarTodosAnimais();
  };

  const buscarTodosAnimais = async () => {
    try {
      const response = await apiService.get("/animal");

      console.log("ANIMAIS RAW:", response.data);

      setAnimais(
        response.data.map((pet: any) => {
          return {
            id: pet.id,
            img: obterFoto(pet.fotos),
            name: pet.nome,
            gender: pet.sexo,
            porte: pet.porte,
            local:
              pet.cidade && pet.estadoSigla
                ? `${pet.cidade} - ${pet.estadoSigla}`
                : pet.cidade || pet.localizacao || "Não informado",
          };
        }),
      );
    } catch (error) {
      console.error("Erro ao buscar animais", error);
    }
  };

  useEffect(() => {
    const buscarEstados = async () => {
      try {
        const response = await apiService.get("/localizacao/estados");
        setEstados(response.data);
      } catch (error) {
        console.error("Erro ao buscar estados:", error);
      }
    };

    buscarEstados();
  }, []);

  useEffect(() => {
    const buscarCidades = async () => {
      if (!estadoId) {
        setCidades([]);
        setCidadeId("");
        return;
      }

      try {
        const response = await apiService.get(
          `/localizacao/cidades/${estadoId}`,
        );

        setCidades(response.data);
      } catch (error) {
        console.error("Erro ao buscar cidades:", error);
        setCidades([]);
      }
    };

    buscarCidades();
  }, [estadoId]);

  // Autocomplete de raças
  useEffect(() => {
    if (!filtro.especie) {
      setRacasSugestoes([]);
      return;
    }

    const buscarRacas = async () => {
      try {
        setBuscandoRacas(true);

        const response = await apiService.get(
          `/racas/${filtro.especie}/buscar`,
          {
            params: {
              nome: racaTexto.trim(),
            },
          },
        );

        setRacasSugestoes(response.data);
      } catch (error) {
        console.error("Erro ao buscar raças:", error);
        setRacasSugestoes([]);
      } finally {
        setBuscandoRacas(false);
      }
    };

    const timer = setTimeout(() => {
      buscarRacas();
    }, 300);

    return () => clearTimeout(timer);
  }, [racaTexto, filtro.especie]);

  useEffect(() => {
    buscarTodosAnimais();
  }, []);

  const indiceInicial = (paginaAtual - 1) * animaisPorPagina;
  const indiceFinal = indiceInicial + animaisPorPagina;
  const animaisDaPagina = animais.slice(indiceInicial, indiceFinal);
  const totalPaginas = Math.ceil(animais.length / animaisPorPagina);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans w-full">
      <main className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 p-8">
        <aside className="w-full md:w-1/4 space-y-6">
          <div className="mb-6">
            <h1 className="text-[#36C3FF] text-2xl font-normal m-0">Filtros</h1>

            <p className="text-[#7085a0] text-sm mt-1">Refine sua busca</p>
          </div>

          <div className="space-y-4">
            {/* ESPÉCIE */}
            <FilterCard label="Especie do animal">
              <Select
                value={filtro.especie}
                onValueChange={(value) => {
                  setFiltro((prev) => ({
                    ...prev,
                    especie: value === "todos" ? "" : value,
                    raca: "",
                  }));

                  setRacaTexto("");
                  setRacaId("");
                  setRacasSugestoes([]);
                }}
              >
                <SelectTrigger className="border border-[#dce3ea] rounded-[10px] focus:ring-2 focus:ring-[#36C3FF]/20">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="CACHORRO">Cachorro</SelectItem>
                  <SelectItem value="GATO">Gato</SelectItem>
                </SelectContent>
              </Select>
            </FilterCard>

            {/* RAÇA */}
            <div className="relative z-50">
              <FilterCard label="Raça">
                <div className="racaAutocomplete relative w-full">
                  <Input
                    placeholder={
                      filtro.especie
                        ? "Digite a raça"
                        : "Selecione primeiro a espécie"
                    }
                    value={racaTexto}
                    onChange={(e) => {
                      setRacaTexto(e.target.value);
                      setRacaId("");
                    }}
                    autoComplete="off"
                    disabled={!filtro.especie}
                    className="h-[38px] w-full rounded-[10px] border border-[#dce3ea] bg-[#f9fbfd] px-3 text-left text-[13px] outline-none transition-all placeholder:text-[#9aa6af] focus:border-[#36C3FF] focus:bg-white focus:ring-2 focus:ring-[#36C3FF]/20 disabled:cursor-not-allowed disabled:bg-[#eef2f5] disabled:text-[#8a969f] disabled:opacity-70"
                  />

                  {racasSugestoes.length > 0 && (
                    <div className="racaSugestoes absolute left-0 top-[42px] z-[1000] max-h-[180px] w-full overflow-y-auto rounded-[10px] border border-[#dce3ea] bg-white p-1 shadow-[0_5px_15px_rgba(0,0,0,0.10)]">
                      {racasSugestoes.map((raca) => (
                        <div
                          key={raca.id}
                          className="racaSugestao cursor-pointer rounded-[7px] px-3 py-2 text-left text-[13px] transition-colors hover:bg-[#eef9ff] hover:text-[#159edb]"
                          onClick={() => {
                            setRacaTexto(raca.nome);
                            setRacaId(String(raca.id));
                            setRacasSugestoes([]);
                          }}
                        >
                          {raca.nome}
                        </div>
                      ))}
                    </div>
                  )}

                  {buscandoRacas && (
                    <div className="racaBuscando absolute left-0 top-[42px] z-[1000] w-full rounded-[10px] border border-[#dce3ea] bg-white px-3 py-2 text-[12px] text-[#8a969f] shadow-[0_5px_15px_rgba(0,0,0,0.10)]">
                      Buscando...
                    </div>
                  )}
                </div>
              </FilterCard>
            </div>

            {/* SEXO */}
            <FilterCard label="Sexo">
              <Select
                value={filtro.sexo}
                onValueChange={(value) =>
                  setFiltro((prev) => ({
                    ...prev,
                    sexo: value === "todos" ? "" : value,
                  }))
                }
              >
                <SelectTrigger className="border border-[#dce3ea] rounded-[10px] focus:ring-2 focus:ring-[#36C3FF]/20">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="MACHO">Macho</SelectItem>
                  <SelectItem value="FEMEA">Fêmea</SelectItem>
                </SelectContent>
              </Select>
            </FilterCard>

            {/* COR */}
            <FilterCard label="Cor">
              <Select
                value={filtro.cor}
                onValueChange={(value) =>
                  setFiltro((prev) => ({
                    ...prev,
                    cor: value === "todos" ? "" : value,
                  }))
                }
              >
                <SelectTrigger className="border border-[#dce3ea] rounded-[10px] focus:ring-2 focus:ring-[#36C3FF]/20">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="BRANCO">Branco</SelectItem>
                  <SelectItem value="PRETO">Preto</SelectItem>
                  <SelectItem value="LARANJA">Laranja</SelectItem>
                  <SelectItem value="CINZA">Cinza</SelectItem>
                  <SelectItem value="MARRON">Marrom</SelectItem>
                  <SelectItem value="CREME">Creme</SelectItem>
                  <SelectItem value="FRAJOLA">Frajola</SelectItem>
                </SelectContent>
              </Select>
            </FilterCard>

            {/* IDADE */}
            <FilterCard label="Idade">
              <Select
                value={filtro.idade}
                onValueChange={(value) =>
                  setFiltro((prev) => ({
                    ...prev,
                    idade: value === "todos" ? "" : value,
                  }))
                }
              >
                <SelectTrigger className="border border-[#dce3ea] rounded-[10px] focus:ring-2 focus:ring-[#36C3FF]/20">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="FILHOTE">Filhote</SelectItem>
                  <SelectItem value="ADULTO">Adulto</SelectItem>
                  <SelectItem value="IDOSO">Idoso</SelectItem>
                </SelectContent>
              </Select>
            </FilterCard>

            {/* PORTE */}
            <FilterCard label="Porte do animal">
              <Select
                value={filtro.porte}
                onValueChange={(value) =>
                  setFiltro((prev) => ({
                    ...prev,
                    porte: value === "todos" ? "" : value,
                  }))
                }
              >
                <SelectTrigger className="border border-[#dce3ea] rounded-[10px] focus:ring-2 focus:ring-[#36C3FF]/20">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="PEQUENO">Pequeno</SelectItem>
                  <SelectItem value="MEDIO">Médio</SelectItem>
                  <SelectItem value="GRANDE">Grande</SelectItem>
                </SelectContent>
              </Select>
            </FilterCard>

            {/* MICROCHIP */}
            <FilterCard label="Possui Microchip?">
              <Select
                value={filtro.possuiChip}
                onValueChange={(value) =>
                  setFiltro((prev) => ({
                    ...prev,
                    possuiChip: value === "todos" ? "" : value,
                  }))
                }
              >
                <SelectTrigger className="border border-[#dce3ea] rounded-[10px] focus:ring-2 focus:ring-[#36C3FF]/20">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="true">Sim</SelectItem>
                  <SelectItem value="false">Não</SelectItem>
                </SelectContent>
              </Select>
            </FilterCard>

            {/* LOCALIZAÇÃO */}
            <FilterCard label="Localização">
              <div className="flex gap-2 w-full">
                <Select
                  value={estadoId}
                  onValueChange={(value) => {
                    setEstadoId(value);
                    setCidadeId("");
                  }}
                >
                  <SelectTrigger className="border border-[#dce3ea] rounded-[10px] focus:ring-2 focus:ring-[#36C3FF]/20">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>

                  <SelectContent>
                    {estados.map((estado) => (
                      <SelectItem key={estado.id} value={String(estado.id)}>
                        {estado.sigla}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={cidadeId}
                  onValueChange={(value) => {
                    setCidadeId(value);
                  }}
                  disabled={!estadoId}
                >
                  <SelectTrigger className="border border-[#dce3ea] rounded-[10px] focus:ring-2 focus:ring-[#36C3FF]/20 disabled:bg-[#eef2f5] disabled:text-[#8a969f]">
                    <SelectValue placeholder="Cidade" />
                  </SelectTrigger>

                  <SelectContent>
                    {cidades.map((cidade) => (
                      <SelectItem key={cidade.id} value={String(cidade.id)}>
                        {cidade.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </FilterCard>

            {/* VACINADO */}
            <FilterCard label="Vacinado">
              <Select
                value={filtro.vacinado}
                onValueChange={(value) =>
                  setFiltro((prev) => ({
                    ...prev,
                    vacinado: value === "todos" ? "" : value,
                  }))
                }
              >
                <SelectTrigger className="border border-[#dce3ea] rounded-[10px] focus:ring-2 focus:ring-[#36C3FF]/20">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="true">Sim</SelectItem>
                  <SelectItem value="false">Não</SelectItem>
                </SelectContent>
              </Select>
            </FilterCard>

            {/* BOTÕES */}
            <div className="flex w-full gap-2">
              <Button
                className="h-[48px] flex-1 rounded-[30px] bg-[#36C3FF] px-3 text-[14px] text-white hover:bg-[#2db0e8]"
                onClick={buscarAnimais}
              >
                Aplicar Filtros
              </Button>

              <Button
                className="h-[48px] flex-1 rounded-[30px] bg-[#36C3FF] px-3 text-[14px] text-white hover:bg-[#2db0e8]"
                onClick={resetarFiltros}
              >
                Resetar Filtros
              </Button>
            </div>
          </div>
        </aside>

        <section className="flex-1 bg-violet-200/30 rounded-3xl p-6 min-h-[600px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {animaisDaPagina.map((pet) => (
              <div
                key={pet.id}
                onClick={() =>
                  navigate(`/listaadotar/DetalhesAnimal/${pet.id}`)
                }
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 cursor-pointer"
              >
                <img
                  src={pet.img}
                  alt={pet.name}
                  className="w-full h-48 object-cover"
                />

                <div className="p-4">
                  <h2 className="text-xl font-bold text-[#36C3FF] mb-2 uppercase">
                    {pet.name}
                  </h2>

                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-semibold text-gray-800">
                        Gênero:
                      </span>{" "}
                      {pet.gender}
                    </p>

                    <p>
                      <span className="font-semibold text-gray-800">
                        Porte:
                      </span>{" "}
                      {pet.porte}
                    </p>

                    <p>
                      <span className="font-semibold text-gray-800">
                        Local:
                      </span>{" "}
                      {pet.local}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {totalPaginas > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                disabled={paginaAtual === 1}
                onClick={() => setPaginaAtual((pagina) => pagina - 1)}
                className="rounded-[20px]"
              >
                Anterior
              </Button>

              {Array.from({ length: totalPaginas }, (_, index) => {
                const pagina = index + 1;

                return (
                  <Button
                    key={pagina}
                    onClick={() => setPaginaAtual(pagina)}
                    className={`rounded-[20px] w-10 h-10 ${
                      paginaAtual === pagina
                        ? "bg-[#36C3FF] hover:bg-[#2db0e8] text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {pagina}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                disabled={paginaAtual === totalPaginas}
                onClick={() => setPaginaAtual((pagina) => pagina + 1)}
                className="rounded-[20px]"
              >
                Próxima
              </Button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

// Componente auxiliar para os cards de filtro
const FilterCard = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <Card className="p-4 rounded-[30px] border-none shadow-sm flex flex-row items-center overflow-visible">
    <Label className="text-[#7085a0] text-[16px] mb-2 block">{label}</Label>

    {children}
  </Card>
);

export default ListarAnimais;
