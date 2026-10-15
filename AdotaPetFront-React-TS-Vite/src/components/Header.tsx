import { useState, useEffect } from "react";
import { User, PawPrint, ClipboardList, LogOut, Bell } from "lucide-react";
import { Button } from "./ui/button";
import { apiService } from "../services/ApiService";

interface HeaderProps {
  mostrarRegistrarAnimal?: boolean;
  corFundo?: string;
  logoSrc?: string;
  homeComoAdotar?: boolean;
}

interface Notificacao {
  id: number;
  titulo: string;
  mensagem: string;
  candidaturaId: number | null;
  lida: boolean;
  dataCriacao: string;
}

export const Header = ({
  mostrarRegistrarAnimal = true,
  corFundo = "#F8FAFC",
  logoSrc = "/imagens/logoMelhor.png",
  homeComoAdotar = false,
}: HeaderProps): JSX.Element => {
  const tipoUsuario = localStorage.getItem("tipoUsuario");
  const token = localStorage.getItem("token");
  const estaLogado = !!token;
  const headerAzul = corFundo === "rgb(54, 195, 255)";

  const [menuAberto, setMenuAberto] = useState(false);
  const [notificacoesAbertas, setNotificacoesAbertas] = useState(false);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);

  const quantidadeNaoLidas = notificacoes.filter(
    (notificacao) => !notificacao.lida,
  ).length;

  useEffect(() => {
    if (!estaLogado) return;

    let ativo = true;

    const buscarNotificacoes = async () => {
      try {
        const response = await apiService.get<Notificacao[]>("/notificacoes");

        if (ativo) {
          setNotificacoes(response.data);
        }
      } catch (error) {
        console.error("Erro ao buscar notificações:", error);
      }
    };

    buscarNotificacoes();

    const intervalo = window.setInterval(buscarNotificacoes, 30000);

    return () => {
      ativo = false;
      window.clearInterval(intervalo);
    };
  }, [estaLogado]);

  const marcarTodasComoLidas = async () => {
    try {
      await apiService.patch("/notificacoes/ler-todas");

      setNotificacoes((atuais) =>
        atuais.map((notificacao) => ({
          ...notificacao,
          lida: true,
        })),
      );
    } catch (error) {
      console.error("Erro ao marcar notificações como lidas:", error);
    }
  };

  const abrirNotificacao = async (notificacao: Notificacao) => {
    try {
      if (!notificacao.lida) {
        await apiService.patch(`/notificacoes/${notificacao.id}/ler`);
      }

      const destino =
        tipoUsuario === "ROLE_ONG" ? "/candidaturas" : "/minhas-candidaturas";

      window.location.href = destino;
    } catch (error) {
      console.error("Erro ao abrir notificação:", error);
    }
  };

  const sair = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tipoUsuario");

    window.location.href = "/login";
  };

  return (
    <header
      className="w-full px-8 py-4 md:px-12"
      style={{ backgroundColor: corFundo }}
    >
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-10">
          <a href="/" className="hover:opacity-70 transition-opacity">
            <img
              src={logoSrc}
              alt="Logo"
              className="w-20 h-[70px] object-contain"
            />
          </a>

          <div className="hidden md:flex gap-8">
            <a
              href={homeComoAdotar ? "/listaadotar" : "/"}
              className="text-black hover:underline"
              style={{ fontFamily: '"Courier New", Courier, monospace' }}
            >
              {homeComoAdotar ? "Adotar" : "Home"}
            </a>

            <a
              href="/"
              className="text-black hover:underline"
              style={{ fontFamily: '"Courier New", Courier, monospace' }}
            >
              Sobre
            </a>

            <a
              href="/#faq"
              className="text-black hover:underline"
              style={{ fontFamily: '"Courier New", Courier, monospace' }}
            >
              F.A.Q
            </a>
          </div>
        </div>

        <div className="flex items-center gap-8">
          {!estaLogado ? (
            <a
              href="/login"
              className={`
                transition-colors
                duration-200
                ease-in-out
                font-light
                rounded-[20px]
                text-[14px]
                w-[80px]
                h-[35px]
                flex
                items-center
                justify-center

                ${
                  headerAzul
                    ? "bg-white text-[#36c3ff] hover:bg-gray-100"
                    : "bg-[#36c3ff] text-white hover:bg-[rgb(26,176,240)]"
                }
              `}
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              Log in
            </a>
          ) : (
            <>
              {tipoUsuario === "ROLE_ONG" && mostrarRegistrarAnimal && (
                <a
                  href="/cadastros/RegistroAnimal"
                  className={`
                    transition-colors
                    font-light
                    rounded-[20px]
                    text-[14px]
                    w-[140px]
                    h-[35px]
                    flex
                    items-center
                    justify-center

                    ${
                      headerAzul
                        ? "bg-white text-[#36c3ff] hover:bg-gray-100"
                        : "bg-[#36c3ff] text-white hover:bg-[rgb(26,176,240)]"
                    }
                  `}
                  style={{ fontFamily: '"Inter", sans-serif' }}
                >
                  Registrar animal
                </a>
              )}

              {/* Botão de notificações */}
              <div className="relative">
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full relative"
                  aria-label="Notificações"
                  aria-expanded={notificacoesAbertas}
                  onClick={() => {
                    setNotificacoesAbertas((atual) => !atual);
                    setMenuAberto(false);
                  }}
                >
                  <Bell className="h-5 w-5" />

                  {/* Indicador de notificações não lidas (temporário) */}
                  {quantidadeNaoLidas > 0 && (
                    <span
                      className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1
                        rounded-full bg-red-500
                        text-white text-[10px] font-bold
                        flex items-center justify-center"
                    >
                      {quantidadeNaoLidas > 9 ? "9+" : quantidadeNaoLidas}
                    </span>
                  )}
                </Button>

                <div
                  className={`
                      absolute
                      right-0
                      top-12
                      w-[320px]
                      max-w-[calc(100vw-32px)]
                      bg-white
                      rounded-2xl
                      shadow-xl
                      border
                      border-gray-100
                      z-50
                      overflow-hidden
                      origin-top-right
                      transition-all
                      duration-200
                      ease-out

                      ${
                        notificacoesAbertas
                          ? "opacity-100 translate-y-0 scale-100"
                          : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
                      }
                    `}
                >
                  <>
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-gray-800 text-[15px]">
                        Notificações
                      </h3>

                      {quantidadeNaoLidas > 0 && (
                        <button
                          type="button"
                          onClick={marcarTodasComoLidas}
                          className="text-[#36c3ff] text-xs font-medium hover:underline"
                        >
                          Marcar todas como lidas
                        </button>
                      )}
                    </div>

                    {notificacoes.length === 0 ? (
                      <div className="px-5 py-9 flex flex-col items-center text-center">
                        <Bell className="w-9 h-9 text-gray-300 mb-3" />

                        <p className="font-medium text-gray-700 text-sm">
                          Nenhuma notificação por enquanto
                        </p>

                        <p className="text-gray-400 text-xs mt-2">
                          As novidades sobre suas adoções aparecerão aqui.
                        </p>
                      </div>
                    ) : (
                      <div className="max-h-[350px] overflow-y-auto">
                        {notificacoes.map((notificacao) => (
                          <button
                            key={notificacao.id}
                            type="button"
                            onClick={() => abrirNotificacao(notificacao)}
                            className={`
                              w-full text-left px-5 py-4
                              border-b border-gray-100
                              hover:bg-[#EAF8FF]
                              transition-colors duration-200
                              ${!notificacao.lida ? "bg-[#F0FAFF]" : "bg-white"}
                            `}
                          >
                            <div className="flex items-start gap-3">
                              <Bell className="w-4 h-4 text-[#36c3ff] mt-1 shrink-0" />

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-[13px] font-semibold text-gray-800">
                                    {notificacao.titulo}
                                  </p>

                                  {!notificacao.lida && (
                                    <span className="w-2 h-2 bg-[#36c3ff] rounded-full shrink-0" />
                                  )}
                                </div>

                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                  {notificacao.mensagem}
                                </p>

                                <p className="text-[11px] text-gray-400 mt-2">
                                  {new Date(
                                    notificacao.dataCriacao,
                                  ).toLocaleString("pt-BR")}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                </div>
              </div>
              <div className="relative">
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                  onClick={() => {
                    setMenuAberto((atual) => !atual);
                    setNotificacoesAbertas(false);
                  }}
                >
                  <User className="h-5 w-5" />
                </Button>

                <div
                  className={`
                    absolute
                    right-0
                    top-12
                    w-[240px]
                    bg-white
                    rounded-2xl
                    shadow-xl
                    border
                    border-gray-100
                    p-2
                    z-50
                    origin-top-right
                    transition-all
                    duration-200
                    ease-out

          ${
            menuAberto
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
          }
        `}
                >
                  <a
                    href="/perfil"
                    className="
                      flex
                      items-center
                      gap-3
                      px-4
                      py-3
                      rounded-xl
                      text-gray-700
                      hover:bg-[#EAF8FF]
                      hover:text-[#36c3ff]
                      transition-colors
                    "
                  >
                    <User className="w-4 h-4" />
                    Meu perfil
                  </a>

                  {tipoUsuario === "ROLE_ADOTANTE" && (
                    <a
                      href="/minhas-candidaturas"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-[#EAF8FF] hover:text-[#36c3ff] transition-colors duration-200"
                    >
                      <ClipboardList className="w-4 h-4" />
                      Minhas candidaturas
                    </a>
                  )}

                  {tipoUsuario === "ROLE_ONG" && (
                    <>
                      <a
                        href="/cadastros/AnimaisCadastrados"
                        className="
                          flex
                          items-center
                          gap-3
                          px-4
                          py-3
                          rounded-xl
                          text-gray-700
                          hover:bg-[#EAF8FF]
                          hover:text-[#36c3ff]
                          transition-colors
                        "
                      >
                        <PawPrint className="w-4 h-4" />
                        Animais cadastrados
                      </a>

                      <a
                        href="/candidaturas"
                        className="
                          flex
                          items-center
                          gap-3
                          px-4
                          py-3
                          rounded-xl
                          text-gray-700
                          hover:bg-[#EAF8FF]
                          hover:text-[#36c3ff]
                          transition-colors
                        "
                      >
                        <ClipboardList className="w-4 h-4" />
                        Candidaturas
                      </a>
                    </>
                  )}

                  <div className="h-px bg-gray-100 my-2" />

                  <button
                    type="button"
                    onClick={sair}
                    className="
                      w-full
                      flex
                      items-center
                      gap-3
                      px-4
                      py-3
                      rounded-xl
                     text-red-500
                     hover:bg-red-50
                      transition-colors
                              "
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
