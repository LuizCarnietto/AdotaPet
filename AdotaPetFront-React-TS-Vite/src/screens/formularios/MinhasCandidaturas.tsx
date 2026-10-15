import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ClipboardList,
  MessageCircle,
  PawPrint,
} from "lucide-react";

import { Header } from "../../components/Header";
import { apiService } from "../../services/ApiService";

interface Candidatura {
  id: number;
  nomeCompleto?: string;
  status: string;
  dataResposta?: string;
  animal?: {
    id: number;
    nome: string;
    fotos?: string | string[] | null;
    nomeOng?: string;
  };
  telefoneOng?: string;
}

function obterFoto(fotos?: string | string[] | null): string {
  if (!fotos) return "";
  if (Array.isArray(fotos)) return fotos[0] || "";

  try {
    const resultado = JSON.parse(fotos);
    return Array.isArray(resultado)
      ? resultado[0] || ""
      : typeof resultado === "string"
        ? resultado
        : "";
  } catch {
    return fotos;
  }
}

function formatarStatus(status: string) {
  switch (status) {
    case "EM_ANALISE":
      return "Em análise";
    case "AGUARDANDO_APROVACAO":
      return "Aguardando aprovação";
    case "APROVADO":
      return "Aprovada";
    case "REPROVADO":
      return "Reprovada";
    case "AGUARDANDO_RETIRADA":
      return "Aguardando retirada";
    case "CONCLUIDO":
      return "Concluída";
    default:
      return status;
  }
}

function formatarData(data?: string) {
  if (!data) return "Não informada";

  const date = new Date(data);
  return Number.isNaN(date.getTime()) ? data : date.toLocaleDateString("pt-BR");
}

export default function MinhasCandidaturas() {
  const navigate = useNavigate();

  const [candidaturas, setCandidaturas] = useState<Candidatura[]>([]);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const tipoUsuario = localStorage.getItem("tipoUsuario");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    if (tipoUsuario !== "ROLE_ADOTANTE") {
      navigate("/", { replace: true });
      return;
    }

    const buscarCandidaturas = async () => {
      try {
        const response = await apiService.get("/adocao/minhas");
        setCandidaturas(response.data);
      } catch (error) {
        console.error("Erro ao buscar candidaturas:", error);
        setErro("Não foi possível carregar suas candidaturas.");
      } finally {
        setCarregando(false);
      }
    };

    buscarCandidaturas();
  }, [navigate]);

  const entrarEmContato = (telefone: string, nomeAnimal: string) => {
    const apenasNumeros = telefone.replace(/\D/g, "");

    const numero =
      apenasNumeros.startsWith("55") && apenasNumeros.length >= 12
        ? apenasNumeros
        : `55${apenasNumeros}`;

    if (numero.length < 12 || numero.length > 13) {
      alert("O número de WhatsApp da ONG é inválido.");
      return;
    }

    const mensagem = encodeURIComponent(
      `Olá! Minha candidatura para adotar ${nomeAnimal} foi aprovada pelo AdotaPet. Gostaria de combinar a retirada do animal.`,
    );

    window.open(
      `https://wa.me/${numero}?text=${mensagem}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-9">
          <p className="text-sm font-semibold text-[#36c3ff] uppercase tracking-wider">
            Área do adotante
          </p>

          <h1 className="text-3xl font-bold text-slate-800 mt-1">
            Minhas Candidaturas
          </h1>

          <p className="text-slate-500 mt-2">
            Acompanhe suas solicitações de adoção.
          </p>
        </div>

        {carregando ? (
          <div className="text-center py-16 text-slate-500">
            Carregando candidaturas...
          </div>
        ) : erro ? (
          <div className="bg-white border border-red-200 rounded-2xl p-8 text-center text-red-600">
            {erro}
          </div>
        ) : candidaturas.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center flex flex-col items-center">
            <ClipboardList size={44} className="text-[#36c3ff] mb-4" />

            <h2 className="text-xl font-bold text-slate-800">
              Nenhuma candidatura encontrada
            </h2>

            <p className="text-slate-500 mt-2">
              Você ainda não enviou nenhuma solicitação de adoção.
            </p>

            <button
              type="button"
              onClick={() => navigate("/listaadotar")}
              className="mt-6 px-6 h-[40px] rounded-[20px] bg-[#36c3ff] text-white hover:bg-[#1ab0f0] transition-colors duration-200"
            >
              Encontrar um animal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {candidaturas.map((candidatura) => {
              const animal = candidatura.animal;
              const nomeAnimal = animal?.nome || "Animal";
              const imagem = obterFoto(animal?.fotos);
              const aprovada =
                candidatura.status === "APROVADO" ||
                candidatura.status === "AGUARDANDO_RETIRADA";

              return (
                <article
                  key={candidatura.id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col"
                >
                  <div className="p-5 flex gap-4 items-center">
                    <div className="w-24 h-24 shrink-0 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center">
                      {imagem ? (
                        <img
                          src={imagem}
                          alt={nomeAnimal}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <PawPrint size={30} className="text-slate-300" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-xl font-bold uppercase text-[#36c3ff]">
                        {nomeAnimal}
                      </h2>

                      <p className="text-sm text-slate-500 mt-1">
                        {animal?.nomeOng || "ONG responsável"}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                        <CalendarDays size={14} />
                        {formatarData(candidatura.dataResposta)}
                      </div>
                    </div>
                  </div>

                  <div className="px-5 pb-5 mt-auto">
                    <div
                      className={`rounded-xl p-4 ${
                        aprovada
                          ? "bg-green-50 text-green-800"
                          : candidatura.status === "REPROVADO"
                            ? "bg-red-50 text-red-700"
                            : "bg-amber-50 text-amber-800"
                      }`}
                    >
                      <span className="text-sm font-bold">
                        {formatarStatus(candidatura.status)}
                      </span>

                      <p className="text-sm mt-2 leading-relaxed">
                        {aprovada
                          ? "Parabéns! Sua candidatura foi aprovada. Entre em contato com a ONG para combinar a retirada."
                          : candidatura.status === "REPROVADO"
                            ? "Sua candidatura não foi aprovada pela ONG."
                            : candidatura.status === "CONCLUIDO"
                              ? "A adoção foi concluída. Desejamos muitas felicidades a vocês!"
                              : "Sua candidatura foi recebida e está aguardando a análise da ONG."}
                      </p>
                    </div>

                    {aprovada &&
                      (candidatura.telefoneOng ? (
                        <button
                          type="button"
                          onClick={() =>
                            entrarEmContato(
                              candidatura.telefoneOng!,
                              nomeAnimal,
                            )
                          }
                          className="w-full mt-4 h-[42px] flex items-center justify-center gap-2 rounded-[20px] bg-[#36c3ff] text-white text-sm font-semibold hover:bg-[#1ab0f0] transition-colors duration-200"
                        >
                          <MessageCircle size={18} />
                          Conversar com a ONG
                        </button>
                      ) : (
                        <p className="text-xs text-slate-500 mt-4 text-center">
                          Contato da ONG ainda não disponível.
                        </p>
                      ))}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
