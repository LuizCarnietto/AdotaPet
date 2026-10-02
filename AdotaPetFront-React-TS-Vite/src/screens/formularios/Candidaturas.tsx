import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronRight,
  ClipboardList,
  Mail,
  MapPin,
  Phone,
  User,
  X,
} from "lucide-react";

import { Header } from "../../components/Header";
import { apiService } from "../../services/ApiService";

interface Animal {
  id?: number;
  nome?: string;
  fotos?: string | string[];
}

interface RespostaPergunta {
  id?: number;
  pergunta?: string;
  textoPergunta?: string;
  resposta?: string;
  valor?: string;
}

interface Candidatura {
  id: number;

  animal?: Animal;
  animalId?: number;
  nomeAnimal?: string;

  nomeCompleto?: string;
  dataNascimento?: string;
  cpf?: string;
  estadoCivil?: string;
  profissao?: string;
  localTrabalho?: string;

  ddd?: string;
  telefone?: string;
  email?: string;

  cep?: string;
  cidade?: string;
  uf?: string;
  estado?: string;
  bairro?: string;
  complemento?: string;
  logradouro?: string;
  numero?: string;

  status?: string;
  dataResposta?: string;

  respostas?: RespostaPergunta[];
}

export default function Candidaturas() {
  const navigate = useNavigate();

  const [candidaturas, setCandidaturas] = useState<Candidatura[]>([]);
  const [selecionada, setSelecionada] = useState<Candidatura | null>(null);

  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);

  useEffect(() => {
    const tipoUsuario = localStorage.getItem("tipoUsuario");
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (tipoUsuario !== "ROLE_ONG") {
      navigate("/");
      return;
    }

    buscarCandidaturas();
  }, [navigate]);

  const buscarCandidaturas = async () => {
    try {
      setCarregando(true);

      const response = await apiService.get("/adocao/ong");

      setCandidaturas(response.data);
    } catch (error: any) {
      console.error("Erro ao buscar candidaturas:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("tipoUsuario");

        navigate("/login");
        return;
      }

      alert("Não foi possível carregar as candidaturas.");
    } finally {
      setCarregando(false);
    }
  };

  const alterarStatus = async (status: "APROVADO" | "REPROVADO") => {
    if (!selecionada) return;

    const mensagem =
      status === "APROVADO"
        ? "Deseja realmente aprovar esta adoção?"
        : "Deseja realmente reprovar esta candidatura?";

    if (!window.confirm(mensagem)) return;

    try {
      setProcessando(true);

      await apiService.patch(
        `/adocao/${selecionada.id}/status?status=${status}`,
      );

      setSelecionada((atual) =>
        atual
          ? {
              ...atual,
              status,
            }
          : null,
      );

      setCandidaturas((atuais) =>
        atuais.map((candidatura) =>
          candidatura.id === selecionada.id
            ? {
                ...candidatura,
                status,
              }
            : candidatura,
        ),
      );

      alert(
        status === "APROVADO"
          ? "Adoção aprovada com sucesso!"
          : "Candidatura reprovada.",
      );
    } catch (error: any) {
      console.error("Erro ao alterar status:", error);

      alert(
        error.response?.data?.message ||
          "Não foi possível atualizar a candidatura.",
      );
    } finally {
      setProcessando(false);
    }
  };

  const formatarStatus = (status?: string) => {
    switch (status) {
      case "EM_ANALISE":
        return "Em análise";

      case "AGUARDANDO_APROVACAO":
        return "Aguardando aprovação";

      case "APROVADO":
        return "Aprovado";

      case "REPROVADO":
        return "Reprovado";

      default:
        return status || "Não informado";
    }
  };

  const classeStatus = (status?: string) => {
    switch (status) {
      case "APROVADO":
        return "status status-aprovado";

      case "REPROVADO":
        return "status status-reprovado";

      default:
        return "status status-analise";
    }
  };

  const formatarData = (data?: string) => {
    if (!data) return "Não informado";

    const date = new Date(data);

    if (Number.isNaN(date.getTime())) {
      return data;
    }

    return date.toLocaleDateString("pt-BR");
  };

  const nomeDoAnimal = (candidatura: Candidatura) => {
    return (
      candidatura.animal?.nome ||
      candidatura.nomeAnimal ||
      `Animal #${candidatura.animalId ?? ""}`
    );
  };

  if (selecionada) {
    return (
      <div className="pagina-candidaturas">
        <Header />

        <main className="conteudo-candidaturas">
          <button
            type="button"
            className="botao-voltar"
            onClick={() => setSelecionada(null)}
          >
            <ArrowLeft size={18} />
            Voltar para candidaturas
          </button>

          <div className="titulo-area">
            <div>
              <span className="subtitulo">Formulário de adoção</span>

              <h1>{nomeDoAnimal(selecionada)}</h1>

              <p>
                Confira as informações fornecidas pelo candidato antes de tomar
                uma decisão.
              </p>
            </div>

            <span className={classeStatus(selecionada.status)}>
              {formatarStatus(selecionada.status)}
            </span>
          </div>

          <section className="formulario-card">
            <h2>
              <User size={21} />
              Dados pessoais
            </h2>

            <div className="grade-informacoes">
              <Campo titulo="Nome completo" valor={selecionada.nomeCompleto} />

              <Campo
                titulo="Data de nascimento"
                valor={formatarData(selecionada.dataNascimento)}
              />

              <Campo titulo="CPF" valor={selecionada.cpf} />

              <Campo titulo="Estado civil" valor={selecionada.estadoCivil} />

              <Campo titulo="Profissão" valor={selecionada.profissao} />

              <Campo
                titulo="Local de trabalho"
                valor={selecionada.localTrabalho}
              />
            </div>
          </section>

          <section className="formulario-card">
            <h2>
              <Phone size={21} />
              Contato
            </h2>

            <div className="grade-informacoes">
              <Campo
                titulo="Telefone"
                valor={
                  selecionada.telefone
                    ? `(${selecionada.ddd || ""}) ${selecionada.telefone}`
                    : undefined
                }
              />

              <Campo
                titulo="E-mail"
                valor={selecionada.email}
                icone={<Mail size={16} />}
              />
            </div>
          </section>

          <section className="formulario-card">
            <h2>
              <MapPin size={21} />
              Endereço
            </h2>

            <div className="grade-informacoes">
              <Campo titulo="CEP" valor={selecionada.cep} />

              <Campo titulo="Logradouro" valor={selecionada.logradouro} />

              <Campo titulo="Número" valor={selecionada.numero} />

              <Campo titulo="Bairro" valor={selecionada.bairro} />

              <Campo titulo="Cidade" valor={selecionada.cidade} />

              <Campo
                titulo="Estado"
                valor={
                  selecionada.estado
                    ? `${selecionada.estado}${
                        selecionada.uf ? ` - ${selecionada.uf}` : ""
                      }`
                    : selecionada.uf
                }
              />

              <Campo titulo="Complemento" valor={selecionada.complemento} />
            </div>
          </section>

          {selecionada.respostas && selecionada.respostas.length > 0 && (
            <section className="formulario-card">
              <h2>
                <ClipboardList size={21} />
                Questionário de adoção
              </h2>

              <div className="lista-respostas">
                {selecionada.respostas.map((item, index) => (
                  <div className="resposta" key={item.id ?? index}>
                    <span className="numero-pergunta">{index + 1}</span>

                    <div>
                      <strong>
                        {item.pergunta ||
                          item.textoPergunta ||
                          `Pergunta ${index + 1}`}
                      </strong>

                      <p>{item.resposta || item.valor || "Não respondido"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="rodape-formulario">
            <div className="data-envio">
              <CalendarDays size={17} />
              Enviado em {formatarData(selecionada.dataResposta)}
            </div>

            {selecionada.status === "EM_ANALISE" && (
              <div className="acoes">
                <button
                  type="button"
                  className="botao-reprovar"
                  disabled={processando}
                  onClick={() => alterarStatus("REPROVADO")}
                >
                  <X size={18} />
                  Reprovar
                </button>

                <button
                  type="button"
                  className="botao-aprovar"
                  disabled={processando}
                  onClick={() => alterarStatus("APROVADO")}
                >
                  <Check size={18} />

                  {processando ? "Processando..." : "Aprovar adoção"}
                </button>
              </div>
            )}
          </div>
        </main>

        <Estilos />
      </div>
    );
  }

  return (
    <div className="pagina-candidaturas">
      <Header />

      <main className="conteudo-candidaturas">
        <div className="titulo-area">
          <div>
            <span className="subtitulo">Processo de adoção</span>

            <h1>Candidaturas recebidas</h1>

            <p>Confira as pessoas interessadas em adotar os seus animais.</p>
          </div>
        </div>

        {carregando ? (
          <div className="estado-vazio">Carregando candidaturas...</div>
        ) : candidaturas.length === 0 ? (
          <div className="estado-vazio">
            <ClipboardList size={42} />

            <h2>Nenhuma candidatura recebida</h2>

            <p>
              Quando alguém preencher o formulário de adoção de um dos seus
              animais, ele aparecerá aqui.
            </p>
          </div>
        ) : (
          <div className="lista-candidaturas">
            {candidaturas.map((candidatura) => (
              <article className="candidatura-card" key={candidatura.id}>
                <div className="candidatura-principal">
                  <div className="icone-candidato">
                    <User size={23} />
                  </div>

                  <div className="dados-candidato">
                    <span className="animal-label">Candidatura para</span>

                    <h2 className="text-[#36c3ff] uppercase font-bold">
                        {nomeDoAnimal(candidatura)}
                    </h2>

                    <strong>{candidatura.nomeCompleto || "Candidato"}</strong>

                    <div className="data">
                      <CalendarDays size={15} />

                      {formatarData(candidatura.dataResposta)}
                    </div>
                  </div>
                </div>

                <div className="candidatura-acoes">
                  <span className={classeStatus(candidatura.status)}>
                    {formatarStatus(candidatura.status)}
                  </span>

                  <button
                    type="button"
                    className="botao-formulario"
                    onClick={() =>
                      navigate(`/formularios?solicitacaoId=${candidatura.id}`)
                    }
                  >
                    Ver formulário
                    <ChevronRight size={17} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Estilos />
    </div>
  );
}

interface CampoProps {
  titulo: string;
  valor?: string | null;
  icone?: React.ReactNode;
}

function Campo({ titulo, valor, icone }: CampoProps) {
  return (
    <div className="campo-informacao">
      <span>{titulo}</span>

      <p>
        {icone}
        {valor || "Não informado"}
      </p>
    </div>
  );
}

function Estilos() {
  return (
    <style>
      {`
        .pagina-candidaturas {
          min-height: 100vh;
          background: #f8fafc;
          font-family: "Inter", sans-serif;
        }

        .conteudo-candidaturas {
          width: min(1100px, calc(100% - 48px));
          margin: 0 auto;
          padding: 45px 0 80px;
        }

        .titulo-area {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 30px;
          margin-bottom: 35px;
        }

        .subtitulo {
          color: #36c3ff;
          font-size: 14px;
          font-weight: 600;
        }

        .titulo-area h1 {
          margin: 6px 0 8px;
          font-size: 32px;
          color: #151515;
        }

        .titulo-area p {
          margin: 0;
          color: #737373;
          font-size: 15px;
        }

        .lista-candidaturas {
          display: flex;
          flex-direction: column;
          gap: 17px;
        }

        .candidatura-card {
          background: white;
          border: 1px solid #edf0f2;
          border-radius: 20px;
          padding: 23px 26px;

          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .candidatura-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.07);
        }

        .candidatura-principal {
          display: flex;
          align-items: center;
          gap: 18px;
          min-width: 0;
        }

        .icone-candidato {
          width: 52px;
          height: 52px;
          flex-shrink: 0;

          border-radius: 50%;
          background: #eaf8ff;
          color: #36c3ff;

          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dados-candidato {
          min-width: 0;
        }

        .animal-label {
          font-size: 12px;
          color: #8b8b8b;
        }

        .dados-candidato h2 {
          margin: 2px 0 6px;
          font-size: 20px;
          color: #36c3ff;
          font-weight: 700;
        }

        .dados-candidato strong {
          font-size: 14px;
          color: #4a4a4a;
        }

        .data {
          margin-top: 7px;
          display: flex;
          align-items: center;
          gap: 6px;
          color: #999;
          font-size: 12px;
        }

        .candidatura-acoes {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-shrink: 0;
        }

        .status {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          min-width: 100px;

          padding: 7px 12px;
          border-radius: 20px;

          font-size: 12px;
          font-weight: 600;
        }

        .status-analise {
          color: #a66c00;
          background: #fff6d8;
        }

        .status-aprovado {
          color: #197447;
          background: #e4f8ed;
        }

        .status-reprovado {
          color: #bd3c3c;
          background: #fdeaea;
        }

        .botao-formulario {
          border: none;
          background: #36c3ff;
          color: white;

          height: 39px;

          padding: 0 18px;

          border-radius: 20px;

          display: flex;
          align-items: center;
          gap: 7px;

          cursor: pointer;

          font-family: "Inter", sans-serif;
          font-size: 13px;

          transition: background-color 0.2s ease;
        }

        .botao-formulario:hover {
          background: rgb(26, 176, 240);
        }

        .formulario-card {
          background: white;

          border-radius: 20px;
          border: 1px solid #edf0f2;

          padding: 28px;

          margin-bottom: 20px;
        }

        .formulario-card h2 {
          margin: 0 0 25px;

          display: flex;
          align-items: center;
          gap: 9px;

          font-size: 18px;
        }

        .formulario-card h2 svg {
          color: #36c3ff;
        }

        .grade-informacoes {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px 35px;
        }

        .campo-informacao span {
          display: block;
          margin-bottom: 7px;

          color: #969696;
          font-size: 12px;
        }

        .campo-informacao p {
          min-height: 20px;

          margin: 0;

          display: flex;
          align-items: center;
          gap: 7px;

          color: #313131;
          font-size: 14px;

          word-break: break-word;
        }

        .lista-respostas {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .resposta {
          display: flex;
          gap: 14px;

          padding: 17px;

          border-radius: 14px;
          background: #f8fafc;
        }

        .numero-pergunta {
          width: 28px;
          height: 28px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: #eaf8ff;
          color: #36c3ff;

          font-size: 12px;
          font-weight: 700;
        }

        .resposta strong {
          font-size: 13px;
          color: #333;
        }

        .resposta p {
          margin: 7px 0 0;
          color: #777;
          font-size: 13px;
          line-height: 1.5;
        }

        .rodape-formulario {
          margin-top: 30px;

          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 25px;
        }

        .data-envio {
          display: flex;
          align-items: center;
          gap: 7px;

          color: #8d8d8d;
          font-size: 13px;
        }

        .acoes {
          display: flex;
          gap: 12px;
        }

        .botao-aprovar,
        .botao-reprovar {
          min-width: 135px;
          height: 42px;

          border-radius: 21px;

          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;

          cursor: pointer;

          font-family: "Inter", sans-serif;
          font-size: 13px;

          transition:
            background-color 0.2s ease,
            color 0.2s ease;
        }

        .botao-aprovar {
          border: none;
          color: white;
          background: #36c3ff;
        }

        .botao-aprovar:hover {
          background: rgb(26, 176, 240);
        }

        .botao-reprovar {
          background: white;
          color: #e34c4c;
          border: 1px solid #e34c4c;
        }

        .botao-reprovar:hover {
          background: #fff1f1;
        }

        .botao-voltar {
          border: none;
          background: transparent;

          display: flex;
          align-items: center;
          gap: 7px;

          margin-bottom: 28px;

          padding: 0;

          cursor: pointer;

          color: #707070;

          font-family: "Inter", sans-serif;
          font-size: 13px;
        }

        .botao-voltar:hover {
          color: #36c3ff;
        }

        .estado-vazio {
          min-height: 330px;

          background: white;
          border-radius: 20px;
          border: 1px solid #edf0f2;

          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          text-align: center;

          color: #8e8e8e;

          padding: 35px;
        }

        .estado-vazio svg {
          color: #36c3ff;
          margin-bottom: 15px;
        }

        .estado-vazio h2 {
          color: #333;
          margin: 0 0 8px;
          font-size: 20px;
        }

        .estado-vazio p {
          max-width: 430px;
          line-height: 1.5;
        }


        @media (max-width: 800px) {
          .conteudo-candidaturas {
            width: min(100% - 30px, 650px);
            padding-top: 30px;
          }

          .titulo-area {
            flex-direction: column;
          }

          .titulo-area h1 {
            font-size: 27px;
          }

          .candidatura-card {
            align-items: flex-start;
            flex-direction: column;
          }

          .candidatura-acoes {
            width: 100%;
            justify-content: space-between;
          }

          .grade-informacoes {
            grid-template-columns: 1fr;
          }

          .rodape-formulario {
            flex-direction: column;
            align-items: stretch;
          }

          .acoes {
            width: 100%;
          }

          .botao-aprovar,
          .botao-reprovar {
            flex: 1;
          }
        }


        @media (max-width: 480px) {
          .conteudo-candidaturas {
            width: calc(100% - 24px);
          }

          .formulario-card {
            padding: 21px 18px;
          }

          .candidatura-card {
            padding: 20px 18px;
          }

          .candidatura-acoes {
            flex-direction: column;
            align-items: stretch;
          }

          .status {
            align-self: flex-start;
          }

          .botao-formulario {
            justify-content: center;
            width: 100%;
          }

          .acoes {
            flex-direction: column-reverse;
          }

          .botao-aprovar,
          .botao-reprovar {
            width: 100%;
          }
        }
      `}
    </style>
  );
}
