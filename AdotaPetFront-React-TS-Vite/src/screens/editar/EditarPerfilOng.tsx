import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, Dispatch, FormEvent, ReactNode, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import {
  AtSign,
  Building2,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronDown,
  Clock,
  Dog,
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
  X,
} from "lucide-react";
import { Header } from "@/components/Header";

type PerfilOngForm = {
  biografia: string;
  nomeOng: string;
  cnpj: string;
  categoria: string;
  localizacao: string;
  anoFundacao: string;
  quantidadeAnimais: string;
  telefone: string;
  emailInstitucional: string;
  enderecoPublico: string;
  horarioVisitas: string;
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

const INITIAL_FORM: PerfilOngForm = {
  biografia:
    "Dedicados ao acolhimento, reabilitação e adoção responsável de cães e gatos em situação de rua desde 2017. Cada vida importa! Acreditamos no amor incondicional e na transformação mútua que a adoção proporciona.",
  nomeOng: "Resgata Pet",
  cnpj: "24.891.102/0001-44",
  categoria: "resgate",
  localizacao: "Londrina, PR",
  anoFundacao: "2017",
  quantidadeAnimais: "",
  telefone: "+55 (43) 96325-8741",
  emailInstitucional: "contato@resgatapet.org.br",
  enderecoPublico: "Estrada do Limoeiro, Km 4 - Londrina, PR",
  horarioVisitas: "Segunda a sábado, das 9h às 16h, com agendamento",
  pixAtivo: true,
  tipoChavePix: "cnpj",
  chavePix: "pix@resgatapet.org.br",
  titularPix: "Associação Protetora Resgata Pet",
  instagram: "Resgata.Pet",
  facebook: "ResgataPet",
  tiktok: "",
  twitter: "Resgata.Pet",
  site: "",
  whatsapp: "5543963258741",
};

const COVER_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC8v2j2MXX41LX6hDo0u_OfcrQFTOiF_9oMi2fWyB-t3SW7O3C3DksH5mh56LZRAyM7LZ20OqgIIbqvuvN-zBEnCR1S7331CXM0v03e47ZpopF9BTEuxeGdSBZmrbBGi3ejKDBmpZWcWW0nllVkNfa2Wr4ZxvyPMu-LrSAJneqLIDZluUxS0jOhtpAtTb1anQ203h7rImisRnUsCl0kikQtJTpuf3r0zvITTBN19DY";
const PROFILE_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCxgkXyk5eG2wrRBoetyVXkUvoZ50U3f6E3hZkIMtcYb8HbVhk-kAkgyo_EEJGNegF6ZhMXwIvx48_-zJqUdEbnjHfEtLPBGtv9QUBj9iCg6nuvgjLflqNIs5i9sRjxnC4NXyK2so8L4erzjLLtk5fivpPS9eUq5LTd3GdN2e3NXaw0GmYT7K0tX5kDz7ISgnoyNI067Gx4S3qRuT1noX77RJddT_lAJ8krPiuHZpA";

const inputClass =
  "w-full rounded-[20px] border-0 bg-[#f5f6f7] px-4 py-3 text-sm font-medium text-[#2c2f30] outline-none transition focus:ring-2 focus:ring-[#1eb7f5]";
const labelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-wider text-[#595c5d]";
const buttonSecondaryClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[20px] bg-[#dce4e9] px-4 py-2.5 text-sm font-semibold text-[#4b5358] transition hover:bg-[#dadddf] active:scale-[0.98]";
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

export default function EditarPerfilOng() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PerfilOngForm>(INITIAL_FORM);
  const [toastVisible, setToastVisible] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(PROFILE_IMAGE);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(COVER_IMAGE);
  const [hasChanges, setHasChanges] = useState(false);
  const toastTimer = useRef<number | null>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    };
  }, []);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setHasChanges(true);
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((current) => ({ ...current, pixAtivo: event.target.checked }));
    setHasChanges(true);
  };

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>,
    setImage: Dispatch<SetStateAction<string | null>>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      window.alert("A imagem deve ter no máximo 5 MB.");
      event.target.value = "";
      return;
    }
    setImage(URL.createObjectURL(file));
    setHasChanges(true);
  };

  const handleDiscard = () => {
    setFormData(INITIAL_FORM);
    setProfilePhoto(PROFILE_IMAGE);
    setCoverPhoto(COVER_IMAGE);
    setHasChanges(false);
    setToastVisible(false);
    if (profileInputRef.current) profileInputRef.current.value = "";
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Esta tela ainda está apenas no frontend; a persistência via API pode ser conectada depois.
    setHasChanges(false);
    setToastVisible(true);
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastVisible(false), 3500);
  };

  return (
    <div className="min-h-screen bg-[#f5f6f7] text-[#2c2f30] antialiased">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <section className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold text-[#006286]">Área da ONG</p>
            <h1 className="font-headline text-3xl font-extrabold tracking-tight sm:text-4xl">
              Editar Perfil
            </h1>
            <p className="mt-2 text-sm text-[#555d61] sm:text-base">
              Atualize as informações públicas para alcançar mais adotantes.
            </p>
          </div>
        </section>

        <form className="space-y-8 pb-8" onSubmit={handleSave}>
          <section className="overflow-hidden rounded-[24px] bg-white shadow-[0_12px_32px_rgba(44,47,48,0.05)]">
            <div className="group relative h-56 overflow-hidden bg-[#dce4e9] sm:h-72">
              {coverPhoto ? (
                <img
                  src={coverPhoto}
                  alt="Capa da ONG"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-r from-[#006286] to-[#1eb7f5] text-white">
                  <PawPrint size={48} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
              <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="inline-flex min-h-11 items-center gap-2 rounded-[20px] bg-white/95 px-4 py-2 text-xs font-semibold text-[#2c2f30] shadow-md transition hover:bg-white"
                >
                  <Camera size={16} className="text-[#006286]" /> Alterar Capa
                </button>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => handleImageChange(event, setCoverPhoto)}
                />
              </div>
              <div className="absolute bottom-4 right-4 hidden items-center gap-2 rounded-full bg-black/60 px-3 py-2 text-xs font-medium text-white backdrop-blur sm:flex">
                <ImagePlus size={15} className="text-[#1eb7f5]" /> Capa recomendada: 1440 × 400 px
              </div>
            </div>

            <div className="relative px-5 pb-7 sm:px-8">
              <div className="-mt-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:text-left">
                  <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gradient-to-tr from-[#006286] to-[#1eb7f5] p-1 shadow-lg sm:h-36 sm:w-36">
                    {profilePhoto ? (
                      <img
                        src={profilePhoto}
                        alt="Foto de perfil da ONG"
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-[#006286]">
                        <PawPrint size={42} />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1 pb-1">
                    <div className="flex items-center justify-center gap-2 sm:justify-start">
                      <h2 className="font-headline text-xl font-bold tracking-tight sm:text-2xl">
                        {formData.nomeOng || "Nome da ONG"}
                      </h2>
                      <ShieldCheck size={17} className="text-[#006286]" aria-label="Dados cadastrais" />
                    </div>
                    <p className="text-xs font-medium text-[#555d61]">{formData.localizacao || "Localização não informada"}</p>
                    <p className="text-[11px] text-[#757778]">
                      PNG, JPG ou WEBP até 5 MB. Proporção 1:1 recomendada.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setProfilePhoto(null);
                      setHasChanges(true);
                    }}
                    className={buttonSecondaryClass}
                  >
                    <Trash2 size={17} /> Remover Foto
                  </button>
                  <button
                    type="button"
                    onClick={() => profileInputRef.current?.click()}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[20px] bg-gradient-to-r from-[#006286] to-[#1eb7f5] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(30,183,245,0.25)] transition hover:opacity-95 active:scale-[0.98]"
                  >
                    <Upload size={17} /> Alterar Foto
                  </button>
                  <input
                    ref={profileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => handleImageChange(event, setProfilePhoto)}
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-8">
              <section className={cardClass}>
                <div className="flex items-start justify-between gap-3">
                  <SectionHeading
                    icon={<FileText size={20} />}
                    title="Sobre a ONG"
                    subtitle="Conte sua história e o trabalho realizado."
                  />
                  <span className="shrink-0 rounded-full bg-[#eff1f2] px-3 py-1.5 text-xs font-semibold text-[#006286]">
                    {formData.biografia.length} / 1000
                  </span>
                </div>
                <div>
                  <label className={labelClass} htmlFor="biografia">Biografia completa</label>
                  <textarea
                    id="biografia"
                    name="biografia"
                    value={formData.biografia}
                    onChange={handleChange}
                    maxLength={1000}
                    rows={6}
                    className={`${inputClass} resize-y leading-relaxed`}
                    placeholder="Descreva a missão, a história e o trabalho da ONG..."
                  />
                </div>
              </section>

              <section className={cardClass}>
                <SectionHeading
                  icon={<Building2 size={20} />}
                  title="Informações Principais da ONG"
                  subtitle="Dados cadastrais públicos visíveis para adotantes e apoiadores."
                />
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor="nomeOng">Nome da ONG <span className="text-[#006286]">*</span></label>
                    <input id="nomeOng" name="nomeOng" required value={formData.nomeOng} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="cnpj">CNPJ</label>
                    <div className="relative">
                      <input id="cnpj" name="cnpj" value={formData.cnpj} readOnly className={`${inputClass} pr-11 opacity-80`} />
                      <ShieldCheck size={17} className="absolute right-4 top-3.5 text-[#006286]" aria-label="Dado cadastral" />
                    </div>
                    <p className="mt-1.5 text-[11px] text-[#757778]">Dado cadastral verificado.</p>
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="categoria">Categoria / Tipo de atuação</label>
                    <div className="relative">
                      <select id="categoria" name="categoria" value={formData.categoria} onChange={handleChange} className={`${inputClass} appearance-none pr-10`}>
                        <option value="resgate">ONG protetora de animais e resgate</option>
                        <option value="acolhimento">Acolhimento e reabilitação</option>
                        <option value="castracao">Mutirões de castração e saúde animal</option>
                        <option value="santuario">Santuário de acolhimento permanente</option>
                      </select>
                      <ChevronDown size={17} className="pointer-events-none absolute right-4 top-3.5 text-[#757778]" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="localizacao">Cidade / Estado</label>
                    <div className="relative">
                      <input id="localizacao" name="localizacao" value={formData.localizacao} onChange={handleChange} className={`${inputClass} pr-11`} />
                      <MapPin size={17} className="absolute right-4 top-3.5 text-[#757778]" />
                    </div>
                  </div>
                </div>
              </section>

              <section className={cardClass}>
                <SectionHeading
                  icon={<Phone size={20} />}
                  title="Contatos Oficiais & Localização do Abrigo"
                  subtitle="Canais para adoção, dúvidas e visitas."
                />
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor="telefone">Telefone & WhatsApp de atendimento</label>
                    <div className="relative">
                      <input id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} className={`${inputClass} pr-11`} />
                      <Phone size={17} className="absolute right-4 top-3.5 text-[#757778]" />
                    </div>
                    <p className="mt-1.5 text-[11px] text-[#757778]">Este campo pode utilizar o telefone informado no cadastro.</p>
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="emailInstitucional">E-mail institucional</label>
                    <div className="relative">
                      <input id="emailInstitucional" name="emailInstitucional" type="email" value={formData.emailInstitucional} onChange={handleChange} className={`${inputClass} pr-11`} />
                      <Mail size={17} className="absolute right-4 top-3.5 text-[#757778]" />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass} htmlFor="enderecoPublico">Endereço do abrigo / sede</label>
                    <div className="relative">
                      <input id="enderecoPublico" name="enderecoPublico" value={formData.enderecoPublico} onChange={handleChange} className={`${inputClass} pr-11`} />
                      <MapPin size={17} className="absolute right-4 top-3.5 text-[#757778]" />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <aside className="space-y-8 lg:col-span-4">
              <section className={cardClass}>
                <SectionHeading
                  icon={<HeartHandshake size={20} />}
                  title="Doações & Chave Pix"
                  subtitle="Incentive apoios e apadrinhamentos."
                />
                <div className="flex items-center justify-between gap-4 rounded-[20px] bg-[#eff1f2] p-4">
                  <div>
                    <span className="block text-sm font-bold">Botão de doação</span>
                    <span className="mt-1 block text-xs text-[#555d61]">Visível no perfil público</span>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center" aria-label="Exibir botão de doação">
                    <input checked={formData.pixAtivo} onChange={handleCheckboxChange} className="peer sr-only" type="checkbox" />
                    <span className="h-6 w-12 rounded-full bg-[#ced5db] transition peer-checked:bg-[#1eb7f5] peer-focus-visible:ring-2 peer-focus-visible:ring-[#006286] peer-focus-visible:ring-offset-2 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-6" />
                  </label>
                </div>
                <div>
                  <label className={labelClass} htmlFor="tipoChavePix">Tipo de chave Pix</label>
                  <div className="relative">
                    <select id="tipoChavePix" name="tipoChavePix" value={formData.tipoChavePix} onChange={handleChange} className={`${inputClass} appearance-none pr-10`}>
                      <option value="cnpj">CNPJ da associação</option>
                      <option value="email">E-mail institucional</option>
                      <option value="telefone">Telefone celular</option>
                      <option value="aleatoria">Chave aleatória</option>
                    </select>
                    <ChevronDown size={17} className="pointer-events-none absolute right-4 top-3.5 text-[#757778]" />
                  </div>
                </div>
                <div>
                  <label className={labelClass} htmlFor="chavePix">Chave Pix cadastrada</label>
                  <div className="relative">
                    <input id="chavePix" name="chavePix" value={formData.chavePix} onChange={handleChange} className={`${inputClass} pr-11`} />
                    <QrCode size={17} className="absolute right-4 top-3.5 text-[#757778]" />
                  </div>
                </div>
                <div>
                  <label className={labelClass} htmlFor="titularPix">Titular da conta bancária</label>
                  <input id="titularPix" name="titularPix" value={formData.titularPix} onChange={handleChange} className={inputClass} />
                </div>
              </section>

              <section className={cardClass}>
                <SectionHeading
                  icon={<Share2 size={20} />}
                  title="Redes Sociais"
                  subtitle="Aproxime os seguidores e mostre os resgates."
                />
                <div>
                  <label className={labelClass} htmlFor="instagram">Instagram</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-sm font-semibold text-[#757778]">@</span>
                    <input id="instagram" name="instagram" value={formData.instagram} onChange={handleChange} className={`${inputClass} pl-9`} placeholder="usuario" />
                    <Instagram size={17} className="absolute right-4 top-3.5 text-[#757778]" />
                  </div>
                </div>
                <div>
                  <label className={labelClass} htmlFor="facebook">Facebook</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-xs font-semibold text-[#757778]">fb.com/</span>
                    <input id="facebook" name="facebook" value={formData.facebook} onChange={handleChange} className={`${inputClass} pl-[76px] pr-11`} placeholder="pagina" />
                    <Facebook size={17} className="absolute right-4 top-3.5 text-[#757778]" />
                  </div>
                </div>
                <div>
                  <label className={labelClass} htmlFor="tiktok">TikTok</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-sm font-semibold text-[#757778]">@</span>
                    <input id="tiktok" name="tiktok" value={formData.tiktok} onChange={handleChange} className={`${inputClass} pl-9 pr-11`} placeholder="usuario" />
                    <AtSign size={17} className="absolute right-4 top-3.5 text-[#757778]" />
                  </div>
                </div>
                <div>
                  <label className={labelClass} htmlFor="twitter">Twitter / X</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-sm font-semibold text-[#757778]">@</span>
                    <input id="twitter" name="twitter" value={formData.twitter} onChange={handleChange} className={`${inputClass} pl-9 pr-11`} placeholder="usuario" />
                    <X size={17} className="absolute right-4 top-3.5 text-[#757778]" />
                  </div>
                </div>
                <div>
                  <label className={labelClass} htmlFor="site">Site oficial</label>
                  <div className="relative">
                    <input id="site" name="site" value={formData.site} onChange={handleChange} className={`${inputClass} pr-11`} placeholder="https://suaong.org.br" />
                    <Globe size={17} className="absolute right-4 top-3.5 text-[#757778]" />
                  </div>
                </div>
                <div>
                  <label className={labelClass} htmlFor="whatsapp">WhatsApp comercial (DDI + DDD + número)</label>
                  <div className="relative">
                    <input id="whatsapp" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className={`${inputClass} pr-11`} placeholder="5543999999999" />
                    <MessageCircle size={17} className="absolute right-4 top-3.5 text-[#757778]" />
                  </div>
                </div>
              </section>

              <section className="space-y-3 rounded-[24px] border border-[#dce4e9] bg-gradient-to-br from-[#eff1f2] to-[#dce4e9]/70 p-6">
                <div className="flex items-center gap-2 text-sm font-bold text-[#006286]">
                  <ShieldCheck size={18} /> Selo de ONG verificada
                </div>
                <p className="text-xs leading-relaxed text-[#555d61]">
                  Manter seus dados atualizados ajuda os adotantes a encontrar a ONG e aumenta a confiança nas informações do perfil.
                </p>
              </section>
            </aside>
          </div>

          <section className="sticky bottom-4 z-30 flex flex-col items-center justify-between gap-4 rounded-[20px] border border-white/70 bg-white/95 p-4 shadow-[0_16px_40px_rgba(44,47,48,0.12)] backdrop-blur-xl sm:flex-row sm:p-5">
            <div className="flex items-center gap-3">
              <span className={`h-2.5 w-2.5 rounded-full ${hasChanges ? "animate-pulse bg-[#1eb7f5]" : "bg-[#22a06b]"}`} />
              <span className="text-xs font-medium text-[#555d61]">
                {hasChanges ? "Você possui alterações não salvas neste formulário" : "Nenhuma alteração pendente"}
              </span>
            </div>
            <div className="flex w-full flex-wrap justify-end gap-3 sm:w-auto">
              <button type="button" onClick={handleDiscard} className={`${buttonSecondaryClass} flex-1 sm:flex-none`}>
                Descartar Alterações
              </button>
              <button type="button" onClick={() => navigate("/perfil/PerfilOng")} className={`${buttonSecondaryClass} hidden md:inline-flex`}>
                <Eye size={16} /> Ver Como Visitante
              </button>
              <button type="submit" className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-[20px] bg-gradient-to-r from-[#006286] to-[#1eb7f5] px-6 py-2.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(30,183,245,0.25)] transition hover:opacity-95 active:scale-[0.98] sm:flex-none">
                <CheckCircle2 size={18} /> Salvar Alterações
              </button>
            </div>
          </section>
        </form>
      </main>

      <footer className="mt-8 bg-[#e6e8ea]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-4 py-8 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <span className="inline-flex items-center gap-2 font-headline text-lg font-bold text-[#006286]"><PawPrint size={20} /> Adota Pet</span>
            <p className="text-xs leading-relaxed text-[#595c5d]">© 2026 Adota Pet. Conectando corações e lares.</p>
          </div>
          <nav className="flex flex-wrap justify-center gap-5 text-xs">
            <a href="/sobre" className="text-[#595c5d] transition hover:text-[#006286]">Sobre Nós</a>
            <a href="/termos" className="text-[#595c5d] transition hover:text-[#006286]">Termos de Uso</a>
            <a href="/privacidade" className="text-[#595c5d] transition hover:text-[#006286]">Privacidade</a>
            <a href="/ajuda" className="text-[#595c5d] transition hover:text-[#006286]">Ajuda e Suporte</a>
          </nav>
        </div>
      </footer>

      {toastVisible && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 left-1/2 z-[100] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center gap-3 rounded-[20px] bg-[#16834a] px-5 py-4 text-white shadow-[0_12px_32px_rgba(0,0,0,0.2)] transition-all"
        >
          <CheckCircle2 size={22} className="shrink-0" />
          <span className="text-sm font-bold">Alterações Salvas</span>
          <button type="button" onClick={() => setToastVisible(false)} aria-label="Fechar mensagem" className="ml-auto rounded-[20px] p-1 transition hover:bg-white/15">
            <X size={17} />
          </button>
        </div>
      )}
    </div>
  );
}
