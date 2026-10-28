import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PawPrint,
  MapPin,
  Pencil,
  Share2,
  Phone,
  Mail,
  MapPinned,
  ExternalLink,
  HeartHandshake,
} from "lucide-react";
import { Header } from "@/components/Header";
import { apiService } from "@/services/ApiService";

type AbaAnimais = "DISPONIVEL" | "ADOTADO";

interface AnimalApi {
  id: number;
  nome?: string | null;
  especie?: string | null;
  porte?: string | null;
  comportamento?: string | null;
  historicoSaude?: string | null;
  fotos?: string | string[] | null;
  status?: string | null;
  cidade?: string | null;
  estadoSigla?: string | null;
}

interface AnimalPerfil {
  id: number;
  nome: string;
  especie: string;
  porte: string;
  localizacao: string;
  descricao: string;
  foto: string;
  status: string;
}

interface PerfilOngDados {
  nomeOng?: string | null;
  nome?: string | null;
  email?: string | null;
  telefone?: string | null;
  endereco?: string | null;
  fotoPerfil?: string | null;
  descricaoOng?: string | null;
}

function obterPrimeiraFoto(fotos: AnimalApi["fotos"]): string {
  if (Array.isArray(fotos)) {
    return typeof fotos[0] === "string" ? fotos[0] : "";
  }

  if (typeof fotos !== "string" || !fotos.trim()) {
    return "";
  }

  const valor = fotos.trim();

  try {
    const parseado: unknown = JSON.parse(valor);

    if (Array.isArray(parseado)) {
      return typeof parseado[0] === "string" ? parseado[0] : "";
    }

    if (typeof parseado === "string") {
      return parseado;
    }
  } catch {
    // O backend também pode devolver uma URL diretamente.
  }

  return valor;
}

function formatarEnum(valor?: string | null): string {
  if (!valor) return "Não informado";

  const texto = valor.toLocaleLowerCase("pt-BR").replace(/_/g, " ");

  return texto.charAt(0).toLocaleUpperCase("pt-BR") + texto.slice(1);
}

function mapearAnimal(animal: AnimalApi): AnimalPerfil {
  const localizacao = [animal.cidade, animal.estadoSigla]
    .filter(Boolean)
    .join(" - ");

  return {
    id: animal.id,
    nome: animal.nome?.trim() || "Animal sem nome",
    especie: formatarEnum(animal.especie),
    porte: formatarEnum(animal.porte),
    localizacao: localizacao || "Localização não informada",
    descricao:
      animal.comportamento?.trim() ||
      animal.historicoSaude?.trim() ||
      "Acesse os detalhes para conhecer melhor este animal.",
    foto: obterPrimeiraFoto(animal.fotos),
    status: (animal.status || "").toUpperCase(),
  };
}

export default function PerfilOng() {
  const navigate = useNavigate();

  const [abaAtiva, setAbaAtiva] =
    useState<AbaAnimais>("DISPONIVEL");

  const [animais, setAnimais] = useState<AnimalPerfil[]>([]);
  const [perfil, setPerfil] = useState<PerfilOngDados | null>(null);

  const [carregandoAnimais, setCarregandoAnimais] = useState(true);
  const [carregandoPerfil, setCarregandoPerfil] = useState(true);

  const [erroAnimais, setErroAnimais] = useState("");
  const [erroPerfil, setErroPerfil] = useState("");

  const nomeOng =
    perfil?.nomeOng?.trim() ||
    perfil?.nome?.trim() ||
    "Perfil da ONG";

  const descricaoOng =
    perfil?.descricaoOng?.trim() ||
    "Esta ONG ainda não adicionou uma descrição ao perfil.";

  useEffect(() => {
    let cancelado = false;

    async function carregarAnimais() {
      setCarregandoAnimais(true);
      setErroAnimais("");

      try {
        const response = await apiService.get("/animal/ong");
        const dados: unknown = response.data;

        const lista = Array.isArray(dados)
          ? dados
          : dados &&
              typeof dados === "object" &&
              "content" in dados &&
              Array.isArray(dados.content)
            ? dados.content
            : [];

        if (!cancelado) {
          setAnimais((lista as AnimalApi[]).map(mapearAnimal));
        }
      } catch (error) {
        console.error("Erro ao carregar animais da ONG:", error);

        if (!cancelado) {
          setErroAnimais(
            "Não foi possível carregar os animais. Verifique se você está conectado como ONG e tente novamente.",
          );
        }
      } finally {
        if (!cancelado) {
          setCarregandoAnimais(false);
        }
      }
    }

    async function carregarPerfil() {
      setCarregandoPerfil(true);
      setErroPerfil("");

      try {
        const response = await apiService.get("/usuario/perfil");

        if (!cancelado) {
          setPerfil(response.data as PerfilOngDados);
        }
      } catch (error) {
        console.error("Erro ao carregar perfil da ONG:", error);

        if (!cancelado) {
          setErroPerfil(
            "Não foi possível carregar os dados do perfil. Confira se o endpoint GET /usuario/perfil foi adicionado ao backend.",
          );
        }
      } finally {
        if (!cancelado) {
          setCarregandoPerfil(false);
        }
      }
    }

    void carregarAnimais();
    void carregarPerfil();

    return () => {
      cancelado = true;
    };
  }, []);

  const animaisFiltrados = useMemo(
    () => animais.filter((animal) => animal.status === abaAtiva),
    [animais, abaAtiva],
  );

  const totalDisponiveis = animais.filter(
    (animal) => animal.status === "DISPONIVEL",
  ).length;

  const totalAdotados = animais.filter(
    (animal) => animal.status === "ADOTADO",
  ).length;

  const contatos = [
    {
      titulo: "Telefone & WhatsApp",
      valor: perfil?.telefone?.trim() || "Não informado",
      Icone: Phone,
    },
    {
      titulo: "E-mail institucional",
      valor: perfil?.email?.trim() || "Não informado",
      Icone: Mail,
    },
    {
      titulo: "Endereço",
      valor: perfil?.endereco?.trim() || "Não informado",
      Icone: MapPinned,
    },
  ];

  const telefoneWhatsApp = (perfil?.telefone || "").replace(/\D/g, "");

  const numeroWhatsApp = telefoneWhatsApp
    ? telefoneWhatsApp.startsWith("55")
      ? telefoneWhatsApp
      : `55${telefoneWhatsApp}`
    : "";

  const compartilhar = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${nomeOng} | Adota Pet`,
          text: descricaoOng,
          url: window.location.href,
        });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(window.location.href);
        window.alert("Link do perfil copiado para compartilhar!");
      } else {
        window.prompt(
          "Copie o link para compartilhar:",
          window.location.href,
        );
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        window.alert("Não foi possível compartilhar o link neste momento.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#222]">
      <Header />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        {erroPerfil && (
          <div
            role="alert"
            className="rounded-[20px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
          >
            {erroPerfil}
          </div>
        )}

        {/* Perfil da ONG */}
        <section className="relative overflow-hidden rounded-[20px] border border-gray-100 bg-white p-6 shadow-sm sm:p-10">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#36c3ff]/10 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row md:items-start">
            <div className="shrink-0 rounded-full bg-gradient-to-br from-[#36c3ff] to-[#178fc4] p-1 shadow-sm">
              <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-white p-1 sm:h-40 sm:w-40">
                {perfil?.fotoPerfil ? (
                  <img
                    alt={`Logo de ${nomeOng}`}
                    className="h-full w-full rounded-full object-cover"
                    src={perfil.fotoPerfil}
                  />
                ) : (
                  <PawPrint
                    className="h-16 w-16 text-[#36c3ff]"
                    aria-hidden="true"
                  />
                )}
              </div>
            </div>

            <div className="w-full min-w-0 flex-1 space-y-5 text-center md:text-left">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-[#222] sm:text-3xl">
                    {carregandoPerfil
                      ? "Carregando perfil..."
                      : nomeOng}
                  </h1>

                  <p className="mt-1 text-sm font-medium text-gray-500">
                    {perfil?.endereco?.trim() ||
                      "Endereço não informado"}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2.5 md:justify-start">
                  <button
                    type="button"
                    onClick={() => navigate("/perfil")}
                    className="inline-flex items-center gap-2 rounded-[20px] border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-200 hover:border-[#36c3ff] hover:bg-[#EAF8FF] hover:text-[#168fc5] active:scale-[0.98]"
                  >
                    <Pencil className="h-4 w-4" />
                    Editar perfil
                  </button>

                  <button
                    type="button"
                    title="Compartilhar perfil"
                    aria-label="Compartilhar perfil da ONG"
                    onClick={compartilhar}
                    className="inline-flex h-[42px] w-[46px] items-center justify-center rounded-[20px] border border-gray-200 bg-white text-gray-700 transition-all duration-200 hover:border-[#36c3ff] hover:bg-[#EAF8FF] hover:text-[#168fc5] active:scale-[0.98]"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="max-w-3xl space-y-2 text-sm leading-relaxed text-gray-700">
                <p className="whitespace-pre-line">{descricaoOng}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Animais cadastrados no backend */}
        <section>
          <div className="mb-6 flex justify-center border-b border-gray-200">
            <div className="flex max-w-full gap-2 overflow-x-auto sm:gap-6">
              <button
                type="button"
                onClick={() => setAbaAtiva("DISPONIVEL")}
                className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-4 text-sm transition-colors duration-200 sm:px-4 ${
                  abaAtiva === "DISPONIVEL"
                    ? "border-[#36c3ff] font-bold text-[#168fc5]"
                    : "border-transparent font-medium text-gray-500 hover:text-[#168fc5]"
                }`}
              >
                <PawPrint className="h-5 w-5" />
                Animais disponíveis

                <span className="rounded-full bg-[#EAF8FF] px-2 py-0.5 text-xs font-bold text-[#168fc5]">
                  {totalDisponiveis}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setAbaAtiva("ADOTADO")}
                className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-4 text-sm transition-colors duration-200 sm:px-4 ${
                  abaAtiva === "ADOTADO"
                    ? "border-[#36c3ff] font-bold text-[#168fc5]"
                    : "border-transparent font-medium text-gray-500 hover:text-[#168fc5]"
                }`}
              >
                <HeartHandshake className="h-5 w-5" />
                Animais adotados

                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">
                  {totalAdotados}
                </span>
              </button>
            </div>
          </div>

          {carregandoAnimais ? (
            <div className="flex min-h-64 items-center justify-center rounded-[20px] border border-gray-100 bg-white px-6 py-12 text-sm text-gray-500">
              Carregando animais cadastrados...
            </div>
          ) : erroAnimais ? (
            <div
              role="alert"
              className="rounded-[20px] border border-red-200 bg-red-50 px-6 py-8 text-center text-sm text-red-700"
            >
              {erroAnimais}
            </div>
          ) : animaisFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {animaisFiltrados.map((animal) => (
                <Link
                  key={animal.id}
                  to={`/listaadotar/DetalhesAnimal/${animal.id}`}
                  className="block h-full rounded-[20px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#36c3ff]"
                >
                  <article className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      {animal.foto ? (
                        <img
                          alt={`${animal.especie} ${animal.nome}`}
                          src={animal.foto}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                          <PawPrint className="h-14 w-14" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col gap-4 p-5">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <h2 className="text-xl font-bold uppercase text-[#36c3ff] transition-colors duration-200 group-hover:text-[#168fc5]">
                            {animal.nome}
                          </h2>

                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                            Porte {animal.porte}
                          </span>
                        </div>

                        <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                          <MapPin className="h-4 w-4 shrink-0 text-[#36c3ff]" />
                          <span>{animal.localizacao}</span>
                        </p>

                        <p className="mt-3 text-sm leading-relaxed text-gray-600">
                          {animal.descricao}
                        </p>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-[20px] border border-gray-100 bg-white px-6 py-12 text-center">
              <PawPrint className="mb-3 h-10 w-10 text-[#36c3ff]" />

              <h3 className="text-lg font-bold text-gray-800">
                Nenhum animal nesta categoria
              </h3>

              <p className="mt-2 max-w-md text-sm text-gray-500">
                Quando houver animais cadastrados com este status, eles aparecerão aqui.
              </p>
            </div>
          )}
        </section>

        {/* Contatos oficiais */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-[20px] border border-gray-100 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF8FF] text-[#168fc5]">
                <Phone className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Contatos oficiais
                </h2>

                <p className="text-xs text-gray-500">
                  Dados informados no cadastro da ONG
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {contatos.map(({ titulo, valor, Icone }) => (
                <div
                  key={titulo}
                  className="flex items-start gap-3 rounded-[20px] border border-gray-100 bg-[#F8FAFC] p-4 transition-colors duration-200 hover:border-[#bceaff] hover:bg-[#EAF8FF]"
                >
                  <Icone className="mt-0.5 h-5 w-5 shrink-0 text-[#168fc5]" />

                  <div className="min-w-0">
                    <span className="block text-xs font-medium text-gray-500">
                      {titulo}
                    </span>

                    <p className="mt-1 break-words text-sm font-semibold text-gray-800">
                      {valor}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[20px] border border-gray-100 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF8FF] text-[#168fc5]">
                <ExternalLink className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Fale com a ONG
                </h2>

                <p className="text-xs text-gray-500">
                  Use os contatos reais cadastrados no perfil
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {perfil?.email && (
                <a
                  href={`mailto:${perfil.email}`}
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[20px] border border-gray-200 bg-[#F8FAFC] px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-[#bceaff] hover:bg-[#EAF8FF] hover:text-[#168fc5]"
                >
                  <Mail className="h-4 w-4" />
                  Enviar e-mail
                </a>
              )}

              {numeroWhatsApp && (
                <a
                  href={`https://wa.me/${numeroWhatsApp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[20px] border border-[#36c3ff] bg-[#36c3ff] px-4 py-3 text-sm font-semibold text-white transition-colors hover:border-[#168fc5] hover:bg-[#168fc5]"
                >
                  <Phone className="h-4 w-4" />
                  Conversar pelo WhatsApp
                </a>
              )}

              {!perfil?.email && !numeroWhatsApp && (
                <p className="rounded-[20px] bg-[#F8FAFC] p-4 text-sm text-gray-500">
                  A ONG ainda não cadastrou um e-mail ou telefone para contato.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Banner de apoio */}
        <section className="flex flex-col items-center justify-between gap-6 overflow-hidden rounded-[20px] bg-gradient-to-r from-[#168fc5] to-[#36c3ff] p-8 text-white shadow-sm sm:p-10 md:flex-row">
          <div className="max-w-xl text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-white/80">
              Transparência & cuidado
            </span>

            <h2 className="mt-2 text-2xl font-bold">
              Apoie o trabalho da {nomeOng}
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-white/90">
              Entre em contato para saber como ajudar a ONG nos cuidados e na adoção responsável dos animais.
            </p>
          </div>

          {numeroWhatsApp && (
            <a
              href={`https://wa.me/${numeroWhatsApp}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[46px] shrink-0 items-center justify-center gap-2 rounded-[20px] border border-white bg-white px-6 py-3 text-sm font-bold text-[#168fc5] transition-all duration-200 hover:bg-[#EAF8FF] active:scale-[0.98]"
            >
              <HeartHandshake className="h-5 w-5" />
              Apoiar a ONG
            </a>
          )}
        </section>
      </main>

      <footer className="mt-8 border-t border-gray-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-5 px-6 py-8 text-center sm:flex-row sm:text-left">
          <div>
            <span className="text-lg font-bold text-[#168fc5]">
              Adota Pet
            </span>

            <p className="mt-1 text-xs text-gray-500">
              © 2026 Adota Pet
              {nomeOng !== "Perfil da ONG" ? ` • ${nomeOng}` : ""}. Todos os direitos reservados.
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-3 text-xs font-medium text-gray-500">
            <Link
              to="/termos"
              className="transition-colors duration-200 hover:text-[#168fc5]"
            >
              Termos de adoção
            </Link>

            <Link
              to="/privacidade"
              className="transition-colors duration-200 hover:text-[#168fc5]"
            >
              Política de privacidade
            </Link>

            <Link
              to="/"
              className="transition-colors duration-200 hover:text-[#168fc5]"
            >
              Início
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}