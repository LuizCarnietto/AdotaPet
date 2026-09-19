import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../services/ApiService";

export default function RegistroAnimal() {
  const navigate = useNavigate();

  const [estados, setEstados] = useState<any[]>([]);
  const [cidades, setCidades] = useState<any[]>([]);
  const [estadoId, setEstadoId] = useState("");
  const [cidadeId, setCidadeId] = useState("");

  const [racaTexto, setRacaTexto] = useState("");
  const [racaId, setRacaId] = useState("");
  const [racasSugestoes, setRacasSugestoes] = useState<any[]>([]);
  const [buscandoRacas, setBuscandoRacas] = useState(false);
  const [especieSelecionada, setEspecieSelecionada] = useState("");

  // Verifica se o usuário é uma ONG
  useEffect(() => {
    const tipoUsuario = localStorage.getItem("tipoUsuario");

    if (tipoUsuario !== "ROLE_ONG") {
      navigate("/");
    }
  }, [navigate]);

  // Busca os estados ao abrir a página
  useEffect(() => {
    const buscarEstados = async () => {
      try {
        const response = await apiService.get("/localizacao/estados");

        setEstados(response.data);
      } catch (error) {
        console.error("Erro ao buscar estados:", error);
        alert("Não foi possível carregar os estados.");
      }
    };

    buscarEstados();
  }, []);

  // Busca as cidades quando o estado muda
  useEffect(() => {
    if (!estadoId) {
      setCidades([]);
      setCidadeId("");
      return;
    }

    const buscarCidades = async () => {
      try {
        const response = await apiService.get(
          `/localizacao/cidades/${estadoId}`,
        );

        setCidades(response.data);
        setCidadeId("");
      } catch (error) {
        console.error("Erro ao buscar cidades:", error);

        setCidades([]);
        setCidadeId("");

        alert("Não foi possível carregar as cidades.");
      }
    };

    buscarCidades();
  }, [estadoId]);

  // Busca raças de acordo com a espécie e o que foi digitado
  useEffect(() => {
    if (!especieSelecionada) {
      setRacasSugestoes([]);
      return;
    }

    const buscarRacas = async () => {
      try {
        setBuscandoRacas(true);

        const response = await apiService.get(
          `/racas/${especieSelecionada}/buscar`,
          {
            params: {
              nome: racaTexto.trim(),
            },
          },
        );

        setRacasSugestoes(response.data);
      } catch (error) {
        console.error("Erro ao buscar raças:", error);
        setRacasSugestoes([]);
      } finally {
        setBuscandoRacas(false);
      }
    };

    const timer = setTimeout(() => {
      buscarRacas();
    }, 300);

    return () => clearTimeout(timer);
  }, [racaTexto, especieSelecionada]);

  const cadastrarAnimal = async () => {
    try {
      const nomeInput = document.querySelector(
        "#descricaoAnimal > input",
      ) as HTMLInputElement | null;

      const descricaoInput = document.querySelector(
        "#descricaoAnimal textarea",
      ) as HTMLTextAreaElement | null;

      const idadeInput = document.getElementById(
        "idade",
      ) as HTMLSelectElement | null;

      const microchipInput = document.getElementById(
        "microchip",
      ) as HTMLSelectElement | null;

      const sexoInput = document.getElementById(
        "sexo",
      ) as HTMLSelectElement | null;

      const porteInput = document.getElementById(
        "porte",
      ) as HTMLSelectElement | null;

      const corInput = document.getElementById(
        "cor",
      ) as HTMLInputElement | null;

      const vacinadoInput = document.getElementById(
        "vacinado",
      ) as HTMLSelectElement | null;

      // Valores

      const nome = nomeInput?.value.trim() || "";
      const comportamento = descricaoInput?.value.trim() || "";
      const idade = idadeInput?.value || "";
      const especie = especieSelecionada;
      const microchip = microchipInput?.value || "";
      const sexo = sexoInput?.value || "";
      const porte = porteInput?.value || "";
      const cor = corInput?.value.trim() || "";
      const vacinado = vacinadoInput?.value || "";

      // Validações

      if (!nome) {
        alert("Digite o nome do animal.");
        return;
      }

      if (!racaId) {
        alert("Selecione uma raça.");
        return;
      }

      if (!idade) {
        alert("Selecione a idade do animal.");
        return;
      }

      if (!especie) {
        alert("Selecione o tipo de animal.");
        return;
      }

      if (!microchip) {
        alert("Informe se o animal possui microchip.");
        return;
      }

      if (!sexo) {
        alert("Selecione o sexo do animal.");
        return;
      }

      if (!porte) {
        alert("Selecione o porte do animal.");
        return;
      }

      if (!cor) {
        alert("Digite a cor do animal.");
        return;
      }

      if (!vacinado) {
        alert("Informe se o animal é vacinado.");
        return;
      }

      if (!estadoId) {
        alert("Selecione o estado.");
        return;
      }

      if (!cidadeId) {
        alert("Selecione a cidade.");
        return;
      }

      if (!comportamento) {
        alert("Descreva o animal.");
        return;
      }

      // Fotos

      const fotos = Array.from(
        document.querySelectorAll<HTMLImageElement>("img.miniatura"),
      )
        .map((img) => img.src)
        .filter((src) => src);

      if (fotos.length === 0) {
        alert("Adicione pelo menos uma foto do animal.");
        return;
      }

      // Payload enviado para o backend

      const payload = {
        nome: nome,

        racaId: Number(racaId),

        idade: idade.toUpperCase(),

        historicoSaude: "",

        comportamento: comportamento,

        fotos: JSON.stringify(fotos),

        possuiChip: microchip === "sim",

        cidadeId: Number(cidadeId),

        vacinado: vacinado === "sim",

        especie: especie.toUpperCase(),

        porte: porte.toUpperCase(),

        sexo: sexo === "masculino" ? "MACHO" : "FEMEA",

        // O backend define DISPONIVEL
        // automaticamente no AnimalService.
        status: null,

        cor: cor,
      };

      console.log("Dados enviados para o backend:");
      console.log(payload);

      // POST /animal

      const response = await apiService.post("/animal", payload);

      console.log("Animal cadastrado:");
      console.log(response.data);

      alert("Animal cadastrado com sucesso!");

      // Vai para a lista de adoção

      navigate("/listaadotar");
    } catch (error: any) {
      console.error("Erro ao cadastrar animal:", error);

      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Resposta:", error.response.data);

        if (error.response.status === 401) {
          alert("Sua sessão expirou. Faça login novamente.");

          localStorage.removeItem("token");
          localStorage.removeItem("tipoUsuario");

          navigate("/login");

          return;
        }

        if (error.response.status === 403) {
          alert("Apenas usuários do tipo ONG podem cadastrar animais.");

          return;
        }

        alert(
          "Erro ao cadastrar o animal. Verifique os dados e tente novamente.",
        );

        return;
      }

      alert("Não foi possível conectar ao servidor.");
    }
  };

  return (
    <>
      <style>
        {`
          @import url("https://fonts.googleapis.com/css2?family=Italiana&display=swap");
          @import url("https://fonts.googleapis.com/css2?family=Italianno&display=swap");
          @import url("https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap");
          @import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");

          * {
            box-sizing: border-box;
          }

          body {
            padding: 0;
            margin: 0;
            display: flex;
            align-items: center;
            flex-direction: column;
            background-color: #fff;
          }

          header {
            background-color: white;
            width: 100%;
            height: 90px;
            padding: 10px 0;
            align-items: center;
            text-align: center;
            display: flex;
            justify-content: center;
            box-sizing: border-box;
          }

          nav {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 70px;
          }

          nav > a:hover {
            text-decoration: underline;
          }

          nav > a > img {
            height: 65px;
            width: 75px;
            object-fit: contain;
          }

          a {
            text-decoration: none;
            color: black;
            font-family: "Courier New", Courier, monospace;
          }

          div#container {
            background-color: white;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            max-width: 1440px;
            width: 100%;
            padding: 0 30px;
            margin: 15px auto 0 auto;
            box-sizing: border-box;
            gap: 50px;
          }

          #containerFotosAnimal {
            flex-shrink: 0;
          }

          div#fotoAnimal {
            background-color: white;
            width: 460px;
            height: 460px;
            border-radius: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          #imagemGrande {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 20px;
            border: 3px solid #36c3ff;
            display: none;
          }

          #imagemGrande.ativa {
            display: block;
          }

          #placeHolderImagem {
            width: 100%;
            height: 100%;
            border-radius: 20px;
            border: 3px dashed #36c3ff;
            background-color: #f4f8fb;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #aab8c4;
            font-size: 18px;
            box-sizing: border-box;
          }

          #placeHolderImagem.oculto {
            display: none;
          }

          div#cardFotoAnimal {
            display: flex;
            flex-direction: row;
            align-items: flex-end;
            justify-content: center;
            background-color: white;
            width: 460px;
            margin-top: 15px;
            gap: 12px;
          }

          .miniaturaWrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
          }

          .miniaturaControles {
            display: flex;
            gap: 6px;
          }

          .btnMiniatura {
            width: 52px;
            height: 28px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 12px;
            font-family: "Inter", sans-serif;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            transition: opacity 0.2s, transform 0.1s;
          }

          .btnMiniatura:hover {
            opacity: 0.85;
            transform: scale(1.05);
          }

          .btnMiniatura:active {
            transform: scale(0.97);
          }

          .btnAdicionar {
            background-color: #36c3ff;
            color: white;
          }

          .btnApagar {
            background-color: #ff5c5c;
            color: white;
          }

          img.miniatura {
            width: 90px;
            height: 90px;
            border-radius: 20px;
            cursor: pointer;
            transition: 0.3s;
            opacity: 0.8;
            border: 3px solid #36c3ff;
            object-fit: cover;
          }

          img.miniatura:hover {
            opacity: 1;
          }

          img.miniatura.ativa {
            opacity: 1;
          }

          .slotVazio {
            width: 90px;
            height: 90px;
            border-radius: 20px;
            border: 2px dashed #ccd6e0;
            background-color: #f4f8fb;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #aab8c4;
            font-size: 28px;
            cursor: default;
          }

          input.inputArquivo {
            display: none;
          }

          div#descricaoAnimal {
            background-color: white;
            width: 650px;
            border-radius: 20px;
            padding: 24px;
            box-shadow: 0px 4px 8px rgba(0,0,0,25%);
            box-sizing: border-box;
          }

          #descricaoAnimal > input {
            width: 100%;
            padding: 10px 16px;
            margin-bottom: 10px;
            background: #f9fbfd;
            border: 1px solid #dce3ea;
            border-radius: 10px;
            box-sizing: border-box;
            font-family: "Montserrat", sans-serif;
            font-weight: 700;
            font-size: 30px;
            color: #222;
          }

          #descricaoAnimal textarea {
            width: 100%;
            min-height: 80px;
            padding: 12px;
            background: #f9fbfd;
            border-radius: 10px;
            border: 1px solid #dce3ea;
            box-sizing: border-box;
            resize: vertical;
            font-size: 14px;
            font-family: "Inter", sans-serif;
          }

          input::placeholder,
          textarea::placeholder {
            font-size: 13px;
            font-weight: 500;
            font-family: "Inter", sans-serif;
          }

          .containerCard {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
            margin-top: 14px;
            font-family: "Inter", sans-serif;
          }

          div.cardBoxEsquerdo,
          div.cardBoxDireito {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            text-align: center;
          }

          div.infoCard1,
          div.infoCard2 {
            background-color: white;
            width: 263px;
            height: 68px;
            padding-top: 7px;
            padding-bottom: 7px;
            border-width: 1px;
            border-radius: 20px;
            box-shadow: 0px 4px 8px rgba(0,0,0,25%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          .infoCard1 label,
          .infoCard2 label {
            font-size: 14px;
            color: black;
            font-weight: bold;
            margin-bottom: 5px;
          }

          .infoCard1 input,
          .infoCard2 input,
          .infoCard1 select,
          .infoCard2 select {
            width: 80%;
            height: 30px;
            padding: 2px 4px;
            border: 1px solid #dce3ea;
            border-radius: 10px;
            text-align: center;
            font-size: 12px;
            background: #f9fbfd;
            outline: none;
          }

          .racaAutocomplete {
              position: relative;
              width: 80%;
            }

            .racaAutocomplete input {
              width: 100%;
              height: 30px;
              padding: 2px 4px;
              border: 1px solid #dce3ea;
              border-radius: 10px;
              text-align: center;
              font-size: 12px;
              background: #f9fbfd;
              outline: none;
              box-sizing: border-box;
            }

            .racaAutocomplete input:disabled {
            background-color: #eef2f5;
            cursor: not-allowed;
            opacity: 0.7;
            }

            .racaSugestoes {
              position: absolute;
              top: 100%;
              left: 0;
              width: 100%;
              background: white;
              border: 1px solid #dce3ea;
              border-radius: 10px;
              box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
              z-index: 1000;
              max-height: 180px;
              overflow-y: auto;
            }

            .racaSugestao {   
              padding: 9px 12px;
              cursor: pointer;
              font-family: "Inter", sans-serif;
              font-size: 12px;
              text-align: left;
            }

            .racaSugestao:hover {
              background-color: #f0f8fc;
            }

            .racaBuscando {
              position: absolute;
              top: 100%;
              left: 0;
              width: 100%;
              padding: 9px 12px;
              background: white;
              border: 1px solid #dce3ea;
              border-radius: 10px;
              font-family: "Inter", sans-serif;
              font-size: 12px;
              z-index: 1000;
            }

          .localizacaoCard {
            height: 95px !important;
          }

          .localizacaoCampos {
            width: 90%;
            display: flex;
            gap: 6px;
          }

          .localizacaoCampos select {
            width: 50% !important;
            height: 30px !important;
            padding: 2px 4px !important;
            font-size: 11px !important;
          }

          .localizacaoCampos select:disabled {
            opacity: 0.6;
          }

          #botaoAzul {
            width: 300px;
            height: 48px;
            color: white;
            background-color: #36c3ff;
            border: none;
            border-radius: 40px;
            font-family: "Inter", sans-serif;
            font-weight: bold;
            font-size: 18px;
            display: block;
            text-align: center;
            margin: 18px auto 0 auto;
            line-height: 48px;
            cursor: pointer;
          }

          #botaoAzul:hover {
            background-color: #1ab0f0;
            transition: background-color 0.2s ease;
          }

          /* ================================
             TELAS HD / ALTURA MENOR
             ================================ */

          @media (max-height: 850px) {
            header {
              height: 70px;
              padding: 5px 0;
            }

            nav {
              gap: 55px;
            }

            nav > a > img {
              height: 52px;
              width: 65px;
            }

            div#container {
              margin-top: 8px;
              gap: 35px;
              padding: 0 25px;
            }

            div#fotoAnimal {
              width: 390px;
              height: 390px;
            }

            div#cardFotoAnimal {
              width: 390px;
              margin-top: 10px;
              gap: 8px;
            }

            img.miniatura,
            .slotVazio {
              width: 72px;
              height: 72px;
            }

            div#descricaoAnimal {
              width: 600px;
              padding: 18px;
            }

            #descricaoAnimal > input {
              font-size: 25px;
              padding: 9px 14px;
              margin-bottom: 8px;
            }

            #descricaoAnimal textarea {
              min-height: 65px;
              padding: 10px;
            }

            .containerCard {
              gap: 8px;
              margin-top: 8px;
            }

            div.cardBoxEsquerdo,
            div.cardBoxDireito {
              gap: 7px;
            }

            div.infoCard1,
            div.infoCard2 {
              height: 54px;
              padding-top: 5px;
              padding-bottom: 5px;
            }

            .infoCard1 label,
            .infoCard2 label {
              font-size: 12px;
              margin-bottom: 3px;
            }

            .infoCard1 input,
            .infoCard2 input,
            .infoCard1 select,
            .infoCard2 select {
              height: 25px;
              font-size: 11px;
            }

            .localizacaoCard {
              height: 70px !important;
            }

            .localizacaoCampos select {
              height: 25px !important;
              font-size: 10px !important;
            }

            #botaoAzul {
              width: 260px;
              height: 42px;
              line-height: 42px;
              font-size: 16px;
              margin-top: 10px;
            }
          }

          /* ================================
             TELAS MÉDIAS
             ================================ */

          @media (max-width: 1200px) {
            div#container {
              gap: 25px;
              padding: 0 20px;
            }

            div#fotoAnimal {
              width: 400px;
              height: 400px;
            }

            div#cardFotoAnimal {
              width: 400px;
            }

            div#descricaoAnimal {
              width: 560px;
            }

            nav {
              gap: 40px;
            }
          }

          /* ================================
             CELULAR / TELAS PEQUENAS
             ================================ */

          @media (max-width: 900px) {
            body {
              overflow-y: auto;
            }

            header {
              height: auto;
              padding: 15px;
            }

            nav {
              gap: 20px;
              flex-wrap: wrap;
            }

            div#container {
              flex-direction: column;
              align-items: center;
              margin-top: 20px;
            }

            div#fotoAnimal {
              width: min(90vw, 450px);
              height: min(90vw, 450px);
            }

            div#cardFotoAnimal {
              width: 100%;
            }

            div#descricaoAnimal {
              width: min(95vw, 650px);
            }
          }
        `}
      </style>

      <header>
        <nav>
          <a href="/login">Entrar</a>

          <a href="/listaadotar">Adotar</a>

          <a href="/">
            <img
              src="/imagens/logoMelhor.png"
              alt="Logo com desenho e escrito"
            />
          </a>

          <a href="/#sobre">Sobre</a>

          <a href="/#faq">F.A.Q</a>
        </nav>
      </header>

      <div id="container">
        <div id="containerFotosAnimal">
          <div id="fotoAnimal">
            <img id="imagemGrande" />

            <div id="placeHolderImagem">Nenhuma imagem selecionada</div>
          </div>

          {/* Miniaturas com controles */}

          <div id="cardFotoAnimal">
            {/* SLOT 1 */}

            <div className="miniaturaWrapper" id="wrapper-0">
              <div className="miniaturaControles">
                <button
                  className="btnMiniatura btnAdicionar"
                  title="Adicionar imagem"
                  onClick={() => document.getElementById("input-0")?.click()}
                >
                  + Add
                </button>

                <button
                  className="btnMiniatura btnApagar"
                  title="Apagar imagem"
                  onClick={() => {
                    const wrapper = document.getElementById("wrapper-0");

                    const img = wrapper?.querySelector("img.miniatura");

                    if (!img) return;

                    const eraAtiva = img.classList.contains("ativa");

                    img.remove();

                    const input = document.getElementById(
                      "input-0",
                    ) as HTMLInputElement | null;

                    if (input) input.value = "";

                    const slot = document.createElement("div");

                    slot.className = "slotVazio";
                    slot.textContent = "+";

                    wrapper?.appendChild(slot);

                    if (eraAtiva) {
                      const imagemGrande = document.getElementById(
                        "imagemGrande",
                      ) as HTMLImageElement | null;

                      if (imagemGrande) {
                        imagemGrande.src = "";
                        imagemGrande.classList.remove("ativa");

                        const placeholder =
                          document.getElementById("placeHolderImagem");

                        if (placeholder) {
                          placeholder.classList.remove("oculto");
                        }
                      }

                      const outra = document.querySelector(
                        "img.miniatura",
                      ) as HTMLImageElement | null;

                      if (outra) {
                        const grande = document.getElementById(
                          "imagemGrande",
                        ) as HTMLImageElement | null;

                        if (grande) {
                          grande.src = outra.src;
                          grande.classList.add("ativa");

                          const placeholder =
                            document.getElementById("placeHolderImagem");

                          if (placeholder) {
                            placeholder.classList.add("oculto");
                          }
                        }

                        document
                          .querySelectorAll("img.miniatura")
                          .forEach((img) => img.classList.remove("ativa"));

                        outra.classList.add("ativa");
                      }
                    }
                  }}
                >
                  ✕ Del
                </button>
              </div>

              <input
                type="file"
                accept="image/*"
                className="inputArquivo"
                id="input-0"
                onChange={(e) => {
                  if (!e.target.files || !e.target.files[0]) return;

                  const reader = new FileReader();

                  reader.onload = (event) => {
                    const wrapper = document.getElementById("wrapper-0");

                    if (!wrapper) return;

                    const slotVazio = wrapper.querySelector(".slotVazio");

                    if (slotVazio) {
                      slotVazio.remove();
                    }

                    let img = wrapper.querySelector(
                      "img.miniatura",
                    ) as HTMLImageElement | null;

                    if (!img) {
                      img = document.createElement("img");

                      img.className = "miniatura";

                      img.onclick = function () {
                        const imagemGrande = document.getElementById(
                          "imagemGrande",
                        ) as HTMLImageElement | null;

                        if (imagemGrande) {
                          imagemGrande.src = img!.src;
                          imagemGrande.classList.add("ativa");

                          const placeholder =
                            document.getElementById("placeHolderImagem");

                          if (placeholder) {
                            placeholder.classList.add("oculto");
                          }
                        }

                        document
                          .querySelectorAll("img.miniatura")
                          .forEach((image) => image.classList.remove("ativa"));

                        img!.classList.add("ativa");
                      };

                      wrapper.appendChild(img);
                    }

                    img.src = event.target?.result as string;

                    const imagemGrande = document.getElementById(
                      "imagemGrande",
                    ) as HTMLImageElement | null;

                    if (imagemGrande) {
                      imagemGrande.src = img.src;
                      imagemGrande.classList.add("ativa");

                      const placeholder =
                        document.getElementById("placeHolderImagem");

                      if (placeholder) {
                        placeholder.classList.add("oculto");
                      }
                    }

                    document
                      .querySelectorAll("img.miniatura")
                      .forEach((image) => image.classList.remove("ativa"));

                    img.classList.add("ativa");
                  };

                  reader.readAsDataURL(e.target.files[0]);
                }}
              />

              <div className="slotVazio">+</div>
            </div>

            {/* SLOT 2 */}

            <div className="miniaturaWrapper" id="wrapper-1">
              <div className="miniaturaControles">
                <button
                  className="btnMiniatura btnAdicionar"
                  title="Adicionar imagem"
                  onClick={() => document.getElementById("input-1")?.click()}
                >
                  + Add
                </button>

                <button
                  className="btnMiniatura btnApagar"
                  title="Apagar imagem"
                  onClick={() => {
                    const wrapper = document.getElementById("wrapper-1");

                    const img = wrapper?.querySelector("img.miniatura");

                    if (!img) return;

                    const eraAtiva = img.classList.contains("ativa");

                    img.remove();

                    const input = document.getElementById(
                      "input-1",
                    ) as HTMLInputElement | null;

                    if (input) input.value = "";

                    const slot = document.createElement("div");

                    slot.className = "slotVazio";
                    slot.textContent = "+";

                    wrapper?.appendChild(slot);

                    if (eraAtiva) {
                      const imagemGrande = document.getElementById(
                        "imagemGrande",
                      ) as HTMLImageElement | null;

                      if (imagemGrande) {
                        imagemGrande.src = "";
                        imagemGrande.classList.remove("ativa");

                        const placeholder =
                          document.getElementById("placeHolderImagem");

                        if (placeholder) {
                          placeholder.classList.remove("oculto");
                        }
                      }

                      const outra = document.querySelector(
                        "img.miniatura",
                      ) as HTMLImageElement | null;

                      if (outra) {
                        const grande = document.getElementById(
                          "imagemGrande",
                        ) as HTMLImageElement | null;

                        if (grande) {
                          grande.src = outra.src;
                          grande.classList.add("ativa");

                          const placeholder =
                            document.getElementById("placeHolderImagem");

                          if (placeholder) {
                            placeholder.classList.add("oculto");
                          }
                        }

                        document
                          .querySelectorAll("img.miniatura")
                          .forEach((img) => img.classList.remove("ativa"));

                        outra.classList.add("ativa");
                      }
                    }
                  }}
                >
                  ✕ Del
                </button>
              </div>

              <input
                type="file"
                accept="image/*"
                className="inputArquivo"
                id="input-1"
                onChange={(e) => {
                  if (!e.target.files || !e.target.files[0]) return;

                  const reader = new FileReader();

                  reader.onload = (event) => {
                    const wrapper = document.getElementById("wrapper-1");

                    if (!wrapper) return;

                    const slotVazio = wrapper.querySelector(".slotVazio");

                    if (slotVazio) {
                      slotVazio.remove();
                    }

                    let img = wrapper.querySelector(
                      "img.miniatura",
                    ) as HTMLImageElement | null;

                    if (!img) {
                      img = document.createElement("img");

                      img.className = "miniatura";

                      img.onclick = function () {
                        const imagemGrande = document.getElementById(
                          "imagemGrande",
                        ) as HTMLImageElement | null;

                        if (imagemGrande) {
                          imagemGrande.src = img!.src;
                          imagemGrande.classList.add("ativa");

                          const placeholder =
                            document.getElementById("placeHolderImagem");

                          if (placeholder) {
                            placeholder.classList.add("oculto");
                          }
                        }

                        document
                          .querySelectorAll("img.miniatura")
                          .forEach((image) => image.classList.remove("ativa"));

                        img!.classList.add("ativa");
                      };

                      wrapper.appendChild(img);
                    }

                    img.src = event.target?.result as string;

                    const imagemGrande = document.getElementById(
                      "imagemGrande",
                    ) as HTMLImageElement | null;

                    if (imagemGrande) {
                      imagemGrande.src = img.src;
                      imagemGrande.classList.add("ativa");

                      const placeholder =
                        document.getElementById("placeHolderImagem");

                      if (placeholder) {
                        placeholder.classList.add("oculto");
                      }
                    }

                    document
                      .querySelectorAll("img.miniatura")
                      .forEach((image) => image.classList.remove("ativa"));

                    img.classList.add("ativa");
                  };

                  reader.readAsDataURL(e.target.files[0]);
                }}
              />

              <div className="slotVazio">+</div>
            </div>

            {/* SLOT 3 */}

            <div className="miniaturaWrapper" id="wrapper-2">
              <div className="miniaturaControles">
                <button
                  className="btnMiniatura btnAdicionar"
                  title="Adicionar imagem"
                  onClick={() => document.getElementById("input-2")?.click()}
                >
                  + Add
                </button>

                <button
                  className="btnMiniatura btnApagar"
                  title="Apagar imagem"
                  onClick={() => {
                    const wrapper = document.getElementById("wrapper-2");

                    const img = wrapper?.querySelector("img.miniatura");

                    if (!img) return;

                    const eraAtiva = img.classList.contains("ativa");

                    img.remove();

                    const input = document.getElementById(
                      "input-2",
                    ) as HTMLInputElement | null;

                    if (input) input.value = "";

                    const slot = document.createElement("div");

                    slot.className = "slotVazio";
                    slot.textContent = "+";

                    wrapper?.appendChild(slot);

                    if (eraAtiva) {
                      const imagemGrande = document.getElementById(
                        "imagemGrande",
                      ) as HTMLImageElement | null;

                      if (imagemGrande) {
                        imagemGrande.src = "";
                        imagemGrande.classList.remove("ativa");

                        const placeholder =
                          document.getElementById("placeHolderImagem");

                        if (placeholder) {
                          placeholder.classList.remove("oculto");
                        }
                      }

                      const outra = document.querySelector(
                        "img.miniatura",
                      ) as HTMLImageElement | null;

                      if (outra) {
                        const grande = document.getElementById(
                          "imagemGrande",
                        ) as HTMLImageElement | null;

                        if (grande) {
                          grande.src = outra.src;
                          grande.classList.add("ativa");

                          const placeholder =
                            document.getElementById("placeHolderImagem");

                          if (placeholder) {
                            placeholder.classList.add("oculto");
                          }
                        }

                        document
                          .querySelectorAll("img.miniatura")
                          .forEach((img) => img.classList.remove("ativa"));

                        outra.classList.add("ativa");
                      }
                    }
                  }}
                >
                  ✕ Del
                </button>
              </div>

              <input
                type="file"
                accept="image/*"
                className="inputArquivo"
                id="input-2"
                onChange={(e) => {
                  if (!e.target.files || !e.target.files[0]) return;

                  const reader = new FileReader();

                  reader.onload = (event) => {
                    const wrapper = document.getElementById("wrapper-2");

                    if (!wrapper) return;

                    const slotVazio = wrapper.querySelector(".slotVazio");

                    if (slotVazio) {
                      slotVazio.remove();
                    }

                    let img = wrapper.querySelector(
                      "img.miniatura",
                    ) as HTMLImageElement | null;

                    if (!img) {
                      img = document.createElement("img");

                      img.className = "miniatura";

                      img.onclick = function () {
                        const imagemGrande = document.getElementById(
                          "imagemGrande",
                        ) as HTMLImageElement | null;

                        if (imagemGrande) {
                          imagemGrande.src = img!.src;
                          imagemGrande.classList.add("ativa");

                          const placeholder =
                            document.getElementById("placeHolderImagem");

                          if (placeholder) {
                            placeholder.classList.add("oculto");
                          }
                        }

                        document
                          .querySelectorAll("img.miniatura")
                          .forEach((image) => image.classList.remove("ativa"));

                        img!.classList.add("ativa");
                      };

                      wrapper.appendChild(img);
                    }

                    img.src = event.target?.result as string;

                    const imagemGrande = document.getElementById(
                      "imagemGrande",
                    ) as HTMLImageElement | null;

                    if (imagemGrande) {
                      imagemGrande.src = img.src;
                      imagemGrande.classList.add("ativa");

                      const placeholder =
                        document.getElementById("placeHolderImagem");

                      if (placeholder) {
                        placeholder.classList.add("oculto");
                      }
                    }

                    document
                      .querySelectorAll("img.miniatura")
                      .forEach((image) => image.classList.remove("ativa"));

                    img.classList.add("ativa");
                  };

                  reader.readAsDataURL(e.target.files[0]);
                }}
              />

              <div className="slotVazio">+</div>
            </div>
          </div>
        </div>

        {/* Descrição */}

        <div className="contDescricaoAnimal">
          <div id="descricaoAnimal">
            <input
              type="text"
              placeholder="Digite o nome do animal"
              defaultValue=""
            />

            <textarea placeholder="Descreva o animal aqui"></textarea>
          </div>

          {/* Cards */}

          <div className="containerCard">
            {/* COLUNA ESQUERDA */}

            <div className="cardBoxEsquerdo">
              <div className="infoCard1">
                <label htmlFor="raca">Raça</label>

                <div className="racaAutocomplete">
                  <input
                    id="raca"
                    type="text"
                    placeholder={
                      especieSelecionada
                        ? "Digite a raça do animal"
                        : "Selecione 1° a espécie do animal"
                    }
                    value={racaTexto}
                    onChange={(e) => {
                      setRacaTexto(e.target.value);
                      setRacaId("");
                    }}
                    autoComplete="off"
                    disabled={!especieSelecionada}
                  />

                  {racasSugestoes.length > 0 && (
                    <div className="racaSugestoes">
                      {racasSugestoes.map((raca) => (
                        <div
                          key={raca.id}
                          className="racaSugestao"
                          onClick={() => {
                            setRacaTexto(raca.nome);
                            setRacaId(String(raca.id));
                            setRacasSugestoes([]);
                          }}
                        >
                          {raca.nome}
                        </div>
                      ))}
                    </div>
                  )}

                  {buscandoRacas && (
                    <div className="racaBuscando">Buscando...</div>
                  )}
                </div>
              </div>

              <div className="infoCard1">
                <label htmlFor="idade">Idade</label>

                <select id="idade" defaultValue="">
                  <option value="" disabled>
                    Selecione uma opção
                  </option>

                  <option value="FILHOTE">Filhote</option>

                  <option value="ADULTO">Adulto</option>

                  <option value="IDOSO">Idoso</option>
                </select>
              </div>

              <div className="infoCard1">
                <label htmlFor="especie">Espécie do animal</label>

                <select
                  id="especie"
                  value={especieSelecionada}
                  onChange={(e) => {
                    setEspecieSelecionada(e.target.value);
                    setRacaTexto("");
                    setRacaId("");
                    setRacasSugestoes([]);
                  }}
                >
                  <option value="" disabled>
                    Selecione uma opção
                  </option>

                  <option value="CACHORRO">Cachorro</option>

                  <option value="GATO">Gato</option>
                </select>
              </div>

              <div className="infoCard1">
                <label htmlFor="microchip">Possui Microchip?</label>

                <select id="microchip" defaultValue="">
                  <option value="" disabled>
                    Selecione uma opção
                  </option>

                  <option value="sim">Sim</option>

                  <option value="nao">Não</option>
                </select>
              </div>

              {/* LOCALIZAÇÃO */}

              <div className="infoCard1 localizacaoCard">
                <label>Localização</label>

                <div className="localizacaoCampos">
                  <select
                    id="estado"
                    value={estadoId}
                    onChange={(e) => setEstadoId(e.target.value)}
                  >
                    <option value="" disabled>
                      Estado
                    </option>

                    {estados.map((estado) => (
                      <option key={estado.id} value={estado.id}>
                        {estado.sigla} - {estado.nome}
                      </option>
                    ))}
                  </select>

                  <select
                    id="cidade"
                    value={cidadeId}
                    onChange={(e) => setCidadeId(e.target.value)}
                    disabled={!estadoId}
                  >
                    <option value="" disabled>
                      {estadoId ? "Cidade" : "Selecione o estado"}
                    </option>

                    {cidades.map((cidade) => (
                      <option key={cidade.id} value={cidade.id}>
                        {cidade.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* COLUNA DIREITA */}

            <div className="cardBoxDireito">
              <div className="infoCard2">
                <label htmlFor="sexo">Sexo</label>

                <select id="sexo" defaultValue="">
                  <option value="" disabled>
                    Selecione uma opção
                  </option>

                  <option value="masculino">Macho</option>

                  <option value="feminino">Fêmea</option>
                </select>
              </div>

              <div className="infoCard2">
                <label htmlFor="porte">Porte do animal</label>

                <select id="porte" defaultValue="">
                  <option value="" disabled>
                    Selecione uma opção
                  </option>

                  <option value="PEQUENO">Pequeno</option>

                  <option value="MEDIO">Médio</option>

                  <option value="GRANDE">Grande</option>
                </select>
              </div>

              <div className="infoCard2">
                <label htmlFor="cor">Cor</label>

                <input
                  id="cor"
                  type="text"
                  placeholder="Digite a cor do animal"
                  defaultValue=""
                />
              </div>

              <div className="infoCard2">
                <label htmlFor="vacinado">Vacinado?</label>

                <select id="vacinado" defaultValue="">
                  <option value="" disabled>
                    Selecione uma opção
                  </option>

                  <option value="sim">Sim</option>

                  <option value="nao">Não</option>
                </select>
              </div>
            </div>
          </div>

          <button id="botaoAzul" type="button" onClick={cadastrarAnimal}>
            Confirmar Registro
          </button>
        </div>
      </div>
    </>
  );
}
