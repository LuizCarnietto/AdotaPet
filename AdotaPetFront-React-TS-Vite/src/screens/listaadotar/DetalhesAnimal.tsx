import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiService } from "@/services/ApiService";

interface Animal {
  id: number;
  nome: string;
  nomeOng?: string;
  ongId?: number;
  comportamento?: string;
  especie?: string;
  raca?: string;
  idade?: string;
  sexo?: string;
  porte?: string;
  cor?: string;
  possuiChip?: boolean;
  vacinado?: boolean;
  cidadeId?: number;
  cidade?: string;
  estadoSigla?: string;
  estadoNome?: string;
  fotos?: string | string[] | null;
}

const obterFotos = (fotos: string | string[] | null | undefined): string[] => {
  if (!fotos) {
    return [];
  }

  if (Array.isArray(fotos)) {
    return fotos.filter((foto) => foto && foto.trim() !== "");
  }

  try {
    const fotosParseadas = JSON.parse(fotos);

    if (Array.isArray(fotosParseadas)) {
      return fotosParseadas.filter(
        (foto) => typeof foto === "string" && foto.trim() !== "",
      );
    }

    if (typeof fotosParseadas === "string") {
      return [fotosParseadas];
    }
  } catch {
    if (fotos.trim() !== "") {
      return [fotos];
    }
  }

  return [];
};

export default function DetalhesAnimal() {
  const { id } = useParams<{ id: string }>();

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [fotos, setFotos] = useState<string[]>([]);
  const [imagemGrande, setImagemGrande] = useState("");
  const navigate = useNavigate();

  const tipoUsuario = localStorage.getItem("tipoUsuario");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const buscarAnimal = async () => {
      try {
        const response = await apiService.get(`/animal/${id}`);

        setAnimal(response.data);

        const fotosAnimal = obterFotos(response.data.fotos);

        setFotos(fotosAnimal);

        if (fotosAnimal.length > 0) {
          setImagemGrande(fotosAnimal[0]);
        }
      } catch (error) {
        console.error("Erro ao buscar animal:", error);
      }
    };

    if (id) {
      buscarAnimal();
    }
  }, [id]);

  const trocarImagem = (foto: string) => {
    setImagemGrande(foto);
  };

  const formatarSexo = (sexo?: string) => {
    if (sexo === "MACHO") return "Macho";
    if (sexo === "FEMEA") return "Fêmea";

    return sexo || "Não informado";
  };

  const formatarPorte = (porte?: string) => {
    if (porte === "PEQUENO") return "Pequeno";
    if (porte === "MEDIO") return "Médio";
    if (porte === "GRANDE") return "Grande";

    return porte || "Não informado";
  };

  const formatarIdade = (idade?: string) => {
    if (idade === "FILHOTE") return "Filhote";
    if (idade === "ADULTO") return "Adulto";
    if (idade === "IDOSO") return "Idoso";

    return idade || "Não informado";
  };

  const formatarChip = (possuiChip?: boolean) => {
    if (possuiChip === true) return "Sim";
    if (possuiChip === false) return "Não";

    return "Não informado";
  };

  const handleAdotar = () => {
    if (!token || !tipoUsuario) {
      navigate("/login");
      return;
    }

    if (tipoUsuario === "ROLE_ADOTANTE") {
      navigate(`/formularios?animalId=${animal?.id}`);
      return;
    }
  };

  if (!animal) {
    return (
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          marginTop: "100px",
        }}
      >
        Carregando...
      </div>
    );
  }

  const localizacao =
    animal.estadoNome && animal.cidade
      ? `${animal.estadoNome} - ${animal.cidade}`
      : animal.estadoSigla && animal.cidade
        ? `${animal.estadoSigla} - ${animal.cidade}`
        : animal.cidade || "Não informado";

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');

          * {
            box-sizing: border-box;
          }

          html,
          body {
            padding: 0;
            margin: 0;
            width: 100%;
            min-height: 100%;
            background-color: white;
          }

          body {
            overflow-x: hidden;
          }

          /* ================================
             HEADER
             ================================ */

          header {
            background-color: white;
            width: 100%;
            padding: 30px 20px;

            display: flex;
            align-items: center;
            justify-content: center;
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
            width: 80px;
            height: 70px;
            object-fit: contain;
          }

          a {
            text-decoration: none;
            color: black;
            font-family: "Courier New", Courier, monospace;
          }

          /* ================================
             CONTAINER PRINCIPAL
             ================================ */

          div#container {
            width: 100%;
            max-width: 1440px;

            margin: 20px auto 40px auto;
            padding: 0 60px;

            display: flex;
            align-items: flex-start;
            justify-content: center;

            gap: 70px;
          }

          /* ================================
             ÁREA DAS FOTOS
             ================================ */

          #containerFotosAnimal {
            width: 549px;
            flex-shrink: 0;

            display: flex;
            flex-direction: column;
            align-items: center;
          }

          div#fotoAnimal {
            width: 100%;
            aspect-ratio: 1 / 1;

            background-color: white;

            border-radius: 20px;
            overflow: hidden;

            display: flex;
            justify-content: center;
            align-items: center;
          }

          #imagemGrande {
            width: 100%;
            height: 100%;

            object-fit: cover;

            border-radius: 20px;
          }

          div#cardFotoAnimal {
            width: 100%;

            margin-top: 24px;

            display: flex;
            flex-direction: row;
            flex-wrap: wrap;

            align-items: center;
            justify-content: center;

            gap: 14px;

            background-color: white;
          }

          img.miniatura {
            width: 105px;
            height: 105px;

            object-fit: cover;

            border-radius: 20px;

            cursor: pointer;

            opacity: 0.8;

            border: 3px solid transparent;

            transition:
              opacity 0.2s ease,
              transform 0.2s ease,
              border-color 0.2s ease;
          }

          img.miniatura:hover {
            opacity: 1;
            transform: scale(1.05);
          }

          img.miniatura.ativa {
            border-color: #36C3FF;
            opacity: 1;
          }

          /* ================================
             DESCRIÇÃO
             ================================ */

          div#descricaoAnimal {
            width: 603px;
            max-width: 100%;

            background-color: white;

            flex-shrink: 1;
          }

          #descricaoAnimal h1 {
            margin: 0 0 8px 0;

            font-family: "Montserrat", sans-serif;
            font-weight: 700;
            font-size: 42px;

            overflow-wrap: anywhere;
          }

          #descricaoAnimal > p {
            margin: 0;

            font-family: "Inter", sans-serif;
            font-size: 16px;
            line-height: 1.5;

            overflow-wrap: anywhere;
          }

          /* ================================
             CARDS
             ================================ */

          .containerCard {
            width: 100%;

            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));

            gap: 20px;

            margin-top: 25px;

            font-family: "Inter", sans-serif;
          }

          div.cardBoxEsquerdo,
          div.cardBoxDireito {
            width: 100%;

            display: flex;
            flex-direction: column;

            align-items: center;

            gap: 20px;

            text-align: center;
          }

          div.infoCard1,
          div.infoCard2 {
            width: 100%;
            max-width: 263px;
            min-height: 72px;

            padding: 10px 15px;

            background-color: white;

            border-radius: 20px;

            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);

            display: flex;
            flex-direction: column;

            align-items: center;
            justify-content: center;
          }

          div.infoCard1 > strong,
          div.infoCard2 > strong {
            font-family: "Inter", sans-serif;

            font-size: 16px;
            font-weight: 600;
          }

          div.infoCard1 > p,
          div.infoCard2 > p {
            font-family: "Inter", sans-serif;

            font-weight: 400;
            font-size: 14px;

            margin: 4px 0 0 0;

            overflow-wrap: anywhere;
          }

          /* ================================
             BOTÃO ADOTAR
             ================================ */

          #botaoAzul {
            width: 209px;
            height: 59px;

            margin: 38px auto 0 auto;

            color: white;
            background-color: #36C3FF;

            border-radius: 40px;

            font-family: "Inter", sans-serif;
            font-weight: bold;
            font-size: 24px;

            display: block;

            text-align: center;
            line-height: 59px;

            transition: background-color 0.2s ease;
          }

          #botaoAzul:hover:not(:disabled) {
            background-color: #2db0e8;
            text-decoration: none;
          }

          /* ================================
             NOTEBOOK / TELAS MENORES
             ================================ */

          @media (max-width: 1200px) {
            div#container {
              padding: 0 30px;
              gap: 40px;
            }

            #containerFotosAnimal {
              width: 430px;
            }

            div#descricaoAnimal {
              width: 550px;
            }

            nav {
              gap: 45px;
            }

            img.miniatura {
              width: 90px;
              height: 90px;
            }
          }

          /* ================================
             ALTURA MENOR
             ================================ */

          @media (max-height: 850px) and (min-width: 901px) {
            header {
              padding: 15px 20px;
            }

            nav > a > img {
              width: 65px;
              height: 55px;
            }

            div#container {
              margin-top: 10px;
              gap: 35px;
            }

            #containerFotosAnimal {
              width: 390px;
            }

            div#cardFotoAnimal {
              margin-top: 12px;
              gap: 8px;
            }

            img.miniatura {
              width: 72px;
              height: 72px;
            }

            #descricaoAnimal h1 {
              font-size: 34px;
            }

            #descricaoAnimal > p {
              font-size: 14px;
            }

            .containerCard {
              margin-top: 14px;
              gap: 12px;
            }

            div.cardBoxEsquerdo,
            div.cardBoxDireito {
              gap: 12px;
            }

            div.infoCard1,
            div.infoCard2 {
              min-height: 60px;
              padding: 7px 10px;
            }

            #botaoAzul {
              height: 48px;
              line-height: 48px;

              margin-top: 20px;

              font-size: 18px;
            }
          }

          /* ================================
             TABLET
             ================================ */

          @media (max-width: 900px) {
            header {
              padding: 20px 15px;
            }

            nav {
              gap: 25px;
              flex-wrap: wrap;
            }

            nav > a > img {
              width: 70px;
              height: 60px;
            }

            div#container {
              flex-direction: column;

              align-items: center;
              justify-content: flex-start;

              gap: 35px;

              padding: 0 25px;

              margin-top: 15px;
            }

            #containerFotosAnimal {
              width: min(100%, 520px);
            }

            div#cardFotoAnimal {
              width: 100%;

              margin-top: 15px;

              justify-content: center;
            }

            img.miniatura {
              width: 90px;
              height: 90px;
            }

            div#descricaoAnimal {
              width: min(100%, 650px);
            }

            #descricaoAnimal h1 {
              font-size: 38px;
            }
          }

          /* ================================
             CELULAR
             ================================ */

          @media (max-width: 600px) {
            header {
              padding: 15px 10px;
            }

            nav {
              width: 100%;

              gap: 15px;

              font-size: 13px;
            }

            nav > a > img {
              width: 58px;
              height: 50px;
            }

            div#container {
              padding: 0 15px;

              gap: 28px;

              margin-top: 10px;
            }

            #containerFotosAnimal {
              width: 100%;
              max-width: 450px;
            }

            div#fotoAnimal {
              width: 100%;
              aspect-ratio: 1 / 1;
            }

            div#cardFotoAnimal {
              width: 100%;

              gap: 8px;

              margin-top: 12px;
            }

            img.miniatura {
              width: 70px;
              height: 70px;

              border-radius: 14px;
            }

            div#descricaoAnimal {
              width: 100%;
            }

            #descricaoAnimal h1 {
              font-size: 30px;
            }

            #descricaoAnimal > p {
              font-size: 14px;
              line-height: 1.5;
            }

            .containerCard {
              grid-template-columns: 1fr;

              gap: 12px;

              margin-top: 20px;
            }

            div.cardBoxEsquerdo,
            div.cardBoxDireito {
              gap: 12px;
            }

            div.infoCard1,
            div.infoCard2 {
              width: 100%;
              max-width: none;

              min-height: 68px;
            }

            #botaoAzul {
              width: min(100%, 300px);

              height: 50px;
              line-height: 50px;

              margin-top: 25px;

              font-size: 18px;
            }
          }

          /* ================================
             CELULARES PEQUENOS
             ================================ */

          @media (max-width: 400px) {
            nav {
              gap: 10px;
              font-size: 12px;
            }

            div#container {
              padding: 0 10px;
            }

            img.miniatura {
              width: 62px;
              height: 62px;
            }

            #descricaoAnimal h1 {
              font-size: 27px;
            }

            div.infoCard1 > strong,
            div.infoCard2 > strong {
              font-size: 14px;
            }

            div.infoCard1 > p,
            div.infoCard2 > p {
              font-size: 13px;
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
            {imagemGrande ? (
              <img
                id="imagemGrande"
                src={imagemGrande}
                alt={`Foto principal de ${animal.nome}`}
              />
            ) : (
              <p>Sem foto</p>
            )}
          </div>

          {fotos.length > 0 && (
            <div id="cardFotoAnimal">
              {fotos.map((foto, index) => (
                <img
                  key={`${foto}-${index}`}
                  className={`miniatura ${
                    imagemGrande === foto ? "ativa" : ""
                  }`}
                  src={foto}
                  alt={`Foto ${index + 1} de ${animal.nome}`}
                  onClick={() => trocarImagem(foto)}
                />
              ))}
            </div>
          )}
        </div>

        <div id="descricaoAnimal">
          <h1>{animal.nome}</h1>

          <p>{animal.comportamento || "Não informado"}</p>

          <div className="containerCard">
            <div className="cardBoxEsquerdo">
              <div className="infoCard1">
                <strong>Raça</strong>
                <p>{animal.raca || "Não informado"}</p>
              </div>

              <div className="infoCard1">
                <strong>Idade</strong>
                <p>{formatarIdade(animal.idade)}</p>
              </div>

              <div className="infoCard1">
                <strong>Localização</strong>
                <p>{localizacao}</p>
              </div>

              <div className="infoCard1">
                <strong>Possui Microchip?</strong>
                <p>{formatarChip(animal.possuiChip)}</p>
              </div>
            </div>

            <div className="cardBoxDireito">
              <div className="infoCard2">
                <strong>Sexo</strong>
                <p>{formatarSexo(animal.sexo)}</p>
              </div>

              <div className="infoCard2">
                <strong>Porte do animal</strong>
                <p>{formatarPorte(animal.porte)}</p>
              </div>

              <div className="infoCard2">
                <strong>Cor</strong>
                <p>{animal.cor || "Não informado"}</p>
              </div>

              <div className="infoCard2">
                <strong>ONG de resgaste</strong>
                <p>{animal.nomeOng || "Não informado"}</p>
              </div>
            </div>
          </div>

          {tipoUsuario === "ROLE_ONG" ? (
            <button
              id="botaoAzul"
              type="button"
              disabled
              style={{
                opacity: 0.6,
                cursor: "not-allowed",
              }}
            >
              Disponível apenas para adotantes
            </button>
          ) : (
            <button id="botaoAzul" type="button" onClick={handleAdotar}>
              Adotar
            </button>
          )}
        </div>
      </div>
    </>
  );
}
