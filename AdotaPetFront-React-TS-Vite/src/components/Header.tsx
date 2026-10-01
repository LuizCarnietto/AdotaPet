import { useState } from "react";
import { User, PawPrint, ClipboardList, LogOut } from "lucide-react";
import { Button } from "./ui/button";

interface HeaderProps {
  mostrarRegistrarAnimal?: boolean;
  corFundo?: string;
  logoSrc?: string;
  homeComoAdotar?: boolean;
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
          <a href="/" className="hover:opacity-80 transition-opacity">
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

              <div className="relative">
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setMenuAberto((valorAtual) => !valorAtual)}
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
