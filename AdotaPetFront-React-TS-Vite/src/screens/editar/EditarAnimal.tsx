import React, { useState, useRef, useEffect } from 'react';
import { Plus, X } from 'lucide-react';

interface ImageSlot {
  id: number;
  src: string | null;
}

export default function EditarAnimal() {
  // Estado para gerenciar as imagens dos 3 slots
  const [imagens, setImagens] = useState<ImageSlot[]>([
    { id: 0, src: "imagens/DetalhesAnimal/cat1.jpeg" },
    { id: 1, src: "imagens/DetalhesAnimal/cat2.jpeg" },
    { id: 2, src: "imagens/DetalhesAnimal/cat3.jpeg" },
  ]);

  // Estado para controlar qual slot de imagem está ativo na tela grande
  const [slotAtivo, setSlotAtivo] = useState<number>(0);

  // Referências para os inputs de arquivos ocultos
  const fileInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Define a imagem principal inicial baseada no primeiro slot válido
  const getImagemGrandeSrc = () => {
    const slotAtual = imagens.find(img => img.id === slotAtivo);
    if (slotAtual && slotAtual.src) return slotAtual.src;
    
    const primeiroValido = imagens.find(img => img.src !== null);
    return primeiroValido ? primeiroValido.src : "#";
  };

  // Sincroniza o slot ativo caso a imagem ativa seja deletada
  useEffect(() => {
    const ativoExiste = imagens.find(img => img.id === slotAtivo && img.src !== null);
    if (!ativoExiste) {
      const proximoValido = imagens.find(img => img.src !== null);
      if (proximoValido) {
        setSlotAtivo(proximoValido.id);
      }
    }
  }, [imagens, slotAtivo]);

  const triggerInput = (index: number) => {
    fileInputRefs[index].current?.click();
  };

  const carregarImagem = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    const url = URL.createObjectURL(file);

    setImagens(prev => prev.map(img => img.id === index ? { ...img, src: url } : img));
    setSlotAtivo(index);
  };

  const apagarImagem = (index: number) => {
    setImagens(prev => prev.map(img => img.id === index ? { ...img, src: null } : img));
    if (fileInputRefs[index].current) {
      fileInputRefs[index].current!.value = "";
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center font-sans antialiased">
      {/* Header */}
      <header className="w-full bg-white py-10 flex justify-center items-center border-b border-gray-100">
        <nav className="flex items-center justify-center gap-10 md:gap-20">
          <a href="login.html" className="font-mono text-black hover:underline decoration-black">Entrar</a>
          <a href="#" className="font-mono text-black hover:underline decoration-black">Adotar</a>
          <a href="HomePage.html" className="hover:opacity-90 transition-opacity">
            <img src="imagens/DetalhesAnimal/logoMelhor.png" alt="Logo" className="h-[70px] w-20 object-contain" />
          </a>
          <a href="#" className="font-mono text-black hover:underline decoration-black">Sobre</a>
          <a href="#" className="font-mono text-black hover:underline decoration-black">F.A.Q</a>
        </nav>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-[1440px] px-6 md:px-[90px] mt-[30px] flex flex-col lg:flex-row justify-center gap-10 lg:gap-0">
        
        {/* Seção de Fotos */}
        <div className="flex flex-col items-center lg:mr-[107px]">
          {/* Foto Principal */}
          <div className="w-full max-w-[549px] h-[350px] sm:h-[549px] bg-white rounded-[20px] overflow-hidden flex justify-center items-center border border-gray-100 shadow-sm">
            <img 
              id="imagemGrande" 
              src={getImagemGrandeSrc() || '#'} 
              alt="Foto principal do animal" 
              className="w-full h-full object-cover rounded-[20px]"
            />
          </div>

          {/* Miniaturas e Controles */}
          <div className="flex flex-row items-end justify-center w-full max-w-[550px] mt-9 gap-[18px]">
            {imagens.map((img, index) => (
              <div key={img.id} className="flex flex-col items-center gap-[6px] relative">
                {/* Botões superiores */}
                <div className="flex gap-[6px]">
                  <button 
                    type="button"
                    title="Adicionar imagem" 
                    onClick={() => triggerInput(index)}
                    className="w-[52px] h-28 bg-[#36c3ff] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-0.5 hover:opacity-85 transition-all transform active:scale-95 active:scale-y-97"
                  >
                    <Plus className="w-3 h-3" /> Add
                  </button>
                  <button 
                    type="button"
                    title="Apagar imagem" 
                    onClick={() => apagarImagem(index)}
                    className="w-[52px] h-28 bg-[#ff5c5c] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-0.5 hover:opacity-85 transition-all transform active:scale-95 active:scale-y-97"
                  >
                    <X className="w-3 h-3" /> Del
                  </button>
                </div>

                {/* Input Oculto */}
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRefs[index]}
                  onChange={(e) => carregarImagem(e, index)}
                  className="hidden" 
                />

                {/* Imagem ou Slot Vazio */}
                {img.src ? (
                  <img 
                    src={img.src} 
                    alt={`Miniatura ${index + 1}`}
                    onClick={() => setSlotAtivo(img.id)}
                    className={`w-[116px] h-[116px] rounded-[20px] cursor-pointer transition-all duration-300 object-cover border-[3px] ${
                      slotAtivo === img.id ? 'border-[#36c3ff] opacity-100' : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                  />
                ) : (
                  <div className="w-[116px] h-[116px] rounded-[20px] border-2 border-dashed border-[#ccd6e0] bg-[#f4f8fb] flex items-center justify-center text-[#aab8c4] text-2xl select-none">
                    +
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Seção de Formulário / Descrição */}
        <div className="w-full max-w-[603px] flex flex-col">
          <div className="bg-white rounded-[20px] p-6 md:p-10 shadow-[0px_4px_8px_rgba(0,0,0,0.25)] border border-gray-50">
            <input 
              type="text" 
              placeholder="Digite o nome do animal" 
              defaultValue="Hazel" 
              className="w-full px-[18px] py-3.5 mb-4 bg-[#f9fbfd] border border-[#dce3ea] rounded-xl font-sans font-bold text-3xl md:text-[42px] color-[#222] focus:outline-none focus:border-[#36c3ff]"
            />
            <textarea 
              placeholder="Descreva o animal aqui"
              defaultValue="O Hazel é um lindo gatinho laranja de porte pequeno e apenas 2 aninhos de idade. Resgatado das ruas pela equipe da Resgata Pet, ele logo mostrou sua personalidade encantadora: é super dócil, adora um colo e está sempre pronto para brincar. Mesmo com um passado difícil, Hazel nunca perdeu a alegria de viver — ele ronrona fácil, se apega rápido e conquista todos com seu jeitinho carinhoso e animado. Agora, ele espera por uma família tão especial quanto ele, que lhe ofereça o amor e o cuidado que merece. Se você procura um companheiro leal, carinhoso e cheio de energia boa, o Hazel é o gatinho perfeito para você! 🐾"
              className="w-full min-h-[120px] p-[18px] bg-[#f9fbfd] border border-[#dce3ea] rounded-xl font-sans text-base resize-y focus:outline-none focus:border-[#36c3ff]"
            />
          </div>

          {/* Cards de Atributos (Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 font-sans">
            {/* Coluna Esquerda */}
            <div className="flex flex-col items-center gap-[34px]">
              <div className="bg-white w-full max-w-[263px] h-[72px] px-4 border border-gray-100 rounded-[20px] shadow-[0px_4px_8px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center">
                <label htmlFor="raca" className="text-sm font-bold text-black mb-1">Raça</label>
                <input id="raca" type="text" placeholder="Digite a raça" defaultValue="Indefinido" className="w-full text-center text-sm bg-[#f9fbfd] border border-[#dce3ea] rounded-lg focus:outline-none" />
              </div>

              <div className="bg-white w-full max-w-[263px] h-[72px] px-4 border border-gray-100 rounded-[20px] shadow-[0px_4px_8px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center">
                <label htmlFor="idade" className="text-sm font-bold text-black mb-1">Idade</label>
                <input id="idade" type="text" placeholder="Digite a idade" defaultValue="2 anos" className="w-full text-center text-sm bg-[#f9fbfd] border border-[#dce3ea] rounded-lg focus:outline-none" />
              </div>

              <div className="bg-white w-full max-w-[263px] h-[72px] px-4 border border-gray-100 rounded-[20px] shadow-[0px_4px_8px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center">
                <label htmlFor="localizacao" className="text-sm font-bold text-black mb-1">Localização</label>
                <input id="localizacao" type="text" placeholder="Digite a localização" defaultValue="Paraná - Londrina" className="w-full text-center text-sm bg-[#f9fbfd] border border-[#dce3ea] rounded-lg focus:outline-none" />
              </div>

              <div className="bg-white w-full max-w-[263px] h-[72px] px-4 border border-gray-100 rounded-[20px] shadow-[0px_4px_8px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center">
                <label htmlFor="microchip" className="text-sm font-bold text-black mb-1">Possui Microchip?</label>
                <select id="microchip" className="w-full text-center text-sm bg-[#f9fbfd] border border-[#dce3ea] rounded-lg focus:outline-none py-0.5">
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
            </div>

            {/* Coluna Direita */}
            <div className="flex flex-col items-center gap-[34px]">
              <div className="bg-white w-full max-w-[263px] h-[72px] px-4 border border-gray-100 rounded-[20px] shadow-[0px_4px_8px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center">
                <label htmlFor="sexo" className="text-sm font-bold text-black mb-1">Sexo</label>
                <select id="sexo" className="w-full text-center text-sm bg-[#f9fbfd] border border-[#dce3ea] rounded-lg focus:outline-none py-0.5">
                  <option value="masculino">Macho</option>
                  <option value="feminino">Fêmea</option>
                </select>
              </div>

              <div className="bg-white w-full max-w-[263px] h-[72px] px-4 border border-gray-100 rounded-[20px] shadow-[0px_4px_8px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center">
                <label htmlFor="porte" className="text-sm font-bold text-black mb-1">Porte do animal</label>
                <select id="porte" className="w-full text-center text-sm bg-[#f9fbfd] border border-[#dce3ea] rounded-lg focus:outline-none py-0.5">
                  <option value="pequeno">Pequeno</option>
                  <option value="medio">Médio</option>
                  <option value="grande">Grande</option>
                </select>
              </div>

              <div className="bg-white w-full max-w-[263px] h-[72px] px-4 border border-gray-100 rounded-[20px] shadow-[0px_4px_8px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center">
                <label htmlFor="cor" className="text-sm font-bold text-black mb-1">Cor</label>
                <input id="cor" type="text" placeholder="Digite a cor" defaultValue="Laranja" className="w-full text-center text-sm bg-[#f9fbfd] border border-[#dce3ea] rounded-lg focus:outline-none" />
              </div>

              <div className="bg-white w-full max-w-[263px] h-[72px] px-4 border border-gray-100 rounded-[20px] shadow-[0px_4px_8px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center">
                <label htmlFor="ong" className="text-sm font-bold text-black mb-1">ONG de resgate</label>
                <input id="ong" type="text" placeholder="Digite o nome da ONG" defaultValue="Nome da ONG" className="w-full text-center text-sm bg-[#f9fbfd] border border-[#dce3ea] rounded-lg focus:outline-none" />
              </div>
            </div>
          </div>

          <button 
            type="button" 
            className="w-full max-w-[350px] h-[59px] text-white bg-[#36c3ff] font-sans font-bold text-2xl rounded-[40px] mt-[38px] mx-auto flex items-center justify-center shadow-md hover:bg-[#2bb0e8] transition-colors"
          >
            Confirmar Edição
          </button>
        </div>

      </main>
    </div>
  );
}