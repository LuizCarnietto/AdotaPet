import { useState, ChangeEvent } from "react";

interface AnimalInfo {
  nome: string;
  imagem: string;
  sexo: string;
  idade: string;
  porte: string;
  localizacao: string;
}

interface InputProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  className?: string;
}

interface TextareaProps {
  label: string;
  id: string;
  placeholder?: string;
}

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  id: string;
  options: SelectOption[];
}

interface SectionTitleProps {
  children: React.ReactNode;
}

const animalInfo: AnimalInfo = {
  nome: "Hazel",
  imagem: "/imagens/DetalhesAnimal/cat1.jpeg",
  sexo: "Macho",
  idade: "2 anos",
  porte: "Pequeno",
  localizacao: "Londrina – PR",
};

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

function Input({ label, id, type = "text", placeholder, className = "" }: InputProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition"
      />
    </div>
  );
}

function Textarea({ label, id, placeholder }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        {label}
      </label>
      <textarea
        id={id}
        rows={2}
        placeholder={placeholder}
        className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition resize-none"
      />
    </div>
  );
}

function Select({ label, id, options }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        {label}
      </label>
      <select
        id={id}
        className="h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition"
      >
        <option value="">Selecione...</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
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

export default function FormularioAdocao() {
  const [aceito, setAceito] = useState<boolean>(false);

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
              <p className="font-bold text-sky-500 text-lg leading-tight">{animalInfo.nome}</p>
              <div className="mt-1 space-y-0.5 text-xs text-slate-500">
                <p><span className="font-semibold text-slate-600">Sexo:</span> {animalInfo.sexo}</p>
                <p><span className="font-semibold text-slate-600">Idade:</span> {animalInfo.idade}</p>
                <p><span className="font-semibold text-slate-600">Porte:</span> {animalInfo.porte}</p>
                <p><span className="font-semibold text-slate-600">Local:</span> {animalInfo.localizacao}</p>
              </div>
            </div>
          </div>

          {/* Título e intro */}
          <div className="flex-1 pt-1">
            <p className="text-xs font-semibold text-sky-500 uppercase tracking-widest mb-1">Resgata Pet</p>
            <h1 className="text-3xl font-bold text-slate-800 mb-3">Formulário de Adoção</h1>
            <p className="text-sm text-slate-500 leading-relaxed mb-2">
              A adoção de um animal resgatado é um compromisso sério e de longo prazo. Este formulário coleta
              informações essenciais para avaliarmos se o perfil do adotante é compatível com as necessidades
              do animal, garantindo sua segurança, bem-estar e qualidade de vida.
            </p>
            <p className="text-sm text-slate-500 leading-relaxed mb-2">
              As informações serão analisadas com responsabilidade e utilizadas exclusivamente pela equipe da ONG Resgata Pet
              no processo de triagem e acompanhamento da adoção.
            </p>
            <p className="text-sm text-slate-500 leading-relaxed">
              Agradecemos sua compreensão e interesse em contribuir com nossa causa.
            </p>
          </div>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-2xl shadow-md p-8 space-y-8">

          {/* Dados Pessoais */}
          <section>
            <SectionTitle>Dados Pessoais</SectionTitle>
            <div className="grid grid-cols-1 gap-4">
              <Input label="Nome Completo" id="nome" placeholder="Seu nome completo" />
              <div className="grid grid-cols-3 gap-4">
                <Input label="Data de Nascimento" id="nascimento" type="date" className="col-span-1" />
                <Input label="CPF" id="cpf" placeholder="000.000.000-00" className="col-span-1" />
                <Select
                  label="Estado Civil"
                  id="estado-civil"
                  options={[
                    { value: "solteiro", label: "Solteiro(a)" },
                    { value: "casado", label: "Casado(a)" },
                    { value: "divorciado", label: "Divorciado(a)" },
                    { value: "viuvo", label: "Viúvo(a)" },
                    { value: "uniao", label: "União Estável" },
                  ]}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Profissão" id="profissao" placeholder="Sua profissão" />
                <Input label="Local de Trabalho" id="trabalho" placeholder="Empresa ou órgão público" />
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
                    maxLength={3}
                    className="w-16 h-10 px-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-center outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition"
                  />
                  <input
                    placeholder="Telefone"
                    className="flex-1 h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition"
                  />
                </div>
              </div>
              <Input label="E-mail" id="email" type="email" placeholder="seuemail@exemplo.com" />
            </div>
          </section>

          {/* Endereço */}
          <section>
            <SectionTitle>Endereço</SectionTitle>
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-4 gap-4">
                <Input label="CEP" id="cep" placeholder="00000-000" />
                <Input label="Cidade" id="cidade" placeholder="Sua cidade" className="col-span-2" />
                <Input label="UF" id="uf" placeholder="PR" />
              </div>
              <Input label="Estado" id="estado" placeholder="Seu estado" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Bairro" id="bairro" placeholder="Seu bairro" />
                <Input label="Complemento" id="complemento" placeholder="Apto, bloco..." />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <Input label="Logradouro" id="logradouro" placeholder="Rua, Av..." className="col-span-3" />
                <Input label="Número" id="numero" placeholder="Nº" />
              </div>
            </div>
          </section>

          {/* Questionário */}
          <section>
            <SectionTitle>Questionário</SectionTitle>
            <div className="space-y-4">
              {questionario.map((pergunta: string, i: number) => (
                <Textarea
                  key={i}
                  label={`${i + 1}. ${pergunta}`}
                  id={`q${i + 1}`}
                />
              ))}
            </div>
          </section>

          {/* Declaração */}
          <div className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-200">
            <input
              type="checkbox"
              id="declaracao"
              checked={aceito}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setAceito(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-sky-500 cursor-pointer flex-shrink-0"
            />
            <label htmlFor="declaracao" className="text-sm text-slate-600 leading-relaxed cursor-pointer">
              Declaro que as informações fornecidas acima são verdadeiras e que estou ciente das responsabilidades
              envolvidas na adoção de um animal. Comprometo-me a oferecer amor, cuidado, segurança e todas as
              condições necessárias para o bem-estar do pet adotado.
            </label>
          </div>

          {/* Botões */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              type="button"
              className="px-8 py-3 rounded-full border-2 border-red-400 text-red-500 font-bold text-base hover:bg-red-50 transition"
            >
              Cancelar Adoção
            </button>
            <button
              type="button"
              disabled={!aceito}
              className="px-10 py-3 rounded-full bg-sky-400 text-white font-bold text-base hover:bg-sky-500 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
            >
              Enviar Formulário
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
