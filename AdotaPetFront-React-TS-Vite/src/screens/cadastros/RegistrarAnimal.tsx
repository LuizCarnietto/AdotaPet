import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { apiService } from "../../services/ApiService"; // ajuste o caminho se necessário

// ─── Enums (devem bater com os do back-end) ───────────────────────────────────
type Especie = "CACHORRO" | "GATO";
type Porte   = "PEQUENO"  | "MEDIO" | "GRANDE";
type Sexo    = "MACHO"    | "FEMEA";
type Status  = "DISPONIVEL" | "INATIVO" | "ADOTADO";
type Idade   = "FILHOTE" | "ADULTO" | "IDOSO";

// ─── DTO de requisição ────────────────────────────────────────────────────────
interface AnimalRequestDTO {
  nome:            string;
  raca:            string;
  idade:           Idade;
  historicoSaude:  string;
  comportamento:   string;
  fotos:           string;
  possuiChip:      boolean;
  localizacao:     string;
  vacinado:        boolean;
  especie:         Especie;
  porte:           Porte;
  sexo:            Sexo;
  status:          Status;
  cor:             string;
}

// ─── Estado do formulário ─────────────────────────────────────────────────────
interface FormState {
  nome:           string;
  raca:           string;
  idade:          Idade  | "";
  historicoSaude: string;
  comportamento:  string;
  possuiChip:     string;
  localizacao:    string;
  vacinado:       string;
  especie:        Especie | "";
  porte:          Porte   | "";
  sexo:           Sexo    | "";
  cor:            string;
}

// ─── Slots de imagem ──────────────────────────────────────────────────────────
interface ImageSlot {
  src: string | null;
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface InfoCardProps {
  label:    string;
  children: React.ReactNode;
  side?:    "left" | "right";
}

interface SlotControlesProps {
  index:        number;
  slot:         ImageSlot;
  ativa:        boolean;
  onAdicionar:  (index: number) => void;
  onApagar:     (index: number) => void;
  onClicar:     (index: number) => void;
  inputRef:     React.RefObject<HTMLInputElement>;
  onFileChange: (e: ChangeEvent<HTMLInputElement>, index: number) => void;
}

// ─── Componentes auxiliares ───────────────────────────────────────────────────
function InfoCard({ label, children, side = "left" }: InfoCardProps) {
  const margin = side === "left" ? "mr-6" : "ml-6";
  return (
    <div className={`bg-white w-[263px] rounded-[20px] shadow-[0px_4px_8px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center py-2 ${margin}`}>
      <label className="text-base font-bold text-black mb-2">{label}</label>
      {children}
    </div>
  );
}

const inputSelectClass =
  "w-4/5 h-full py-1 px-0.5 border border-[#dce3ea] rounded-[10px] text-center text-sm bg-[#f9fbfd] outline-none";

function SlotMiniatura({ index, slot, ativa, onAdicionar, onApagar, onClicar, inputRef, onFileChange }: SlotControlesProps) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex gap-1.5">
        <button type="button" title="Adicionar imagem" onClick={() => onAdicionar(index)}
          className="w-[52px] h-7 bg-[#36c3ff] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1 hover:opacity-85 active:scale-95 transition">
          + Add
        </button>
        <button type="button" title="Apagar imagem" onClick={() => onApagar(index)}
          className="w-[52px] h-7 bg-[#ff5c5c] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1 hover:opacity-85 active:scale-95 transition">
          ✕ Del
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFileChange(e, index)} />
      {slot.src ? (
        <img src={slot.src} alt={`Miniatura ${index + 1}`} onClick={() => onClicar(index)}
          className={`w-[116px] h-[116px] rounded-[20px] cursor-pointer transition-opacity duration-300 border-[3px] border-[#36c3ff] ${ativa ? "opacity-100" : "opacity-80 hover:opacity-100"}`}
        />
      ) : (
        <div className="w-[116px] h-[116px] rounded-[20px] border-2 border-dashed border-[#ccd6e0] bg-[#f4f8fb] flex items-center justify-center text-[#aab8c4] text-[28px]">
          +
        </div>
      )}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function RegistrarAnimal() {
  // Estado das imagens
  const [slots, setSlots] = useState<ImageSlot[]>([{ src: null }, { src: null }, { src: null }]);
  const [imagemAtiva, setImagemAtiva]   = useState<number | null>(null);
  const [imagemGrande, setImagemGrande] = useState<string | null>(null);

  // Estado do formulário
  const [form, setForm] = useState<FormState>({
    nome:           "",
    raca:           "",
    idade:          "",
    historicoSaude: "",
    comportamento:  "",
    possuiChip:     "",
    localizacao:    "",
    vacinado:       "",
    especie:        "",
    porte:          "",
    sexo:           "",
    cor:            "",
  });

  // Estado de feedback
  const [loading, setLoading]   = useState(false);
  const [erro, setErro]         = useState<string | null>(null);
  const [sucesso, setSucesso]   = useState(false);

  // Refs dos inputs de arquivo
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // ── Handlers de imagem ──────────────────────────────────────────────────────
  const handleAdicionar = (index: number): void => {
    inputRefs[index].current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, index: number): void => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setSlots((prev) => {
        const updated = [...prev];
        updated[index] = { src: result };
        return updated;
      });
      setImagemGrande(result);
      setImagemAtiva(index);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleApagar = (index: number): void => {
    setSlots((prev) => {
      const updated = [...prev];
      updated[index] = { src: null };
      return updated;
    });
    if (imagemAtiva === index) {
      const outra = slots.findIndex((s, i) => i !== index && s.src !== null);
      if (outra !== -1) { setImagemGrande(slots[outra].src); setImagemAtiva(outra); }
      else              { setImagemGrande(null); setImagemAtiva(null); }
    }
  };

  const handleClicar = (index: number): void => {
    if (slots[index].src) { setImagemGrande(slots[index].src); setImagemAtiva(index); }
  };

  // ── Handler de campo de formulário ─────────────────────────────────────────
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setErro(null);
    setSucesso(false);

    // Validações básicas
    if (!form.nome.trim())          return setErro("Informe o nome do animal.");
    if (!form.especie)              return setErro("Selecione a espécie.");
    if (!form.sexo)                 return setErro("Selecione o sexo.");
    if (!form.porte)                return setErro("Selecione o porte.");
    if (!form.possuiChip)           return setErro("Informe se possui microchip.");
    if (!form.vacinado)             return setErro("Informe se está vacinado.");
    if (!form.idade)                return setErro("Informe a idade.");

    // Foto principal em base64 (primeiro slot preenchido ou string vazia)
    const fotoPrincipal = slots.find((s) => s.src !== null)?.src ?? "";

    const payload: AnimalRequestDTO = {
      nome:           form.nome.trim(),
      raca:           form.raca.trim(),
      idade:          form.idade as Idade,
      historicoSaude: form.historicoSaude.trim(),
      comportamento:  form.comportamento.trim(),
      fotos:          fotoPrincipal,
      possuiChip:     form.possuiChip === "true",
      localizacao:    form.localizacao.trim(),
      vacinado:       form.vacinado === "true",
      especie:        form.especie as Especie,
      porte:          form.porte   as Porte,
      sexo:           form.sexo    as Sexo,
      status:         "DISPONIVEL",
      cor:            form.cor.trim(),
    };

    try {
      setLoading(true);

      // ✅ Usando apiService — envia o token JWT automaticamente no header
      await apiService.post("/animal", payload);

      setSucesso(true);
    } catch (err: unknown) {
  const axiosError = err as { response?: { data?: unknown } };
  console.log("ERRO COMPLETO:", axiosError?.response?.data);

  const data = axiosError?.response?.data;
  let msg = "Erro ao cadastrar animal.";

  if (typeof data === "string") {
    msg = data;
  } else if (typeof data === "object" && data !== null) {
    const obj = data as Record<string, unknown>;
    msg = String(obj.message ?? obj.error ?? obj.detail ?? JSON.stringify(data));
  } else if (err instanceof Error) {
    msg = err.message;
  }

  setErro(msg);
} finally {
      setLoading(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white flex flex-col items-center font-[Inter,sans-serif]">

      {/* Header */}
      <header className="bg-white w-full py-10 flex justify-center">
        <nav className="flex items-center justify-center gap-20">
          <a href="/login" className="no-underline text-black font-mono hover:underline">Entrar</a>
          <a href="#"      className="no-underline text-black font-mono hover:underline">Adotar</a>
          <a href="/home">
            <img src="/imagens/DetalhesAnimal/logoMelhor.png" alt="Logo" className="h-[70px] w-[80px]" />
          </a>
          <a href="#" className="no-underline text-black font-mono hover:underline">Sobre</a>
          <a href="#" className="no-underline text-black font-mono hover:underline">F.A.Q</a>
        </nav>
      </header>

      {/* Feedback de erro / sucesso */}
      {erro && (
        <div className="w-full max-w-[1440px] px-[90px] mt-4">
          <div className="bg-red-50 border border-red-300 text-red-700 rounded-xl px-5 py-3 text-sm">
            ⚠️ {erro}
          </div>
        </div>
      )}
      {sucesso && (
        <div className="w-full max-w-[1440px] px-[90px] mt-4">
          <div className="bg-green-50 border border-green-300 text-green-700 rounded-xl px-5 py-3 text-sm">
            ✅ Animal cadastrado com sucesso!
          </div>
        </div>
      )}

      {/* Container principal */}
      <form onSubmit={handleSubmit} className="bg-white flex justify-center max-w-[1440px] w-full px-[90px] mt-[30px]">

        {/* Coluna de fotos */}
        <div className="mr-[107px]">
          <div className="w-[549px] h-[549px] bg-white rounded-[20px] flex justify-center items-center">
            {imagemGrande ? (
              <img src={imagemGrande} alt="Foto principal do animal"
                className="w-full h-full object-cover rounded-[20px] border-[3px] border-[#36c3ff]" />
            ) : (
              <div className="w-full h-full rounded-[20px] border-[3px] border-dashed border-[#36c3ff] bg-[#f4f8fb] flex items-center justify-center text-[#aab8c4] text-lg">
                Nenhuma imagem selecionada
              </div>
            )}
          </div>
          <div className="flex flex-row items-end justify-center w-[550px] mt-9 gap-[18px]">
            {slots.map((slot, i) => (
              <SlotMiniatura key={i} index={i} slot={slot} ativa={imagemAtiva === i}
                onAdicionar={handleAdicionar} onApagar={handleApagar} onClicar={handleClicar}
                inputRef={inputRefs[i]} onFileChange={handleFileChange} />
            ))}
          </div>
        </div>

        {/* Coluna de descrição */}
        <div>
          {/* Nome + textos descritivos */}
          <div className="bg-white w-[603px] rounded-[20px] p-10 shadow-[0px_4px_8px_rgba(0,0,0,0.25)]">
            <input
              name="nome" value={form.nome} onChange={handleChange}
              type="text" placeholder="Digite o nome do animal"
              className="w-full px-[18px] py-[14px] mb-4 bg-[#f9fbfd] border border-[#dce3ea] rounded-[10px] box-border font-[Montserrat,sans-serif] font-bold text-[42px] text-[#222] outline-none placeholder:text-sm placeholder:font-medium placeholder:font-[Inter,sans-serif]"
            />
            <textarea
              name="comportamento" value={form.comportamento} onChange={handleChange}
              placeholder="Comportamento do animal"
              className="w-full min-h-[80px] p-[18px] bg-[#f9fbfd] rounded-[10px] border border-[#dce3ea] box-border resize-y text-base font-[Inter,sans-serif] outline-none placeholder:text-sm placeholder:font-medium"
            />
          </div>

          {/* Cards de informações */}
          <div className="grid grid-cols-2 gap-5 mt-5 font-[Inter,sans-serif]">

            {/* Coluna esquerda */}
            <div className="flex flex-col items-center gap-[34px]">
              <InfoCard label="Raça" side="left">
                <input name="raca" value={form.raca} onChange={handleChange}
                  type="text" placeholder="Digite a raça" className={inputSelectClass} />
              </InfoCard>

              <InfoCard label="Idade" side="left">
                <select name="idade" value={form.idade} onChange={handleChange} className={inputSelectClass}>
                  <option value="" disabled>Selecione</option>
                  <option value="FILHOTE">Filhote</option>
                  <option value="ADULTO">Adulto</option>
                  <option value="IDOSO">Idoso</option>
                </select>
              </InfoCard>

              <InfoCard label="Espécie" side="left">
                <select name="especie" value={form.especie} onChange={handleChange} className={inputSelectClass}>
                  <option value="" disabled>Selecione</option>
                  <option value="CACHORRO">Cachorro</option>
                  <option value="GATO">Gato</option>
                </select>
              </InfoCard>

              <InfoCard label="Possui Microchip?" side="left">
                <select name="possuiChip" value={form.possuiChip} onChange={handleChange} className={inputSelectClass}>
                  <option value="" disabled>Selecione</option>
                  <option value="true">Sim</option>
                  <option value="false">Não</option>
                </select>
              </InfoCard>

              <InfoCard label="Localização" side="left">
                <input name="localizacao" value={form.localizacao} onChange={handleChange}
                  type="text" placeholder="Cidade - Estado" className={inputSelectClass} />
              </InfoCard>
            </div>

            {/* Coluna direita */}
            <div className="flex flex-col items-center gap-[34px]">
              <InfoCard label="Sexo" side="right">
                <select name="sexo" value={form.sexo} onChange={handleChange} className={inputSelectClass}>
                  <option value="" disabled>Selecione</option>
                  <option value="MACHO">Macho</option>
                  <option value="FEMEA">Fêmea</option>
                </select>
              </InfoCard>

              <InfoCard label="Porte" side="right">
                <select name="porte" value={form.porte} onChange={handleChange} className={inputSelectClass}>
                  <option value="" disabled>Selecione</option>
                  <option value="PEQUENO">Pequeno</option>
                  <option value="MEDIO">Médio</option>
                  <option value="GRANDE">Grande</option>
                </select>
              </InfoCard>

              <InfoCard label="Cor" side="right">
                <input name="cor" value={form.cor} onChange={handleChange}
                  type="text" placeholder="Digite a cor" className={inputSelectClass} />
              </InfoCard>

              <InfoCard label="Vacinado?" side="right">
                <select name="vacinado" value={form.vacinado} onChange={handleChange} className={inputSelectClass}>
                  <option value="" disabled>Selecione</option>
                  <option value="true">Sim</option>
                  <option value="false">Não</option>
                </select>
              </InfoCard>
            </div>
          </div>

          {/* Botão confirmar */}
          <button
            type="submit"
            disabled={loading}
            className="w-[350px] h-[59px] text-white bg-[#36c3ff] border-none rounded-[40px] font-[Inter,sans-serif] font-bold text-2xl block text-center mx-auto mt-[38px] leading-[59px] cursor-pointer hover:bg-[#1ab0f0] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Salvando..." : "Confirmar Registro"}
          </button>
        </div>
      </form>
    </div>
  );
}