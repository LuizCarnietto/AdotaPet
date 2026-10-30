import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Building2,
  Camera,
  CheckCircle2,
  ChevronDown,
  Eye,
  Facebook,
  FileText,
  Globe,
  HeartHandshake,
  ImagePlus,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  PawPrint,
  Phone,
  QrCode,
  Share2,
  ShieldCheck,
  Trash2,
  Upload,
} from "lucide-react";
import { Header } from "@/components/Header";
import { apiService } from "@/services/ApiService";

type Estado = { id: number; nome: string; sigla: string };
type Cidade = { id: number; nome: string };

type PerfilOngForm = {
  nomeOng: string;
  cnpj: string;
  descricaoOng: string;
  telefone: string;
  emailInstitucional: string;
  enderecoPublico: string;
  pixAtivo: boolean;
  tipoChavePix: string;
  chavePix: string;
  titularPix: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  twitter: string;
  site: string;
  whatsapp: string;
};

type PerfilOngApi = Partial<PerfilOngForm> & {
  nome?: string | null;
  email?: string | null;
  endereco?: string | null;
  fotoPerfil?: string | null;
  fotoCapa?: string | null;
  capa?: string | null;
  cidade?: string | null;
  cidadeId?: number | string | null;
  estado?: string | null;
  estadoSigla?: string | null;
  estadoId?: number | string | null;
};

const FORMULARIO_VAZIO: PerfilOngForm = {
  nomeOng: "",
  cnpj: "",
  descricaoOng: "",
  telefone: "",
  emailInstitucional: "",
  enderecoPublico: "",
  pixAtivo: false,
  tipoChavePix: "",
  chavePix: "",
  titularPix: "",
  instagram: "",
  facebook: "",
  tiktok: "",
  twitter: "",
  site: "",
  whatsapp: "",
};

const inputClass =
  "w-full rounded-[20px] border-0 bg-[#f5f6f7] px-4 py-3 text-sm font-medium text-[#2c2f30] outline-none transition focus:ring-2 focus:ring-[#1eb7f5] disabled:cursor-not-allowed disabled:opacity-60";
const labelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-wider text-[#595c5d]";
const secondaryButton =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[20px] bg-[#dce4e9] px-4 py-2.5 text-sm font-semibold text-[#4b5358] transition hover:bg-[#dadddf]";
const cardClass =
  "space-y-6 rounded-[24px] bg-white p-6 shadow-[0_12px_32px_rgba(44,47,48,0.05)] sm:p-8";

function SectionHeading({
  icon,
  title,
  subtitle,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-3 pb-2">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#dce4e9] text-[#006286]">
        {icon}
      </div>
      <div>
        <h2 className="font-semibold text-[#2c2f30]">{title}</h2>
        {subtitle && <p className="mt-1 text-xs text-[#555d61]">{subtitle}</p>}
      </div>
    </div>
  );
}

// Mesma máscara de CNPJ utilizada na tela de cadastro.
function formatarCNPJ(valor: string) {
  const n = valor.replace(/\D/g, "").slice(0, 14);
  if (n.length <= 2) return n;
  if (n.length <= 5) return `${n.slice(0, 2)}.${n.slice(2)}`;
  if (n.length <= 8) return `${n.slice(0, 2)}.${n.slice(2, 5)}.${n.slice(5)}`;
  if (n.length <= 12)
    return `${n.slice(0, 2)}.${n.slice(2, 5)}.${n.slice(5, 8)}/${n.slice(8)}`;
  return `${n.slice(0, 2)}.${n.slice(2, 5)}.${n.slice(5, 8)}/${n.slice(8, 12)}-${n.slice(12)}`;
}
const somenteNumeros = (valor: string) => valor.replace(/\D/g, "");

export default function EditarPerfilOng() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(FORMULARIO_VAZIO);
  const [perfilOriginal, setPerfilOriginal] = useState<PerfilOngApi | null>(
    null,
  );
  const [estados, setEstados] = useState<Estado[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [estadoId, setEstadoId] = useState("");
  const [cidadeId, setCidadeId] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [coverPhotoFile, setCoverPhotoFile] = useState<File | null>(null);
  const [carregandoPerfil, setCarregandoPerfil] = useState(true);
  const [carregandoEstados, setCarregandoEstados] = useState(true);
  const [carregandoCidades, setCarregandoCidades] = useState(false);
  const [erroPerfil, setErroPerfil] = useState("");
  const [erroEstados, setErroEstados] = useState("");
  const [mensagemSalvar, setMensagemSalvar] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Busca os dados existentes. Os campos ainda não devolvidos pelo DTO ficam vazios.
  useEffect(() => {
    let ativo = true;
    async function carregarPerfil() {
      try {
        const response = await apiService.get("/usuario/perfil");
        const dados = (response.data || {}) as PerfilOngApi;
        const carregado: PerfilOngForm = {
          ...FORMULARIO_VAZIO,
          nomeOng: dados.nomeOng || "",
          cnpj: formatarCNPJ(dados.cnpj || ""),
          descricaoOng: dados.descricaoOng || "",
          telefone: dados.telefone || "",
          emailInstitucional: dados.emailInstitucional || "",
          enderecoPublico: dados.enderecoPublico || dados.endereco || "",
          pixAtivo: dados.pixAtivo ?? false,
          tipoChavePix: dados.tipoChavePix || "",
          chavePix: dados.chavePix || "",
          titularPix: dados.titularPix || "",
          instagram: dados.instagram || "",
          facebook: dados.facebook || "",
          tiktok: dados.tiktok || "",
          twitter: dados.twitter || "",
          site: dados.site || "",
          whatsapp: dados.whatsapp || "",
        };
        if (ativo) {
          setPerfilOriginal(dados);
          setFormData(carregado);
          setProfilePhoto(dados.fotoPerfil || null);
          setCoverPhoto(dados.fotoCapa || dados.capa || null);
        }
      } catch (error) {
        console.error("Erro ao carregar perfil para edição:", error);
        if (ativo)
          setErroPerfil(
            "Não foi possível carregar os dados já cadastrados. Você ainda pode preencher os campos manualmente.",
          );
      } finally {
        if (ativo) setCarregandoPerfil(false);
      }
    }
    void carregarPerfil();
    return () => {
      ativo = false;
    };
  }, []);

  // Mesmo endpoint de estados usado em RegistroAnimal.tsx.
  useEffect(() => {
    let ativo = true;
    async function buscarEstados() {
      try {
        const response = await apiService.get("/localizacao/estados");
        if (ativo) setEstados(response.data || []);
      } catch (error) {
        console.error("Erro ao buscar estados:", error);
        if (ativo)
          setErroEstados("Não foi possível carregar a lista de estados.");
      } finally {
        if (ativo) setCarregandoEstados(false);
      }
    }
    void buscarEstados();
    return () => {
      ativo = false;
    };
  }, []);

  const estadoOriginal = useMemo(() => {
    if (!perfilOriginal || !estados.length) return undefined;
    return estados.find(
      (estado) =>
        String(estado.id) === String(perfilOriginal.estadoId || "") ||
        estado.sigla?.toLowerCase() ===
          (perfilOriginal.estadoSigla || "").toLowerCase() ||
        estado.nome?.toLowerCase() ===
          (perfilOriginal.estado || "").toLowerCase(),
    );
  }, [perfilOriginal, estados]);

  useEffect(() => {
    if (estadoOriginal && !estadoId) setEstadoId(String(estadoOriginal.id));
  }, [estadoOriginal, estadoId]);

  // Mesmo endpoint de cidades usado em RegistroAnimal.tsx.
  useEffect(() => {
    if (!estadoId) {
      setCidades([]);
      setCidadeId("");
      return;
    }
    let ativo = true;
    async function buscarCidades() {
      setCarregandoCidades(true);
      try {
        const response = await apiService.get(
          `/localizacao/cidades/${estadoId}`,
        );
        const lista = (response.data || []) as Cidade[];
        if (!ativo) return;
        setCidades(lista);
        if (
          estadoOriginal &&
          String(estadoOriginal.id) === estadoId &&
          perfilOriginal?.cidade
        ) {
          const encontrada = lista.find(
            (cidade) =>
              String(cidade.id) === String(perfilOriginal.cidadeId || "") ||
              cidade.nome?.toLowerCase() ===
                perfilOriginal.cidade?.toLowerCase(),
          );
          setCidadeId(encontrada ? String(encontrada.id) : "");
        }
      } catch (error) {
        console.error("Erro ao buscar cidades:", error);
        if (ativo) {
          setCidades([]);
          setCidadeId("");
        }
      } finally {
        if (ativo) setCarregandoCidades(false);
      }
    }
    void buscarCidades();
    return () => {
      ativo = false;
    };
  }, [estadoId, estadoOriginal, perfilOriginal]);

  const estadoSelecionado = estados.find((e) => String(e.id) === estadoId);
  const cidadeSelecionada = cidades.find((c) => String(c.id) === cidadeId);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;
    setFormData((atual) => ({ ...atual, [name]: value }));
    setHasChanges(true);
    setMensagemSalvar("");
  };

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>,
    tipo: "perfil" | "capa",
  ) => {
    const arquivo = event.target.files?.[0];
    if (!arquivo) return;
    if (!arquivo.type.startsWith("image/")) {
      window.alert("Selecione um arquivo de imagem válido.");
      event.target.value = "";
      return;
    }
    if (arquivo.size > 5 * 1024 * 1024) {
      window.alert("A imagem deve ter no máximo 5 MB.");
      event.target.value = "";
      return;
    }
    const preview = URL.createObjectURL(arquivo);
    if (tipo === "perfil") {
      setProfilePhoto(preview);
      setProfilePhotoFile(arquivo);
    } else {
      setCoverPhoto(preview);
      setCoverPhotoFile(arquivo);
    }
    setHasChanges(true);
    setMensagemSalvar("");
  };

  const removerFoto = (tipo: "perfil" | "capa") => {
    if (tipo === "perfil") {
      setProfilePhoto(null);
      setProfilePhotoFile(null);
      if (profileInputRef.current) profileInputRef.current.value = "";
    } else {
      setCoverPhoto(null);
      setCoverPhotoFile(null);
      if (coverInputRef.current) coverInputRef.current.value = "";
    }
    setHasChanges(true);
    setMensagemSalvar("");
  };

  // Critérios do selo: campos essenciais preenchidos, fotos escolhidas,
  // dados de Pix completos se a ONG ativar doações e pelo menos uma rede/canal.
  const perfilCompleto = useMemo(() => {
    const cnpjOk = somenteNumeros(formData.cnpj).length === 14;
    const telefoneOk = somenteNumeros(formData.telefone).length >= 10;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      formData.emailInstitucional.trim(),
    );
    const pixOk =
      !formData.pixAtivo ||
      Boolean(
        formData.tipoChavePix &&
        formData.chavePix.trim() &&
        formData.titularPix.trim(),
      );
    const temRede = [
      formData.instagram,
      formData.facebook,
      formData.tiktok,
      formData.twitter,
      formData.site,
      formData.whatsapp,
    ].some((v) => v.trim());
    return Boolean(
      formData.nomeOng.trim() &&
      cnpjOk &&
      formData.descricaoOng.trim() &&
      telefoneOk &&
      emailOk &&
      formData.enderecoPublico.trim() &&
      estadoId &&
      cidadeId &&
      profilePhoto &&
      coverPhoto &&
      pixOk &&
      temRede,
    );
  }, [formData, estadoId, cidadeId, profilePhoto, coverPhoto]);

  // Sem endpoint de atualização confirmado, não simula um salvamento no banco.
  const prepararDados = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      nomeOng: formData.nomeOng.trim(),
      cnpj: somenteNumeros(formData.cnpj),
      descricaoOng: formData.descricaoOng.trim(),
      telefone: somenteNumeros(formData.telefone),
      emailInstitucional: formData.emailInstitucional.trim(),
      enderecoPublico: formData.enderecoPublico.trim(),
      cidade: cidadeSelecionada?.nome || "",
      estado: estadoSelecionado?.nome || "",
      estadoSigla: estadoSelecionado?.sigla || "",
      pixAtivo: formData.pixAtivo,
      tipoChavePix: formData.pixAtivo ? formData.tipoChavePix : "",
      chavePix: formData.pixAtivo ? formData.chavePix.trim() : "",
      titularPix: formData.pixAtivo ? formData.titularPix.trim() : "",
      instagram: formData.instagram.trim(),
      facebook: formData.facebook.trim(),
      tiktok: formData.tiktok.trim(),
      twitter: formData.twitter.trim(),
      site: formData.site.trim(),
      whatsapp: somenteNumeros(formData.whatsapp),
      fotoPerfilArquivo: profilePhotoFile,
      fotoCapaArquivo: coverPhotoFile,
    };
    console.log("Dados preparados para atualização do perfil da ONG:", payload);
    setMensagemSalvar(
      "Os dados foram preparados. Para gravá-los no banco, ainda é necessário conectar o endpoint de atualização do perfil no backend.",
    );
  };

  return (
    <div className="min-h-screen bg-[#f5f6f7] text-[#2c2f30] antialiased">
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <section className="mb-8">
          <h1 className="font-headline text-3xl font-extrabold tracking-tight sm:text-4xl">
            Editar Perfil
          </h1>
          <p className="mt-2 text-sm text-[#555d61] sm:text-base">
            Complete as informações da sua ONG para apresentá-la aos adotantes.
          </p>
        </section>

        {(erroPerfil || erroEstados) && (
          <div
            role="status"
            className="mb-6 rounded-[20px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
          >
            {erroPerfil || erroEstados}
          </div>
        )}

        <form className="space-y-8 pb-8" onSubmit={prepararDados}>
          {/* Imagens sem conteúdo fictício: a ONG envia as próprias fotos. */}
          <section className="overflow-hidden rounded-[24px] bg-white shadow-[0_12px_32px_rgba(44,47,48,0.05)]">
            <div className="group relative h-48 overflow-hidden bg-[#e8eef1] sm:h-64">
              {coverPhoto ? (
                <img
                  src={coverPhoto}
                  alt="Capa da ONG"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-[#71818a]">
                  <ImagePlus size={36} />
                  <span className="text-sm font-medium">
                    Adicione uma foto de capa
                  </span>
                </div>
              )}
              <div className="absolute right-4 top-4 flex gap-2 sm:right-6 sm:top-6">
                {coverPhoto && (
                  <button
                    type="button"
                    onClick={() => removerFoto("capa")}
                    className="inline-flex min-h-10 items-center gap-2 rounded-[20px] bg-white/95 px-3 py-2 text-xs font-semibold"
                  >
                    <Trash2 size={15} /> Remover
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="inline-flex min-h-10 items-center gap-2 rounded-[20px] bg-white/95 px-4 py-2 text-xs font-semibold text-[#2c2f30] shadow-md"
                >
                  <Camera size={16} className="text-[#006286]" />{" "}
                  {coverPhoto ? "Alterar capa" : "Adicionar capa"}
                </button>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, "capa")}
                />
              </div>
            </div>

            <div className="relative px-5 pb-7 sm:px-8">
              <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:text-left">
                  <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#e8eef1] shadow-lg sm:h-32 sm:w-32">
                    {profilePhoto ? (
                      <img
                        src={profilePhoto}
                        alt="Foto de perfil da ONG"
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-[#f5f6f7] text-[#71818a]">
                        <PawPrint size={38} />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1 pb-1">
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                      <h2 className="font-headline text-xl font-bold tracking-tight sm:text-2xl">
                        {formData.nomeOng.trim() || "Nome da ONG"}
                      </h2>
                      {perfilCompleto && !hasChanges && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f6ee] px-2.5 py-1 text-[11px] font-bold text-[#16834a]">
                          <ShieldCheck size={14} /> ONG verificada
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-[#555d61]">
                      {cidadeSelecionada && estadoSelecionado
                        ? `${cidadeSelecionada.nome} - ${estadoSelecionado.sigla}`
                        : "Cidade e estado não informados"}
                    </p>
                    <p className="text-[11px] text-[#757778]">
                      PNG, JPG ou WEBP até 5 MB. Proporção 1:1 recomendada.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
                  {profilePhoto && (
                    <button
                      type="button"
                      onClick={() => removerFoto("perfil")}
                      className={secondaryButton}
                    >
                      <Trash2 size={16} /> Remover foto
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => profileInputRef.current?.click()}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[20px] bg-gradient-to-r from-[#006286] to-[#1eb7f5] px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    <Upload size={16} />{" "}
                    {profilePhoto ? "Alterar foto" : "Adicionar foto"}
                  </button>
                  <input
                    ref={profileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e, "perfil")}
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-8">
              <section className={cardClass}>
                <SectionHeading
                  icon={<FileText size={20} />}
                  title="Sobre a ONG"
                  subtitle="Conte a história, a missão e o trabalho realizado."
                />
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label className={labelClass} htmlFor="descricaoOng">
                      Descrição da ONG
                    </label>
                    <span className="shrink-0 text-xs text-[#757778]">
                      {formData.descricaoOng.length} / 1000
                    </span>
                  </div>
                  <textarea
                    id="descricaoOng"
                    name="descricaoOng"
                    value={formData.descricaoOng}
                    onChange={handleChange}
                    maxLength={1000}
                    rows={6}
                    className={`${inputClass} resize-y leading-relaxed`}
                    placeholder="Descreva a missão, a história e as atividades da sua ONG..."
                  />
                </div>
              </section>

              <section className={cardClass}>
                <SectionHeading
                  icon={<Building2 size={20} />}
                  title="Informações principais da ONG"
                  subtitle="Preencha os dados institucionais."
                />
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor="nomeOng">
                      Nome da ONG *
                    </label>
                    <input
                      id="nomeOng"
                      name="nomeOng"
                      value={formData.nomeOng}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Digite o nome da ONG"
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="cnpj">
                      CNPJ *
                    </label>
                    <input
                      id="cnpj"
                      name="cnpj"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      value={formData.cnpj}
                      onChange={(e) => {
                        setFormData((atual) => ({
                          ...atual,
                          cnpj: formatarCNPJ(e.target.value),
                        }));
                        setHasChanges(true);
                        setMensagemSalvar("");
                      }}
                      className={inputClass}
                      placeholder="xx.xxx.xxx/xxxx-xx"
                      maxLength={18}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="estado">
                      Estado *
                    </label>
                    <div className="relative">
                      <select
                        id="estado"
                        value={estadoId}
                        onChange={(e) => {
                          setEstadoId(e.target.value);
                          setCidadeId("");
                          setHasChanges(true);
                          setMensagemSalvar("");
                        }}
                        className={`${inputClass} appearance-none pr-10`}
                        disabled={carregandoEstados}
                        required
                      >
                        <option value="">
                          {carregandoEstados
                            ? "Carregando estados..."
                            : "Selecione o estado"}
                        </option>
                        {estados.map((estado) => (
                          <option key={estado.id} value={estado.id}>
                            {estado.sigla} - {estado.nome}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={17}
                        className="pointer-events-none absolute right-4 top-3.5 text-[#757778]"
                      />
                    </div>
                    {erroEstados && (
                      <p className="mt-1 text-xs text-red-600">{erroEstados}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="cidade">
                      Cidade *
                    </label>
                    <div className="relative">
                      <select
                        id="cidade"
                        value={cidadeId}
                        onChange={(e) => {
                          setCidadeId(e.target.value);
                          setHasChanges(true);
                          setMensagemSalvar("");
                        }}
                        className={`${inputClass} appearance-none pr-10`}
                        disabled={!estadoId || carregandoCidades}
                        required
                      >
                        <option value="">
                          {!estadoId
                            ? "Selecione o estado primeiro"
                            : carregandoCidades
                              ? "Carregando cidades..."
                              : "Selecione a cidade"}
                        </option>
                        {cidades.map((cidade) => (
                          <option key={cidade.id} value={cidade.id}>
                            {cidade.nome}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={17}
                        className="pointer-events-none absolute right-4 top-3.5 text-[#757778]"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className={cardClass}>
                <SectionHeading
                  icon={<Phone size={20} />}
                  title="Contatos oficiais e localização do abrigo"
                  subtitle="Informe os canais de atendimento e o endereço da ONG."
                />
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor="telefone">
                      Telefone / WhatsApp *
                    </label>
                    <div className="relative">
                      <input
                        id="telefone"
                        name="telefone"
                        type="tel"
                        autoComplete="tel"
                        value={formData.telefone}
                        onChange={handleChange}
                        className={`${inputClass} pr-11`}
                        placeholder="(xx) xxxxx-xxxx"
                        required
                      />
                      <Phone
                        size={17}
                        className="absolute right-4 top-3.5 text-[#757778]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="emailInstitucional">
                      E-mail institucional *
                    </label>
                    <div className="relative">
                      <input
                        id="emailInstitucional"
                        name="emailInstitucional"
                        type="email"
                        value={formData.emailInstitucional}
                        onChange={handleChange}
                        className={`${inputClass} pr-11`}
                        placeholder="contato@suaong.org.br"
                        required
                      />
                      <Mail
                        size={17}
                        className="absolute right-4 top-3.5 text-[#757778]"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass} htmlFor="enderecoPublico">
                      Endereço do abrigo / sede *
                    </label>
                    <div className="relative">
                      <input
                        id="enderecoPublico"
                        name="enderecoPublico"
                        value={formData.enderecoPublico}
                        onChange={handleChange}
                        className={`${inputClass} pr-11`}
                        placeholder="Rua, número, bairro..."
                        required
                      />
                      <MapPin
                        size={17}
                        className="absolute right-4 top-3.5 text-[#757778]"
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <aside className="space-y-8 lg:col-span-4">
              <section className={cardClass}>
                <SectionHeading
                  icon={<HeartHandshake size={20} />}
                  title="Doações e chave Pix"
                  subtitle="Cadastre uma chave caso sua ONG receba doações."
                />
                <div className="flex items-center justify-between gap-4 rounded-[20px] bg-[#eff1f2] p-4">
                  <div>
                    <span className="block text-sm font-bold">
                      Receber doações por Pix
                    </span>
                    <span className="mt-1 block text-xs text-[#555d61]">
                      Ative para informar os dados da chave.
                    </span>
                  </div>
                  <label
                    className="relative inline-flex cursor-pointer items-center"
                    aria-label="Ativar recebimento de doações por Pix"
                  >
                    <input
                      type="checkbox"
                      checked={formData.pixAtivo}
                      onChange={(e) => {
                        setFormData((atual) => ({
                          ...atual,
                          pixAtivo: e.target.checked,
                        }));
                        setHasChanges(true);
                        setMensagemSalvar("");
                      }}
                      className="peer sr-only"
                    />
                    <span className="relative h-6 w-12 rounded-full bg-[#ced5db] transition peer-checked:bg-[#1eb7f5] peer-focus-visible:ring-2 peer-focus-visible:ring-[#006286] peer-focus-visible:ring-offset-2 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-6" />
                  </label>
                </div>
                {formData.pixAtivo && (
                  <>
                    <div>
                      <label className={labelClass} htmlFor="tipoChavePix">
                        Tipo de chave Pix *
                      </label>
                      <div className="relative">
                        <select
                          id="tipoChavePix"
                          name="tipoChavePix"
                          value={formData.tipoChavePix}
                          onChange={handleChange}
                          className={`${inputClass} appearance-none pr-10`}
                          required
                        >
                          <option value="">Selecione o tipo de chave</option>
                          <option value="cnpj">CNPJ</option>
                          <option value="email">E-mail</option>
                          <option value="telefone">Telefone celular</option>
                          <option value="aleatoria">Chave aleatória</option>
                        </select>
                        <ChevronDown
                          size={17}
                          className="pointer-events-none absolute right-4 top-3.5 text-[#757778]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="chavePix">
                        Chave Pix *
                      </label>
                      <div className="relative">
                        <input
                          id="chavePix"
                          name="chavePix"
                          value={formData.chavePix}
                          onChange={handleChange}
                          className={`${inputClass} pr-11`}
                          placeholder="Informe a chave Pix"
                          required
                        />
                        <QrCode
                          size={17}
                          className="absolute right-4 top-3.5 text-[#757778]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="titularPix">
                        Titular da conta *
                      </label>
                      <input
                        id="titularPix"
                        name="titularPix"
                        value={formData.titularPix}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Nome do titular da conta"
                        required
                      />
                    </div>
                  </>
                )}
              </section>

              <section className={cardClass}>
                <SectionHeading
                  icon={<Share2 size={20} />}
                  title="Redes sociais"
                  subtitle="Adicione os canais oficiais da ONG."
                />
                <div>
                  <label className={labelClass} htmlFor="instagram">
                    Instagram
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-sm font-semibold text-[#757778]">
                      @
                    </span>
                    <input
                      id="instagram"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      className={`${inputClass} pl-9 pr-11`}
                      placeholder="usuario"
                    />
                    <Instagram
                      size={17}
                      className="absolute right-4 top-3.5 text-[#757778]"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass} htmlFor="facebook">
                    Facebook
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-xs font-semibold text-[#757778]">
                      fb.com/
                    </span>
                    <input
                      id="facebook"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleChange}
                      className={`${inputClass} pl-[76px] pr-11`}
                      placeholder="pagina"
                    />
                    <Facebook
                      size={17}
                      className="absolute right-4 top-3.5 text-[#757778]"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass} htmlFor="tiktok">
                    TikTok
                  </label>
                  <input
                    id="tiktok"
                    name="tiktok"
                    value={formData.tiktok}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="@usuario"
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="twitter">
                    Twitter / X
                  </label>
                  <input
                    id="twitter"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="@usuario"
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="site">
                    Site oficial
                  </label>
                  <div className="relative">
                    <input
                      id="site"
                      name="site"
                      type="url"
                      value={formData.site}
                      onChange={handleChange}
                      className={`${inputClass} pr-11`}
                      placeholder="https://suaong.org.br"
                    />
                    <Globe
                      size={17}
                      className="absolute right-4 top-3.5 text-[#757778]"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass} htmlFor="whatsapp">
                    WhatsApp comercial
                  </label>
                  <div className="relative">
                    <input
                      id="whatsapp"
                      name="whatsapp"
                      type="tel"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      className={`${inputClass} pr-11`}
                      placeholder="DDD + número"
                    />
                    <MessageCircle
                      size={17}
                      className="absolute right-4 top-3.5 text-[#757778]"
                    />
                  </div>
                </div>
              </section>
            </aside>
          </div>

          <section className="sticky bottom-4 z-30 flex flex-col items-center justify-between gap-4 rounded-[20px] border border-white/70 bg-white/95 p-4 shadow-[0_16px_40px_rgba(44,47,48,0.12)] backdrop-blur-xl sm:flex-row sm:p-5">
            <div className="flex items-center gap-3">
              <span
                className={`h-2.5 w-2.5 rounded-full ${hasChanges ? "animate-pulse bg-[#1eb7f5]" : "bg-[#22a06b]"}`}
              />
              <span className="text-xs font-medium text-[#555d61]">
                {hasChanges
                  ? "Você possui alterações não salvas"
                  : "Nenhuma alteração pendente"}
              </span>
            </div>
            <div className="flex w-full flex-wrap justify-end gap-3 sm:w-auto">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className={`${secondaryButton} flex-1 sm:flex-none`}
              >
                Descartar alterações
              </button>
              <button
                type="button"
                onClick={() => navigate("/perfil/PerfilOng")}
                className={`${secondaryButton} hidden md:inline-flex`}
              >
                <Eye size={16} /> Ver como visitante
              </button>
              <button
                type="submit"
                disabled={carregandoPerfil}
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-[20px] bg-gradient-to-r from-[#006286] to-[#1eb7f5] px-6 py-2.5 text-sm font-bold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
              >
                <CheckCircle2 size={18} /> Preparar alterações
              </button>
            </div>
          </section>

          {mensagemSalvar && (
            <p
              role="status"
              className="rounded-[20px] border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800"
            >
              {mensagemSalvar}
            </p>
          )}
        </form>

        {carregandoPerfil && (
          <p className="pb-6 text-center text-xs text-[#757778]">
            Carregando dados do perfil...
          </p>
        )}
      </main>

      <footer className="mt-8 border-t border-gray-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-5 px-6 py-8 text-center sm:flex-row sm:text-left">
          <div>
            <span className="text-lg font-bold text-[#168fc5]">Adota Pet</span>

            <p className="mt-1 text-xs text-gray-500">
              © 2026 Adota Pet
              {formData.nomeOng.trim() !== ""
                ? ` • ${formData.nomeOng.trim()}`
                : " • Perfil da ONG"}
              . Todos os direitos reservados.
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
