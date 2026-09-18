import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "@/services/ApiService";

// Importante:
// aqui sempre tenho que usar o mesmo import do Header que existe em ListaAdotar.tsx
import { Header } from "../../components/Header";

interface AnimaisCadastrados {
  id: number;
  nome: string;
  raca?: string;
  idade?: string;
  fotos?: string | string[] | null;
  cidade?: string;
  estadoSigla?: string;
  especie?: string;
  porte?: string;
  sexo?: string;
  status?: string;
}

const obterFotos = (fotos: string | string[] | null | undefined): string[] => {
  if (!fotos) return [];

  if (Array.isArray(fotos)) {
    return fotos.filter((foto) => foto && foto.trim() !== "");
  }

  try {
    const fotosParseadas = JSON.parse(fotos);

    if (Array.isArray(fotosParseadas)) {
      return fotosParseadas.filter(
        (foto) => typeof foto === "string" && foto.trim() !== "",
      );
    }

    if (typeof fotosParseadas === "string") {
      return [fotosParseadas];
    }
  } catch {
    if (fotos.trim() !== "") {
      return [fotos];
    }
  }

  return [];
};

const formatarEspecie = (especie?: string) => {
  if (especie === "CACHORRO") return "Cachorro";
  if (especie === "GATO") return "Gato";

  return especie || "Não informado";
};

const formatarSexo = (sexo?: string) => {
  if (sexo === "MACHO") return "Macho";
  if (sexo === "FEMEA") return "Fêmea";

  return sexo || "Não informado";
};

const formatarPorte = (porte?: string) => {
  if (porte === "PEQUENO") return "Pequeno";
  if (porte === "MEDIO") return "Médio";
  if (porte === "GRANDE") return "Grande";

  return porte || "Não informado";
};

const formatarIdade = (idade?: string) => {
  if (idade === "FILHOTE") return "Filhote";
  if (idade === "ADULTO") return "Adulto";
  if (idade === "IDOSO") return "Idoso";

  return idade || "Não informado";
};

const formatarStatus = (status?: string) => {
  if (status === "DISPONIVEL") return "Disponível";
  if (status === "ADOTADO") return "Adotado";
  if (status === "INATIVO") return "Inativo";

  return status || "Não informado";
};

export default function AnimaisCadastrados() {
  const navigate = useNavigate();

  const [animais, setAnimais] = useState<AnimaisCadastrados[]>([]);
  const [carregando, setCarregando] = useState(true);

  const tipoUsuario = localStorage.getItem("tipoUsuario");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || !tipoUsuario) {
      navigate("/login");
      return;
    }

    if (tipoUsuario !== "ROLE_ONG") {
      navigate("/");
      return;
    }

    const buscarAnimais = async () => {
      try {
        const response = await apiService.get("/animal/ong");

        setAnimais(response.data);
      } catch (error) {
        console.error("Erro ao buscar animais da ONG:", error);
      } finally {
        setCarregando(false);
      }
    };

    buscarAnimais();
  }, [navigate, tipoUsuario, token]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header mostrarRegistrarAnimal={!carregando && animais.length > 0} />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold text-sky-500 uppercase tracking-wider">
            Administração
          </p>

          <h1 className="text-3xl font-bold text-slate-800 mt-1">
            Meus Animais
          </h1>

          <p className="text-slate-500 mt-2">
            Gerencie os animais cadastrados pela sua ONG.
          </p>
        </div>

        {carregando ? (
          <div className="text-center py-16 text-slate-500">
            Carregando animais...
          </div>
        ) : animais.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
            <h2 className="text-xl font-bold text-slate-700">
              Nenhum animal cadastrado
            </h2>

            <p className="text-slate-500 mt-2">
              Sua ONG ainda não possui animais cadastrados.
            </p>

            <button
              type="button"
              onClick={() => navigate("/cadastros/RegistroAnimal")}
              className="mt-6 px-6 py-3 rounded-full bg-sky-400 text-white font-bold hover:bg-sky-500 transition"
            >
              Cadastrar Animal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {animais.map((animal) => {
              const fotos = obterFotos(animal.fotos);
              const fotoPrincipal = fotos[0] || "";

              const localizacao =
                animal.cidade && animal.estadoSigla
                  ? `${animal.cidade} - ${animal.estadoSigla}`
                  : animal.cidade || "Não informado";

              return (
                <div
                  key={animal.id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col"
                >
                  <div className="h-52 bg-slate-100 overflow-hidden">
                    {fotoPrincipal ? (
                      <img
                        src={fotoPrincipal}
                        alt={animal.nome}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        Sem foto
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <h2 className="text-xl font-bold text-[#36c3ff]">
                          {animal.nome}
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                          {animal.raca || "Raça não informada"}
                        </p>
                      </div>

                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                        {formatarStatus(animal.status)}
                      </span>
                    </div>

                    <div className="mt-4 space-y-1 text-sm text-slate-600">
                      <p>
                        <span className="font-semibold">Espécie:</span>{" "}
                        {formatarEspecie(animal.especie)}
                      </p>

                      <p>
                        <span className="font-semibold">Sexo:</span>{" "}
                        {formatarSexo(animal.sexo)}
                      </p>

                      <p>
                        <span className="font-semibold">Idade:</span>{" "}
                        {formatarIdade(animal.idade)}
                      </p>

                      <p>
                        <span className="font-semibold">Porte:</span>{" "}
                        {formatarPorte(animal.porte)}
                      </p>

                      <p>
                        <span className="font-semibold">Local:</span>{" "}
                        {localizacao}
                      </p>
                    </div>

                    <div className="mt-auto pt-5">
                      <button
                        type="button"
                        onClick={() => navigate(`/editar/animal/${animal.id}`)}
                        className="w-full py-2.5 rounded-full bg-sky-400 text-white font-bold hover:bg-sky-500 transition"
                      >
                        Editar animal
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
