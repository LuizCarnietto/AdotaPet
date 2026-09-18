import { useEffect, useState, ChangeEvent, ReactNode } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiService } from "@/services/ApiService";
import axios from "axios";

interface AnimalInfo {
  id: number;
  nome: string;
  imagem: string;
  sexo: string;
  idade: string;
  porte: string;
  localizacao: string;
  nomeOng: string;
}

interface FormularioState {
  nome: string;
  nascimento: string;
  cpf: string;
  estadoCivil: string;
  profissao: string;
  trabalho: string;

  ddd: string;
  telefone: string;
  email: string;

  cep: string;
  cidade: string;
  uf: string;
  estado: string;
  bairro: string;
  complemento: string;
  logradouro: string;
  numero: string;

  respostas: string[];
}

interface InputProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  className?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

interface TextareaProps {
  label: string;
  id: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  id: string;
  options: SelectOption[];
  value?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

interface SectionTitleProps {
  children: ReactNode;
}

interface Estado {
  id: number;
  sigla: string;
  nome: string;
}

interface Cidade {
  id: number;
  nome: string;
}

interface RespostaAdocao {
  perguntaId: number;
  pergunta: string;
  resposta: string;
}

const questionario: string[] = [
  "Você já teve animais de estimação antes?",
  "Atualmente possui outros animais? Se sim, quantos e quais espécies?",
  "Os animais que você possui são castrados e vacinados?",
  "Você mora em casa, apartamento ou chácara/sítio?",
  "O imóvel é próprio ou alugado?",
  "Caso seja alugado, o proprietário permite animais?",
  "A residência possui áreas seguras para o animal (telas, muros, portões)?",
  "Onde o animal ficará durante o dia?",
  "E durante a noite?",
  "Quanto tempo o animal ficará sozinho por dia?",
  "Tem crianças pequenas na casa? Se sim, quais idades?",
  "Todos os membros da família estão de acordo com a adoção?",
  "Em caso de mudança, o que pretende fazer com o animal?",
  "Está ciente de que o animal precisa ser castrado, vacinado e receber cuidados veterinários regulares?",
  "Está disposto(a) a permitir uma visita pré e/ou pós-adoção da ONG?",
];

const formularioInicial: FormularioState = {
  nome: "",
  nascimento: "",
  cpf: "",
  estadoCivil: "",
  profissao: "",
  trabalho: "",

  ddd: "",
  telefone: "",
  email: "",

  cep: "",
  cidade: "",
  uf: "",
  estado: "",
  bairro: "",
  complemento: "",
  logradouro: "",
  numero: "",

  respostas: Array(questionario.length).fill(""),
};

const obterFotos = (fotos: string | string[] | null | undefined): string[] => {
  if (!fotos) {
    return [];
  }

  if (Array.isArray(fotos)) {
    return fotos;
  }

  try {
    const fotosParseadas = JSON.parse(fotos);

    if (Array.isArray(fotosParseadas)) {
      return fotosParseadas;
    }
  } catch {
    return [fotos];
  }

  return [];
};

const formatarSexo = (sexo?: string) => {
  if (sexo === "MACHO") return "Macho";
  if (sexo === "FEMEA") return "Fêmea";

  return sexo || "Não informado";
};

const formatarIdade = (idade?: string) => {
  if (idade === "FILHOTE") return "Filhote";
  if (idade === "ADULTO") return "Adulto";
  if (idade === "IDOSO") return "Idoso";

  return idade || "Não informado";
};

const formatarPorte = (porte?: string) => {
  if (porte === "PEQUENO") return "Pequeno";
  if (porte === "MEDIO") return "Médio";
  if (porte === "GRANDE") return "Grande";

  return porte || "Não informado";
};

function Input({
  label,
  id,
  type = "text",
  placeholder,
  className = "",
  value = "",
  disabled = false,
  onChange,
}: InputProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label
        htmlFor={id}
        className="text-xs font-semibold text-slate-500 uppercase tracking-wide"
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition"
      />
    </div>
  );
}

function Textarea({
  label,
  id,
  placeholder,
  value = "",
  disabled = false,
  onChange,
}: TextareaProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-xs font-semibold text-slate-500 uppercase tracking-wide"
      >
        {label}
      </label>

      <textarea
        id={id}
        rows={2}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition resize-none"
      />
    </div>
  );
}

function Select({
  label,
  id,
  options,
  value = "",
  disabled = false,
  onChange,
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-xs font-semibold text-slate-500 uppercase tracking-wide"
      >
        {label}
      </label>

      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition"
      >
        <option value="">Selecione...</option>

        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function SectionTitle({ children }: SectionTitleProps) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="text-base font-bold text-slate-700">{children}</span>

      <div className="flex-1 h-px bg-slate-200" />
    </div>
  );
}

const somenteNumeros = (valor: string) => {
  return valor.replace(/\D/g, "");
};

const formatarCPF = (valor: string) => {
  const numeros = somenteNumeros(valor).slice(0, 11);

  return numeros
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
};

const formatarCNPJ = (valor: string) => {
  const numeros = somenteNumeros(valor).slice(0, 14);

  return numeros
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
};

const formatarCEP = (valor: string) => {
  const numeros = somenteNumeros(valor).slice(0, 8);

  return numeros.replace(/^(\d{5})(\d)/, "$1-$2");
};

const formatarData = (valor: string) => {
  const numeros = somenteNumeros(valor).slice(0, 8);

  if (numeros.length <= 2) {
    return numeros;
  }

  if (numeros.length <= 4) {
    return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
  }

  return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
};

const formatarTelefone = (valor: string) => {
  const numeros = somenteNumeros(valor).slice(0, 9);

  if (numeros.length <= 4) {
    return numeros;
  }

  if (numeros.length <= 8) {
    return `${numeros.slice(0, 4)}-${numeros.slice(4)}`;
  }

  return `${numeros.slice(0, 5)}-${numeros.slice(5)}`;
};

const formatarDDD = (valor: string) => {
  return somenteNumeros(valor).slice(0, 2);
};

export default function FormularioAdocao() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const animalId = searchParams.get("animalId");
  const solicitacaoId = searchParams.get("solicitacaoId");

  const tipoUsuario = localStorage.getItem("tipoUsuario");
  const token = localStorage.getItem("token");

  const isOng = tipoUsuario === "ROLE_ONG";
  const isAdotante = tipoUsuario === "ROLE_ADOTANTE";

  const [aceito, setAceito] = useState<boolean>(false);

  const [animalInfo, setAnimalInfo] = useState<AnimalInfo | null>(null);

  const [formulario, setFormulario] =
    useState<FormularioState>(formularioInicial);

  const [estados, setEstados] = useState<Estado[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [estadoId, setEstadoId] = useState<number | null>(null);

  const alterarCampo = (
    campo: keyof Omit<FormularioState, "respostas">,
    valor: string,
  ) => {
    setFormulario((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const alterarResposta = (index: number, valor: string) => {
    setFormulario((prev) => {
      const respostas = [...prev.respostas];

      respostas[index] = valor;

      return {
        ...prev,
        respostas,
      };
    });
  };

  useEffect(() => {
    if (!token || !tipoUsuario) {
      navigate("/login");
      return;
    }

    if (!isAdotante && !isOng) {
      navigate("/");
    }
  }, [token, tipoUsuario, isAdotante, isOng, navigate]);

  useEffect(() => {
    if (!animalId || !isAdotante) {
      return;
    }

    const buscarAnimal = async () => {
      try {
        const response = await apiService.get(`/animal/${animalId}`);

        const animal = response.data;
        const fotos = obterFotos(animal.fotos);

        setAnimalInfo({
          id: animal.id,
          nome: animal.nome,
          imagem: fotos[0] || "",
          sexo: formatarSexo(animal.sexo),
          idade: formatarIdade(animal.idade),
          porte: formatarPorte(animal.porte),
          localizacao:
            animal.cidade && animal.estadoSigla
              ? `${animal.cidade} – ${animal.estadoSigla}`
              : animal.cidade || "Não informado",
          nomeOng: animal.nomeOng || "ONG responsável",
        });
      } catch (error) {
        console.error("Erro ao buscar animal:", error);
      }
    };

    buscarAnimal();
  }, [animalId, isAdotante]);

  useEffect(() => {
    if (!solicitacaoId || !isOng) {
      return;
    }

    const buscarSolicitacao = async () => {
      try {
        const response = await apiService.get(`/adocao/${solicitacaoId}`);

        const data = response.data;

        const fotos = obterFotos(data.animal.fotos);

        setAnimalInfo({
          id: data.animal.id,
          nome: data.animal.nome,
          imagem: fotos[0] || "",
          sexo: formatarSexo(data.animal.sexo),
          idade: formatarIdade(data.animal.idade),
          porte: formatarPorte(data.animal.porte),
          localizacao:
            data.animal.cidade && data.animal.estadoSigla
              ? `${data.animal.cidade} – ${data.animal.estadoSigla}`
              : data.animal.cidade || "Não informado",
          nomeOng: data.animal.nomeOng || "ONG responsável",
        });

        const respostasFormulario = Array(questionario.length).fill("");

        (data.respostas || []).forEach((item: RespostaAdocao) => {
          const index = item.perguntaId - 11;

          if (index >= 0 && index < questionario.length) {
            respostasFormulario[index] = item.resposta || "";
          }
        });

        setFormulario({
          nome: data.nomeCompleto || "",
          nascimento: formatarData(data.dataNascimento || ""),
          cpf: formatarCPF(data.cpf || ""),
          estadoCivil: data.estadoCivil || "",
          profissao: data.profissao || "",
          trabalho: data.localTrabalho || "",

          ddd: formatarDDD(data.ddd || ""),
          telefone: formatarTelefone(data.telefone || ""),
          email: data.email || "",

          cep: formatarCEP(data.cep || ""),
          cidade: data.cidade || "",
          uf: data.uf || "",
          estado: data.estado || "",
          bairro: data.bairro || "",
          complemento: data.complemento || "",
          logradouro: data.logradouro || "",
          numero: data.numero || "",

          respostas: respostasFormulario,
        });
      } catch (error) {
        console.error("Erro ao buscar solicitação:", error);
      }
    };

    buscarSolicitacao();
  }, [solicitacaoId, isOng]);

  const enviarFormulario = async () => {
    if (!animalId) {
      alert("Animal não identificado.");
      return;
    }

    if (!aceito) {
      alert("Você precisa aceitar a declaração para continuar.");
      return;
    }

    try {
      const payload = {
        animalId: Number(animalId),

        nomeCompleto: formulario.nome,
        dataNascimento: formulario.nascimento,
        cpf: formulario.cpf,
        estadoCivil: formulario.estadoCivil,
        profissao: formulario.profissao,
        localTrabalho: formulario.trabalho,

        ddd: formulario.ddd,
        telefone: formulario.telefone,
        email: formulario.email,

        cep: formulario.cep,
        cidade: formulario.cidade,
        uf: formulario.uf,
        estado: formulario.estado,
        bairro: formulario.bairro,
        complemento: formulario.complemento,
        logradouro: formulario.logradouro,
        numero: formulario.numero,

        respostas: formulario.respostas.map((resposta, index) => ({
          perguntaId: index + 11,
          resposta: resposta,
        })),
      };

      console.log("PAYLOAD ENVIADO:", payload);
      await apiService.post("/adocao/responder", payload);

      alert("Formulário enviado para a ONG com sucesso!");

      navigate("/listaadotar");
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);

      if (axios.isAxiosError(error)) {
        console.error("Status:", error.response?.status);
        console.error("Resposta:", error.response?.data);
      }

      alert("Não foi possível enviar o formulário.");
    }
  };

  const aceitarAdocao = async () => {
    if (!solicitacaoId) {
      return;
    }

    try {
      await apiService.patch(`/adocao/${solicitacaoId}/status?status=APROVADO`);

      alert("Adoção aceita com sucesso!");

      navigate("/");
    } catch (error) {
      console.error("Erro ao aceitar adoção:", error);

      if (axios.isAxiosError(error)) {
        alert(
          error.response?.data?.error || "Não foi possível aceitar a adoção.",
        );
      }
    }
  };

  const recusarAdocao = async () => {
    if (!solicitacaoId) {
      return;
    }

    try {
      await apiService.patch(
        `/adocao/${solicitacaoId}/status?status=REPROVADO`,
      );

      alert("Adoção recusada.");

      navigate("/");
    } catch (error) {
      console.error("Erro ao recusar adoção:", error);

      if (axios.isAxiosError(error)) {
        alert(
          error.response?.data?.error || "Não foi possível recusar a adoção.",
        );
      }
    }
  };

  useEffect(() => {
    if (!isAdotante) {
      return;
    }

    const buscarEstados = async () => {
      try {
        const response = await apiService.get("/localizacao/estados");

        setEstados(response.data);
      } catch (error) {
        console.error("Erro ao buscar estados:", error);
      }
    };

    buscarEstados();
  }, [isAdotante]);

  useEffect(() => {
    if (!estadoId || !isAdotante) {
      setCidades([]);
      return;
    }

    const buscarCidades = async () => {
      try {
        const response = await apiService.get(
          `/localizacao/cidades/${estadoId}`,
        );

        setCidades(response.data);
      } catch (error) {
        console.error("Erro ao buscar cidades:", error);
      }
    };

    buscarCidades();
  }, [estadoId, isAdotante]);

  if (!animalInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 py-10 px-4 font-sans">
        Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 py-10 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho: título + card do animal lado a lado */}

        <div className="flex items-start gap-6 mb-8">
          {/* Card do animal */}

          <div className="flex-shrink-0 bg-white rounded-2xl shadow-md overflow-hidden w-44">
            <div className="h-36 bg-slate-100 overflow-hidden">
              <img
                src={animalInfo.imagem}
                alt={animalInfo.nome}
                className="w-full h-full object-cover"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>

            <div className="p-3">
              <p className="font-bold text-sky-500 text-lg leading-tight">
                {animalInfo.nome}
              </p>

              <div className="mt-1 space-y-0.5 text-xs text-slate-500">
                <p>
                  <span className="font-semibold text-slate-600">Sexo:</span>{" "}
                  {animalInfo.sexo}
                </p>

                <p>
                  <span className="font-semibold text-slate-600">Idade:</span>{" "}
                  {animalInfo.idade}
                </p>

                <p>
                  <span className="font-semibold text-slate-600">Porte:</span>{" "}
                  {animalInfo.porte}
                </p>

                <p>
                  <span className="font-semibold text-slate-600">Local:</span>{" "}
                  {animalInfo.localizacao}
                </p>
              </div>
            </div>
          </div>

          {/* Título e intro */}

          <div className="flex-1 pt-1">
            <p className="text-xs font-semibold text-sky-500 uppercase tracking-widest mb-1">
              {animalInfo.nomeOng}
            </p>

            <h1 className="text-3xl font-bold text-slate-800 mb-3">
              Formulário de Adoção
            </h1>

            <p className="text-sm text-slate-500 leading-relaxed mb-2">
              A adoção de um animal resgatado é um compromisso sério e de longo
              prazo. Este formulário coleta informações essenciais para
              avaliarmos se o perfil do adotante é compatível com as
              necessidades do animal, garantindo sua segurança, bem-estar e
              qualidade de vida.
            </p>

            <p className="text-sm text-slate-500 leading-relaxed mb-2">
              As informações serão analisadas com responsabilidade e utilizadas
              exclusivamente pela equipe da ONG {animalInfo.nomeOng} no processo
              de triagem e acompanhamento da adoção.
            </p>

            <p className="text-sm text-slate-500 leading-relaxed">
              Agradecemos sua compreensão e interesse em contribuir com nossa
              causa.
            </p>
          </div>
        </div>

        {/* Formulário */}

        <div className="bg-white rounded-2xl shadow-md p-8 space-y-8">
          {/* Dados Pessoais */}

          <section>
            <SectionTitle>Dados Pessoais</SectionTitle>

            <div className="grid grid-cols-1 gap-4">
              <Input
                label="Nome Completo"
                id="nome"
                placeholder="Seu nome completo"
                value={formulario.nome}
                disabled={isOng}
                onChange={(value) => alterarCampo("nome", value)}
              />

              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Data de Nascimento"
                  id="nascimento"
                  placeholder="dd/mm/aaaa"
                  className="col-span-1"
                  value={formulario.nascimento}
                  disabled={isOng}
                  onChange={(value) =>
                    alterarCampo("nascimento", formatarData(value))
                  }
                />

                <Input
                  label="CPF"
                  id="cpf"
                  placeholder="000.000.000-00"
                  className="col-span-1"
                  value={formulario.cpf}
                  disabled={isOng}
                  onChange={(value) => alterarCampo("cpf", formatarCPF(value))}
                />

                <Select
                  label="Estado Civil"
                  id="estado-civil"
                  value={formulario.estadoCivil}
                  disabled={isOng}
                  onChange={(value) => alterarCampo("estadoCivil", value)}
                  options={[
                    {
                      value: "solteiro",
                      label: "Solteiro(a)",
                    },
                    {
                      value: "casado",
                      label: "Casado(a)",
                    },
                    {
                      value: "divorciado",
                      label: "Divorciado(a)",
                    },
                    {
                      value: "viuvo",
                      label: "Viúvo(a)",
                    },
                    {
                      value: "uniao",
                      label: "União Estável",
                    },
                  ]}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Profissão"
                  id="profissao"
                  placeholder="Sua profissão"
                  value={formulario.profissao}
                  disabled={isOng}
                  onChange={(value) => alterarCampo("profissao", value)}
                />

                <Input
                  label="Local de Trabalho"
                  id="trabalho"
                  placeholder="Empresa ou órgão público"
                  value={formulario.trabalho}
                  disabled={isOng}
                  onChange={(value) => alterarCampo("trabalho", value)}
                />
              </div>
            </div>
          </section>

          {/* Informações de Contato */}

          <section>
            <SectionTitle>Informações de Contato</SectionTitle>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Telefone / Whatsapp
                </label>

                <div className="flex gap-2">
                  <input
                    placeholder="DDD"
                    maxLength={2}
                    value={formulario.ddd}
                    disabled={isOng}
                    onChange={(e) =>
                      alterarCampo("ddd", formatarDDD(e.target.value))
                    }
                    className="w-16 h-10 px-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-center outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition"
                  />

                  <input
                    placeholder="Telefone"
                    value={formulario.telefone}
                    disabled={isOng}
                    onChange={(e) =>
                      alterarCampo("telefone", formatarTelefone(e.target.value))
                    }
                    className="flex-1 h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition"
                  />
                </div>
              </div>

              <Input
                label="E-mail"
                id="email"
                type="email"
                placeholder="seuemail@exemplo.com"
                value={formulario.email}
                disabled={isOng}
                onChange={(value) => alterarCampo("email", value)}
              />
            </div>
          </section>

          {/* Endereço */}

          <section>
            <SectionTitle>Endereço</SectionTitle>

            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="CEP"
                  id="cep"
                  placeholder="00000-000"
                  value={formulario.cep}
                  disabled={isOng}
                  onChange={(value) => alterarCampo("cep", formatarCEP(value))}
                />

                {isOng ? (
                  <>
                    <Input
                      label="Estado"
                      id="estado"
                      value={
                        formulario.estado && formulario.uf
                          ? `${formulario.estado} - ${formulario.uf}`
                          : formulario.estado
                      }
                      disabled
                    />

                    <Input
                      label="Cidade"
                      id="cidade"
                      value={formulario.cidade}
                      disabled
                    />
                  </>
                ) : (
                  <>
                    <Select
                      label="Estado"
                      id="estado"
                      value={estadoId?.toString() || ""}
                      onChange={(value) => {
                        const idSelecionado = Number(value);

                        const estadoSelecionado = estados.find(
                          (estado) => estado.id === idSelecionado,
                        );

                        setEstadoId(idSelecionado || null);

                        alterarCampo("estado", estadoSelecionado?.nome || "");

                        alterarCampo("uf", estadoSelecionado?.sigla || "");

                        alterarCampo("cidade", "");
                      }}
                      options={estados.map((estado) => ({
                        value: estado.id.toString(),
                        label: `${estado.nome} - ${estado.sigla}`,
                      }))}
                    />

                    <Select
                      label="Cidade"
                      id="cidade"
                      value={formulario.cidade}
                      disabled={!estadoId}
                      onChange={(value) => alterarCampo("cidade", value)}
                      options={cidades.map((cidade) => ({
                        value: cidade.nome,
                        label: cidade.nome,
                      }))}
                    />
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Bairro"
                  id="bairro"
                  placeholder="Seu bairro"
                  value={formulario.bairro}
                  disabled={isOng}
                  onChange={(value) => alterarCampo("bairro", value)}
                />

                <Input
                  label="Complemento"
                  id="complemento"
                  placeholder="Apto, bloco..."
                  value={formulario.complemento}
                  disabled={isOng}
                  onChange={(value) => alterarCampo("complemento", value)}
                />
              </div>

              <div className="grid grid-cols-4 gap-4">
                <Input
                  label="Logradouro"
                  id="logradouro"
                  placeholder="Rua, Av..."
                  className="col-span-3"
                  value={formulario.logradouro}
                  disabled={isOng}
                  onChange={(value) => alterarCampo("logradouro", value)}
                />

                <Input
                  label="Número"
                  id="numero"
                  placeholder="Nº"
                  value={formulario.numero}
                  disabled={isOng}
                  onChange={(value) => alterarCampo("numero", value)}
                />
              </div>
            </div>
          </section>

          {/* Questionário */}

          <section>
            <SectionTitle>Questionário</SectionTitle>

            <div className="space-y-4">
              {questionario.map((pergunta, i) => (
                <Textarea
                  key={i}
                  label={`${i + 1}. ${pergunta}`}
                  id={`q${i + 1}`}
                  value={formulario.respostas[i] || ""}
                  disabled={isOng}
                  onChange={(value) => alterarResposta(i, value)}
                />
              ))}
            </div>
          </section>

          {/* Declaração - somente adotante */}

          {!isOng && (
            <div className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-200">
              <input
                type="checkbox"
                id="declaracao"
                checked={aceito}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setAceito(e.target.checked)
                }
                className="mt-0.5 h-4 w-4 accent-sky-500 cursor-pointer flex-shrink-0"
              />

              <label
                htmlFor="declaracao"
                className="text-sm text-slate-600 leading-relaxed cursor-pointer"
              >
                Declaro que as informações fornecidas acima são verdadeiras e
                que estou ciente das responsabilidades envolvidas na adoção de
                um animal. Comprometo-me a oferecer amor, cuidado, segurança e
                todas as condições necessárias para o bem-estar do pet adotado.
              </label>
            </div>
          )}

          {/* Botões */}

          <div className="flex items-center justify-center gap-4 pt-2">
            {isOng ? (
              <>
                <button
                  type="button"
                  onClick={recusarAdocao}
                  className="px-8 py-3 rounded-full border-2 border-red-400 text-red-500 font-bold text-base hover:bg-red-50 transition"
                >
                  Recusar Adoção
                </button>

                <button
                  type="button"
                  onClick={aceitarAdocao}
                  className="px-10 py-3 rounded-full bg-sky-400 text-white font-bold text-base hover:bg-sky-500 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
                >
                  Aceitar Adoção
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/listaadotar/DetalhesAnimal/${animalInfo.id}`)
                  }
                  className="px-8 py-3 rounded-full border-2 border-red-400 text-red-500 font-bold text-base hover:bg-red-50 transition"
                >
                  Cancelar Adoção
                </button>

                <button
                  type="button"
                  onClick={enviarFormulario}
                  disabled={!aceito}
                  className="px-10 py-3 rounded-full bg-sky-400 text-white font-bold text-base hover:bg-sky-500 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
                >
                  Enviar Formulário
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
