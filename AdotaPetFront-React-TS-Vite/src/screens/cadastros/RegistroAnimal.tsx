import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../services/ApiService";

export default function RegistroAnimal() {
  const navigate = useNavigate();

  useEffect(() => {
    const tipoUsuario = localStorage.getItem("tipoUsuario");

    if (tipoUsuario !== "ROLE_ONG") {
      navigate("/");
    }
  }, [navigate]);

  const cadastrarAnimal = async () => {
    try {
      const nomeInput = document.querySelector(
        "#descricaoAnimal > input",
      ) as HTMLInputElement | null;

      const descricaoInput = document.querySelector(
        "#descricaoAnimal textarea",
      ) as HTMLTextAreaElement | null;

      const racaInput = document.getElementById(
        "raca",
      ) as HTMLInputElement | null;

      const idadeInput = document.getElementById(
        "idade",
      ) as HTMLSelectElement | null;

      const especieInput = document.getElementById(
        "especie",
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

      const localizacaoInput = document.getElementById(
        "localizacao",
      ) as HTMLInputElement | null;

      // valores

      const nome = nomeInput?.value.trim() || "";
      const comportamento = descricaoInput?.value.trim() || "";
      const raca = racaInput?.value.trim() || "";
      const idade = idadeInput?.value || "";
      const especie = especieInput?.value || "";
      const microchip = microchipInput?.value || "";
      const sexo = sexoInput?.value || "";
      const porte = porteInput?.value || "";
      const cor = corInput?.value.trim() || "";
      const vacinado = vacinadoInput?.value || "";
      const localizacao = localizacaoInput?.value.trim() || "";

      // Validando

      if (!nome) {
        alert("Digite o nome do animal.");
        return;
      }

      if (!raca) {
        alert("Digite a raça do animal.");
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

      if (!localizacao) {
        alert("Digite a localização do animal.");
        return;
      }

      if (!comportamento) {
        alert("Descreva o animal.");
        return;
      }

      // fotos

      const fotos = Array.from(
        document.querySelectorAll<HTMLImageElement>("img.miniatura"),
      )
        .map((img) => img.src)
        .filter((src) => src);

      if (fotos.length === 0) {
        alert("Adicione pelo menos uma foto do animal.");
        return;
      }

      // convertendo para o formato esperado pelo backend (Java)

      const payload = {
        nome: nome,

        raca: raca,

        idade: idade.toUpperCase(),

        historicoSaude: "",

        comportamento: comportamento,

        fotos: JSON.stringify(fotos),

        possuiChip: microchip === "sim",

        localizacao: localizacao,

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

      // vai para a lista de adoção

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

          body {
            padding: 0px;
            margin: 0px;
            display: flex;
            align-items: center;
            flex-direction: column;
            background-color: #fff;
          }

          header {
            background-color: white;
            width: 100%;
            padding: 40px 0px 40px 0px;
            align-items: center;
            text-align: center;
            display: flex;
            justify-content: center;
          }

          nav {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 80px;
          }

          nav > a:hover {
            text-decoration: underline;
          }

          nav > a > img {
            height: 70px;
            width: 80px;
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
            padding: 0px 46px 0px 46px;
            margin: 30px auto 0px auto;
            box-sizing: border-box;
          }

          div#fotoAnimal {
            background-color: white;
            width: 549px;
            height: 549px;
            margin-right: 107px;
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
            width: 550px;
            margin-top: 36px;
            gap: 18px;
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
            width: 116px;
            height: 116px;
            border-radius: 20px;
            cursor: pointer;
            transition: 0.3s;
            opacity: 0.8;
            border: 3px solid #36c3ff;
          }

          img.miniatura:hover {
            opacity: 1;
          }

          img.miniatura.ativa {
            opacity: 1;
          }

          .slotVazio {
            width: 116px;
            height: 116px;
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
            width: 686px;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0px 4px 8px rgba(0,0,0,25%);
            box-sizing: border-box;
          }

          #descricaoAnimal > input {
            width: 100%;
            padding: 14px 18px;
            margin-bottom: 16px;
            background: #f9fbfd;
            border: 1px solid #dce3ea;
            border-radius: 10px;
            box-sizing: border-box;
            font-family: "Montserrat", sans-serif;
            font-weight: 700;
            font-size: 42px;
            color: #222;
          }

          #descricaoAnimal textarea {
            width: 100%;
            min-height: 120px;
            padding: 18px;
            background: #f9fbfd;
            border-radius: 10px;
            border: 1px solid #dce3ea;
            box-sizing: border-box;
            resize: vertical;
            font-size: 16px;
            font-family: "Inter", sans-serif;
          }

          input::placeholder,
          textarea::placeholder {
            font-size: 14px;
            font-weight: 500;
            font-family: "Inter", sans-serif;
          }

          .containerCard {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 20px;
            font-family: "Inter", sans-serif;
          }

          div.cardBoxEsquerdo,
          div.cardBoxDireito {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 34px;
            text-align: center;
          }

          div.infoCard1 {
            background-color: white;
            width: 263px;
            height: 80px;
            margin-right: 24px;
            padding-top: 10px;
            padding-bottom: 10px;
            border-width: 1px;
            border-radius: 20px;
            box-shadow: 0px 4px 8px rgba(0,0,0,25%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          div.infoCard2 {
            background-color: white;
            width: 263px;
            height: 80px;
            margin-left: 24px;
            padding-top: 10px;
            padding-bottom: 10px;
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
            font-size: 16px;
            color: black;
            font-weight: bold;
            margin-bottom: 10px;
          }

          .infoCard1 input,
          .infoCard2 input,
          .infoCard1 select,
          .infoCard2 select {
            width: 80%;
            height: 100%;
            padding: 1px 2px;
            border: 1px solid #dce3ea;
            border-radius: 10px;
            text-align: center;
            font-size: 14px;
            background: #f9fbfd;
            outline: none;
          }

          #botaoAzul {
            width: 350px;
            height: 59px;
            color: white;
            background-color: #36c3ff;
            border: none;
            border-radius: 40px;
            font-family: "Inter", sans-serif;
            font-weight: bold;
            font-size: 24px;
            display: block;
            text-align: center;
            margin: 38px auto 0 auto;
            line-height: 59px;
            cursor: pointer;
          }

          #botaoAzul:hover {
            background-color: #1ab0f0;
            transition: background-color 0.2s ease;
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
            {/*slot 1*/}

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

            {/* slot 2*/}

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

            {/* slot 3*/}

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

        {/* descrição */}

        <div className="contDescricaoAnimal">
          <div id="descricaoAnimal">
            <input
              type="text"
              placeholder="Digite o nome do animal"
              defaultValue=""
            />

            <textarea placeholder="Descreva o animal aqui"></textarea>
          </div>

          {/* cards */}

          <div className="containerCard">
            <div className="cardBoxEsquerdo">
              <div className="infoCard1">
                <label htmlFor="raca">Raça</label>

                <input
                  id="raca"
                  type="text"
                  placeholder="Digite a raça do animal"
                  defaultValue=""
                />
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
                <label htmlFor="especie">Tipo de animal</label>

                <select id="especie" defaultValue="">
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

              <div className="infoCard1">
                <label htmlFor="localizacao">Localização</label>

                <input
                  id="localizacao"
                  type="text"
                  placeholder="Ex: Londrina - PR"
                  defaultValue=""
                />
              </div>
            </div>

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
