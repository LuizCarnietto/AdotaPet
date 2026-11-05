import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Camera,
  ClipboardList,
  LockKeyhole,
  Mail,
  Pencil,
  PawPrint,
  Phone,
  Save,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { Header } from "@/components/Header";
import { apiService } from "@/services/ApiService";

type PerfilAdotante = {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  dataNascimento: string | null;
  fotoPerfil: string | null;
};

type FormularioPerfil = {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  dataNascimento: string;
};

const inputClass =
  "w-full rounded-[20px] border-0 bg-[#f5f6f7] px-4 py-3 text-sm font-medium text-[#2c2f30] outline-none transition focus:ring-2 focus:ring-[#36c3ff] disabled:cursor-not-allowed disabled:opacity-70";

const labelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-wider text-[#595c5d]";

const cardClass =
  "space-y-6 rounded-[24px] bg-white p-6 shadow-[0_12px_32px_rgba(44,47,48,0.05)] sm:p-8";

const botaoSecundario =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-[20px] bg-[#dce4e9] px-4 py-2 text-sm font-semibold text-[#4b5358] transition hover:bg-[#dadddf] disabled:opacity-60";

function formatarCPF(valor: string) {
  const numeros = valor.replace(/\D/g, "").slice(0, 11);

  return numeros
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatarTelefone(valor: string) {
  const numeros = valor.replace(/\D/g, "").slice(0, 11);

  if (numeros.length <= 2) return numeros;

  if (numeros.length <= 10) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}${
      numeros.length > 6 ? `-${numeros.slice(6)}` : ""
    }`;
  }

  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
}

function resolverUrlFoto(foto: string | null | undefined) {
  if (!foto) return null;

  if (/^(https?:|blob:|data:)/i.test(foto)) {
    return foto;
  }

  const baseURL = apiService.defaults.baseURL || window.location.origin;

  return new URL(foto, new URL(baseURL, window.location.origin)).toString();
}

function mensagemErro(error: unknown) {
  const erro = error as {
    response?: { data?: { message?: string } };
  };

  return (
    erro.response?.data?.message ||
    "Não foi possível realizar a operação. Tente novamente."
  );
}

export default function PerfilAdotante() {
  const [perfil, setPerfil] = useState<PerfilAdotante | null>(null);

  const [formData, setFormData] = useState<FormularioPerfil>({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    dataNascimento: "",
  });

  const [editando, setEditando] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [salvandoSenha, setSalvandoSenha] = useState(false);
  const [mensagemSenha, setMensagemSenha] = useState("");

  const [foto, setFoto] = useState<string | null>(null);
  const fotoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let ativo = true;

    async function carregarPerfil() {
      try {
        const response = await apiService.get<PerfilAdotante>(
          "/usuario/perfil/adotante",
        );

        if (!ativo) return;

        const dados = response.data;

        setPerfil(dados);

        setFormData({
          nome: dados.nome || "",
          email: dados.email || "",
          telefone: formatarTelefone(dados.telefone || ""),
          cpf: formatarCPF(dados.cpf || ""),
          dataNascimento: dados.dataNascimento || "",
        });

        setFoto(resolverUrlFoto(dados.fotoPerfil));
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);

        if (ativo) {
          setErro(mensagemErro(error));
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    void carregarPerfil();

    return () => {
      ativo = false;
    };
  }, []);

  const alterarCampo = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((atual) => ({
      ...atual,
      [name]: value,
    }));

    setMensagem("");
    setErro("");
  };

  const iniciarEdicao = () => {
    setMensagem("");
    setErro("");
    setEditando(true);
  };

  const cancelarEdicao = () => {
    if (!perfil) return;

    setFormData({
      nome: perfil.nome || "",
      email: perfil.email || "",
      telefone: formatarTelefone(perfil.telefone || ""),
      cpf: formatarCPF(perfil.cpf || ""),
      dataNascimento: perfil.dataNascimento || "",
    });

    setEditando(false);
    setMensagem("");
    setErro("");
  };

  const salvarPerfil = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSalvando(true);
      setMensagem("");
      setErro("");

      const payload = {
        nome: formData.nome.trim(),
        email: formData.email.trim().toLowerCase(),
        telefone: formData.telefone.replace(/\D/g, ""),
        cpf: formData.cpf.replace(/\D/g, ""),
        dataNascimento: formData.dataNascimento || null,
      };

      const response = await apiService.put<PerfilAdotante>(
        "/usuario/perfil/adotante",
        payload,
      );

      const dados = response.data;

      setPerfil(dados);

      setFormData({
        nome: dados.nome || "",
        email: dados.email || "",
        telefone: formatarTelefone(dados.telefone || ""),
        cpf: formatarCPF(dados.cpf || ""),
        dataNascimento: dados.dataNascimento || "",
      });

      setEditando(false);
      setMensagem("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      setErro(mensagemErro(error));
    } finally {
      setSalvando(false);
    }
  };

  const alterarFoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const arquivo = event.target.files?.[0];

    if (!arquivo) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(arquivo.type)) {
      setErro("Selecione uma imagem JPG, PNG ou WEBP.");
      event.target.value = "";
      return;
    }

    if (arquivo.size > 5 * 1024 * 1024) {
      setErro("A imagem deve ter no máximo 5 MB.");
      event.target.value = "";
      return;
    }

    const preview = URL.createObjectURL(arquivo);
    setFoto(preview);
    setErro("");
    setMensagem("");

    try {
      const formDataFoto = new FormData();
      formDataFoto.append("arquivo", arquivo);

      const response = await apiService.post(
        "/usuario/perfil/foto",
        formDataFoto,
      );

      const caminhoFoto = response.data?.fotoPerfil;

      if (caminhoFoto) {
        const novaFoto = resolverUrlFoto(caminhoFoto);
        setFoto(novaFoto);

        setPerfil((atual) =>
          atual ? { ...atual, fotoPerfil: caminhoFoto } : atual,
        );
      }

      setMensagem("Foto de perfil atualizada!");
    } catch (error) {
      console.error("Erro ao atualizar foto:", error);
      setFoto(resolverUrlFoto(perfil?.fotoPerfil));
      setErro(mensagemErro(error));
    } finally {
      if (fotoInputRef.current) {
        fotoInputRef.current.value = "";
      }
    }
  };

  const alterarSenha = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMensagemSenha("");

    if (novaSenha.length < 8) {
      setMensagemSenha("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setMensagemSenha("As senhas não coincidem.");
      return;
    }

    try {
      setSalvandoSenha(true);

      await apiService.put("/usuario/perfil/adotante/senha", {
        senhaAtual,
        novaSenha,
      });

      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");

      setMensagemSenha("Senha alterada com sucesso!");
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      setMensagemSenha(mensagemErro(error));
    } finally {
      setSalvandoSenha(false);
    }
  };

  const nome = perfil?.nome?.trim() || "Adotante";
  const inicial = nome.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#222]">
      <Header />

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="relative shrink-0">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#36c3ff] to-[#168fc5] p-1">
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white">
                  {foto ? (
                    <img
                      src={foto}
                      alt={`Foto de ${nome}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-[#168fc5]">
                      {inicial}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => fotoInputRef.current?.click()}
                className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#36c3ff] text-white shadow-sm transition hover:bg-[#168fc5]"
                title="Alterar foto de perfil"
                aria-label="Alterar foto de perfil"
              >
                <Camera size={16} />
              </button>

              <input
                ref={fotoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={alterarFoto}
              />
            </div>

            <div className="min-w-0 text-center sm:text-left">
              <p className="text-sm font-semibold text-[#168fc5]">MEU PERFIL</p>

              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#222] sm:text-3xl">
                Olá, {carregando ? "..." : nome}!
              </h1>

              <p className="mt-2 break-all text-sm text-gray-500">
                {perfil?.email || ""}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Gerencie suas informações pessoais e sua conta.
              </p>
            </div>
          </div>
        </section>

        {erro && (
          <div
            role="alert"
            className="rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {erro}
          </div>
        )}

        {mensagem && (
          <div
            role="status"
            className="rounded-[20px] border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            {mensagem}
          </div>
        )}

        <section className={cardClass}>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF8FF] text-[#168fc5]">
                <User size={21} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#222]">
                  Dados pessoais
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Suas informações cadastradas.
                </p>
              </div>
            </div>

            {!editando && (
              <button
                type="button"
                onClick={iniciarEdicao}
                disabled={carregando || !perfil}
                className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-[20px] border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-[#36c3ff] hover:bg-[#EAF8FF] hover:text-[#168fc5] disabled:opacity-50 sm:self-auto"
              >
                <Pencil size={15} />
                Editar perfil
              </button>
            )}
          </div>

          {carregando ? (
            <p className="py-6 text-sm text-gray-500">
              Carregando seus dados...
            </p>
          ) : (
            <form onSubmit={salvarPerfil}>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="nome">
                    Nome completo
                  </label>
                  <input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={alterarCampo}
                    className={inputClass}
                    disabled={!editando}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="email">
                    E-mail
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={alterarCampo}
                      className={`${inputClass} pr-11`}
                      disabled={!editando}
                      required
                    />
                    <Mail
                      size={17}
                      className="absolute right-4 top-3.5 text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass} htmlFor="telefone">
                    Telefone
                  </label>
                  <div className="relative">
                    <input
                      id="telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={(e) =>
                        setFormData((atual) => ({
                          ...atual,
                          telefone: formatarTelefone(e.target.value),
                        }))
                      }
                      className={`${inputClass} pr-11`}
                      disabled={!editando}
                    />
                    <Phone
                      size={17}
                      className="absolute right-4 top-3.5 text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass} htmlFor="cpf">
                    CPF
                  </label>
                  <input
                    id="cpf"
                    name="cpf"
                    value={formData.cpf}
                    onChange={(e) =>
                      setFormData((atual) => ({
                        ...atual,
                        cpf: formatarCPF(e.target.value),
                      }))
                    }
                    className={inputClass}
                    disabled={!editando}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="dataNascimento">
                    Data de nascimento
                  </label>
                  <div className="relative">
                    <input
                      id="dataNascimento"
                      name="dataNascimento"
                      type="date"
                      value={formData.dataNascimento}
                      onChange={alterarCampo}
                      className={`${inputClass} pr-11`}
                      disabled={!editando}
                    />
                    <CalendarDays
                      size={17}
                      className="pointer-events-none absolute right-4 top-3.5 text-gray-400"
                    />
                  </div>
                </div>
              </div>

              {editando && (
                <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-5">
                  <button
                    type="button"
                    onClick={cancelarEdicao}
                    disabled={salvando}
                    className={botaoSecundario}
                  >
                    <X size={16} />
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={salvando}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[20px] bg-[#36c3ff] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#168fc5] disabled:opacity-60"
                  >
                    <Save size={16} />
                    {salvando ? "Salvando..." : "Salvar alterações"}
                  </button>
                </div>
              )}
            </form>
          )}
        </section>

        <section className={cardClass}>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF8FF] text-[#168fc5]">
              <ShieldCheck size={21} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#222]">
                Segurança da conta
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Altere sua senha para manter sua conta protegida.
              </p>
            </div>
          </div>

          <form onSubmit={alterarSenha} className="space-y-5">
            <div>
              <label className={labelClass} htmlFor="senhaAtual">
                Senha atual
              </label>
              <input
                id="senhaAtual"
                type="password"
                autoComplete="current-password"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="novaSenha">
                  Nova senha
                </label>
                <input
                  id="novaSenha"
                  type="password"
                  autoComplete="new-password"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  className={inputClass}
                  minLength={8}
                  required
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="confirmarSenha">
                  Confirmar nova senha
                </label>
                <input
                  id="confirmarSenha"
                  type="password"
                  autoComplete="new-password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className={inputClass}
                  minLength={8}
                  required
                />
              </div>
            </div>

            {mensagemSenha && (
              <p role="status" className="text-sm text-[#168fc5]">
                {mensagemSenha}
              </p>
            )}

            <div className="flex justify-end border-t border-gray-100 pt-5">
              <button
                type="submit"
                disabled={salvandoSenha}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[20px] bg-[#36c3ff] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#168fc5] disabled:opacity-60"
              >
                <LockKeyhole size={16} />
                {salvandoSenha ? "Alterando..." : "Alterar senha"}
              </button>
            </div>
          </form>
        </section>

        <Link
          to="/minhas-candidaturas"
          className="group flex items-center justify-between gap-4 rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm transition hover:border-[#bceaff] hover:bg-[#F0FAFF]"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EAF8FF] text-[#168fc5]">
              <ClipboardList size={22} />
            </div>

            <div>
              <h2 className="font-bold text-gray-800">Minhas candidaturas</h2>
              <p className="mt-1 text-xs text-gray-500">
                Acompanhe suas solicitações de adoção.
              </p>
            </div>
          </div>

          <PawPrint className="h-5 w-5 shrink-0 text-[#36c3ff] transition-transform group-hover:translate-x-1" />
        </Link>
      </main>
    </div>
  );
}
